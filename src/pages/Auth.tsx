import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const setSeo = () => {
  document.title = "Sign in | BLEE";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", "Sign in or create an account to manage BLEE case studies.");
  } else {
    const m = document.createElement("meta");
    m.name = "description";
    m.content = "Sign in or create an account to manage BLEE case studies.";
    document.head.appendChild(m);
  }
  const linkCanonical = document.querySelector('link[rel="canonical"]');
  if (linkCanonical) {
    linkCanonical.setAttribute("href", window.location.origin + "/auth");
  } else {
    const l = document.createElement("link");
    l.rel = "canonical";
    l.href = window.location.origin + "/auth";
    document.head.appendChild(l);
  }
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = useMemo(() => {
    const from = location.state?.from?.pathname as string | undefined;
    return from ?? "/";
  }, [location.state]);

  useEffect(() => {
    setSeo();
    // If already signed in, go home
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate(redirectTo, { replace: true });
    });
  }, [navigate, redirectTo]);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Signed in", description: "Welcome back!" });
    navigate(redirectTo, { replace: true });
  };

  const handleSignUp = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Check your email", description: "Confirm your email to complete signup." });
  };

  return (
    <main className="min-h-screen bg-background grid place-items-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
            {mode === "signin" ? (
              <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            )}
            <Button variant="ghost" className="w-full" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
