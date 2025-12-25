import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function CPUChart({ data }) {
  const [seriesData, setSeriesData] = useState({
    user: [],
    system: []
  });

  useEffect(() => {
    if (!data?.data) return;

    const newUserPoints = data.data.map(d => [d[0] * 1000, d[1]]);
    const newSystemPoints = data.data.map(d => [d[0] * 1000, d[2]]);

    setSeriesData(prev => ({
      user: [...prev.user, ...newUserPoints].slice(-50),
      system: [...prev.system, ...newSystemPoints].slice(-50)
    }));
  }, [data]);

  const options = {
    chart: { type: "line", height: 400 },
    title: { text: "Utilisation du CPU" },
    xAxis: { type: "datetime", title: { text: "Time" } },
    yAxis: { title: { text: "CPU %" }, min: 0, max: 100 },
    tooltip: { shared: true, valueSuffix: "%" },
    legend: { enabled: true },
    credits: { enabled: false },
    series: [
      { name: "Consommation utilisateur", data: seriesData.user, color: "#2196F3" },
      { name: "Consommation système", data: seriesData.system, color: "#FF5722" }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default CPUChart;
