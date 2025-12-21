import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchDisk } from '../../services/Dashboard/diskService';

function DiskUsageChart() {
  const [options, setOptions] = useState({
    chart: {
      type: 'column',
      height: 500
    },
    title: {
      text: 'Disk Usage par partition'
    },
    subtitle: {
      text: 'Used = espace utilisé • Available = espace disponible'
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
    shared: false,
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
      { name: 'Used', data: [], color: '#e74c3c' },
      { name: 'Available', data: [], color: '#2ecc71' }
    ]
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const diskData = await fetchDisk();

        const categories = diskData.map(d => d.mount);
        const usedData = diskData.map(d => parseFloat(d.usedGB) || 0);
        const availableData = diskData.map(d => parseFloat(d.availableGB) || 0);

        setOptions(prev => ({
          ...prev,
          xAxis: { ...prev.xAxis, categories },
          series: [
            { ...prev.series[0], data: usedData },
            { ...prev.series[1], data: availableData }
          ]
        }));

        setIsLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message || 'Erreur lors de la récupération des données disque');
        setIsLoading(false);
      }
    };

    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20, backgroundColor: '#ffebee', color: '#c62828' }}>
        <h3>⚠️ Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
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
