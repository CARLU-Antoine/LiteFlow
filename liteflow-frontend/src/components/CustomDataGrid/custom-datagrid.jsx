import React from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';

// Traduction française pour le DataGrid
const frenchLocaleText = {
  // Toolbar
  toolbarDensity: 'Densité',
  toolbarDensityLabel: 'Densité',
  toolbarDensityCompact: 'Compacte',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Confortable',
  toolbarColumns: 'Colonnes',
  toolbarFilters: 'Filtres',
  toolbarExport: 'Exporter',
  
  // Filters
  filterPanelAddFilter: 'Ajouter un filtre',
  filterPanelDeleteIconLabel: 'Supprimer',
  filterPanelOperators: 'Opérateurs',
  filterPanelOperatorAnd: 'Et',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colonnes',
  filterPanelInputLabel: 'Valeur',
  filterPanelInputPlaceholder: 'Filtrer la valeur',
  
  // Column menu
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Afficher les colonnes',
  columnMenuFilter: 'Filtrer',
  columnMenuHideColumn: 'Masquer',
  columnMenuUnsort: 'Annuler le tri',
  columnMenuSortAsc: 'Trier par ordre croissant',
  columnMenuSortDesc: 'Trier par ordre décroissant',
  
  // Pagination
  MuiTablePagination: {
    labelRowsPerPage: 'Lignes par page :',
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} sur ${count !== -1 ? count : `plus de ${to}`}`,
  },
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} lignes sélectionnées`
      : `${count.toLocaleString()} ligne sélectionnée`,
  
  // No rows
  noRowsLabel: 'Aucune ligne',
  noResultsOverlayLabel: 'Aucun résultat trouvé.',
  
  // Error
  errorOverlayDefaultLabel: 'Une erreur est survenue.',
};

/**
 * Convertit le modèle de sélection MUI v8.x en tableau d'IDs
 * @param {Object|Array} selectionModel - Le modèle de sélection retourné par DataGrid
 * @param {Array} rows - Les lignes du tableau
 * @returns {Array} - Tableau d'IDs sélectionnés
 */
export const convertSelectionToIds = (selectionModel, rows = []) => {
  if (Array.isArray(selectionModel)) {
    return selectionModel;
  }
  
  if (selectionModel && typeof selectionModel === 'object') {
    if (selectionModel.type === 'exclude') {
      const excludedIds = Array.from(selectionModel.ids || new Set());
      return rows.filter(row => !excludedIds.includes(row.id)).map(row => row.id);
    } else if (selectionModel.type === 'include') {
      return Array.from(selectionModel.ids || new Set());
    }
  }
  
  return [];
};

/**
 * Composant DataGrid personnalisé avec gestion simplifiée de la sélection
 * @param {Array} rows - Les données à afficher
 * @param {Array} columns - Les colonnes du tableau
 * @param {Function} onSelectionChange - Callback appelé avec le tableau d'IDs sélectionnés
 * @param {Object} dataGridProps - Props supplémentaires pour le DataGrid MUI
 * @param {Object} paperProps - Props pour le Paper container
 */
const CustomDataGrid = ({
  rows = [],
  columns = [],
  onSelectionChange,
  checkboxSelection = true,
  height = '45vh',
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  dataGridProps = {},
  paperProps = {},
}) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState({ 
    type: 'exclude', 
    ids: new Set() 
  });

  const handleSelectionChange = (newSelection) => {
    setRowSelectionModel(newSelection);
    
    // Convertir et appeler le callback si fourni
    if (onSelectionChange) {
      const selectedIds = convertSelectionToIds(newSelection, rows);
      const selectedRows = rows.filter(row => selectedIds.includes(row.id));
      onSelectionChange(selectedIds, selectedRows);
    }
  };

  return (
    <Paper 
      sx={{ height, width: '100%', position: 'relative', ...paperProps.sx }} 
      {...paperProps}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        onRowSelectionModelChange={handleSelectionChange}
        pageSizeOptions={pageSizeOptions}
        initialState={{
          pagination: {
            paginationModel: { pageSize }
          }
        }}
        localeText={frenchLocaleText}
        sx={{ border: 0 }}
        {...dataGridProps}
      />
    </Paper>
  );
};

export default CustomDataGrid;