import React, { ChangeEvent, useEffect, useState } from "react";
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

function ChecklistContainer() {
  const { user } = useAuth();

  const [cards, setCards] = useState<Array<ChecklistCard>>([]);
  const [error, setError] = useState(null);

  const [cardParams, setCardParams] = useState<CardParams>({});

  const [cardsAdded, setCardsAdded] = useState<number[]>([]);
  const [cardsRemoved, setCardsRemoved] = useState<number[]>([]);

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

  const cardAdded = (id: number) => {
    setCardsAdded((prevIds) => {
      return [...prevIds, id];
    });
  };

  const cardRemoved = (id: number) => {
    setCardsRemoved((prevIds) => {
      return [...prevIds, id];
    });
  };
  useEffect(() => {
    loadCards();
  }, []);

  function loadCards(): void {
    axios
      .get(ENDPOINTS.GET_CARDS, {
        params: cardParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      })
      .then((response) => {
        setCards(response.data);
      })
      .catch((err) => {
        setError(err);
        toastNotify("Error loading cards.", "error");
      });
  }

  function handleSave(): void {
    const changes: CollectionChanges = {
      added: cardsAdded,
      removed: cardsRemoved,
    };

    axios
      .post(ENDPOINTS.SAVE_COLLECTION, changes)
      .then((response) => {
        // set is no loading
        setCardsAdded([]);
        setCardsRemoved([]);

        toastNotify("Collection Updated!");
      })
      .catch((err) => {
        toastNotify("Error saving collection", "error");
        // set banner
        setError(err);
      });
  }

  function filterClick(): void {
    loadCards();
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
                  />
                </Form>
                <Button
                  variant="success"
                  style={{ marginTop: "100px" }}
                  onClick={() => {}}
                >
                  <FaFileExcel /> Export to Excel
                </Button>

                <div style={{ marginTop: "20px" }}>
                  <Button
                    onClick={handleSave}
                    variant="success"
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
          />
        </Col>
      </Row>
    </Container>
  );
}

export default ChecklistContainer;
