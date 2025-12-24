import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchNetwork } from '../../services/Dashboard/networkService';

function NetworkAreaChart() {
  const [options, setOptions] = useState({
    chart: { type: 'area', animation: true, zoomType: 'x' },
    title: { text: 'Network Throughput (MB/s)' },
    subtitle: { text: 'données reçues,données envoyées' },
    xAxis: { type: 'datetime', title: { text: 'Time' } },
    yAxis: { title: { text: 'MB/s' }, min: 0 },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueDecimals: 2,
      formatter: function () {
        // Explication RX/TX dans le tooltip
        const rx = this.points[0].y.toFixed(2);
        const tx = this.points[1].y.toFixed(2);
        return `<b>${Highcharts.dateFormat('%H:%M:%S', this.x)}</b><br/>
                Reçu : ${rx} MB/s<br/>
                Envoyé : ${tx} MB/s`;
      },
    },
    legend: { enabled: true },
    credits: { enabled: false },
    plotOptions: {
      area: {
        stacking: 'normal',
        marker: { enabled: false },
      },
    },
    series: [
      { name: '(Reçu)', data: [], color: '#2196F3', fillOpacity: 0.5 },
      { name: '(Envoyé)', data: [], color: '#FF5722', fillOpacity: 0.5 },
    ],
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const networkStats = await fetchNetwork();
        const now = new Date().getTime();

        setOptions(prev => ({
          ...prev,
          series: [
            {
              ...prev.series[0],
              data: [...prev.series[0].data, [now, parseFloat(networkStats[0].rxMB)]].slice(-20),
            },
            {
              ...prev.series[1],
              data: [...prev.series[1].data, [now, parseFloat(networkStats[0].txMB)]].slice(-20),
            },
          ],
        }));

        setIsLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des données réseau");
        setIsLoading(false);
      }
    };

    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 4000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '4px', color: '#c62828' }}>
        <h3>⚠️ Erreur</h3>
        <p>{error}</p>
        <small>Vérifiez que le backend est lancé sur http://localhost:3001</small>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>Chargement des données réseau...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
        containerProps={{ style: { height: '100%' } }} 
      />
    </div>
  );
}

export default NetworkAreaChart;
