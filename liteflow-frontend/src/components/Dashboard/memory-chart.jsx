import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchMemory } from '../../services/Dashboard/memoryService';

function MemoryUsageChart() {
  const [options, setOptions] = useState({
    chart: {
      type: 'column',
      height: 400
    },
    title: {
      text: 'Utilisation de la mémoire (RAM)'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: ['RAM']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Go'
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    tooltip: {
      shared: false,
      formatter: function () {
        const label =
          this.series.name === 'Used'
            ? 'Mémoire utilisée'
            : 'Mémoire libre';

        return `
          <b>${label}</b><br/>
          ${this.y.toFixed(2)} Go
        `;
      }
    },
    series: [
      {
        name: 'Used',
        data: [0],
        color: '#e74c3c'
      },
      {
        name: 'Free',
        data: [0],
        color: '#2ecc71'
      }
    ],
    credits: { enabled: false }
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const memory = await fetchMemory();

        setOptions(prev => ({
          ...prev,
          subtitle: {
            text: `Mémoire utilisée à ${memory.usedPercent}%`
          },
          series: [
            { ...prev.series[0], data: [parseFloat(memory.usedGB)] },
            { ...prev.series[1], data: [parseFloat(memory.freeGB)] }
          ]
        }));

        setIsLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message || 'Erreur lors de la récupération de la mémoire');
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
        Chargement des données mémoire…
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

export default MemoryUsageChart;
