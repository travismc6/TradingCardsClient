import { useEffect, useRef, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
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
import {
  CellClickedEvent,
  ColDef,
  ValueFormatterParams,
} from "ag-grid-community";
import { FaFileExcel } from "react-icons/fa";
import toastNotify from "../Common/toastHelper";
import { useNavigate } from "react-router-dom";

import qs from "qs";

export interface CollectionDetailsProps {
  details: CollectionSetDetails;
}

interface ImportResults {
  imported: number;
  failed: number;
}

export default function CardCollectionDetails() {
  const { user, userLoaded } = useAuth();

  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionDetails | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setShowModal(true);
    }
  };

  const handleModalConfirm = async () => {
    setShowModal(false);

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setSaving(true);

        const result = await axios.post<ImportResults>(
          ENDPOINTS.IMPORT_CHECKLIST,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user?.authToken}`,
            },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }
        );
        toastNotify(`Successfully Imported ${result.data.imported} Cards`);

        if (result.data.failed > 0) {
          toastNotify(`Failed to Import ${result.data.failed} Cards`, "error");
        }
      } catch (error) {
        toastNotify("Error importing collection.", "error");
      }
      setSaving(false);
      loadDetails();
    } else {
      toastNotify("Error importing collection.", "error");
    }
  };

  const handleModalCancel = () => {
    // Logic to cancel file upload
    setSelectedFile(null);
    setShowModal(false);
  };

  function HandleNavigateToChecklist(
    event: CellClickedEvent<CollectionSetDetails, any>
  ) {
    const url =
      "/?year=" + event.data?.setYear + "&brand=" + event.data?.brandId;

    navigate(url);
  }

  const percentFormatter = (params: ValueFormatterParams) => {
    const percentage = (params.value as number) * 100;

    if (percentage > 0 && percentage < 1) {
      return "1%";
    }

    if (percentage > 99 && percentage < 100) {
      return "99%";
    }

    return `${percentage.toFixed(0)}%`;
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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
      valueFormatter: percentFormatter,
      valueGetter: (params: any) => {
        return params.data.uniqueCollectionCount / params.data.setCount;
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

          <div style={{ display: "flex", alignItems: "center" }}>
            <Button variant="success" onClick={handleExportCollection}>
              <FaFileExcel /> Export
            </Button>

            <div style={{ marginLeft: "20px" }}>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImportFileChange}
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the input field
              />
              <Button onClick={handleImportClick} variant="primary">
                <FaFileExcel /> Import
              </Button>
              {/* {selectedFile && (
              <Button onClick={() => {}} variant="success">
                Upload File
              </Button>
            )} */}
            </div>
          </div>

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

        <Modal show={showModal} onHide={handleModalCancel}>
          <Modal.Header closeButton>
            <Modal.Title>WARNING</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This will replace your entire collection. Do you wish to continue?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModalConfirm}>
              Import Collection
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else if (error === null) {
    return <Loading />;
  } else {
    return <ErrorHandler message={error} onRetry={loadDetails} />;
  }
}
