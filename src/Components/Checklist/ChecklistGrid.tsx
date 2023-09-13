import { ColDef, CellValueChangedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { ChecklistCard } from "../../Models/ChecklistCard";

const columnDefs: ColDef[] = [
  {
    headerName: "",
    field: "inCollection",
    width: 70,
    cellDataType: "boolean",
    editable: true,
  },
  {
    headerName: "#",
    field: "number",
    width: 100,
    sortable: true,
  },
  { headerName: "Year", field: "year", width: 100, sortable: true },
  { headerName: "Set", field: "setName", sortable: true },
  { headerName: "Player Name", field: "name", sortable: true },
  { headerName: "Notes", field: "notes", sortable: true },
];

interface Props {
  cards: ChecklistCard[];
  cardAdded: (id: number) => void;
  cardRemoved: (id: number) => void;
}

export default function ChecklistGrid({
  cards,
  cardAdded,
  cardRemoved,
}: Props) {
  const onCellValueChanged = (params: CellValueChangedEvent) => {
    const card = params.data as ChecklistCard;

    if (params.column.getColId() === "inCollection") {
      if (card.inCollection) {
        cardAdded(card.id);
      } else {
        cardRemoved(card.id);
      }
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "100vh", padding: 20 }}>
      <AgGridReact
        rowData={cards}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
}
