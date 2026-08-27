export const lkpdPrintCss = `
  @page {
    size: A4;
    margin: 1.5cm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1a202c;
    margin: 0;
    padding: 20px;
    font-size: 13px;
    line-height: 1.5;
  }
  .header-table {
    width: 100%;
    border-bottom: 3px double #2d3748;
    padding-bottom: 12px;
    margin-bottom: 15px;
  }
  .header-logo {
    font-size: 20px;
    font-weight: 800;
    color: #3182ce;
    letter-spacing: -0.5px;
  }
  .header-logo span {
    color: #e53e3e;
  }
  .header-title {
    text-align: center;
  }
  .header-title h1 {
    margin: 0;
    font-size: 17px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .header-title h2 {
    margin: 3px 0 0 0;
    font-size: 14px;
    color: #4a5568;
  }
  .identity-box {
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 16px;
    background-color: #f7fafc;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 24px;
  }
  .id-field {
    display: flex;
  }
  .id-field .label {
    width: 90px;
    font-weight: 600;
    color: #4a5568;
  }
  .id-field .dots {
    flex: 1;
    border-bottom: 1px dotted #718096;
  }
  .petunjuk-box {
    border-left: 4px solid #3182ce;
    background-color: #ebf8ff;
    padding: 8px 12px;
    margin-bottom: 16px;
    border-radius: 0 4px 4px 0;
    font-size: 12px;
  }
  .petunjuk-box strong {
    color: #2b6cb0;
  }
  .question-card {
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .question-header {
    display: flex;
    gap: 6px;
    font-size: 13.5px;
    margin-bottom: 6px;
  }
  .q-num {
    font-weight: 700;
    color: #2d3748;
  }
  .q-text {
    flex: 1;
  }
  .q-score {
    font-size: 11px;
    color: #718096;
    font-style: italic;
  }
  .options-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 16px;
    margin-left: 20px;
    margin-top: 4px;
  }
  .option-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .option-box {
    width: 14px;
    height: 14px;
    border: 1.5px solid #4a5568;
    border-radius: 50%;
    display: inline-block;
  }
  .answer-blank {
    margin-left: 20px;
    margin-top: 4px;
    color: #4a5568;
  }
  .essay-box {
    margin-left: 20px;
    margin-top: 6px;
  }
  .essay-box .line {
    border-bottom: 1px dashed #cbd5e0;
    height: 20px;
    margin-bottom: 4px;
  }
  .page-break {
    page-break-before: always;
    margin-top: 30px;
  }
  .rubric-header {
    border-bottom: 2px solid #e53e3e;
    padding-bottom: 8px;
    margin-bottom: 14px;
  }
  .rubric-header h2 {
    margin: 0;
    color: #c53030;
    font-size: 16px;
  }
  .rubric-note {
    margin: 4px 0 0 0;
    color: #742a2a;
    font-size: 12px;
    font-style: italic;
  }
  .rubric-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 12.5px;
  }
  .rubric-table th, .rubric-table td {
    border: 1px solid #cbd5e0;
    padding: 6px 10px;
  }
  .rubric-table th {
    background-color: #edf2f7;
    text-align: left;
    font-weight: 600;
  }
  .scoring-guide {
    margin-top: 14px;
    padding: 10px;
    background-color: #fffaf0;
    border: 1px solid #feebc8;
    border-radius: 4px;
    font-size: 12px;
  }
  .scoring-guide h4 {
    margin: 0 0 4px 0;
    color: #c05621;
  }
  .print-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #3182ce;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  @media print {
    .print-btn { display: none; }
    body { padding: 0; }
  }
`;
