import {
  NotificationChannel,
  NotificationOptions,
  CalendarEvent,
  CalendarProvider,
  NotificationPriority,
  NotificationGroup,
  RecurrenceRule,
} from '@/lib/types';

class NotificationService {
  private static instance: NotificationService;
  private channels: NotificationChannel[] = [];
  private groups: Map<string, NotificationGroup> = new Map();
  private calendarProviders: Map<CalendarProvider, any> = new Map();

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    // Request notification permissions
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    }

    // Initialize calendar providers
    await this.initializeCalendarProviders();
  }

  private async initializeCalendarProviders() {
    // Initialize Google Calendar
    if (typeof gapi !== 'undefined') {
      try {
        await gapi.client.init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar.events',
        });
        this.calendarProviders.set('google', gapi.client.calendar);
      } catch (error) {
        console.error('Failed to initialize Google Calendar:', error);
      }
    }

    // Initialize Apple Calendar
    if ('calendar' in navigator) {
      try {
        await (navigator as any).calendar.requestAccess();
        this.calendarProviders.set('apple', (navigator as any).calendar);
      } catch (error) {
        console.error('Failed to initialize Apple Calendar:', error);
      }
    }

    // Initialize Outlook Calendar
    if (typeof Office !== 'undefined') {
      try {
        await Office.onReady();
        this.calendarProviders.set('outlook', Office.context.mailbox);
      } catch (error) {
        console.error('Failed to initialize Outlook Calendar:', error);
      }
    }
  }

  async sendNotification(
    title: string,
    options: NotificationOptions = {}
  ) {
    const notification = { title, ...options };

    // Handle notification grouping
    if (options.groupId) {
      await this.addToGroup(options.groupId, notification);
    }

    // Send in-app notification
    this.sendInAppNotification(notification);

    // Send push notification if enabled
    if (this.isChannelEnabled('push')) {
      this.sendPushNotification(notification);
    }

    // Add to calendar if enabled
    if (this.isChannelEnabled('calendar')) {
      await this.addToCalendar(notification);
    }
  }

  private async addToGroup(groupId: string, notification: NotificationOptions) {
    let group = this.groups.get(groupId);
    if (!group) {
      group = {
        id: groupId,
        title: `Group ${groupId}`,
        priority: 'normal',
        notifications: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.groups.set(groupId, group);
    }

    group.notifications.push(notification);
    group.updatedAt = new Date();

    // If group has high priority, show it immediately
    if (group.priority === 'high') {
      await this.showGroup(group);
    }
  }

  private async showGroup(group: NotificationGroup) {
    const notification = new Notification(group.title, {
      body: `${group.notifications.length} new notifications`,
      icon: '/icons/notification-group.png',
      tag: group.id,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View All',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    });

    notification.onclick = () => {
      window.focus();
      // TODO: Show notification center with group details
    };
  }

  private sendInAppNotification(notification: NotificationOptions) {
    if (!this.isChannelEnabled('in-app')) return;

    const channel = this.getChannel('in-app');
    const nativeNotification = new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      silent: !channel.settings.sound,
      vibrate: channel.settings.vibration ? [200, 100, 200] : undefined,
      tag: notification.tag,
      requireInteraction: notification.requireInteraction,
      actions: notification.actions,
    });

    nativeNotification.onclick = () => {
      window.focus();
      nativeNotification.close();
    };
  }

  private async sendPushNotification(notification: NotificationOptions) {
    if (!this.isChannelEnabled('push')) return;

    const channel = this.getChannel('push');
    const registration = await navigator.serviceWorker.ready;
    
    await registration.showNotification(notification.title, {
      ...notification,
      silent: !channel.settings.sound,
      vibrate: channel.settings.vibration ? [200, 100, 200] : undefined,
    });
  }

  private async addToCalendar(notification: NotificationOptions) {
    if (!this.isChannelEnabled('calendar')) return;

    const channel = this.getChannel('calendar');
    if (!channel.settings.calendarSync) return;

    const provider = channel.settings.calendarProvider || 'local';
    const calendarProvider = this.calendarProviders.get(provider);

    if (!calendarProvider) {
      console.error(`Calendar provider ${provider} not available`);
      return;
    }

    try {
      const event: CalendarEvent = {
        title: notification.title,
        description: notification.body,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000), // 1 hour duration
        reminderTime: channel.settings.reminderTime,
        provider,
        recurrence: notification.data?.recurrence,
      };

      await this.addEventToCalendar(calendarProvider, event);
    } catch (error) {
      console.error('Failed to add event to calendar:', error);
    }
  }

  private async addEventToCalendar(provider: any, event: CalendarEvent) {
    switch (event.provider) {
      case 'google':
        await provider.events.insert({
          calendarId: 'primary',
          resource: this.convertToGoogleEvent(event),
        });
        break;
      case 'apple':
        await provider.addEvent(this.convertToAppleEvent(event));
        break;
      case 'outlook':
        await provider.item.saveAsync(this.convertToOutlookEvent(event));
        break;
      default:
        // Local calendar
        if ('calendar' in navigator) {
          await (navigator as any).calendar.addEvent(event);
        }
    }
  }

  private convertToGoogleEvent(event: CalendarEvent) {
    return {
      summary: event.title,
      description: event.description,
      start: { dateTime: event.startTime.toISOString() },
      end: { dateTime: event.endTime.toISOString() },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
      recurrence: event.recurrence ? [this.convertRecurrenceRule(event.recurrence)] : undefined,
    };
  }

  private convertToAppleEvent(event: CalendarEvent) {
    return {
      title: event.title,
      notes: event.description,
      startDate: event.startTime,
      endDate: event.endTime,
      isAllDay: event.isAllDay,
      recurrence: event.recurrence,
    };
  }

  private convertToOutlookEvent(event: CalendarEvent) {
    return {
      subject: event.title,
      body: event.description,
      start: event.startTime,
      end: event.endTime,
      isAllDay: event.isAllDay,
      recurrence: event.recurrence,
    };
  }

  private convertRecurrenceRule(rule: RecurrenceRule): string {
    const parts = [`FREQ=${rule.frequency.toUpperCase()}`];
    if (rule.interval) parts.push(`INTERVAL=${rule.interval}`);
    if (rule.count) parts.push(`COUNT=${rule.count}`);
    if (rule.endDate) parts.push(`UNTIL=${rule.endDate.toISOString()}`);
    if (rule.daysOfWeek) parts.push(`BYDAY=${rule.daysOfWeek.join(',')}`);
    if (rule.daysOfMonth) parts.push(`BYMONTHDAY=${rule.daysOfMonth.join(',')}`);
    if (rule.monthsOfYear) parts.push(`BYMONTH=${rule.monthsOfYear.join(',')}`);
    return `RRULE:${parts.join(';')}`;
  }

  private isChannelEnabled(channelId: string): boolean {
    const channel = this.channels.find(c => c.id === channelId);
    return channel?.enabled ?? false;
  }

  private getChannel(channelId: string): NotificationChannel {
    return this.channels.find(c => c.id === channelId) ?? {
      id: channelId,
      type: channelId as any,
      enabled: false,
      settings: {},
    };
  }

  updateChannels(channels: NotificationChannel[]) {
    this.channels = channels;
  }

  async setGroupPriority(groupId: string, priority: NotificationPriority) {
    const group = this.groups.get(groupId);
    if (group) {
      group.priority = priority;
      if (priority === 'high') {
        await this.showGroup(group);
      }
    }
  }
}

export const notificationService = NotificationService.getInstance(); 