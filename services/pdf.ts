
import { FertilizerAdvice, UserContext, WeatherData } from "../types";

export const downloadReport = (context: UserContext, advice: FertilizerAdvice, weather: WeatherData | null) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const formatToList = (text: string) => {
    if (!text) return '';
    const items = text.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`)
      .join('');
    return `<ul style="margin: 0; padding-left: 20px;">${items}</ul>`;
  };

  const html = `
    <html>
      <head>
        <title>AFAS Agricultural Report - ${context.crop}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #059669; }
          .meta { font-size: 14px; color: #666; margin-top: 5px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-left: 4px solid #059669; padding-left: 10px; }
          .grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
          .card { background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; text-align: center; }
          .card-label { font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: bold; }
          .card-value { font-size: 24px; font-weight: bold; color: #111827; }
          .schedule-item { display: flex; gap: 15px; margin-bottom: 10px; }
          .step-num { font-weight: bold; color: #059669; }
          .findings { background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; margin-top: 10px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">AFAS Farmer Advisory Report</div>
          <div class="meta">Generated on: ${new Date().toLocaleDateString()} | Region: ${context.region}</div>
        </div>

        <div class="section">
          <div class="section-title">Field Context</div>
          <p><strong>Crop:</strong> ${context.crop} | <strong>Area:</strong> ${context.area} Acres | <strong>Soil:</strong> ${context.soilType} | <strong>Season:</strong> ${context.season}</p>
        </div>

        ${weather ? `
        <div class="section">
          <div class="section-title">Weather & Risk Assessment</div>
          <p><strong>Conditions:</strong> ${weather.condition} (${weather.temp}°C, ${weather.humidity}% Humidity)</p>
          <p><strong>Disease Risk Level:</strong> ${weather.riskLevel}</p>
          <p>${weather.riskMessage}</p>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Fertilizer Recommendation</div>
          <div class="grid">
            <div class="card"><div class="card-label">Urea</div><div class="card-value">${advice.urea} kg</div></div>
            <div class="card"><div class="card-label">DAP</div><div class="card-value">${advice.dap} kg</div></div>
            <div class="card"><div class="card-label">MOP</div><div class="card-value">${advice.mop} kg</div></div>
          </div>
          <div style="margin-top: 15px;">
            <strong>Expert Explanation:</strong>
            <div style="margin-top: 8px;">${formatToList(advice.explanation)}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Application Schedule</div>
          ${advice.schedule.map((step, i) => `
            <div class="schedule-item">
              <span class="step-num">Step ${i+1}:</span>
              <span>${step}</span>
            </div>
          `).join('')}
        </div>

        ${advice.diseaseFindings ? `
        <div class="section">
          <div class="section-title">Image Analysis Findings</div>
          <div class="findings">${formatToList(advice.diseaseFindings)}</div>
        </div>
        ` : ''}

        <div class="section" style="margin-top: 50px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
          Disclaimer: This report is for advisory purposes based on ICAR guidelines. Consult with local agricultural officers for critical decisions.
        </div>

        <button class="no-print" onclick="window.print()" style="position: fixed; top: 20px; right: 20px; background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Print to PDF</button>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
