import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchCPUData } from '../../services/Dashboard/cpuService';

function CPUChart() {
  const [options, setOptions] = useState({
    chart: { type: 'line', animation: true },
    title: { text: 'CPU Usage' },
    xAxis: { type: 'datetime', title: { text: 'Time' } },
    yAxis: { title: { text: 'CPU %' }, min: 0, max: 100 },
    tooltip: { shared: true, crosshairs: true, valueSuffix: '%', valueDecimals: 0 },
    legend: { enabled: true },
    credits: { enabled: false },
    series: [
      { name: 'User CPU', data: [], color: '#2196F3' },
      { name: 'System CPU', data: [], color: '#FF5722' },
    ],
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const { userSeries, systemSeries } = await fetchCPUData();

        setOptions(prev => ({
          ...prev,
          series: [
            { name: 'User CPU', data: userSeries, color: '#2196F3' },
            { name: 'System CPU', data: systemSeries, color: '#FF5722' },
          ],
        }));

        setIsLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des données CPU");
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
        <p>Chargement des données CPU...</p>
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

export default CPUChart;
