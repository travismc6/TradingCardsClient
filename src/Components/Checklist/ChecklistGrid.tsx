import {
  ColDef,
  CellValueChangedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { ChecklistCard } from "../../Models/ChecklistCard";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface LinkProps extends ICellRendererParams {
  value: string;
  data: ChecklistCard;
}

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
  const navigate = useNavigate();

  const LinkComponent = (props: LinkProps) => {
    return (
      <Button
        variant="link"
        onClick={() => {
          navigate("/cardDetails");
        }}
      >
        {props.value}
      </Button>
    );
  };

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
    {
      headerName: "Player Name",
      field: "name",
      sortable: true,
      cellRenderer: LinkComponent,
    },
    { headerName: "Notes", field: "notes", sortable: true },
  ];

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
