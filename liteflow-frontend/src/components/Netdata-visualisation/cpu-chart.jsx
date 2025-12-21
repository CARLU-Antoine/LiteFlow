import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function CPUChart() {
  const [options, setOptions] = useState({
    chart: {
      type: 'line',
      animation: true,
    },
    title: { 
      text: 'Usage CPU' 
    },
    xAxis: { 
      type: 'datetime',
      title: { text: 'Time' }
    },
    yAxis: { 
      title: { text: 'CPU %' },
      min: 0,
      max: 100
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueSuffix: '%',
      valueDecimals: 0
    },
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [
      { 
        name: 'User CPU', 
        data: [],
        color: '#2196F3'
      },
      { 
        name: 'System CPU', 
        data: [],
        color: '#FF5722'
      },
    ],
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!window.api || !window.api.fetchCPU) {
      setIsLoading(false);
      
      const simulateData = () => {
        const now = Date.now();
        const timestamps = Array.from({ length: 10 }, (_, i) => now - (9 - i) * 1000);
        const userSeries = timestamps.map(time => [time, Math.round(Math.random() * 50 + 20)]);
        const systemSeries = timestamps.map(time => [time, Math.round(Math.random() * 30 + 10)]);
        
        setOptions(prev => ({
          ...prev,
          series: [
            { name: 'User CPU', data: userSeries, color: '#2196F3' },
            { name: 'System CPU', data: systemSeries, color: '#FF5722' },
          ],
        }));
      };
      
      simulateData();
      const interval = setInterval(simulateData, 2000);
      return () => clearInterval(interval);
    }

    const fetchAndUpdate = async () => {
      try {
        const json = await window.api.fetchCPU();
        
        if (!json || !json.data || !Array.isArray(json.data)) {
          throw new Error("Format de données invalide");
        }


        const userSeries = [];
        const systemSeries = [];
        
        json.data.forEach((dataPoint) => {
          if (Array.isArray(dataPoint) && dataPoint.length >= 3) {
            const timestamp = dataPoint[0] * 1000;
            const userCPU = dataPoint[1]; // User CPU
            const systemCPU = dataPoint[2]; // System CPU
            
            if (timestamp && userCPU !== null && systemCPU !== null) {
              userSeries.push([timestamp, Math.round(userCPU)]);
              systemSeries.push([timestamp, Math.round(systemCPU)]);
            }
          }
        });

        setOptions(prev => ({
          ...prev,
          series: [
            { 
              name: 'User CPU', 
              data: userSeries,
              color: '#2196F3'
            },
            { 
              name: 'System CPU', 
              data: systemSeries,
              color: '#FF5722'
            },
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
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#ffebee', 
        borderRadius: '4px',
        color: '#c62828'
      }}>
        <h3>⚠️ Erreur</h3>
        <p>{error}</p>
        <small>Vérifiez que Netdata est lancé sur http://127.0.0.1:19999</small>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666'
      }}>
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