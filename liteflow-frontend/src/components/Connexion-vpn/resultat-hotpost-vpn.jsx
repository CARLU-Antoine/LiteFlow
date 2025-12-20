import React, { useState } from 'react';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid';
import './resultat-hotpost-vpn.css';
import { useLocation } from 'react-router-dom';

const columnsTelephone = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'Nom', headerName: 'Nom du téléphone', width: 300 },
  { field: 'etat', headerName: 'Etat de la connexion', width: 400 },
];

const rowsTelephone = [
  { id: 1, Nom: 'Téléphone A', etat: 'Connecté' },
  { id: 2, Nom: 'Téléphone B', etat: 'Déconnecté' },
  { id: 3, Nom: 'Téléphone C', etat: 'Connecté' },
  { id: 4, Nom: 'Téléphone D', etat: 'Déconnecté' },
  { id: 5, Nom: 'Téléphone E', etat: 'Connecté' },
];

function ResultatHotspotVPN() {
  const location = useLocation();
  const RegionFromState = location.state?.regionMobile || '';

  const [selection, setSelection] = useState([]);

  const handleBack = () => {
    window.history.back();
  };

  const handleSelectionChangeTelephone = (selectedRows) => {
    setSelection(selectedRows);
    console.log('Lignes sélectionnées :', selectedRows);
  };

  return (
    <>
      <svg
        id="btn-back"
        onClick={handleBack}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        style={{ cursor: 'pointer', width: '40px', height: '40px', marginBottom: '20px' }}
      >
        <path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/>
      </svg>

      <h1>Résultat de la connexion hotspot VPN pour {RegionFromState || 'Aucune région'}</h1>

      <CustomDataGrid
        rows={rowsTelephone}
        columns={columnsTelephone}
        onSelectionChange={handleSelectionChangeTelephone}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        paperProps={{ sx: { height: '80vh', width: '100%', position: 'relative', marginTop: '20px' } }}
      />
    </>
  );
}

export default ResultatHotspotVPN;
