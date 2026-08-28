import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type Tab = "masuk" | "daftar";

export function LoginPage() {
  const [tab, setTab] = useState<Tab>("masuk");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#f9f9fa] pt-16">
      <AppHeader variant="landing" />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[448px] flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-black">PahamIn</h1>
            <p className="text-sm text-[#5d5e66]">Teaching Assistant AI</p>
          </div>

          <div className="border border-[#c4c7c7] bg-white">
            <div className="flex border-b border-[#c4c7c7]">
              <button
                onClick={() => setTab("masuk")}
                className={`flex-1 py-4 font-mono text-xs font-medium uppercase tracking-wide ${
                  tab === "masuk"
                    ? "border-b-2 border-black text-black"
                    : "bg-[#f3f3f4] text-[#5d5e66]"
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setTab("daftar")}
                className={`flex-1 py-4 font-mono text-xs font-medium uppercase tracking-wide ${
                  tab === "daftar"
                    ? "border-b-2 border-black text-black"
                    : "bg-[#f3f3f4] text-[#5d5e66]"
                }`}
              >
                Daftar
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/dashboard");
              }}
              className="flex flex-col gap-6 px-10 py-8"
            >
              {tab === "daftar" && (
                <label className="flex flex-col gap-1 text-base text-[#1a1c1d]">
                  Nama
                  <Input type="text" placeholder="Nama lengkap" />
                </label>
              )}
              <label className="flex flex-col gap-1 text-base text-[#1a1c1d]">
                Email
                <Input type="email" placeholder="nama@institusi.edu" />
              </label>
              <label className="flex flex-col gap-1 text-base text-[#1a1c1d]">
                Password
                <Input type="password" placeholder="••••••••" />
              </label>

              {tab === "masuk" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-[#5d5e66]">
                    <input type="checkbox" className="size-4 border border-[#c4c7c7]" />
                    Ingat saya
                  </label>
                  <a className="font-mono text-xs text-[#5d5e66] underline">Lupa Password?</a>
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full py-3 text-base normal-case">
                {tab === "masuk" ? "Masuk Sistem" : "Daftar Sekarang"}
              </Button>
            </form>
          </div>

          <p className="text-center font-mono text-[11px] text-[#5d5e66]">
            © 2024 PahamIn AI. Structural Blueprint Design.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
