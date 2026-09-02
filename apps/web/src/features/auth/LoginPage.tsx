import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = "masuk" | "daftar";

export function LoginPage() {
  const [tab, setTab] = useState<Tab>("masuk");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background pt-16">
      {/* <AppHeader variant="landing" /> */}

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[448px] flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">PahamIn</h1>
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-10 py-8">
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="nama@institusi.edu" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
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
                <Button type="submit" variant="primary" className="h-11 w-full text-sm normal-case">
                  Masuk Sistem
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="daftar">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-10 py-8">
                <div className="flex flex-col gap-1.5">
                  <Label>Nama</Label>
                  <Input type="text" placeholder="Nama lengkap" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="nama@institusi.edu" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" variant="primary" className="h-11 w-full text-sm normal-case">
                  Daftar Sekarang
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
