import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function DiskUsageChart({ data }) {
  const [options, setOptions] = useState({
    chart: {
      type: 'column',
      height: 400
    },
    title: {
      text: 'Utilisation du disque par partition'
    },
    xAxis: {
      categories: [],
      title: { text: 'Points de montage' },
      labels: { rotation: -45 }
    },
    yAxis: {
      min: 0,
      title: { text: 'Espace disque (Go)' }
    },
    tooltip: {
      formatter: function () {
        return `
          <b>${this.category}</b><br/>
          <b>${this.series.name}</b><br/>
          ${this.y.toFixed(2)} Go
        `;
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0
      }
    },
    legend: { enabled: true },
    credits: { enabled: false },
    series: [
      { name: 'Utilisé', data: [], color: '#e74c3c' },
      { name: 'Disponible', data: [], color: '#2ecc71' }
    ]
  });

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const categories = data.map(d => d.mount);
    const usedData = data.map(d => Number(d.usedGB) || 0);
    const availableData = data.map(d => Number(d.availableGB) || 0);

    setOptions(prev => ({
      ...prev,
      xAxis: {
        ...prev.xAxis,
        categories
      },
      series: [
        { ...prev.series[0], data: usedData },
        { ...prev.series[1], data: availableData }
      ]
    }));
  }, [data]);

  if (!data) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        Chargement des données disque…
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: '100%' } }}
      />
    </div>
  );
}

export default DiskUsageChart;
