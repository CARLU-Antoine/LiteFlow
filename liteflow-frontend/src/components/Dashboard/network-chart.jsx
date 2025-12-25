import { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function NetworkAreaChart({ data: networkData }) {
  const chartRef = useRef(null);
  const [seriesData, setSeriesData] = useState({
    rx: [],
    tx: []
  });

  useEffect(() => {
    if (!networkData || networkData.length === 0) return;

    const now = new Date().getTime();
    const newRx = parseFloat(networkData[0].rxMB || 0);
    const newTx = parseFloat(networkData[0].txMB || 0);

    setSeriesData(prev => ({
      rx: [...prev.rx, [now, newRx]].slice(-50), // garder les 50 derniers points
      tx: [...prev.tx, [now, newTx]].slice(-50)
    }));
  }, [networkData]);

  const options = {
    chart: { type: "area", height: 400, zoomType: "x" },
    title: { text: "Consommation du réseau (MB/s)" },
    xAxis: { type: "datetime" },
    yAxis: { title: { text: "MB/s" }, min: 0 },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueDecimals: 2,
      formatter: function () {
        const rx = this.points[0]?.y?.toFixed(2) || 0;
        const tx = this.points[1]?.y?.toFixed(2) || 0;
        return `<b>${Highcharts.dateFormat("%H:%M:%S", this.x)}</b><br/>
                Reçu : ${rx} MB/s<br/>
                Envoyé : ${tx} MB/s`;
      }
    },
    legend: { enabled: true },
    credits: { enabled: false },
    plotOptions: { area: { stacking: "normal", marker: { enabled: false } } },
    series: [
      { name: "Reçu", data: seriesData.rx, color: "#2196F3", fillOpacity: 0.5 },
      { name: "Envoyé", data: seriesData.tx, color: "#FF5722", fillOpacity: 0.5 }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />;
}

export default NetworkAreaChart;
