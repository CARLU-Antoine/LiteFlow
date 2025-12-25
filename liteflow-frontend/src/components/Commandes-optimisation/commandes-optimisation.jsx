import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import './commandes-optimisation.css';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid.jsx';
import * as XLSX from 'xlsx';
import { fetchCommandes, ajouterCommande, supprimerCommande } from '../../services/commandesService.js';

const baseColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'commande', headerName: 'Commande', width: 150 },
  { field: 'description', headerName: 'Description', width: 300 }
];

function CommandesOptimisation() {
  const location = useLocation();
  const typeFromState = location.state?.type || 'Powershell';
  const [value, setValue] = React.useState(typeFromState === 'Powershell' ? 0 : 1);

  const [commandeText, setCommandeText] = React.useState('');
  const [descriptionText, setDescriptionText] = React.useState('');

  const [rowsPowershell, setRowsPowershell] = React.useState([]);
  const [rowsBash, setRowsBash] = React.useState([]);

  const [selectedIdsPowershell, setSelectedIdsPowershell] = React.useState([]);
  const [selectedRowsPowershell, setSelectedRowsPowershell] = React.useState([]);
  const [selectedIdsBash, setSelectedIdsBash] = React.useState([]);
  const [selectedRowsBash, setSelectedRowsBash] = React.useState([]);
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Charger les commandes au montage
  React.useEffect(() => {
    async function loadCommandes() {
      try {
        const bashData = await fetchCommandes('bash');
        const powershellData = await fetchCommandes('powershell');

        setRowsBash(
          bashData.map((cmd, index) => ({
            id: cmd.id,
            commande: cmd.commande,
            description: cmd.description
          }))
        );

        setRowsPowershell(
          powershellData.map((cmd, index) => ({
            id: cmd.id,
            commande: cmd.commande,
            description: cmd.description
          }))
        );
      } catch (error) {
        console.error('Erreur chargement commandes', error);
      }
    }

    loadCommandes();
  }, []);

  // Export Excel
  const handleClickDownload = (type) => {
    let selectedRows = type === 'Powershell' ? selectedRowsPowershell : selectedRowsBash;
    if (!selectedRows.length) {
      alert(`Aucune ligne sélectionnée pour ${type} !`);
      return;
    }

    const ws = XLSX.utils.json_to_sheet(selectedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${type} Commandes`);
    XLSX.writeFile(wb, `commandes_${type.toLowerCase()}.xlsx`);
  };

  // Gestion des sélections
  const handleSelectionChangePowershell = (ids, rows) => {
    setSelectedIdsPowershell(ids);
    setSelectedRowsPowershell(rows);
  };

  const handleSelectionChangeBash = (ids, rows) => {
    setSelectedIdsBash(ids);
    setSelectedRowsBash(rows);
  };

  const handleChange = (event, newValue) => setValue(newValue);

  const handleChangeModal = (event, newValue) => {
    setValue(newValue);
    setCommandeText('');
    setDescriptionText('');
  };

  // Ajouter une commande
  const handleSubmit = async () => {
    const type = value === 0 ? 'powershell' : 'bash';
    try {
      let id = (type === 'bash' ? rowsBash.length : rowsPowershell.length) + 1;
      await ajouterCommande(type, id, commandeText, descriptionText);

      // Mettre à jour les lignes
      const commandes = await fetchCommandes(type);
      if (type === 'powershell') {
        setRowsPowershell(
          commandes.map((cmd, index) => ({
            id: index + 1,
            commande: cmd.commande,
            description: cmd.description
          }))
        );
      } else {
        setRowsBash(
          commandes.map((cmd, index) => ({
            id: index + 1,
            commande: cmd.commande,
            description: cmd.description
          }))
        );
      }

      handleClose();
      setCommandeText('');
      setDescriptionText('');
    } catch (error) {
      console.error('Erreur ajout commande:', error);
    }
  };

  // Supprimer une ligne
  const handleDeleteRow = async (row) => {
    try {
      const type = value === 0 ? 'powershell' : 'bash';

      supprimerCommande(type,row.id);

      // Supprimer côté client
      if (type === 'powershell') {
        setRowsPowershell((prev) => prev.filter((r) => r.id !== row.id));
      } else {
        setRowsBash((prev) => prev.filter((r) => r.id !== row.id));
      }
    } catch (error) {
      console.error('Erreur suppression commande:', error);
    }
  };

  // Colonnes avec bouton Supprimer
  const columnsWithDelete = [
    ...baseColumns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteRow(params.row)}
        >
          Supprimer
        </Button>
      ),
    },
  ];

  const handleBack = () => window.history.back();

  return (
    <div>
      <svg id="btn-back" onClick={handleBack} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/>
      </svg>

      <div className='container-download-btn'>
        <div className="item-dowload-btn">
          Powershell
          <svg className="btn-dowload-xlsx" onClick={() => handleClickDownload("Powershell")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
          </svg>
        </div>
        <div className="item-dowload-btn">
          Bash
          <svg className="btn-dowload-xlsx" onClick={() => handleClickDownload("Bash")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
          </svg>
        </div>
      </div>

      <Button variant="outlined" onClick={handleOpen}>Ajouter une commande</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Tabs value={value} onChange={handleChangeModal}>
            <Tab label="Commande Powershell" />
            <Tab label="Commande Bash" />
          </Tabs>

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Commande"
              value={commandeText}
              onChange={(e) => setCommandeText(e.target.value)}
            />
            <TextField
              label="Description"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />

            <Button variant="contained" onClick={handleSubmit}>
              Ajouter
            </Button>
          </Box>
        </Box>
      </Modal>

      <Tabs value={value} onChange={handleChange}>
        <Tab label="Powershell" />
        <Tab label="Bash" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && (
          <CustomDataGrid
            rows={rowsPowershell}
            columns={columnsWithDelete}
            onSelectionChange={handleSelectionChangePowershell}
            pageSize={10}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paperProps={{ sx: { height: '65vh', width: '100%', marginTop: '20px' } }}
          />
        )}
        {value === 1 && (
          <CustomDataGrid
            rows={rowsBash}
            columns={columnsWithDelete}
            onSelectionChange={handleSelectionChangeBash}
            pageSize={10}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paperProps={{ sx: { height: '65vh', width: '100%', marginTop: '20px' } }}
          />
        )}
      </Box>
    </div>
  );
}

export default CommandesOptimisation;
