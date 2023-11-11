import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { ENDPOINTS } from "../../Utils/apiConfig";
import useAuth from "../Hooks/useAuth";
import Loading from "../Common/Loading";
import Saving from "../Common/Saving";
import ErrorHandler from "../Common/ErrorHandler";
import {
  CollectionDetails,
  CollectionSetDetails,
} from "../../Models/CollectionDetails";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent, ColDef } from "ag-grid-community";
import { FaFileExcel } from "react-icons/fa";
import toastNotify from "../Common/toastHelper";
import { useNavigate } from "react-router-dom";

import qs from "qs";

export interface CollectionDetailsProps {
  details: CollectionSetDetails;
}

export default function CardCollectionDetails() {
  const { user, userLoaded } = useAuth();

  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionDetails | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data using axios

    if (userLoaded) {
      loadDetails();
    }
  }, [userLoaded, user?.authToken]);

  const LinkComponent = () => {
    //const collection = props.data as CollectionSetDetails;

    return (
      <Button variant="link" onClick={() => {}} style={{ padding: 0 }}>
        <span>Checklist</span>
      </Button>
    );
  };

  const loadDetails = () => {
    setError(null);
    setLoading(true);
    axios
      .get<CollectionDetails>(ENDPOINTS.COLLECTION_DETAILS, {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      })
      .then((response) => {
        setCollection(response.data);
      })
      .catch(() => {
        setError("Unable to load collection. Please retry.");
      })
      .finally(() => setLoading(false));
  };

  function handleExportCollection(): void {
    setSaving(true);
    axios
      .get(ENDPOINTS.EXPORT_CHECKLIST, {
        responseType: "blob",
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      })
      .then((response) => {
        // Create a Blob from the received data
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Create an object URL for the blob
        const blobURL = window.URL.createObjectURL(blob);

        // Create a new anchor element in the DOM
        const tempLink = document.createElement("a");
        tempLink.href = blobURL;
        tempLink.setAttribute("download", "file.xlsx");
        tempLink.style.display = "none";
        document.body.appendChild(tempLink);

        // Programmatically click the anchor to trigger download
        tempLink.click();

        // Clean up: remove the anchor from the DOM and revoke the blob URL
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
        toastNotify("Collection exported");
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(() => {
        toastNotify("Error exporting cards.", "error");
      })
      .finally(() => setSaving(false));
  }

  function HandleNavigateToChecklist(
    event: CellClickedEvent<CollectionSetDetails, any>
  ) {
    const url =
      "/?year=" + event.data?.setYear + "&brand=" + event.data?.brandId;

    navigate(url);
  }

  const columnDefs: ColDef[] = [
    {
      headerName: "Year",
      field: "setYear",
      width: 100,
      sortable: true,
    },
    { headerName: "Set", field: "setName", sortable: true },
    {
      headerName: "Owned",
      field: "uniqueCollectionCount",
      sortable: true,
    },
    {
      headerName: "Total",
      field: "setCount",
      sortable: true,
    },
    {
      headerName: "Completion",
      field: "setCount",
      sortable: true,
      valueGetter: (params: any) => {
        const percentage = Math.round(
          (params.data.uniqueCollectionCount / params.data.setCount) * 100
        );

        return `${percentage.toFixed(0)}%`;
      },
    },
    {
      headerName: "Duplicates",
      sortable: true,
      valueGetter: (params: any) => {
        return `${
          params.data.collectionCount - params.data.uniqueCollectionCount
        }`;
      },
    },
    {
      headerName: "",
      sortable: false,
      cellRenderer: LinkComponent,
      onCellClicked: HandleNavigateToChecklist,
    },
  ];

  if (!loading && error === null && collection !== null) {
    return (
      <>
        {saving && <Saving />}
        <Container style={{ padding: 10 }}>
          <h3>Total Cards: {collection.totalCards}</h3>

          <Button variant="success" onClick={handleExportCollection}>
            <FaFileExcel /> Export
          </Button>

          <div
            className="ag-theme-alpine"
            style={{ height: "100vh", padding: 20 }}
          >
            <AgGridReact
              rowData={collection.collectionSets}
              columnDefs={columnDefs}
            />
          </div>
        </Container>
      </>
    );
  } else if (error === null) {
    return <Loading />;
  } else {
    return <ErrorHandler message={error} onRetry={loadDetails} />;
  }
}
