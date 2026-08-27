import { LkpdData } from '../../../common/types/shared.types';
import { lkpdPrintCss } from './lkpd-styles';
import { renderQuestionsHtml } from './lkpd-questions.template';
import { renderRubricHtml } from './lkpd-rubric.template';

export function renderLkpdPrintableHtml(lkpd: LkpdData, schoolName?: string | null): string {
  const questionsHtml = renderQuestionsHtml(lkpd.questions);
  const rubricHtml = renderRubricHtml(lkpd.rubrik);
  const school = schoolName || 'Sekolah Dasar';

  const instructions = lkpd.petunjuk
    ? `<div class="petunjuk-box"><strong>Petunjuk:</strong> ${lkpd.petunjuk}</div>`
    : '';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${lkpd.title} - ${lkpd.topic}</title>
  <style>${lkpdPrintCss}</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Cetak LKPD</button>

  <table class="header-table">
    <tr>
      <td style="width: 25%;">
        <div class="header-logo">Paham<span>In</span></div>
        <small style="color: #718096;">${school}</small>
      </td>
      <td class="header-title">
        <h1>${lkpd.title || 'LEMBAR KERJA PESERTA DIDIK (LKPD)'}</h1>
        <h2>${lkpd.subject} — Fase ${lkpd.fase} · ${lkpd.topic}</h2>
      </td>
      <td style="width: 25%; text-align: right; font-size: 11px; color: #718096;">
        Kurikulum Merdeka<br>
        TV Merah Putih Media
      </td>
    </tr>
  </table>

  <div class="identity-box">
    <div class="id-field"><span class="label">Nama Siswa</span>: <span class="dots"></span></div>
    <div class="id-field"><span class="label">Kelas</span>: <span class="dots"></span></div>
    <div class="id-field"><span class="label">No. Absen</span>: <span class="dots"></span></div>
    <div class="id-field"><span class="label">Tanggal</span>: <span class="dots"></span></div>
  </div>

  ${instructions}

  <div class="questions-container">
    ${questionsHtml}
  </div>

  ${rubricHtml}
</body>
</html>
  `.trim();
}
