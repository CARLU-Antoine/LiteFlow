import { useEffect, useState } from "react";
import CPUChart from "./cpu-chart";
import NetworkAreaChart from "./network-chart";
import DiskUsageChart from "./disk-chart";
import MemoryUsageChart from "./memory-chart";
import { fetchDashboard } from "../../services/dashboardService";
import './dashboard.css';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    disk: [],
    cpu: {},
    network: [],
    memory: {}
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const data = await fetchDashboard();
        if (!mounted) return;
        setDashboardData(data);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Erreur lors de la récupération du dashboard");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20, backgroundColor: '#ffebee', color: '#c62828' }}>
        <h3>⚠️ Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        Chargement du dashboard…
      </div>
    );
  }

  return (
    <div className="container-components-dashboard">
      <div className="item-component">
        <DiskUsageChart data={dashboardData.disk} />
      </div>

      <div className="item-component">
        <CPUChart data={dashboardData.cpu} />
      </div>

      <div className="item-component">
        <NetworkAreaChart data={dashboardData.network} />
      </div>

      <div className="item-component">
        <MemoryUsageChart data={dashboardData.memory} />
      </div>
    </div>
  );
}

export default Dashboard;
