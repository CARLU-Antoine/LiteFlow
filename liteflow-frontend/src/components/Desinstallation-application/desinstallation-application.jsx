import * as React from 'react';
import CustomDataGrid from '../CustomDataGrid/custom-datagrid';
import './desinstallation-application.css';

  const columnsApplications = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'Nom', headerName: "Nom de l'application", width: 300 },
    { field: 'Description', headerName: "Description de l'application", width: 400 },
  ];
  const rowsApplications = [
    { id: 1, Nom: 'App1', Description: 'Description de l\'application 1' },
    { id: 2, Nom: 'App2', Description: 'Description de l\'application 2' },
    { id: 3, Nom: 'App3', Description: 'Description de l\'application 3' },
    { id: 4, Nom: 'App4', Description: 'Description de l\'application 4' },
    { id: 5, Nom: 'App5', Description: 'Description de l\'application 5' },
  ];
  

function DesinstallationApplication() {
  const [selectedIdsApplications, setSelectedIdsApplications] = React.useState([]);
  const [selectedRowsApplications, setSelectedRowsApplications] = React.useState([]);


  const handleSelectionChangeApplications = (ids, rows) => {
    console.log("Applications Désinstallées - IDs sélectionnés :", ids);
    console.log("Applications Désinstallées - Lignes sélectionnées :", rows);
  };


  return (
    <div>
      <h1>Désinstallation d'application</h1>
        <CustomDataGrid
          rows={rowsApplications}
          columns={columnsApplications}
          onSelectionChange={handleSelectionChangeApplications}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          paperProps={{ sx: { height: '65vh', width: '100%', position: 'relative', marginTop: '20px' } }}
        />
    </div>
  );
}

export default DesinstallationApplication;