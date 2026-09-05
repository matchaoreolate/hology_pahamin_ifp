"""
Static prompt templates for PresentationArtifact v0.2.

Contains:
- SCHEMA_TEMPLATE  : JSON schema example shown to Gemini
- INTERACTION_RULES: Full specification of all 5 interaction primitives
                     (choice | matching | sorting | reveal | drag_drop)

These are kept separate so they can be updated without touching builder logic.
"""

SCHEMA_TEMPLATE = """\
{{
  "version": "0.2",
  "meta": {{
    "title": "{topik}",
    "mata_pelajaran": "{mata_pelajaran}",
    "topik": "{topik}",
    "fase": "{fase}",
    "total_slides": {n}
  }},
  "slides": [
    {{
      "id": "slide-1",
      "order": 1,
      "type": "opening",
      "title": "Judul Slide Pembuka",
      "content": "Pengantar topik pembelajaran",
      "assets": [],
      "interaction": null,
      "teacher_note": "Ajak siswa fokus dan mulai dengan apersepsi",
      "speaker_script": "Halo anak-anak hebat! Hari ini kita akan belajar tentang..."
    }}
  ]
}}"""

# ─────────────────────────────────────────────────────────────────
# Interaction Rules — all 5 primitives with annotated JSON examples
# ─────────────────────────────────────────────────────────────────

INTERACTION_RULES = """\
5. Untuk slide bertipe "interactive", field `interaction` HARUS menggunakan salah satu dari 5 primitive berikut:
   PENTING: Selalu sertakan EMOJI yang relevan pada setiap opsi, label, dan pasangan agar anak-anak SD tertarik saat menyentuh layar!

   a) **Choice** (`"type": "choice"`):
      Struktur: instruction, options[{id, label}], correct_answer (berisi id), feedback{correct, incorrect}
      Contoh:
      {
        "type": "choice",
        "instruction": "Apa fungsi utama akar pada tumbuhan? 🌱",
        "options": [
          {"id": "opt-a", "label": "💧 Menyerap air dan mineral dari tanah"},
          {"id": "opt-b", "label": "☀️ Melakukan fotosintesis di bawah sinar matahari"},
          {"id": "opt-c", "label": "🌸 Menghasilkan bunga dan buah"}
        ],
        "correct_answer": "opt-a",
        "feedback": {"correct": "🎉 Tepat sekali! Akar menyerap air dan mineral dari tanah.", "incorrect": "💡 Coba lagi yuk! Perhatikan bagian tumbuhan yang ada di dalam tanah."}
      }

   b) **Matching** (`"type": "matching"`):
      Struktur: instruction, pairs[{id, left{id, label}, right{id, label}}], feedback
      Contoh:
      {
        "type": "matching",
        "instruction": "Pasangkan setiap hewan dengan habitat aslinya! 🐾",
        "pairs": [
          {"id": "pair-1", "left": {"id": "left-1", "label": "🐟 Ikan Badut"}, "right": {"id": "right-1", "label": "🌊 Terumbu Karang"}},
          {"id": "pair-2", "left": {"id": "left-2", "label": "🦅 Burung Elang"}, "right": {"id": "right-2", "label": "🌲 Pohon Tinggi di Hutan"}}
        ],
        "feedback": {"correct": "🌟 Luar biasa! Semua pasangan hewan dan habitatnya cocok!", "incorrect": "🤔 Ada pasangan yang belum pas, ayo coba cari lagi!"}
      }

   c) **Sorting** (`"type": "sorting"`):
      Struktur: instruction, categories[{id, label}], items[{id, label, correct_category}], feedback
      Contoh:
      {
        "type": "sorting",
        "instruction": "Kelompokkan benda-benda berikut ke kotak yang tepat! 📦",
        "categories": [
          {"id": "cat-hidup", "label": "🌿 Makhluk Hidup"},
          {"id": "cat-mati", "label": "🧱 Benda Tak Hidup"}
        ],
        "items": [
          {"id": "item-1", "label": "🌳 Pohon Mangga", "correct_category": "cat-hidup"},
          {"id": "item-2", "label": "🪨 Batu Kali", "correct_category": "cat-mati"}
        ],
        "feedback": {"correct": "🎉 Hebat! Semua benda dikelompokkan dengan benar!", "incorrect": "🧐 Coba periksa kembali ya, apakah ada benda yang tertukar?"}
      }

   d) **Reveal** (`"type": "reveal"`):
      Struktur: instruction (opsional), items[{id, label, revealed_content, asset?}]
      Contoh:
      {
        "type": "reveal",
        "instruction": "Sentuh setiap kartu misteri untuk membuka rahasianya! 🔍",
        "items": [
          {"id": "rv-1", "label": "☀️ Penguapan (Evaporasi)", "revealed_content": "Air di laut dan sungai menguap ke udara karena hangatnya sinar matahari."},
          {"id": "rv-2", "label": "☁️ Pembentukan Awan (Kondensasi)", "revealed_content": "Uap air yang naik ke atas mendingin dan berkumpul membentuk awan putih yang indah."}
        ]
      }

   e) **Drag & Drop** (`"type": "drag_drop"`):
      Struktur: instruction, items[{id, label}], targets[{id, label}], answers[{item_id, target_id}], feedback
      Setiap item harus memiliki tepat satu target yang benar di dalam answers[].
      Contoh:
      {
        "type": "drag_drop",
        "instruction": "Tarik dan letakkan setiap tahap ke kotak urutan yang benar! 🎯",
        "items": [
          {"id": "item-telur", "label": "🥚 Telur"},
          {"id": "item-ulat", "label": "🐛 Ulat Lucu"},
          {"id": "item-kupu", "label": "🦋 Kupu-kupu Indah"}
        ],
        "targets": [
          {"id": "target-1", "label": "Tahap 1"},
          {"id": "target-2", "label": "Tahap 2"},
          {"id": "target-3", "label": "Tahap 3"}
        ],
        "answers": [
          {"item_id": "item-telur", "target_id": "target-1"},
          {"item_id": "item-ulat", "target_id": "target-2"},
          {"item_id": "item-kupu", "target_id": "target-3"}
        ],
        "feedback": {"correct": "🎉 Luar biasa! Urutannya tepat dan sempurna!", "incorrect": "Ayo coba teliti lagi urutannya dari awal."}
      }"""
