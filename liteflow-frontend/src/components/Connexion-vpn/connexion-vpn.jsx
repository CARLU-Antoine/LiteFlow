import './connexion-vpn.css';
import React, { useState } from 'react';
import { Select, Tabs, Tab, Box, InputLabel, MenuItem, FormControl, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ConnexionVPN() {
  const [tabIndex, setTabIndex] = useState(0);
  const [regionOrdinateur, setRegionOrdinateur] = useState('');
  const [regionMobile, setRegionMobile] = useState('');

  const navigate = useNavigate(); 

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleRegionOrdinateurChange = (event) => {
    setRegionOrdinateur(event.target.value);
  };

  const handleRegionMobileChange = (event) => {
    setRegionMobile(event.target.value);
  };

    const handleSubmitHotspot = (valeurRegionMobile) => {
    if (valeurRegionMobile && valeurRegionMobile !== "") {
        navigate('/resultat-hotpost-vpn', { state: { regionMobile: valeurRegionMobile } });
    } else {
        console.log('Aucune région sélectionnée pour les mobiles');
    }
    };

  return (
    <div className="container-connexion-vpn">
      <Box sx={{ width: '100%' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs VPN">
          <Tab label="Ordinateur" />
          <Tab label="Mobile" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <div>
          <div className="container-icon">
            <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M380.8 96C372.7 110.1 368 126.5 368 144L368 160L96 160L96 384L368 384L368 448L96 448C60.7 448 32 419.3 32 384L32 160C32 124.7 60.7 96 96 96L380.8 96zM368 496C368 513.5 372.7 529.9 380.8 544L152 544C138.7 544 128 533.3 128 520C128 506.7 138.7 496 152 496L368 496zM464 96L560 96C586.5 96 608 117.5 608 144L608 496C608 522.5 586.5 544 560 544L464 544C437.5 544 416 522.5 416 496L416 144C416 117.5 437.5 96 464 96zM488 160C474.7 160 464 170.7 464 184C464 197.3 474.7 208 488 208L536 208C549.3 208 560 197.3 560 184C560 170.7 549.3 160 536 160L488 160zM488 256C474.7 256 464 266.7 464 280C464 293.3 474.7 304 488 304L536 304C549.3 304 560 293.3 560 280C560 266.7 549.3 256 536 256L488 256zM544 400C544 382.3 529.7 368 512 368C494.3 368 480 382.3 480 400C480 417.7 494.3 432 512 432C529.7 432 544 417.7 544 400z"/>
            </svg>
          </div>

          <div className="container-select-region">
            <Box >
              <FormControl fullWidth>
                <InputLabel id="region-ordinateur-label">Region Ordinateur</InputLabel>
                <Select
                  labelId="region-ordinateur-label"
                  value={regionOrdinateur}
                  onChange={handleRegionOrdinateurChange}
                  className="select-region"
                >
                  <MenuItem value="Etats-Unis">Etats-Unis</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Asie">Asie</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress />
            </Box>

            <Button variant="contained" sx={{ mt: 2 }}>
              Configurer VPN
            </Button>
          </div>
        </div>
      )}

      {tabIndex === 1 && (
        <div>
          <div className="container-icon">
            <svg className="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M208 64C172.7 64 144 92.7 144 128L144 512C144 547.3 172.7 576 208 576L432 576C467.3 576 496 547.3 496 512L496 128C496 92.7 467.3 64 432 64L208 64zM280 480L360 480C373.3 480 384 490.7 384 504C384 517.3 373.3 528 360 528L280 528C266.7 528 256 517.3 256 504C256 490.7 266.7 480 280 480z"/>
            </svg>
          </div>

          <div className="container-select-region">
            <Box>
              <FormControl fullWidth>
                <InputLabel id="region-mobile-label">Region Mobile</InputLabel>
                <Select
                  labelId="region-mobile-label"
                  value={regionMobile}
                  onChange={handleRegionMobileChange}
                  className="select-region"
                >
                  <MenuItem value="Etats-Unis">Etats-Unis</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Asie">Asie</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress />
            </Box>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => handleSubmitHotspot(regionMobile)}
            >
              Configurer hotspot VPN
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnexionVPN;
