import { useEffect, useState } from 'react';
import { fetchSystemInfo } from '../../services/systemInfoService';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import './systeminfo.css';

function SystemInfo() {
  // Charger depuis localStorage au premier rendu
  const [systemInfo, setSystemInfo] = useState(() => {
    const saved = localStorage.getItem('systemInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [passwordSudo, setPasswordSudo] = useState(() => {
    return localStorage.getItem('passwordSudo') || '';
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!systemInfo);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const data = await fetchSystemInfo();

        localStorage.setItem('systemInfo', JSON.stringify(data));

        setSystemInfo(data);
        setIsLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message || "Erreur lors de la récupération des données du système");
        setIsLoading(false);
      }
    };
    
    if (!systemInfo) {
      fetchAndUpdate();
    }
  }, [systemInfo]);

  const handleEdit = () => {
    setIsDisabled(!isDisabled);
    localStorage.setItem('passwordSudo',passwordSudo);
  };


  const handleDeletePasswordSudo = () => {
    setIsDisabled(isDisabled);
    setPasswordSudo('');

    localStorage.setItem('passwordSudo','');

  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>
        <p>Chargement des informations système...</p>
      </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{ mb: 2, mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  return (
    <div className='container-system-info'>
      <Box sx={{ p: 2 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Informations CPU</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography><strong>Marque :</strong> {systemInfo.cpu.brand}</Typography>
            <Typography><strong>Fabricant :</strong> {systemInfo.cpu.manufacturer}</Typography>
            <Typography><strong>Cœurs :</strong> {systemInfo.cpu.cores} (physiques : {systemInfo.cpu.physicalCores})</Typography>
            <Typography><strong>Fréquence :</strong> {systemInfo.cpu.speed} GHz</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Système d'exploitation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography><strong>Plateforme :</strong> {systemInfo.os.platform}</Typography>
            <Typography><strong>Distro :</strong> {systemInfo.os.distro}</Typography>
            <Typography><strong>Version :</strong> {systemInfo.os.release}</Typography>
            <Typography><strong>Architecture :</strong> {systemInfo.os.arch}</Typography>
            <Typography><strong>Nom d'hôte :</strong> {systemInfo.os.hostname}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Mémoire</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography><strong>Total :</strong> {systemInfo.memory.totalGB} GB</Typography>
          </AccordionDetails>
        </Accordion>
  
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Mot de passe sudo</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className='container-edit-password-sudo'>
            <TextField id="standard-basic" label="Mot de passe sudo" variant="standard" disabled={isDisabled} value={passwordSudo} onChange={(e) => setPasswordSudo(e.target.value)}/>
            <svg id ="btn-edit-password-sudo" onClick={handleEdit} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/></svg>
            <svg onClick={() => handleDeletePasswordSudo()} id='btn-delete-password-sudo' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
            </div>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
}

export default SystemInfo;
