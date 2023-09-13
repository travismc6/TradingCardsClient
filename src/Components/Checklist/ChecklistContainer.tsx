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
import { toast } from "react-toastify";

function ChecklistContainer() {
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

    setCardParams((c) => ({
      ...cardParams,
      year: year,
    }));
  };

  const handleBrandChange = (event: ChangeEvent<HTMLInputElement>) => {
    // const { name, checked } = event.target;
    // if (checked) {
    //   cardParams.brand?.push(name)
    // } else {
    // }
    // // Update the state based on the checkbox's checked property
    // setCardParams((c) => ({
    //   ...cardParams,
    //   year: year,
    // }));
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
    axios
      .get(ENDPOINTS.GET_CARDS)
      .then((response) => {
        setCards(response.data);
      })
      .catch((err) => {
        setError(err);
        toast.error("Error loading cards", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }, []);

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

        toast.success("Collection Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((err) => {
        // set banner
        setError(err);
        toast.error("Error saving collection", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={2} style={{ backgroundColor: "#f8f9fa" }}>
          <div style={{ padding: "20px" }}>
            <Form.Group style={{ maxWidth: "300px" }}>
              <Form.Control type="text" placeholder="Player..." />
            </Form.Group>

            <h5 style={{ marginTop: "20px" }}>Brands</h5>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Topps"
                onChange={handleBrandChange}
              />
              <Form.Check
                type="checkbox"
                label="Bowman"
                onChange={handleBrandChange}
              />
              <Form.Check
                type="checkbox"
                label="UpperDeck"
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

            <Form style={{ marginTop: "20px" }}>
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Only cards in collection"
              />
            </Form>

            <div style={{ marginTop: "20px" }}>
              <Button
                variant="primary"
                style={{ marginRight: "10px", width: "200px" }}
              >
                <FaFilter /> Filter
              </Button>
            </div>

            <Button
              variant="success"
              style={{ marginTop: "100px", width: "200px" }}
              onClick={() => {}}
            >
              <FaFileExcel /> Export to Excel
            </Button>

            <div style={{ marginTop: "20px" }}>
              <Button
                onClick={handleSave}
                variant="success"
                style={{ marginRight: "10px", width: "200px" }}
              >
                Save Collection
              </Button>
            </div>
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
