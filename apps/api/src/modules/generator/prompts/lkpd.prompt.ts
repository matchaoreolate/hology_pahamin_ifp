import { GenerateDto } from '../dto/generate.dto';
import { buildBaseContext, describeGeo } from './context.builder';

export function buildLkpdPrompt(dto: GenerateDto): string {
  const context = buildBaseContext(dto);
  const total = dto.lkpdJumlahSoal || 10;
  const mudah = dto.lkpdPersenMudah ?? 70;
  const hots = 100 - mudah;
  const tipe = dto.lkpdQuestionType || 'campuran';
  const rubricRequirement = dto.lkpdRubrik
    ? 'WAJIB sertakan rubrik penilaian guru (kunci jawaban & pembobotan nilai).'
    : 'Set field "rubrik" menjadi null.';

  return `
Kamu adalah asisten kurikulum AI ahli lembar kerja siswa SD Indonesia (LKPD Fisik).
Buat LKPD terstruktur dan siap cetak untuk siswa di meja masing-masing.

${context}

=== PANDUAN LKPD ===
- Tipe Soal: ${tipe}
- Jumlah: ${total} butir soal
- Bobot Kesulitan: ${mudah}% Mudah/Sedang, ${hots}% Tingkat Tinggi (HOTS)
- Injeksi Konteks: Gunakan latar cerita ${describeGeo(dto.geoContext)}
- Rubrik: ${rubricRequirement}

=== OUTPUT FORMAT (JSON ONLY) ===
{
  "title": "LEMBAR KERJA PESERTA DIDIK (LKPD)",
  "subject": "${dto.mataPelajaran}",
  "topic": "${dto.topik}",
  "fase": "${dto.fase}",
  "petunjuk": "Petunjuk pengerjaan ramah anak",
  "identitySection": {
    "fields": ["Nama", "Kelas", "Tanggal"]
  },
  "questions": [
    {
      "no": 1,
      "type": "pilihan_ganda | isian_singkat | mencocokkan | uraian",
      "difficulty": "mudah | sedang | hots",
      "question": "Kalimat soal",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "Kunci jawaban",
      "score": 10,
      "hotsLevel": null
    }
  ],
  "rubrik": {
    "totalScore": 100,
    "answerKey": [
      { "no": 1, "answer": "Kunci jawaban", "score": 10 }
    ],
    "scoringGuide": "Panduan penskoran guru"
  }
}
`.trim();
}
