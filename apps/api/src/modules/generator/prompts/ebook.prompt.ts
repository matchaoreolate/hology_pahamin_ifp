import { GenerateDto } from '../dto/generate.dto';
import { EbookNarrativeStyle } from '../dto/enums';
import { buildBaseContext } from './context.builder';

export function buildEbookPrompt(dto: GenerateDto): string {
  const context = buildBaseContext(dto);
  const narrative = dto.ebookStyle === EbookNarrativeStyle.DIALOG_KARAKTER
    ? 'Dialog Karakter: percakapan edukatif 2 tokoh ramah anak (misal: Bima dan EduBot).'
    : 'Buku Cerita Bergambar: narasi petualangan mengalir untuk dibaca bersama orang tua.';
  const glossary = dto.ebookGlosarium
    ? 'WAJIB sertakan kamus mini kosa kata baru di akhir buku.'
    : 'Set glossary ke array kosong [].';
  const parentDiscussion = dto.ebookPemantikDiskusi
    ? 'WAJIB sertakan 3-4 pertanyaan pemantik diskusi orang tua di rumah.'
    : 'Set parentDiscussion ke array kosong [].';

  return `
Kamu adalah asisten pedagogi AI pembuat buku cerita digital anak SD Indonesia.
Rancang E-Book web yang bisa dipindai orang tua murid via QR Code.

${context}

=== PANDUAN E-BOOK ===
- Gaya Narasi: ${narrative}
- Kamus Mini: ${glossary}
- Diskusi Rumah: ${parentDiscussion}

=== OUTPUT FORMAT (JSON ONLY) ===
{
  "title": "Judul E-Book Menarik",
  "subtitle": "Subjudul Petualangan",
  "subject": "${dto.mataPelajaran}",
  "topic": "${dto.topik}",
  "targetAge": "7-10 tahun",
  "characters": [
    { "name": "Karakter", "role": "Peran", "description": "Deskripsi" }
  ],
  "chapters": [
    {
      "no": 1,
      "title": "Judul Bab",
      "content": "Isi cerita narasi (3-4 paragraf)",
      "illustration": "Deskripsi visual halaman",
      "keyPoints": ["Poin penting 1", "Poin penting 2"]
    }
  ],
  "glossary": [
    { "term": "Istilah", "definition": "Penjelasan ramah anak" }
  ],
  "parentDiscussion": [
    { "question": "Pertanyaan untuk anak", "hint": "Petunjuk diskusi ortu" }
  ],
  "closingMessage": "Pesan penutup hangat"
}
`.trim();
}
