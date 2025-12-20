import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomAutocomplete from './CustomAutocomplete.jsx';
import * as XLSX from 'xlsx';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid.jsx';
import './nettoyage-disque.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'Disque', headerName: 'Disque', width: 70 },
  { field: 'Nom', headerName: 'Nom du fichier', width: 250 },
  { field: 'TailleLibérée', headerName: 'Taille Libérée (Mo)', width: 180 },
];

const rowsDetails = [
  { id: 1, Disque: 'C:', Nom: 'fichier1.tmp', TailleLibérée: 1200 },
  { id: 2, Disque: 'D:', Nom: 'fichier2.log', TailleLibérée: 800 },
  { id: 3, Disque: 'E:', Nom: 'fichier3.cache', TailleLibérée: 600 },
  { id: 4, Disque: 'C:', Nom: 'fichier4.trash', TailleLibérée: 400 },
  { id: 5, Disque: 'D:', Nom: 'fichier5.log', TailleLibérée: 1500 },
  { id: 6, Disque: 'E:', Nom: 'fichier6.list', TailleLibérée: 0 },
];


function NettoyageDisque() {
  const [value, setValue] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [selectedIdsFichiersSupprimes, setSelectedIdsFichiersSupprimes] = React.useState([]);
  const [selectedRowsFichiersSupprimes, setSelectedRowsFichiersSupprimes] = React.useState([]);

const handleClickDownload = () => {
      if (selectedIdsFichiersSupprimes.length === 0) {
        alert("Aucune ligne sélectionnée pour les détails !");
        return;
      }
    // Créer une feuille de calcul à partir des données sélectionnées
    const ws = XLSX.utils.json_to_sheet(selectedRowsFichiersSupprimes);

    // Créer un classeur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fichiers Supprimés');

    // Télécharger le fichier
    XLSX.writeFile(wb, `fichier-supprimés.xlsx`);
  };


  const handleSelectionChangeFichiersSupprimes = (ids, rows) => {
    console.log("Fichiers Supprimés - IDs sélectionnés :", ids);
    console.log("Fichiers Supprimés - Lignes sélectionnées :", rows);
    setSelectedIdsFichiersSupprimes(ids);
    setSelectedRowsFichiersSupprimes(rows);
  };

  const handlePointClick = (point) => {
    const disque = point.category;
    const type = point.series.name;
    const taille = point.y;
    
    // Vérifier que toutes les données sont valides
    if (!disque || !type || taille === undefined || taille === null) {
      console.error('Données invalides:', { disque, type, taille });
      return;
    }
    
    // Créer un objet représentant la sélection
    const newSelection = {
      id: `${disque}-${type}-${Date.now()}`,
      disque: disque,
      type: type,
      taille: taille
    };
    
    // Vérifier si déjà sélectionné
    const alreadySelected = selectedFiles.some(
      item => item.disque === disque && item.type === type
    );
    
    if (!alreadySelected) {
      setSelectedFiles([...selectedFiles, newSelection]);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = {
    chart: {
      type: 'column',
      height: 400
    },
    title: {
      text: 'Analyse des fichiers inutiles par disque'
    },
    xAxis: {
      categories: ['Disque C:', 'Disque D:', 'Disque E:'],
      labels: {
        rotation: -45
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Espace utilisé (Go)'
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        cursor: 'pointer'
      },
      series: {
        point: {
          events: {
            click: function () {
              handlePointClick(this);
            }
          }
        }
      }
    },
    tooltip: {
      pointFormat: '<b>{series.name}</b> : {point.y} Go'
    },
    series: [
      {
        name: 'Fichiers temporaires',
        data: [12, 6, 3],
        color: '#f39c12'
      },
      {
        name: 'Cache applications',
        data: [8, 4, 2],
        color: '#e67e22'
      },
      {
        name: 'Corbeille',
        data: [5, 2, 1],
        color: '#c0392b'
      },
      {
        name: 'Fichiers système inutiles',
        data: [15, 7, 4],
        color: '#8e44ad'
      },
      {
        name: 'Fichiers utilisateur',
        data: [20, 30, 10],
        color: '#2980b9'
      }
    ]
  };

  return (
    <div className='nettoyage-disque-container'>
      <div className='header-nettoyage-disque'>
        <div className="container-autocomplete-nettoyage-disque">
            <CustomAutocomplete
              value={selectedFiles}
              onChange={setSelectedFiles}
            />
            <svg id="btn-delete-partitions" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 192C576 156.7 547.3 128 512 128L205.3 128C188.3 128 172 134.7 160 146.7L9.4 297.4C3.4 303.4 0 311.5 0 320C0 328.5 3.4 336.6 9.4 342.6L160 493.3C172 505.3 188.3 512 205.3 512L512 512C547.3 512 576 483.3 576 448L576 192zM284.1 252.1C293.5 242.7 308.7 242.7 318 252.1L351.9 286L385.8 252.1C395.2 242.7 410.4 242.7 419.7 252.1C429 261.5 429.1 276.7 419.7 286L385.8 319.9L419.7 353.8C429.1 363.2 429.1 378.4 419.7 387.7C410.3 397 395.1 397.1 385.8 387.7L351.9 353.8L318 387.7C308.6 397.1 293.4 397.1 284.1 387.7C274.8 378.3 274.7 363.1 284.1 353.8L318 319.9L284.1 286C274.7 276.6 274.7 261.4 284.1 252.1z"/></svg>
        </div>
        <div className="container-btn-download">
          <svg className="btn-dowload-xlsx" onClick={() => handleClickDownload()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
            </svg>
        </div>
      </div>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Analyse" />
        <Tab label="Détails" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {value === 0 && (
          <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        )}
        {value === 1 && (
          <div>
            <CustomDataGrid
              rows={rowsDetails}
              columns={columns}
              onSelectionChange={handleSelectionChangeFichiersSupprimes}
              pageSize={10}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              paperProps={{ sx: { height: '65vh', width: '100%', position: 'relative', marginTop: '20px' } }}
            />
          </div>
        )}
      </Box>
    </div>
  );
}

export default NettoyageDisque;