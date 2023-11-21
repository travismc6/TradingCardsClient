import React, { useState } from "react";
//import useAuth from "../Hooks/useAuth";
import { AgGridReact } from "ag-grid-react";
import { ChecklistCard } from "../../Models/ChecklistCard";

const CardsAdmin: React.FC = () => {
  //   const { user } = useAuth();
  //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //const [saving, setSaving] = useState<boolean>(false);

  const [cards] = useState<Array<ChecklistCard>>([]);

  return (
    <div className="ag-theme-alpine" style={{ height: "100vh", padding: 20 }}>
      <AgGridReact
        rowData={cards}
        //columnDefs={columnDefs}
        //onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};

export default CardsAdmin;
