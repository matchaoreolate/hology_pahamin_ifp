import { LkpdQuestion } from '../../../common/types/shared.types';

export function renderQuestionsHtml(questions: LkpdQuestion[] = []): string {
  return questions
    .map((q, idx) => {
      let answerBox = '';

      if (q.type === 'pilihan_ganda' && q.options && q.options.length > 0) {
        answerBox = `
          <div class="options-list">
            ${q.options
              .map(
                (opt) =>
                  `<div class="option-item"><span class="option-box"></span> ${opt}</div>`,
              )
              .join('')}
          </div>
        `;
      } else if (q.type === 'isian_singkat') {
        answerBox = `
          <div class="answer-blank">
            <span>Jawaban: __________________________________________________________________________</span>
          </div>
        `;
      } else {
        answerBox = `
          <div class="essay-box">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
        `;
      }

      return `
        <div class="question-card">
          <div class="question-header">
            <span class="q-num">${q.no || idx + 1}.</span>
            <span class="q-text">${q.question}</span>
            ${q.score ? `<span class="q-score">(${q.score} Poin)</span>` : ''}
          </div>
          ${answerBox}
        </div>
      `;
    })
    .join('');
}
