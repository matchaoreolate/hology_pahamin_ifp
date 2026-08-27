import { LkpdRubrik } from '../../../common/types/shared.types';

export function renderRubricHtml(rubrik?: LkpdRubrik | null): string {
  if (!rubrik) return '';

  const rows = (rubrik.answerKey || [])
    .map(
      (item) => `
      <tr>
        <td style="text-align: center;">${item.no}</td>
        <td>${item.answer}</td>
        <td style="text-align: center;">${item.score}</td>
      </tr>
    `,
    )
    .join('');

  const guide = rubrik.scoringGuide
    ? `
      <div class="scoring-guide">
        <h4>Panduan Penilaian Guru:</h4>
        <p>${rubrik.scoringGuide}</p>
      </div>
    `
    : '';

  return `
    <div class="rubric-page page-break">
      <div class="rubric-header">
        <h2>LEMBAR KUNCI JAWABAN & RUBRIK PENILAIAN GURU</h2>
        <p class="rubric-note">Halaman ini khusus untuk pegangan guru. Jangan dibagikan ke siswa.</p>
      </div>

      <div class="rubric-summary">
        <strong>Total Skor Maksimal:</strong> ${rubrik.totalScore || 100}
      </div>

      <table class="rubric-table">
        <thead>
          <tr>
            <th style="width: 60px;">No</th>
            <th>Kunci Jawaban</th>
            <th style="width: 80px;">Bobot Skor</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      ${guide}
    </div>
  `;
}
