import React from 'react';
import './optimiser-pc.css';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid.jsx';
import * as XLSX from 'xlsx';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'Commande', headerName: 'Commandes', width: 200 },
  { field: 'Description', headerName: 'Description de la commande', width: 150 },
  { field: 'Résultat', headerName: 'Utilisation Mémoire (MB)', width: 180 },
];

const rows = [
  { id: 1, Commande: 'ProcessusA.exe', Description: 25, Résultat: 150 },
  { id: 2, Commande: 'ProcessusB.exe', Description: 15, Résultat: 100 },
  { id: 3, Commande: 'ProcessusC.exe', Description: 45, Résultat: 300 },
  { id: 4, Commande: 'ProcessusD.exe', Description: 5, Résultat: 50 },
  { id: 5, Commande: 'ProcessusE.exe', Description: 30, Résultat: 200 },
];

function OptimiserPc() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionChange = (ids, rows) => {
    setSelectedIds(ids);
    setSelectedRows(rows);
  };

  const handleClickDownload = () => {
  if (selectedIds.length === 0) {
    alert("Aucune ligne sélectionnée !");
    return;
  }

  // Créer une feuille de calcul à partir des données sélectionnées
  const ws = XLSX.utils.json_to_sheet(selectedRows);
  
  // Créer un classeur
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Processus");
  
  // Télécharger le fichier
  XLSX.writeFile(wb, "processus_selectionnés.xlsx");
};

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
        <Badge color="primary" badgeContent={10} showZero>
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

      <div className="container-traitement-optimiser-pc">
        <p>Optimisation en cours...</p>

        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>

        <div className="header-optimiser-pc">
          <svg id="btn-dowload-xlsx" onClick={handleClickDownload} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
          </svg>
        </div>

        <CustomDataGrid
          rows={rows}
          columns={columns}
          onSelectionChange={handleSelectionChange}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          paperProps={{ sx: { height: '45vh', width: '100%' ,position: 'relative', marginTop: '20px' } }}
        />
        <Button variant="contained" id="btn-optimiser-pc">
          Optimiser
        </Button>
      </div>
    </div>
  );
}

export default OptimiserPc;

