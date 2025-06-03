import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthModal } from "@/components/auth-modal";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const features = [
  {
    title: "Weekly Meal Planning",
    desc: "Plan your meals for the whole week and stay organized.",
    icon: "🍽️",
  },
  {
    title: "Recipe Management",
    desc: "Save, edit, and discover new recipes easily.",
    icon: "📖",
  },
  {
    title: "Smart Shopping Lists",
    desc: "Generate shopping lists based on your meal plan.",
    icon: "🛒",
  },
  {
    title: "Family Friendly",
    desc: "Share plans and recipes with your family.",
    icon: "👨‍👩‍👧‍👦",
  },
];

const testimonials = [
  {
    name: "Anna",
    text: "Meal Planner hefur gjörbreytt hversdagslífinu okkar!",
  },
  {
    name: "Jón",
    text: "Aldrei verið auðveldara að skipuleggja vikuna og innkaupin!",
  },
  {
    name: "Sara",
    text: "Ég elska hvað þetta app er einfalt og fallegt!",
  },
];

export function LandingPage() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className={"min-h-screen flex flex-col " + inter.className}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur">
        <div className="font-bold text-xl text-orange-600">🍊 Meal Planner</div>
        <div>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setModalOpen(true)}>
            Log in / Sign up
          </Button>
        </div>
      </header>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-16 bg-gradient-to-b from-orange-50 to-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-900">Plan Your Perfect Week</h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-700 max-w-2xl mx-auto">
          Organize your meals, discover recipes, and generate shopping lists effortlessly.
        </p>
        <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg" onClick={() => setModalOpen(true)}>
          Get Started
        </Button>
      </section>
      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {features.map((f) => (
            <Card key={f.title} className="flex flex-col items-center p-6 text-center shadow-md">
              <div className="text-4xl mb-2">{f.icon}</div>
              <div className="font-bold text-xl mb-1">{f.title}</div>
              <div className="text-gray-600">{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-12 bg-orange-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-orange-600">What our users say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 text-center shadow">
                <div className="italic text-gray-700 mb-2">"{t.text}"</div>
                <div className="font-bold text-orange-600">- {t.name}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-12 bg-white text-center">
        <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg" onClick={() => setModalOpen(true)}>
          Get Started
        </Button>
      </section>
      {/* Footer */}
      <footer className="py-6 border-t text-center text-gray-500 text-sm bg-white/80 backdrop-blur">
        <div className="font-bold text-orange-600 mb-1">🍊 Meal Planner</div>
        <div>&copy; {new Date().getFullYear()} Meal Planner. All rights reserved.</div>
      </footer>
      <AuthModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
} 