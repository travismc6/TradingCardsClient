import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { ChecklistCard } from "../../Models/ChecklistCard";
import { ENDPOINTS } from "../../Utils/apiConfig";
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Row,
} from "react-bootstrap";
import { CardParams } from "../../Models/CardParams";
import ChecklistGrid from "./ChecklistGrid";
import { FaFileExcel, FaFilter } from "react-icons/fa";
import { CollectionChanges } from "../../Models/CollectionChanges";
import toastNotify from "../Common/toastHelper";
import { BrandsEnum } from "../../Models/BrandsEnum";
import qs from "qs";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../Common/ConfirmationModal";
import InfoModal from "../Common/InfoModal";

function ChecklistContainer() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [cards, setCards] = useState<Array<ChecklistCard>>([]);

  const [cardParams, setCardParams] = useState<CardParams>({
    inCollection: false,
  });

  const [cardsAdded, setCardsAdded] = useState<number[]>([]);
  const [cardsRemoved, setCardsRemoved] = useState<number[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const years = generateYears(1951, 1970);

  function generateYears(start: number, end: number) {
    let years = [];
    while (start <= end) {
      years.push(start++);
    }
    return years;
  }

  const yearChanged = (yearString: string | null) => {
    let year: number | null = null;

    if (yearString !== null) {
      year = parseFloat(yearString);
      if (year === cardParams.year) {
        year = null;
      }
    }

    setCardParams((prevState) => ({
      ...prevState,
      year: year,
    }));
  };

  const cardClicked = (id: number) => {
    if (cardsAdded.length === 0 && cardsRemoved.length === 0) {
      navigate(`/card/${id}`);
    } else {
      setShowModal(true);
    }
  };

  const handleBrandChange = (event: ChangeEvent<HTMLInputElement>) => {
    const brandId = parseInt(event.target.id);
    const isChecked = event.target.checked;

    if (isChecked) {
      setCardParams((prevState) => ({
        ...prevState,
        brands: prevState.brands ? [...prevState.brands, brandId] : [brandId],
      }));
    } else if (cardParams.brands !== null && cardParams.brands !== undefined) {
      setCardParams((prevState) => ({
        ...prevState,
        brands: prevState.brands!.filter((b) => b !== brandId),
      }));
    }
  };

  const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCardParams((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleOnlyCollectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setCardParams((prevState) => ({
      ...prevState,
      inCollection: isChecked,
    }));
  };

  const cardAdded = (id: number) => {
    const isRemoved = cardsRemoved.find((n) => n === id);

    const removed = cardsRemoved.filter(
      (number) => !number.toString().includes(id.toString())
    );
    setCardsRemoved(removed);

    if (!isRemoved) {
      setCardsAdded((prevIds) => {
        return [...prevIds, id];
      });
    }
  };

  const cardRemoved = (id: number) => {
    const isAdded = cardsAdded.find((n) => n === id);

    const added = cardsAdded.filter((number) => number !== id);
    setCardsAdded(added);

    if (!isAdded) {
      setCardsRemoved((prevIds) => {
        return [...prevIds, id];
      });
    }
  };
  useEffect(() => {
    if (!loading) loadCards();
  }, [user, loading]);

  function loadCards(): void {
    axios
      .get(ENDPOINTS.GET_CHECKLIST, {
        params: cardParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      })
      .then((response) => {
        setCards(response.data);
      })
      .catch((err) => {
        toastNotify("Error loading cards.", "error");
      });
  }

  function handleSave(): void {
    const changes: CollectionChanges = {
      added: cardsAdded,
      removed: cardsRemoved,
    };

    axios
      .post(ENDPOINTS.SAVE_CHECKLIST, changes, {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      })
      .then((response) => {
        // set is no loading
        setCardsAdded([]);
        setCardsRemoved([]);

        toastNotify("Collection Updated!");
      })
      .catch((err) => {
        toastNotify("Error saving collection", "error");
        // set banner
      });
  }

  function handleExportCollection(): void {
    axios
      .get(ENDPOINTS.EXPORT_CHECKLIST, {
        params: cardParams,
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
      .catch((err) => {
        toastNotify("Error exporting cards.", "error");
      });
  }

  function filterClick(): void {
    if (cardsAdded.length === 0 && cardsRemoved.length === 0) {
      loadCards();
    } else {
      setShowModal(true);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={2} style={{ backgroundColor: "#f8f9fa" }}>
          <div style={{ padding: "20px" }}>
            <Form.Group style={{ maxWidth: "300px" }}>
              <Form.Control
                type="text"
                placeholder="Player..."
                onChange={handlePlayerNameChange}
              />
            </Form.Group>

            <h5 style={{ marginTop: "20px" }}>Brands</h5>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Topps"
                id={BrandsEnum.Topps.toString()}
                onChange={handleBrandChange}
              />
              <Form.Check
                type="checkbox"
                label="Bowman"
                id={BrandsEnum.Bowman.toString()}
                onChange={handleBrandChange}
              />
              <Form.Check
                type="checkbox"
                label="UpperDeck"
                id={BrandsEnum.UpperDeck.toString()}
                onChange={handleBrandChange}
              />
            </Form.Group>

            <DropdownButton
              id="dropdown-basic-button"
              title={
                cardParams.year !== null && cardParams.year !== undefined
                  ? cardParams.year
                  : "Select Year"
              }
              variant="secondary"
              onSelect={yearChanged}
              style={{ marginTop: "20px", width: "100px" }}
            >
              {years.map((year) => (
                <Dropdown.Item eventKey={year} key={year}>
                  {year}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <div style={{ marginTop: "20px" }}>
              <Button
                variant="primary"
                style={{ marginRight: "10px" }}
                onClick={filterClick}
              >
                <FaFilter /> Filter
              </Button>
            </div>

            {user !== null && (
              <div>
                <Form style={{ marginTop: "20px" }}>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                    label="Only cards in collection"
                    onChange={handleOnlyCollectionChange}
                  />
                </Form>
                <Button
                  variant="success"
                  style={{ marginTop: "100px" }}
                  onClick={handleExportCollection}
                >
                  <FaFileExcel /> Export to Excel
                </Button>

                <div style={{ marginTop: "20px" }}>
                  <Button
                    onClick={handleSave}
                    variant="success"
                    disabled={
                      cardsAdded.length === 0 && cardsRemoved.length === 0
                    }
                    style={{ marginRight: "10px" }}
                  >
                    Save Collection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Col>

        <Col xs={8}>
          <ChecklistGrid
            cards={cards}
            cardAdded={cardAdded}
            cardRemoved={cardRemoved}
            cardClicked={cardClicked}
          />
        </Col>
      </Row>
      <InfoModal
        show={showModal}
        title="Unsaved Collection"
        onConfirm={() => setShowModal(false)}
        message="There are unsaved changes to the collection. Please save collection first."
      />
    </Container>
  );
}

export default ChecklistContainer;
