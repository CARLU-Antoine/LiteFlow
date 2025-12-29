import React, { useState, useEffect, useRef } from 'react';
import './optimiser-pc.css';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid.jsx';
import * as XLSX from 'xlsx';
import { fetchOptimiserPc } from '../../services/commandesService.js';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'commande', headerName: 'Commandes', width: 300 },
  { field: 'success', headerName: 'Statut', width: 100, 
    renderCell: (params) => (
      <span style={{ color: params.value ? 'green' : 'red' }}>
        {params.value ? '✓ Réussi' : '✗ Échec'}
      </span>
    )
  },
  { field: 'output', headerName: 'Résultat', width: 400 },
];

function OptimiserPc() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [etatButtonOptimiser, setEtatButtonOptimiser] = useState('Optimiser le pc');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [passwordSudo, setPasswordSudo] = useState(() => {
    const savedPassword = localStorage.getItem('passwordSudo') || '';
    return savedPassword;
  });

  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5173/ws');
    wsRef.current = ws;

    ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.percentage !== undefined) {
      setProgress(message.percentage);
      setProgressText(`${message.current}/${message.total} - ${message.commandeName}`);
    }

    if (message.success !== undefined) {
      setRows((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          commande: message.commandeName,
          success: message.success,
          output: message.success
            ? message.output?.substring(0, 100) || 'Succès'
            : message.error || 'Échec',
        },
      ]);
    }

    if (message.current === message.total) {
      setProgress(100);
      setProgressText('Optimisation terminée !');
      setLoading(false);
    }
  };



    ws.onerror = (err) => console.error('WebSocket error', err);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!passwordSudo.trim()) {
      setLoading(true);
      setEtatButtonOptimiser('Saisir mot de passe sudo');
    }
  }, [passwordSudo]);

  const handleSelectionChange = (ids, rows) => {
    setSelectedIds(ids);
    setSelectedRows(rows);
  };

  const handleClickDownload = () => {
    if (selectedIds.length === 0) {
      alert("Aucune ligne sélectionnée !");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(selectedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Optimisation");
    XLSX.writeFile(wb, "optimisation_pc.xlsx");
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClickRecherche = async () => {
    try {
      setLoading(true);
      setVisible(true);
      setError(null);
      setProgress(0);
      setProgressText('Initialisation...');

      await fetchOptimiserPc(passwordSudo);

    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de l\'optimisation');
      setProgressText('Erreur');
      setLoading(false);
    }
  };

  const handleClose = (path, type) => {
    setAnchorEl(null);
    if (path) {
      navigate(path, { state: { type } });
    }
  };

  return (
    <div className="container-optimiser-pc">
      <div className="header-optimiser-pc">
        <Badge color="primary" badgeContent={rows.length} showZero>
          <Box
            onClick={handleClick}
            sx={{ cursor: 'pointer' }}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" fill="currentColor">
              <path d="M73.4 182.6C60.9 170.1 60.9 149.8 73.4 137.3C85.9 124.8 106.2 124.8 118.7 137.3L278.7 297.3C291.2 309.8 291.2 330.1 278.7 342.6L118.7 502.6C106.2 515.1 85.9 515.1 73.4 502.6C60.9 490.1 60.9 469.8 73.4 457.3L210.7 320L73.4 182.6zM288 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L288 512C270.3 512 256 497.7 256 480C256 462.3 270.3 448 288 448z"/>
            </svg>
          </Box>
        </Badge>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          sx={{ '& .MuiPaper-root': { borderRadius: '5px' } }}
        >
          <MenuItem onClick={() => handleClose('/commandes-optimisation','Powershell')} sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <Box sx={{ cursor: 'pointer' }}>Powershell</Box>
            <Badge color="primary" badgeContent={10} showZero />
          </MenuItem>
          <MenuItem onClick={() => handleClose('/commandes-optimisation','Bash')} sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <Box sx={{ cursor: 'pointer' }}>Bash</Box>
            <Badge color="primary" badgeContent={10} showZero />
          </MenuItem>
        </Menu>
      </div>

      <div className="container-icon-optimiser-pc">
        <svg id="svg-eclair" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M434.8 54.1C446.7 62.7 451.1 78.3 445.7 91.9L367.3 288L512 288C525.5 288 537.5 296.4 542.1 309.1C546.7 321.8 542.8 336 532.5 344.6L244.5 584.6C233.2 594 217.1 594.5 205.2 585.9C193.3 577.3 188.9 561.7 194.3 548.1L272.7 352L128 352C114.5 352 102.5 343.6 97.9 330.9C93.3 318.2 97.2 304 107.5 295.4L395.5 55.4C406.8 46 422.9 45.5 434.8 54.1z"/>
        </svg>
      </div>

      {error && <Box sx={{ mb: 2, mt: 2 }}><Alert severity="error">{error}</Alert></Box>}

      <div className={`container-traitement-optimiser-pc ${visible ? '' : 'hidden'}`}>
        <Typography variant="body1" sx={{ mb: 1 }}>{progressText}</Typography>

        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" sx={{ mt: 0.5 }}>{progress}%</Typography>
        </Box>

        {rows.length > 0 && (
          <>
            <div className="header-optimiser-pc">
              <svg 
                id="btn-dowload-xlsx" 
                onClick={handleClickDownload} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 640 640"
                style={{ cursor: 'pointer' }}
              >
                <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
              </svg>
            </div>

            <CustomDataGrid
              rows={rows}
              columns={columns}
              onSelectionChange={handleSelectionChange}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              paperProps={{ 
                sx: { height: '45vh', width: '100%', position: 'relative', marginTop: '20px' } 
              }}
            />
          </>
        )}
      </div>

      { !passwordSudo.trim() && (
        <Box sx={{ mb: 2, mt: 2 }}>
          <Alert severity="error">
            Aucun mot de passe sudo enregistré, veuillez cliquer sur le bouton Information en haut à gauche de votre écran
          </Alert>
        </Box>
      )}

      <Button 
        variant="contained" 
        id="btn-optimiser-pc"
        onClick={handleClickRecherche}
        disabled={loading}
      >
        {etatButtonOptimiser}
      </Button>
    </div>
  );
}

export default OptimiserPc;
