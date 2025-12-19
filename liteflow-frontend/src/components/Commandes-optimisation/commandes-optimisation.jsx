import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './commandes-optimisation.css';

function Commandes() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="commandes">
      <h1>Commandes d'optimisation</h1>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Commande powershell" />
        <Tab label="Commande bash" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && <div>Détails de la commande powershell</div>}
        {value === 1 && <div>Détails de la commande bash</div>}
      </Box>
    </div>
  );
}

export default Commandes;
