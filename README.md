# Meal Planner

A modern web application for planning meals, managing recipes, and generating shopping lists.

## Features

- 🍽️ Meal Planning
  - Weekly calendar view
  - Drag-and-drop interface
  - Save favorite recipes
- 📚 Recipe Management
  - Search and filter recipes
  - Add custom recipes
  - View detailed instructions
- 🛒 Shopping Lists
  - Auto-generated from meal plans
  - Categorized items
  - Export to PDF/CSV
- 🔐 Authentication
  - Secure login/register
  - Protected routes
  - User profiles

## Tech Stack

- **Frontend**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Query
  - React Beautiful DnD
- **Backend**
  - Node.js
  - Express
  - TypeScript
  - Supabase (PostgreSQL)
  - MongoDB
- **Authentication**
  - JWT
  - Supabase Auth

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/meal-planner.git
   cd meal-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.