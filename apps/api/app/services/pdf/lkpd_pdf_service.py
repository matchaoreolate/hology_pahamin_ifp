"""
PDF Generator for LKPD (Lembar Kerja Peserta Didik).
Generates ready-to-print A4 worksheets for classroom use.
Supports both v0.1 schema (meta & sections with activities) and legacy schema (header & soal).
"""
from typing import Any
from fpdf import FPDF


def _sanitize(text: Any) -> str:
    """Sanitize text to be safely encodable in standard PDF Latin-1 fonts."""
    if text is None:
        return ""
    s = str(text)
    replacements = {
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "-",
        "\u2026": "...",
        "\u2022": "*",
        "\u00a0": " ",
        "\u200b": "",
    }
    for old, new in replacements.items():
        s = s.replace(old, new)
    return s.encode("latin-1", "replace").decode("latin-1")


class LKPD_PDF(FPDF):
    def __init__(self, subtitle: str = "Kurikulum Merdeka - Sekolah Dasar", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.doc_subtitle = subtitle

    def header(self):
        self.set_font("helvetica", "B", 14)
        self.cell(0, 8, "LEMBAR KERJA PESERTA DIDIK (LKPD)", align="C", new_y="NEXT")
        self.set_font("helvetica", "I", 10)
        self.cell(0, 6, _sanitize(self.doc_subtitle), align="C", new_y="NEXT")
        self.set_draw_color(30, 60, 150)
        self.set_line_width(0.8)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Halaman {self.page_no()} | Dibuat dengan KelasIn AI", align="C")


class LKPD_PDFService:
    @staticmethod
    def generate_pdf(lkpd_data: dict[str, Any]) -> bytes:
        """Render LKPD JSON data into standard A4 printable PDF bytes.

        Supports:
        - v0.1 contract: {version: '0.1', meta: {...}, sections: [...]}
        - legacy contract: {header: {...}, soal: [...]}
        """
        if "sections" in lkpd_data:
            return LKPD_PDFService._render_v01(lkpd_data)
        return LKPD_PDFService._render_legacy(lkpd_data)

    @staticmethod
    def _render_v01(lkpd_data: dict[str, Any]) -> bytes:
        meta = lkpd_data.get("meta", {})
        sections = lkpd_data.get("sections", [])

        topik = meta.get("topik", "Pembelajaran")
        mapel = meta.get("mata_pelajaran", "Tematik")
        fase = meta.get("fase", "Fase A")
        waktu_menit = meta.get("alokasi_waktu_menit")
        waktu_str = f"{waktu_menit} menit" if waktu_menit else "35 menit"

        subtitle = f"{mapel} - {topik} - Fase {fase}"
        pdf = LKPD_PDF(subtitle=subtitle, orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(auto=True, margin=18)
        pdf.add_page()

        # --- Identitas Pembelajaran & Siswa ---
        pdf.set_font("helvetica", "B", 9)
        pdf.set_fill_color(240, 245, 255)
        pdf.rect(10, pdf.get_y(), 190, 24, "F")

        # Kolom Kiri: Info Mapel
        pdf.set_xy(12, pdf.get_y() + 2)
        pdf.cell(90, 5, _sanitize(f"Mata Pelajaran: {mapel}"))
        # Kolom Kanan: Nama Siswa
        pdf.cell(90, 5, "Nama Siswa : ........................................", new_y="NEXT")

        pdf.set_x(12)
        pdf.cell(90, 5, _sanitize(f"Topik/Materi   : {topik}"))
        pdf.cell(90, 5, "Kelas / No  : .................... / ................", new_y="NEXT")

        pdf.set_x(12)
        pdf.cell(90, 5, _sanitize(f"Fase / Waktu  : {fase} / {waktu_str}"))
        pdf.cell(90, 5, "Tanggal      : ........................................", new_x="LMARGIN", new_y="NEXT")
        pdf.set_x(10)
        pdf.ln(5)

        # --- Petunjuk Umum ---
        pdf.set_font("helvetica", "B", 10)
        pdf.cell(0, 6, "Petunjuk Pengerjaan:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("helvetica", size=9)
        pdf.set_x(10)
        pdf.multi_cell(
            190,
            5,
            "1. Tuliskan nama, kelas, dan nomor absen pada kolom identitas di atas.\n"
            "2. Bacalah setiap petunjuk dan instruksi kegiatan dengan seksama.\n"
            "3. Kerjakan tugas secara mandiri atau diskusikan bersama kelompok sesuai arahan guru.",
        )
        pdf.ln(4)

        # --- Sections & Activities ---
        q_counter = 1
        for sec_idx, section in enumerate(sections, 1):
            if pdf.get_y() > 240:
                pdf.add_page()

            sec_title = section.get("title", f"Bagian {sec_idx}")
            sec_instruction = section.get("instruction")
            activities = section.get("activities", [])

            # Section Header Bar
            pdf.set_font("helvetica", "B", 10.5)
            pdf.set_fill_color(230, 238, 250)
            pdf.set_draw_color(180, 200, 230)
            pdf.rect(10, pdf.get_y(), 190, 8, "FD")
            pdf.set_xy(12, pdf.get_y() + 1.5)
            pdf.cell(186, 5, _sanitize(sec_title), new_y="NEXT")
            pdf.ln(3)

            # Section Instruction
            if sec_instruction:
                pdf.set_font("helvetica", "I", 9)
                pdf.set_text_color(60, 60, 60)
                pdf.set_x(12)
                pdf.multi_cell(186, 4.5, _sanitize(f"Petunjuk: {sec_instruction}"))
                pdf.set_text_color(0, 0, 0)
                pdf.ln(2)

            # Activities
            for act in activities:
                act_type = act.get("type", "instruction")

                if act_type == "instruction":
                    content = act.get("content", "")
                    if content:
                        if pdf.get_y() > 245:
                            pdf.add_page()
                        pdf.set_font("helvetica", size=9)
                        pdf.set_x(12)
                        pdf.multi_cell(186, 5, _sanitize(content))
                        pdf.ln(2)

                elif act_type == "question":
                    question_text = act.get("question", "")
                    space_type = act.get("answer_space", "lined")

                    needed_height = 35 if space_type == "boxed" else (18 if space_type == "short" else 28)
                    if pdf.get_y() + needed_height > 265:
                        pdf.add_page()

                    pdf.set_font("helvetica", "B", 9.5)
                    pdf.set_x(10)
                    pdf.multi_cell(190, 5, _sanitize(f"{q_counter}. {question_text}"))
                    q_counter += 1

                    if space_type == "short":
                        pdf.set_draw_color(180, 180, 180)
                        pdf.ln(1)
                        pdf.line(14, pdf.get_y() + 4, 195, pdf.get_y() + 4)
                        pdf.ln(7)
                    elif space_type == "boxed":
                        pdf.set_draw_color(180, 180, 180)
                        pdf.rect(12, pdf.get_y() + 2, 186, 22)
                        pdf.set_font("helvetica", "I", 8)
                        pdf.set_text_color(160, 160, 160)
                        pdf.set_xy(14, pdf.get_y() + 3)
                        pdf.cell(180, 4, "Tulis jawaban di dalam kotak ini...")
                        pdf.set_text_color(0, 0, 0)
                        pdf.ln(23)
                    else:  # "lined" (default)
                        pdf.set_draw_color(180, 180, 180)
                        pdf.ln(1)
                        for _ in range(3):
                            pdf.line(14, pdf.get_y() + 4, 195, pdf.get_y() + 4)
                            pdf.ln(6)

                    pdf.ln(2)

            pdf.ln(2)

        # --- Rubrik / Nilai Box ---
        if pdf.get_y() > 240:
            pdf.add_page()

        pdf.ln(4)
        pdf.set_draw_color(50, 50, 50)
        pdf.rect(140, pdf.get_y(), 60, 20)
        pdf.set_font("helvetica", "B", 8)
        pdf.set_xy(142, pdf.get_y() + 2)
        pdf.cell(56, 4, "Nilai / Catatan Guru:", align="C", new_y="NEXT")

        return bytes(pdf.output())

    @staticmethod
    def _render_legacy(lkpd_data: dict[str, Any]) -> bytes:
        header_data = lkpd_data.get("header", {})
        soal_list = lkpd_data.get("soal", [])

        pdf = LKPD_PDF(orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(auto=True, margin=18)
        pdf.add_page()

        # --- Identitas Pembelajaran & Siswa ---
        pdf.set_font("helvetica", "B", 9)
        pdf.set_fill_color(240, 245, 255)
        pdf.rect(10, pdf.get_y(), 190, 24, "F")

        topik = header_data.get("topik", "Pembelajaran")
        mapel = header_data.get("mata_pelajaran", "Tematik")
        kelas = header_data.get("kelas", "SD")
        fase = header_data.get("fase", "Fase A")
        waktu = header_data.get("alokasi_waktu", "35 menit")

        # Kolom Kiri: Info Mapel
        pdf.set_xy(12, pdf.get_y() + 2)
        pdf.cell(90, 5, _sanitize(f"Mata Pelajaran: {mapel}"))
        # Kolom Kanan: Nama Siswa
        pdf.cell(90, 5, "Nama Siswa : ........................................", new_y="NEXT")

        pdf.set_x(12)
        pdf.cell(90, 5, _sanitize(f"Topik/Materi   : {topik}"))
        pdf.cell(90, 5, "Kelas / No  : .................... / ................", new_y="NEXT")

        pdf.set_x(12)
        pdf.cell(90, 5, _sanitize(f"Fase / Waktu  : {fase} (Kls {kelas}) / {waktu}"))
        pdf.cell(90, 5, "Tanggal      : ........................................", new_x="LMARGIN", new_y="NEXT")
        pdf.set_x(10)
        pdf.ln(5)

        # --- Petunjuk Pengerjaan ---
        pdf.set_font("helvetica", "B", 10)
        pdf.cell(0, 6, "Petunjuk Pengerjaan:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("helvetica", size=9)
        pdf.set_x(10)
        pdf.multi_cell(190, 5, "1. Tuliskan nama, kelas, dan nomor absen pada kolom di atas.\n"
                               "2. Bacalah setiap pertanyaan dengan teliti sebelum menjawab.\n"
                               "3. Kerjakan secara mandiri atau diskusikan sesuai instruksi guru.")
        pdf.ln(4)

        # --- Daftar Pertanyaan / Soal ---
        pdf.set_font("helvetica", "B", 11)
        pdf.cell(0, 7, "Ayo Berlatih & Menjawab Tantangan!", new_y="NEXT")
        pdf.ln(2)

        for item in soal_list:
            nomor = item.get("nomor", "")
            pertanyaan = item.get("pertanyaan", "")
            opsi = item.get("opsi", [])
            skor = item.get("skor", "")

            pdf.set_font("helvetica", "B", 9)
            badge = f" [Skor: {skor}]" if skor else ""
            pdf.set_x(10)
            pdf.cell(0, 5, _sanitize(f"{nomor}. Pertanyaan{badge}:"), new_x="LMARGIN", new_y="NEXT")

            pdf.set_font("helvetica", size=9)
            pdf.set_x(10)
            pdf.multi_cell(190, 5, _sanitize(pertanyaan), new_x="LMARGIN", new_y="NEXT")

            if opsi:  # Pilihan Ganda
                pdf.set_font("helvetica", size=8.5)
                for opt in opsi:
                    pdf.set_x(16)
                    pdf.cell(0, 4.5, _sanitize(str(opt)), new_x="LMARGIN", new_y="NEXT")
            else:  # Isian / Uraian (Berikan garis tempat menulis jawaban)
                pdf.set_draw_color(180, 180, 180)
                pdf.ln(2)
                for _ in range(2):
                    pdf.line(16, pdf.get_y() + 4, 195, pdf.get_y() + 4)
                    pdf.ln(6)

            pdf.ln(3)

        # --- Rubrik / Nilai Box ---
        if pdf.get_y() > 240:
            pdf.add_page()

        pdf.ln(4)
        pdf.set_draw_color(50, 50, 50)
        pdf.rect(140, pdf.get_y(), 60, 20)
        pdf.set_font("helvetica", "B", 8)
        pdf.set_xy(142, pdf.get_y() + 2)
        pdf.cell(56, 4, "Nilai / Catatan Guru:", align="C", new_y="NEXT")

        return bytes(pdf.output())

