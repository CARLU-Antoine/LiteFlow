import React from 'react';
import './optimiser-pc.css';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nom', headerName: 'Nom du processus', width: 200 },
  { field: 'utilisationCpu', headerName: 'Utilisation CPU (%)', width: 150 },
  { field: 'utilisationMemoire', headerName: 'Utilisation Mémoire (MB)', width: 180 },
];

const rows = [
  { id: 1, nom: 'ProcessusA.exe', utilisationCpu: 25, utilisationMemoire: 150 },
  { id: 2, nom: 'ProcessusB.exe', utilisationCpu: 15, utilisationMemoire: 100 },
  { id: 3, nom: 'ProcessusC.exe', utilisationCpu: 45, utilisationMemoire: 300 },
  { id: 4, nom: 'ProcessusD.exe', utilisationCpu: 5, utilisationMemoire: 50 },
  { id: 5, nom: 'ProcessusE.exe', utilisationCpu: 30, utilisationMemoire: 200 },
];

function OptimiserPc() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path,type) => {
    setAnchorEl(null);
    if (path) {
      navigate(path, { state: { type } });
    }
  };

  return (
    <div className="container-optimiser-pc">

      <div className="header-optimiser-pc">
        <Badge
          color="primary"
          badgeContent={10}
          showZero
        >
          <Box
            onClick={handleClick}
            sx={{ cursor: 'pointer' }}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M73.4 182.6C60.9 170.1 60.9 149.8 73.4 137.3C85.9 124.8 106.2 124.8 118.7 137.3L278.7 297.3C291.2 309.8 291.2 330.1 278.7 342.6L118.7 502.6C106.2 515.1 85.9 515.1 73.4 502.6C60.9 490.1 60.9 469.8 73.4 457.3L210.7 320L73.4 182.6zM288 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L288 512C270.3 512 256 497.7 256 480C256 462.3 270.3 448 288 448z"/>
            </svg>
          </Box>
        </Badge>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '5px',
            },
          }}
        >
          <MenuItem
            onClick={() => handleClose('/commandes-optimisation','Powershell')}
            sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}
          >
            <Box sx={{ cursor: 'pointer' }}>Powershell</Box>
            <Badge color="primary" badgeContent={10} showZero />
          </MenuItem>

          <MenuItem
            onClick={() => handleClose('/commandes-optimisation','Bash')}
            sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}
          >
            <Box sx={{ cursor: 'pointer' }}>Bash</Box>
            <Badge color="primary" badgeContent={10} showZero />
          </MenuItem>
        </Menu>
      </div>

      <div className="container-icon-optimiser-pc">
        <svg
          id="svg-eclair"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M434.8 54.1C446.7 62.7 451.1 78.3 445.7 91.9L367.3 288L512 288C525.5 288 537.5 296.4 542.1 309.1C546.7 321.8 542.8 336 532.5 344.6L244.5 584.6C233.2 594 217.1 594.5 205.2 585.9C193.3 577.3 188.9 561.7 194.3 548.1L272.7 352L128 352C114.5 352 102.5 343.6 97.9 330.9C93.3 318.2 97.2 304 107.5 295.4L395.5 55.4C406.8 46 422.9 45.5 434.8 54.1z"/>
        </svg>
      </div>

      <div className="container-traitement-optimiser-pc">
        <p>Optimisation en cours...</p>

        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>

        <Paper sx={{ height: '45vh', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>

        <Button variant="contained" id="btn-optimiser-pc">
          Optimiser
        </Button>
      </div>
    </div>
  );
}

export default OptimiserPc;
