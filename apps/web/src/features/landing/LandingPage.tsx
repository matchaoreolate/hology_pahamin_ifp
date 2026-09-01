import {
  ArrowRight,
  BatteryFull,
  BookOpenCheck,
  FileEdit,
  MonitorPlay,
  Sparkles,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: FileEdit,
    iconBg: "bg-[#001456]/10",
    iconColor: "text-[#001456]",
    title: "Step 1",
    description: "Isi topik, tujuan, dan konteks pembelajaran.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-[#90d792]/20",
    iconColor: "text-[#1e7a24]",
    title: "Step 2",
    description: "AI menghasilkan draf materi yang relevan.",
  },
  {
    icon: MonitorPlay,
    iconBg: "bg-[#fdd34d]/20",
    iconColor: "text-[#725b00]",
    title: "Step 3",
    description: "Edit, sesuaikan, dan tampilkan di kelas.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#454650]">
      {/* Floating nav */}
      <header className="fixed top-6 left-1/2 z-20 flex w-[568px] max-w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center gap-16 rounded-full border border-[#c6c5d2]/10 bg-[#fbf9f5]/80 px-6 py-2 shadow-lg backdrop-blur-md">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-[#001456]"
        >
          <Sparkles size={18} className="text-[#001456]" />
          PahamIn
        </Link>
        <nav className="flex items-center gap-6">
          <span className="text-sm font-bold tracking-wide text-[#454650]">
            Tentang
          </span>
          <span className="text-sm font-bold tracking-wide text-[#454650]">
            Fitur
          </span>
        </nav>
        <Link
          to="/login"
          className="rounded-full bg-[#001456] px-6 py-2 text-sm font-semibold text-white shadow-[0_4px_6px_-1px_rgba(0,20,86,0.1)] transition-colors hover:bg-[#001456]/90"
        >
          Masuk
        </Link>
      </header>

      <main>
        {/* HERO */}
        <section className="relative flex flex-col items-center overflow-hidden px-10 pt-32 pb-12">
          <div className="absolute top-10 left-10 size-24 rounded-full bg-[#fdd34d] opacity-80" />
          <div className="absolute top-10 right-20 h-32 w-16 bg-[#fdd34d] opacity-90" />
          <div className="absolute top-48 right-10 size-48 rounded-full border-4 border-[#001456] opacity-50" />
          <div className="absolute right-0 bottom-20 size-64 rounded-l-full bg-[#001456] opacity-90" />

          {/* IFP mockup */}
          <div className="relative z-[1] w-full max-w-[1000px] rounded-3xl border-8 border-[#333] bg-[#1a1a1a] p-6 shadow-2xl">
            <div className="w-full rounded-xl bg-[#fbf9f5] p-12">
              <div className="mb-4 flex justify-end gap-4 text-[#767681]">
                <span className="flex items-center gap-1 text-sm">
                  <Wifi size={14} />
                  05:00
                </span>
                <BatteryFull size={14} />
              </div>
              <div className="flex items-start justify-between gap-8">
                <div className="max-w-[428px]">
                  <p className="mb-2 text-sm font-bold tracking-wide text-[#001456]">
                    Matematika • Pecahan
                  </p>
                  <h2 className="mb-4 text-4xl leading-tight font-bold text-[#001456]">
                    Mengenal Pecahan Senilai
                  </h2>
                  <p className="mb-8 text-base text-[#454650]">
                    Perhatikan gambar. Geser bagian yang berwarna untuk mencari pecahan senilai.
                  </p>
                  <button className="flex items-center gap-2 rounded-full bg-[#001456] px-6 py-2 text-base font-semibold text-white">
                    <Sparkles size={16} />
                    Ayo Coba!
                  </button>
                </div>
                <div className="flex shrink-0 items-center gap-8 pt-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative size-32 overflow-hidden rounded-full border-2 border-[#767681]">
                      <div className="absolute top-0 left-0 h-1/2 w-1/2 border-r border-b border-[#767681] bg-[#fdd34d]" />
                    </div>
                    <span className="text-2xl font-bold text-[#001456]">
                      1/2
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#001456]">
                    =
                  </span>
                  <div className="flex flex-col items-center gap-4">
                    <div className="grid size-32 grid-cols-4 grid-rows-2 overflow-hidden rounded-full border-2 border-[#767681]">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={`t-${i}`} className={i < 2 ? "border border-[#767681] bg-[#fdd34d]" : "border border-[#767681]"} />
                      ))}
                      {[0, 1, 2, 3].map((i) => (
                        <span key={`b-${i}`} className={i < 2 ? "border border-[#767681] bg-[#fdd34d]" : "border border-[#767681]"} />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-[#001456]">
                      4/8
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="pt-2 text-center text-xs font-bold tracking-[1.2px] text-[#666] uppercase">
              PahamIn
            </p>
          </div>

          <div className="relative z-[1] flex max-w-5xl flex-col items-center gap-6 pt-12 text-center">
            <h1 className="text-5xl leading-tight font-extrabold tracking-tight text-[#001456] md:text-6xl">
              Platform untuk Kelas Interaktif
            </h1>
            <p className="text-lg text-[#454650]">
              Dirancang khusus untuk layar sentuh besar.
              <br />
              Bantu guru mengajar lebih interaktif, siswa lebih terlibat.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                to="/projects/new"
                className="rounded-full bg-[#001456] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_6px_-1px_rgba(0,20,86,0.1)] transition-colors hover:bg-[#001456]/90"
              >
                Coba Gratis
              </Link>
              <button className="rounded-full border-2 border-[#001456] px-8 py-3.5 text-base font-semibold text-[#001456] transition-colors hover:bg-[#001456]/5">
                Lihat Fitur
              </button>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-10 py-24 md:flex-row">
          <div className="flex-1">
            <h2 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-[#001456]">
              Guru bingung membuat media?
              <br />
              Ada TV interaktif? blablabla
            </h2>
            <p className="text-lg leading-relaxed text-[#454650]">
              Membuat materi menarik memakan waktu. Padahal guru punya banyak hal lain yang lebih
              penting. PahamIn hadir untuk mengubah cara guru menyiapkan pembelajaran.
            </p>
          </div>
          <div className="relative flex h-[400px] flex-1 items-end justify-center overflow-hidden rounded-[40px] bg-[#b8c3ff]/30 p-12">
            <img
              src="/landing/problem-illustration.png"
              alt="Ilustrasi guru kewalahan menyiapkan materi ajar"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </section>

        {/* SOLUTION */}
        <section className="mx-auto flex max-w-[1280px] flex-col gap-16 px-10 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#001456]">
              PahamIn, Generator Media Pembelajaran
            </h2>
            <p className="text-lg text-[#454650]">
              Buat berbagai media pembelajaran dalam hitungan menit dengan bantuan AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-[#001456] p-10 shadow-lg md:col-span-7">
              <div className="absolute top-1/4 -left-10 h-1/2 w-20 rounded-r-full bg-[#fdd34d] opacity-90" />
              <div className="relative z-[1] flex flex-col gap-2">
                <h3 className="text-4xl font-bold text-white">PPT</h3>
                <p className="max-w-[250px] text-base text-white/80">
                  Presentasi interaktif yang siap tampil di kelas.
                </p>
              </div>
              <button className="relative z-[1] mt-8 flex size-12 items-center justify-center rounded-full bg-white text-[#001456]">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-6 md:col-span-5">
              <div className="flex items-start justify-between rounded-[32px] bg-[#fdd34d] p-8 shadow-md">
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="mb-1 text-2xl font-bold text-[#725b00]">
                      LKPD
                    </h3>
                    <p className="text-base text-[#725b00]/80">
                      Lembar kerja peserta didik siap cetak atau digital.
                    </p>
                  </div>
                  <button className="flex size-10 items-center justify-center rounded-full bg-[#725b00] text-[#fdd34d]">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <FileEdit size={40} className="shrink-0 text-[#725b00]/40" />
              </div>

              <div className="flex items-start justify-between rounded-[32px] bg-[#90d792] p-8 shadow-md">
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="mb-1 text-2xl font-bold text-[#002107]">
                      E-Book
                    </h3>
                    <p className="text-base text-[#002107]/80">
                      Bahan ajar digital yang menarik dan mudah dibaca.
                    </p>
                  </div>
                  <button className="flex size-10 items-center justify-center rounded-full bg-[#002107] text-[#90d792]">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <BookOpenCheck size={40} className="shrink-0 text-[#002107]/40" />
              </div>
            </div>
          </div>
        </section>

        {/* STEP BY STEP */}
        <section className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-10 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#001456]">
              Step By Step
            </h2>
            <p className="text-lg text-[#454650]">Dengan mudah blablabla</p>
          </div>

          <div className="relative flex flex-col items-stretch justify-between gap-6 pt-8 md:flex-row">
            <div className="absolute top-[calc(50%+16px)] right-0 left-0 hidden -translate-y-1/2 border-t-2 border-dashed border-[#c6c5d2] md:block" />
            {steps.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
              <div
                key={title}
                className="relative z-[1] flex flex-1 flex-col gap-4 rounded-2xl border border-[#c6c5d2]/20 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex size-12 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#001456]">
                    {title}
                  </h3>
                </div>
                <p className="text-base text-[#454650]">{description}</p>
              </div>
            ))}
          </div>

          <div className="relative h-24 w-full">
            <div className="absolute bottom-0 left-0 h-16 w-32 rounded-t-full bg-[#90d792]" />
            <div className="absolute right-10 bottom-0 size-32 rounded-full border-4 border-[#c6c5d2]/30" />
            <div className="absolute right-16 bottom-0 size-20 rounded-full border-4 border-[#c6c5d2]/30" />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-[#001456] py-24">
          <div className="absolute top-1/2 left-[-187px] h-[318px] w-[328px] -translate-y-1/2 rounded-full border-[16px] border-[#fdd34d] opacity-90" />
          <div className="absolute top-[calc(50%-27px)] right-[-140px] h-[318px] w-[328px] -translate-y-1/2 rounded-full border-[16px] border-[#fdd34d] opacity-90" />
          <div className="relative z-[1] mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-10 text-center">
            <h2 className="text-4xl font-bold text-white">
              Cobain Sekarang!
            </h2>
            <p className="text-lg text-white/80">Dirancang khusus untuk TV Merah Putih</p>
            <div className="flex gap-4 pt-6">
              <Link
                to="/projects/new"
                className="rounded-full bg-[#fbf9f5] px-8 py-3.5 text-base font-semibold text-[#001456] shadow-md transition-colors hover:bg-white"
              >
                Coba Gratis
              </Link>
              <button className="rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#c6c5d2]/20 bg-[#fbf9f5] py-8">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-10">
          <span className="text-2xl font-bold text-[#001456]">
            PahamIn AI
          </span>
          <span className="text-sm text-[#454650]">© 2026 PahamIn AI.</span>
          <div className="flex gap-6">
            <span className="text-sm font-bold tracking-wide text-[#454650] opacity-80">
              Bantuan
            </span>
            <span className="text-sm font-bold tracking-wide text-[#454650] opacity-80">
              Syarat &amp; Ketentuan
            </span>
            <span className="text-sm font-bold tracking-wide text-[#454650] opacity-80">
              Privasi
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
