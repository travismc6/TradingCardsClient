import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import useAuth from "../Hooks/useAuth";
import axios from "axios";
import { ENDPOINTS } from "../../Utils/apiConfig";
import qs from "qs";
import toastNotify from "../Common/toastHelper";

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (selectedFile) {
      setSaving(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setSaving(true);

        await axios.post(ENDPOINTS.UPLOAD_CARD_SET, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.authToken}`,
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });
        toastNotify("Successfully uploaded card set");
      } catch (error) {
        toastNotify("Error uploading card set.", "error");
      }
    } else {
      toastNotify("Error uploading card set.", "error");
    }

    setSaving(false);
  };

  return (
    <Container>
      <h1>Admin</h1>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload a Card Set</Form.Label>
          <Form.Control
            type="file"
            accept=".json"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleImport}>
          Upload
        </Button>
      </Form>
    </Container>
  );
};

export default Admin;
