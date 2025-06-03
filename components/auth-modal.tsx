import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { login, register, loading, error } = useAuth();
  const [isRegister, setIsRegister] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register(form.name, form.email, form.password);
    } else {
      await login(form.email, form.password);
    }
    if (!loading && !error) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isRegister ? "Sign Up" : "Log In"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required disabled={loading} />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={loading} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required disabled={loading} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Sign Up" : "Log In"}
          </Button>
        </form>
        <div className="text-center mt-2">
          <button
            type="button"
            className="text-orange-600 hover:underline text-sm"
            onClick={() => setIsRegister((v) => !v)}
            disabled={loading}
          >
            {isRegister ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 