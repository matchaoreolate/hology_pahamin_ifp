import { GenerateDto } from '../dto/generate.dto';
import { buildBaseContext, describeClassMode } from './context.builder';

export function buildPresentasiPrompt(dto: GenerateDto): string {
  const context = buildBaseContext(dto);
  const mode = describeClassMode(dto.classMode);
  const theme = dto.visualTheme?.replace('_', ' ') || 'cute 3d';
  const iceBreaking = dto.iceBreaking
    ? 'WAJIB sisipkan 1 slide aktivitas fisik ringan tiap jeda sub-materi.'
    : 'Tidak perlu ice-breaking.';
  const notes = dto.instruksiSpesifik
    ? `Instruksi khusus guru: "${dto.instruksiSpesifik}"`
    : '';

  return `
Kamu adalah asisten pedagogi AI spesialis media pembelajaran SD di TV Merah Putih (Interactive Flat Panel).
Buat modul Presentasi Interaktif dengan estetika ${theme}.

${context}

=== PANDUAN MODUL TV ===
- Gaya Visual: ${theme}
- Mode Dinamika: ${mode}
- Ice Breaking: ${iceBreaking}
${notes}

=== OUTPUT FORMAT (JSON ONLY) ===
{
  "title": "Judul Presentasi",
  "theme": "${theme}",
  "colorPalette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "slides": [
    {
      "id": 1,
      "type": "apersepsi | pembuka | materi | interaktif | ice_breaking | penutup",
      "title": "Judul Slide",
      "content": "Isi narasi slide",
      "visualDescription": "Deskripsi visual cute 3D",
      "speakerNotes": "Catatan panduan guru",
      "interactive": false,
      "interactiveConfig": null
    },
    {
      "id": 2,
      "type": "interaktif",
      "title": "Kuis Sentuh Layar",
      "content": "Instruksi interaksi",
      "visualDescription": "Visual tombol/elemen yang bisa disentuh",
      "speakerNotes": "Panduan meminta siswa maju ke depan",
      "interactive": true,
      "interactiveConfig": {
        "activityType": "tap_answer | drag_drop | true_false | word_match",
        "question": "Pertanyaan",
        "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        "correctAnswer": "Opsi A",
        "feedback": { "correct": "Hebat!", "incorrect": "Coba lagi ya!" }
      }
    }
  ]
}
`.trim();
}
