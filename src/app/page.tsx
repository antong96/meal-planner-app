import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Plan Your Meals, Simplify Your Life
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Create meal plans, discover recipes, and generate shopping lists all in one place.
              Save time and eat better with our meal planning app.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/meal-planner">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/recipes">
                <Button variant="outline" size="lg">
                  Browse Recipes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Plan Your Meals
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card>
              <CardHeader>
                <CardTitle>Meal Planning</CardTitle>
                <CardDescription>
                  Create weekly meal plans with our drag-and-drop interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Save your favorite recipes and plan your meals in advance. Our intuitive interface
                  makes it easy to organize your weekly menu.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Collection</CardTitle>
                <CardDescription>
                  Discover and manage your favorite recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse our extensive recipe collection or add your own. Filter by type, diet, and
                  ingredients to find the perfect meal.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardHeader>
                <CardTitle>Shopping Lists</CardTitle>
                <CardDescription>
                  Smart shopping lists generated from your meal plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatically generate shopping lists from your meal plans. Export to PDF or
                  print for easy shopping. Never forget an ingredient again.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 