/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import React, { useState, FormEvent } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { ENDPOINTS } from "../../Utils/apiConfig";
import toastNotify from "../Common/toastHelper";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  name: string;
  password: string;
  role: string;
  email: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    password: "",
    role: "collector",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios
        .post(ENDPOINTS.REGISTER, formData)
        .then((response) => {
          if (response.status === 200) {
            navigate("/login");
            toastNotify("User created. Please Login to continue...");
          }
        })
        .catch(() => {
          toastNotify("Error registering...", "error");
        });
    } catch (error) {
      console.error("There was an error sending the request", error);
    }
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit} className="p-4 border rounded">
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
}
