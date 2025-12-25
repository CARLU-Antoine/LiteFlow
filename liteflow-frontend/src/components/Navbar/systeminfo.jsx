import { useEffect, useState } from 'react';
import { fetchSystemInfo } from '../../services/systemInfoService';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import './systeminfo.css';

function SystemInfo() {
  // Charger depuis localStorage au premier rendu
  const [systemInfo, setSystemInfo] = useState(() => {
    const saved = localStorage.getItem('systemInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!systemInfo);

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

  if (isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>
        <p>Chargement des informations système...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
        <Typography variant="h6">⚠️ Erreur</Typography>
        <Typography>{error}</Typography>
        <Typography variant="body2">Vérifiez que le backend est lancé sur http://localhost:3001</Typography>
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
      </Box>
    </div>
  );
}

export default SystemInfo;
