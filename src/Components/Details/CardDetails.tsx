import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Form, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";
import { ENDPOINTS } from "../../Utils/apiConfig";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { CollectionCard } from "../../Models/CollectionCard";
import toastNotify from "../Common/toastHelper";
import { ImageTypeEnum } from "../../Models/ImageTypeEnum";

export interface CardDetailsProps {
  cardData?: CollectionCard;
}

export default function CardDetails() {
  const [card, setCard] = useState<CollectionCard>({} as CollectionCard);

  const [imageType, setImageType] = useState<ImageTypeEnum>(
    ImageTypeEnum.Front
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const routeParams = useParams();
  const cardId = routeParams["id"];

  const { user, loading } = useAuth();

  const navigate = useNavigate();

  const grades = generateGrades();

  function generateGrades() {
    let grades = [];
    for (let i = 1; i <= 10; i += 0.5) {
      grades.push(i);
    }
    return grades;
  }

  useEffect(() => {
    // Load data using axios
    if (!loading) {
      axios
        .get<CollectionCard>(ENDPOINTS.CARD_DETAILS(cardId!), {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        })
        .then((response) => {
          setCard(response.data);
        });
    }
  }, [cardId, loading, user?.authToken]);

  const handleSave = () => {
    axios
      .put<CollectionCard>(
        ENDPOINTS.SAVE_CARD,
        { ...card },
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      )
      .then((response) => {
        toastNotify("Card saved...");
        handleBack();
      })
      .catch((err) => {
        toastNotify("Error saving card", "error");
      });
  };

  const handleBack = () => {
    navigate("/");
  };

  const gradeChanged = (gradeString: string | null) => {
    let grade: number | null = null;

    if (gradeString !== null) {
      grade = parseFloat(gradeString);
      if (grade === card?.grade) {
        grade = null;
      }
    }

    setCard((prevState) => ({
      ...prevState,
      grade: grade,
    }));
  };

  const handleNotesChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Create a copy of the state to avoid mutating it directly
    const updatedState = { ...card, notes: event.target.value };
    setCard(updatedState);
  };

  const handleImageUploadClick = (imageType: ImageTypeEnum) => {
    setImageType(imageType);
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = () => {
    if (inputRef.current?.files) {
      const file = inputRef.current.files[0];

      axios
        .post(
          ENDPOINTS.IMAGE_UPLOAD(card.id.toString()) +
            "?imagetype=" +
            imageType.toString(),
          { file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user?.authToken}`,
            },
          }
        )
        .then((response) => {
          toastNotify("Image Uploaded...");
        })
        .catch((err) => {
          toastNotify("Error uploading image", "error");
        });

      // post to api
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Card
        style={{
          width: "600px",
          margin: "0 auto",
          padding: 20,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card.Body>
          <Card.Title style={{ fontSize: "36px" }}>{card?.name}</Card.Title>

          <Card.Text style={{ fontSize: "22px" }}>
            <span>
              #{card?.number} {card?.year} {card?.brandName}
            </span>
          </Card.Text>

          <div style={{ display: "flex", marginBottom: 25 }}>
            <div style={{ flex: 1, marginRight: 20 }}>
              <b>{`Front ${
                card?.frontImageUrl === null ? "(default)" : ""
              }`}</b>
              <a
                href={
                  card?.frontImageUrl ||
                  card?.defaultFrontImageUrl?.replace(`{number}`, card.number)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card.Img
                  style={{ opacity: card?.frontImageUrl === null ? 0.25 : 1 }}
                  variant="top"
                  src={
                    card?.frontImageUrl ||
                    card?.defaultFrontImageUrl?.replace(`{number}`, card.number)
                  }
                />
              </a>
              <input
                accept="image/*"
                ref={inputRef}
                onChange={handleDisplayFileDetails}
                className="d-none"
                type="file"
              />
              <Button
                variant="link"
                onClick={() => handleImageUploadClick(ImageTypeEnum.Front)}
              >
                Upload Front Image
              </Button>
            </div>
            <div style={{ flex: 1 }}>
              <b>{`Back ${card?.backImageUrl === null ? "(default)" : ""}`}</b>
              <a
                href={
                  card?.backImageUrl ||
                  card?.defaultBackImageUrl?.replace(`{number}`, card.number)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card.Img
                  style={{ opacity: card?.backImageUrl === null ? 0.25 : 1 }}
                  variant="top"
                  src={
                    card?.backImageUrl ||
                    card?.defaultBackImageUrl?.replace(`{number}`, card.number)
                  }
                />
              </a>
              <a href="#">Upload Back Image</a>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={card?.notes}
              onChange={handleNotesChanged}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Grade</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              title={
                card?.grade !== null && card?.grade !== undefined
                  ? card.grade
                  : "Select Grade"
              }
              variant="secondary"
              onSelect={gradeChanged}
              style={{}}
            >
              {grades.map((g) => (
                <Dropdown.Item eventKey={g} key={g}>
                  {g}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>

          <div style={{ marginTop: 30 }}>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleBack} className="ms-2">
              Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
