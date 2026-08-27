import { GenerateDto } from '../dto/generate.dto';
import { FaseKelas, GeoContext, ClassLevel, ClassMode } from '../dto/enums';

export function describeFase(fase: FaseKelas): string {
  const map: Record<FaseKelas, string> = {
    [FaseKelas.A]: 'Fase A (Kelas 1-2): gunakan kosa kata sangat sederhana, kalimat pendek, dan gambar besar.',
    [FaseKelas.B]: 'Fase B (Kelas 3-4): kosa kata lebih beragam, mulai masukkan logika dasar dan analogi sederhana.',
    [FaseKelas.C]: 'Fase C (Kelas 5-6): bisa menggunakan istilah ilmiah dasar, materi analitis, dan berpikir kritis.',
  };
  return map[fase] || 'Fase SD umum';
}

export function describeGeo(geo?: GeoContext): string {
  if (!geo) return 'konteks umum sekolah dasar di Indonesia.';
  const map: Record<GeoContext, string> = {
    [GeoContext.PESISIR]: 'daerah pesisir pantai (analogi: nelayan, perahu, tambak garam, cuaca laut, ombak, ikan).',
    [GeoContext.PERKOTAAN]: 'daerah perkotaan (analogi: transportasi kota, gedung, pasar modern, lampu lalu lintas).',
    [GeoContext.PEGUNUNGAN]: 'daerah pegunungan (analogi: ladang sayur, kebun teh, sungai, hutan, hewan ternak).',
  };
  return map[geo];
}

export function describeClassLevel(level?: ClassLevel): string {
  if (!level) return 'tingkat kesiapan campuran, sajikan berjenjang dari dasar ke menantang.';
  const map: Record<ClassLevel, string> = {
    [ClassLevel.BELUM_PAHAM]: 'mayoritas siswa BELUM PAHAM dasar. Perbanyak analogi visual, perlambat pacing materi.',
    [ClassLevel.SUDAH_PAHAM]: 'mayoritas siswa SUDAH PAHAM dasar. Padatkan teori, perbanyak kuis tantangan aktif.',
    [ClassLevel.CAMPURAN]: 'kelas CAMPURAN. Gunakan scaffolding berjenjang dari mudah ke menantang.',
  };
  return map[level];
}

export function describeClassMode(mode?: ClassMode): string {
  if (!mode) return 'Mode Seimbang: teori diselingi aktivitas interaktif.';
  const map: Record<ClassMode, string> = {
    [ClassMode.FOKUS]: 'Mode Fokus/Mendongeng: banyak visual bercerita, interaksi sentuh layar di akhir.',
    [ClassMode.SEIMBANG]: 'Mode Seimbang: setiap 2-3 slide materi diselingi 1 slide interaktif di layar TV.',
    [ClassMode.SUPER_AKTIF]: 'Mode Super Aktif: minimalkan teks panjang, dominasi game & kuis sentuh layar IFP.',
  };
  return map[mode];
}

export function buildBaseContext(dto: GenerateDto): string {
  const durasiMenit = dto.durasiJP * 35;
  const approach = dto.fokusApproach?.join(', ') || 'tidak ada preferensi spesifik';

  return `
=== KONTEKS PEMBELAJARAN ===
- Mata Pelajaran: ${dto.mataPelajaran}
- Topik: ${dto.topik}
- Tujuan Pembelajaran (TP): "${dto.tujuanPembelajaran}"
- Fase: ${describeFase(dto.fase)}
- Alokasi Durasi: ${dto.durasiJP} JP (${durasiMenit} menit)
- Konteks Geografis: ${describeGeo(dto.geoContext)}
- Kesiapan Kelas: ${describeClassLevel(dto.classLevel)}
- Apersepsi (Pelajaran Lalu): "${dto.apersepsi || 'tidak ada'}"
- Pendekatan: ${approach}
=== END KONTEKS ===
`.trim();
}
