/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { FaFilter } from "react-icons/fa";
import { CollectionChanges } from "../../Models/CollectionChanges";
import toastNotify from "../Common/toastHelper";
import { BrandsEnum } from "../../Models/BrandsEnum";
import qs from "qs";
import useAuth from "../Hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfoModal from "../Common/InfoModal";
import Loading from "../Common/Loading";
import Saving from "../Common/Saving";

function ChecklistContainer() {
  const { user, userLoaded } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState<Array<ChecklistCard>>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const [cardParams, setCardParams] = useState<CardParams>({
    inCollection: undefined,
    year: searchParams.get("year") !== null ? +searchParams.get("year")! : null,
    brands:
      searchParams.get("brand") !== null
        ? [+searchParams.get("brand")!]
        : undefined,
  });

  const [cardsAdded, setCardsAdded] = useState<number[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const years = generateYears(1948, 1970);

  useEffect(() => {
    if (userLoaded) loadCards();
  }, [user, userLoaded]);

  function loadCards(): void {
    setLoading(true);

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
      .catch(() => {
        toastNotify("Error loading cards.", "error");
      })
      .finally(() => setLoading(false));
  }

  function generateYears(start: number, end: number) {
    const years = [];
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
    if (cardsAdded.length === 0) {
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
    let isChecked: boolean | undefined = undefined;

    if (event.target.value === "0") {
      isChecked = false;
    } else if (event.target.value === "1") {
      isChecked = true;
    }

    setCardParams((prevState) => ({
      ...prevState,
      inCollection: isChecked,
    }));
  };

  const cardAdded = (id: number) => {
    setCardsAdded((prevIds) => {
      return [...prevIds, id];
    });
  };

  const cardRemoved = (id: number) => {
    const added = cardsAdded.filter((number) => number !== id);
    setCardsAdded(added);
  };

  const duplicateAdded = (card: ChecklistCard) => {
    setSaving(true);
    axios
      .post<number>(
        ENDPOINTS.DUPLICATE_CARD(card.collectionCardId!.toString()),
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      )
      .then((response) => {
        const newCard = { ...card, collectionCardId: response.data };
        setCards((prevCards) => {
          const originalIndex = prevCards.indexOf(card);
          return [
            ...prevCards.slice(0, originalIndex + 1),
            newCard,
            ...prevCards.slice(originalIndex + 1),
          ];
        });

        toastNotify("New card added...");
      })
      .catch(() => {
        toastNotify("Error adding new card", "error");
      })
      .finally(() => setSaving(false));
  };

  const collectionCardDeleted = (card: ChecklistCard) => {
    setSaving(true);
    axios
      .put<boolean>(
        ENDPOINTS.DELETE_CARD(card.collectionCardId!.toString()),
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      )
      .then(() => {
        if (cards.filter((c) => card.id === c.id).length > 1) {
          setCards((prevCards) => prevCards.filter((c) => c !== card));
        } else {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === card.id ? { ...card, inCollection: false } : c
            )
          );
        }

        toastNotify("Card deleted...");
      })
      .catch(() => {
        toastNotify("Error deleting card", "error");
      })
      .finally(() => setSaving(false));
  };

  function handleSave(): void {
    const changes: CollectionChanges = {
      added: cardsAdded,
      //removed: cardsRemoved,
    };

    setSaving(true);

    axios
      .post(ENDPOINTS.SAVE_CHECKLIST, changes, {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      })
      .then(() => {
        // set is no loading
        setCardsAdded([]);
        //setCardsRemoved([]);
        loadCards();

        toastNotify("Collection Updated!");
      })
      .catch(() => {
        toastNotify("Error saving collection", "error");
        // set banner
      })
      .finally(() => setSaving(false));
  }

  function filterClick(): void {
    if (cardsAdded.length === 0) {
      loadCards();
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      {saving && <Saving />}
      {loading && <Loading />}
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
                  checked={cardParams.brands?.includes(BrandsEnum.Topps)}
                  onChange={handleBrandChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Bowman"
                  id={BrandsEnum.Bowman.toString()}
                  checked={cardParams.brands?.includes(BrandsEnum.Bowman)}
                  onChange={handleBrandChange}
                />
                <Form.Check
                  type="checkbox"
                  label="UpperDeck"
                  id={BrandsEnum.UpperDeck.toString()}
                  checked={cardParams.brands?.includes(BrandsEnum.UpperDeck)}
                  onChange={handleBrandChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Leaf"
                  id={BrandsEnum.Leaf.toString()}
                  checked={cardParams.brands?.includes(BrandsEnum.Leaf)}
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
                    <Form.Group
                      controlId="exampleForm.SelectCustom"
                      onChange={handleOnlyCollectionChange}
                    >
                      <Form.Check // prettier-ignore
                        type="radio"
                        id={`radio-all`}
                        label={`All Cards`}
                        checked={cardParams.inCollection === undefined}
                        value={undefined}
                      />
                      <Form.Check // prettier-ignore
                        type="radio"
                        id={`radio-incollection`}
                        label={`In Collection`}
                        checked={cardParams.inCollection === true}
                        value={1}
                      />
                      <Form.Check // prettier-ignore
                        type="radio"
                        id={`radio-missing`}
                        label={`NOT in Collection`}
                        checked={cardParams.inCollection === false}
                        value={0}
                      />
                    </Form.Group>
                  </Form>

                  <div style={{ marginTop: "40px" }}>
                    <Button
                      onClick={handleSave}
                      variant="success"
                      disabled={cardsAdded.length === 0}
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
              duplicateAdded={duplicateAdded}
              collectionCardDeleted={collectionCardDeleted}
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
    </>
  );
}

export default ChecklistContainer;
