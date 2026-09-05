"""
PDF Generator for LKPD (Lembar Kerja Peserta Didik).
Generates ready-to-print A4 worksheets for classroom use.
"""
from typing import Any
from fpdf import FPDF


class LKPD_PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 14)
        self.cell(0, 8, "LEMBAR KERJA PESERTA DIDIK (LKPD)", align="C", new_y="NEXT")
        self.set_font("helvetica", "I", 10)
        self.cell(0, 6, "Kurikulum Merdeka - Sekolah Dasar", align="C", new_y="NEXT")
        self.set_draw_color(30, 60, 150)
        self.set_line_width(0.8)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Halaman {self.page_no()} | Dibuat dengan PahamIn AI", align="C")


class LKPD_PDFService:
    @staticmethod
    def generate_pdf(lkpd_data: dict[str, Any]) -> bytes:
        """Render LKPD JSON data into standard A4 printable PDF bytes."""
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
        pdf.cell(90, 5, f"Mata Pelajaran: {mapel}")
        # Kolom Kanan: Nama Siswa
        pdf.cell(90, 5, "Nama Siswa : ........................................", new_y="NEXT")

        pdf.set_x(12)
        pdf.cell(90, 5, f"Topik/Materi   : {topik}")
        pdf.cell(90, 5, "Kelas / No  : .................... / ................", new_y="NEXT")

        pdf.set_x(12)
        pdf.cell(90, 5, f"Fase / Waktu  : {fase} (Kls {kelas}) / {waktu}")
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
            tipe = item.get("tipe", "pilihan_ganda")
            opsi = item.get("opsi", [])
            skor = item.get("skor", "")

            pdf.set_font("helvetica", "B", 9)
            badge = f" [Skor: {skor}]" if skor else ""
            pdf.set_x(10)
            pdf.cell(0, 5, f"{nomor}. Pertanyaan{badge}:", new_x="LMARGIN", new_y="NEXT")

            pdf.set_font("helvetica", size=9)
            pdf.set_x(10)
            pdf.multi_cell(190, 5, pertanyaan, new_x="LMARGIN", new_y="NEXT")

            if opsi:  # Pilihan Ganda
                pdf.set_font("helvetica", size=8.5)
                for opt in opsi:
                    pdf.set_x(16)
                    pdf.cell(0, 4.5, str(opt), new_x="LMARGIN", new_y="NEXT")
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
