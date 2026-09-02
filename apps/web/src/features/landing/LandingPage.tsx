import {
  BatteryFull,
  FileEdit,
  MonitorPlay,
  Sparkles,
  Wifi,
} from "lucide-react";
import { ReactLenis } from "lenis/react";
import { Link } from "react-router-dom";

import { MobileNav } from "./MobileNav";
import { HeroPresentationShowcase } from "./showcase/HeroPresentationShowcase";

const steps = [
  {
    icon: FileEdit,
    iconBg: "bg-[#001456]/10",
    iconColor: "text-[#001456]",
    title: "1 - Isi Konteks",
    description: "Masukkan topik, tujuan, waktu, dan konteks pembelajaran.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-[#90d792]/20",
    iconColor: "text-[#1e7a24]",
    title: "2 - Generate dengan AI",
    description: "PahamIn menyusun materi dan aktivitas berdasarkan kebutuhan kelas.",
  },
  {
    icon: MonitorPlay,
    iconBg: "bg-[#fdd34d]/20",
    iconColor: "text-[#725b00]",
    title: "3 - Siap Digunakan di Kelas",
    description: "Tinjau, sesuaikan, lalu tampilkan di kelas atau gunakan sebagai bahan belajar.",
  },
];

export function LandingPage() {
  return (
    <ReactLenis root options={{ anchors: true }}>
    <div className="min-h-screen overflow-x-clip bg-white text-[#454650]">
      {/* Mobile nav: simple full-width bar + hamburger dropdown */}
      <MobileNav />

      {/* Desktop nav: floating pill */}
      <header className="fixed top-6 left-1/2 z-20 hidden w-3xl max-w-[calc(100%-1rem)] -translate-x-1/2 items-center justify-between gap-12 rounded-full border border-[#c6c5d2]/40 bg-white/60 px-6 py-2 shadow-lg backdrop-blur-md sm:flex">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-[#001456]"
        >
          <Sparkles size={18} className="text-[#001456]" />
          PahamIn
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="#tentang"
            className="text-sm font-bold tracking-wide text-[#454650] transition-colors hover:text-[#001456]"
          >
            Tentang
          </a>
          <a
            href="#fitur"
            className="text-sm font-bold tracking-wide text-[#454650] transition-colors hover:text-[#001456]"
          >
            Fitur
          </a>
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
        <section className="relative flex flex-col items-center overflow-hidden px-10 pt-32 pb-24">
          <div className="absolute top-10 left-10 size-24 rounded-full bg-[#fdd34d] opacity-80 [animation:float_6s_ease-in-out_infinite]" />
          <div className="absolute top-10 right-20 h-32 w-16 bg-[#fdd34d] opacity-90 [animation:float_7s_ease-in-out_infinite_0.5s]" />
          <div className="hidden sm:block absolute top-48 right-10 size-48 rounded-full border-4 border-[#001456] opacity-50 [animation:float_8s_ease-in-out_infinite_1s]" />
          <div className="hidden sm:block absolute -right-20 bottom-20 size-64 rounded-l-full bg-[#001456] opacity-90 [animation:float_9s_ease-in-out_infinite_1.5s]" />


          <div className="relative z-[1] flex max-w-5xl flex-col items-center gap-4 py-6 pb-10  text-center">
            <h1 className="text-5xl leading-tight font-extrabold tracking-tight text-[#001456] md:text-6xl">
              Platform untuk{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-2 top-8 bottom-2 -z-10 bg-[#fdd34d]"
                />
                Kelas Interaktif
              </span>
            </h1>
            <p className="text-lg text-[#454650]">
              Buat media pembelajaran dengan AI dan gunakan langsung di TV interaktif kelas.
              <br />
              Bantu guru mengajar lebih interaktif, siswa lebih terlibat.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                to="/login"
                className="rounded-full bg-[#001456] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_6px_-1px_rgba(0,20,86,0.1)] transition-colors hover:bg-[#001456]/90"
              >
                Coba Gratis
              </Link>
              <a
                href="#fitur"
                className="rounded-full border-2 border-[#001456] px-8 py-3.5 text-base font-semibold text-[#001456] transition-colors hover:bg-[#001456]/5"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          {/* IFP mockup — locked to 16:9, small on mobile, large on desktop */}
          <div className="relative z-[1] w-full max-w-[320px] sm:max-w-[560px] lg:max-w-[1000px]">
            <div className="aspect-video w-full rounded-xl border-4 sm:rounded-2xl sm:border-6 lg:rounded-3xl lg:border-8 border-[#333] bg-[#1a1a1a] p-1.5 sm:p-3 lg:p-6 shadow-md [animation:shadow-pulse_5s_ease-in-out_infinite]">
              <div className="flex size-full flex-col overflow-hidden rounded-lg sm:rounded-xl bg-[#fbf9f5] p-3 sm:p-6 lg:p-10">
                <div className="flex justify-end gap-2 sm:gap-4 text-[#767681]">
                  <span className="flex items-center gap-2 text-[8px] sm:text-xs lg:text-sm">
                    <Wifi className="size-2.5 sm:size-3.5" />
                    05:00
                  </span>
                  <BatteryFull className="size-4 sm:size-6" />
                </div>
                <HeroPresentationShowcase />
              </div>
            </div>
            <p className="absolute bottom-2 right-1/2 text-center text-[7px] font-bold tracking-[1.2px] text-[#666] uppercase sm:pt-2 sm:text-xs">
              PahamIn
            </p>
          </div>

        </section>

        {/* PROBLEM */}
        <section
          id="tentang"
          className="mx-auto flex max-w-7xl scroll-mt-28 flex-col items-center gap-12 px-10 py-6 pb-24 md:flex-row"
        >
          <div className="flex-1">
            <h2 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-[#001456]">
              Punya TV interaktif, tapi bingung mau dipakai buat apa?
            </h2>
            <p className="text-lg leading-relaxed text-[#454650]">
              Membuat media pembelajaran yang menarik membutuhkan waktu. Padahal, guru punya banyak hal lain yang harus disiapkan.
              <br /> <strong> PahamIn </strong> membantu guru mengubah ide pembelajaran menjadi media yang siap digunakan di kelas.
            </p>
          </div>
          <div className="relative flex h-[400px] flex-1 items-end justify-center overflow-hidden rounded-[40px] bg-[#b8c3ff]/30 p-40 sm:p-12">
            <img
              src="/landing/problem-illustration.png"
              alt="Ilustrasi guru kewalahan menyiapkan materi ajar"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </section>

        {/* SOLUTION */}
        <section
          id="fitur"
          className="mx-auto flex max-w-[1280px] scroll-mt-28 flex-col gap-16 px-10 py-16"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#001456]">
              Satu Ide, Berbagai Media Pembelajaran
            </h2>
            <p className="text-lg text-[#454650]">
              Buat berbagai media pembelajaran dalam hitungan menit dengan bantuan AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* PPT — large card, slide mockup asset behind the copy */}
            <div className="relative flex min-h-[454px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#001456] p-10 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] md:col-span-7">
              <div className="absolute top-1/4 -left-10 h-1/2 w-20 rounded-r-full bg-[#fdd34d] opacity-90 [animation:float_7s_ease-in-out_infinite]" />

              <img
                src="/presentation.png"
                alt="Pratinjau slide presentasi interaktif"
                className="absolute top-1/3 right-0 bottom-0 left-1/3 z-[1] size-full rounded-tl-3xl object-cover shadow-[-8px_-8px_0px_rgba(0,0,0,0.1)]"
              />

              <div className="relative z-[2] flex flex-col gap-2">
                <h3 className="text-4xl font-bold text-white">PPT</h3>
                <p className="max-w-[250px] text-base text-white/80">
                  Presentasi interaktif untuk digunakan langsung di TV kelas.
                </p>
              </div>
              {/* <button className="relative z-[2] mt-8 flex size-12 items-center justify-center rounded-full bg-white text-[#001456]">
                <ArrowRight size={18} />
              </button> */}
            </div>

            <div className="flex flex-col gap-6 md:col-span-5">
              {/* LKPD — worksheet mockup asset behind the copy */}
              <div className="relative flex min-h-[213px] items-start justify-between overflow-hidden rounded-[32px] bg-[#fdd34d] p-8 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                <div className="relative z-[2] flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="mb-1 text-2xl font-bold text-[#362B00]">LKPD</h3>
                    <p className="text-base text-[#725b00]/80">
                      Lembar kerja peserta didik siap cetak atau digital.
                    </p>
                  </div>
                  {/* <button className="flex size-10 items-center justify-center rounded-full bg-[#725b00] text-[#fdd34d]">
                    <ArrowRight size={16} />
                  </button> */}
                </div>
                <img
                  src="/LKPD.png"
                  alt="Pratinjau lembar kerja peserta didik"
                  className="absolute top-28 -right-2 z-[1] w-40 rotate-6 rounded-lg shadow-md"
                />
              </div>

              {/* E-Book — reader mockup asset behind the copy */}
              <div className="relative flex min-h-[213px] items-start justify-between gap-4 overflow-hidden rounded-[32px] bg-[#90d792] p-8 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                <div className="relative z-[2] flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="mb-1 text-2xl font-bold text-[#002107]">E-Book</h3>
                    <p className="text-base text-[#002107]/80">
                      Bahan ajar digital yang menarik dan mudah dibaca.
                    </p>
                  </div>
                  {/* <button className="flex size-10 items-center justify-center rounded-full bg-[#002107] text-[#90d792]">
                    <ArrowRight size={16} />
                  </button> */}
                </div>
                <img
                  src="/EBOOK.png"
                  alt="Pratinjau e-book pembelajaran"
                  className="absolute top-45 right-4 z-[1] w-36 -translate-y-1/2 rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* STEP BY STEP */}
        <section className="relative mx-auto flex max-w-[1280px] flex-col gap-8 px-10 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#001456]">
              Dari Ide Jadi Media, Semudah Ini
            </h2>
            <p className="text-lg text-[#454650]">Isi konteks pembelajaran, biarkan AI membantu, lalu gunakan hasilnya di kelas.</p>
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
            <div className="absolute bottom-0 left-0 h-16 w-32 rounded-t-full bg-[#90d792] [animation:float_6s_ease-in-out_infinite]" />
            <div className="absolute right-10 bottom-0 size-32 rounded-full border-4 border-[#c6c5d2]/30 [animation:float_8s_ease-in-out_infinite_0.5s]" />
            <div className="absolute right-16 bottom-0 size-20 rounded-full border-4 border-[#c6c5d2]/30 [animation:float_7s_ease-in-out_infinite_1s]" />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-[#001456] py-24">
          <div className="hidden sm:block absolute  top-1/2 left-[-187px] h-[318px] w-[328px] -translate-y-1/2 rounded-full border-[16px] border-[#fdd34d] opacity-90 [animation:float_8s_ease-in-out_infinite]" />
          <div className="hidden sm:block absolute  top-[calc(50%-27px)] right-[-140px] h-[318px] w-[328px] -translate-y-1/2 rounded-full border-[16px] border-[#fdd34d] opacity-90 [animation:float_9s_ease-in-out_infinite_1s]" />
          <div className="relative z-[1] mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-10 text-center">
            <h2 className="text-4xl font-bold text-white">
              Cobain Sekarang!
            </h2>
            <p className="text-lg text-white/80">Dirancang untuk pembelajaran di TV interaktif dan Interactive Flat Panel.</p>
            <div className="flex gap-4 pt-6">
              <Link
                to="/login"
                className="rounded-full bg-[#fbf9f5] px-8 py-3.5 text-base font-semibold text-[#001456] shadow-md transition-colors hover:bg-white"
              >
                Coba Gratis
              </Link>
              {/* <button className="rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10">
                Pelajari Lebih Lanjut
              </button> */}
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
              Tentang Kami
            </span>
          </div>
        </div>
      </footer>
    </div>
    </ReactLenis>
  );
}
