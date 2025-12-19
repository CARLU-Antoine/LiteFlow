import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './commandes-optimisation.css';


function CommandesOptimisation() {
  const location = useLocation();
  const typeFromState = location.state?.type || 'Powershell';
  const [value, setValue] = React.useState(typeFromState === 'Powershell' ? 0 : 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="commandes">
      <h1>Commandes d'optimisation</h1>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Powershell" />
        <Tab label="Bash" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && <div>Détails des commandes Powershell</div>}
        {value === 1 && <div>Détails des commandes Bash</div>}
      </Box>
    </div>
  );
}


export default CommandesOptimisation;
