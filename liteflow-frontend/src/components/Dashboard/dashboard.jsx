import React, { useState } from "react";
import SystemInfo from "./systeminfo-chart";
import CPUChart from "./cpu-chart";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NetworkAreaChart from "./network";
import DiskUsageChart from "./disk-chart";
import MemoryUsageChart from "./memory-chart";

function Dashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <h1>Dashboard</h1>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Réseau" />
        <Tab label="Processeur" />
        <Tab label="Disque" />
        <Tab label="Mémoire" />
        <Tab label="Système" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && (
          <div>
            <NetworkAreaChart />
          </div>
        )}
          {value === 1 && (
          <div>
            <CPUChart/>
          </div>
        )}
        {value === 2 && (
          <div>
            <DiskUsageChart/>
          </div>
        )}
        {value === 3 && (
          <div>
            <MemoryUsageChart/>
          </div>
        )}
        {value === 4 && (
          <div>
            <SystemInfo />
          </div>
        )}
      </Box>
    </>
  );
}

export default Dashboard;
