import {
  ColDef,
  CellValueChangedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { ChecklistCard } from "../../Models/ChecklistCard";
import { Button, Form } from "react-bootstrap";
import useAuth from "../Hooks/useAuth";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";

interface LinkProps extends ICellRendererParams {
  value: string;
  data: ChecklistCard;
}

interface Props {
  cards: ChecklistCard[];
  cardAdded: (cardId: number) => void;
  cardRemoved: (collectionCardId: number) => void;
  cardClicked: (id: number) => void;
  duplicateAdded: (card: ChecklistCard) => void;
  collectionCardDeleted: (card: ChecklistCard) => void;
}

export default function ChecklistGrid({
  cards,
  cardAdded,
  cardRemoved,
  cardClicked,
  duplicateAdded,
  collectionCardDeleted,
}: Props) {
  const { user } = useAuth();
  const [cardsAdded, setCardsAdded] = useState<number[]>([]);

  const PlayerNameComponent = (props: LinkProps) => {
    const card = props.data as ChecklistCard;

    return card.inCollection ? (
      <Button
        variant="link"
        onClick={() => {
          cardClicked(card.collectionCardId!);
        }}
        style={{ padding: 0 }}
      >
        <span>{props.value}</span>
      </Button>
    ) : (
      card.name
    );
  };

  const ActionsComponent = (props: LinkProps) => {
    const card = props.data as ChecklistCard;

    if (card.inCollection) {
      return (
        <>
          <Button
            variant="link"
            onClick={() => handleDeleteClick(card)}
            style={{ margin: "0" }}
            title="Delete"
          >
            <FaTrash color="gray" />
          </Button>

          <Button
            variant="link"
            title="Add a duplicate"
            onClick={() => handleAddDuplicateClick(card)}
            style={{ margin: "0" }}
          >
            <FaPlus color="gray" />
          </Button>
        </>
      );
    } else {
      return <></>;
    }
  };

  const CheckComponent = (props: LinkProps) => {
    const card = props.data as ChecklistCard;

    if (card.inCollection) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <input
            type="checkbox"
            checked={card.inCollection}
            disabled={true}
            style={{ margin: "0 5px" }}
          />
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <input
            type="checkbox"
            style={{ margin: "0 5px" }}
            checked={cardsAdded.includes(card.id)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked;

              if (isChecked) {
                setCardsAdded((prevIds) => {
                  return [...prevIds, card.id];
                });
                cardAdded(card.id);
              } else {
                const added = cardsAdded.filter((number) => number !== card.id);
                setCardsAdded(added);
                cardRemoved(card.id);
              }
            }}
          />
        </div>
      );
    }
  };

  const handleAddDuplicateClick = (card: ChecklistCard) => {
    duplicateAdded(card);
  };

  const handleDeleteClick = (card: ChecklistCard) => {
    collectionCardDeleted(card);
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "inCollection",
      width: 50,
      hide: user === null,
      cellRenderer: CheckComponent,
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
      cellRenderer: PlayerNameComponent,
    },
    // { headerName: "Notes", field: "notes", sortable: true },
    {
      headerName: "",
      sortable: false,
      cellRenderer: ActionsComponent,
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: "100vh", padding: 20 }}>
      <AgGridReact
        rowData={cards}
        columnDefs={columnDefs}
        //onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
}
