import type { FormEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, register } from "@/lib/api/auth";
import type { ApiError } from "@/types/api";

type Tab = "masuk" | "daftar";

export function LoginPage() {
  const [tab, setTab] = useState<Tab>("masuk");
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  async function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      navigate("/dashboard");
    } catch (err) {
      setLoginError((err as ApiError).detail);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault();
    setRegisterError(null);
    setRegisterLoading(true);
    try {
      await register({
        full_name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      // Registration doesn't log the user in — sign them in right after.
      await login({ email: registerEmail, password: registerPassword });
      navigate("/dashboard");
    } catch (err) {
      setRegisterError((err as ApiError).detail);
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background pt-16">
      {/* <AppHeader variant="landing" /> */}

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[448px] flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Selamat datang Guru!</h1>
            {/* <p className="text-sm text-muted-foreground">Teaching Assistant AI</p> */}
          </div>

          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as Tab)}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
          >
            <TabsList>
              <TabsTrigger value="masuk">Masuk</TabsTrigger>
              <TabsTrigger value="daftar">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="masuk">
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6 px-10 py-8">
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="nama@institusi.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox />
                    Ingat saya
                  </label>
                  {/* <a className="font-mono text-xs text-muted-foreground underline hover:text-foreground">
                    Lupa Password?
                  </a> */}
                </div>
                {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                <Button
                  type="submit"
                  variant="primary"
                  className="h-11 w-full text-sm normal-case"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="daftar">
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6 px-10 py-8">
                <div className="flex flex-col gap-1.5">
                  <Label>Nama</Label>
                  <Input
                    type="text"
                    placeholder="Nama lengkap"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="nama@institusi.edu"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                      aria-label={showRegisterPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {registerError && <p className="text-sm text-destructive">{registerError}</p>}
                <Button
                  type="submit"
                  variant="primary"
                  className="h-11 w-full text-sm normal-case"
                  disabled={registerLoading}
                >
                  {registerLoading ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
