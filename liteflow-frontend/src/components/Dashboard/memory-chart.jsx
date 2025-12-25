import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function MemoryUsageChart({ data }) {
  if (!data) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        Chargement des données mémoire…
      </div>
    );
  }

  const usedGB = parseFloat(data.used / (1024 ** 3)) || 0;
  const freeGB = parseFloat(data.free / (1024 ** 3)) || 0;
  const usedPercent = data.usedPercent || 0;

  const options = {
    chart: { type: 'column', height: 400 },
    title: { text: 'Utilisation de la mémoire (RAM)' },
    subtitle: { text: `Mémoire utilisée à ${usedPercent}%` },
    xAxis: { categories: ['RAM'] },
    yAxis: { min: 0, title: { text: 'Go' } },
    plotOptions: { column: { stacking: 'normal' } },
    tooltip: {
      shared: false,
      formatter: function () {
        const label = this.series.name === 'Used' ? 'Mémoire utilisée' : 'Mémoire libre';
        return `<b>${label}</b><br/>${this.y.toFixed(2)} Go`;
      },
    },
    series: [
      { name: 'Utilisé', data: [usedGB], color: '#e74c3c' },
      { name: 'Disponible', data: [freeGB], color: '#2ecc71' },
    ],
    credits: { enabled: false },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default MemoryUsageChart;
