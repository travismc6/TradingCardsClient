import axios from "axios";
import React, { useState, FormEvent } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { ENDPOINTS } from "../../Utils/apiConfig";
import toastNotify from "../Common/toastHelper";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import useAuth from "../Hooks/useAuth";
import { User } from "../../Models/User";

interface FormData {
  username: string;
  password: string;
}

interface userModel {
  fullName?: string;
  id: string;
  email: string;
  role?: string;
}

// interface ApiResponse {
//   data?: {
//     // this will be included in suggestions so if possible use the format if you know that.
//     statusCode?: number;
//     isSuccess?: boolean;
//     errorMessages?: Array<string>;
//     result: {
//       // this will not give suggestions
//       [key: string]: string;
//     };
//   };
//   error?: any;
// }

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
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
      const response = await axios.post(ENDPOINTS.LOGIN, formData);
      if (response.data) {
        const { token } = response.data;
        const { fullName, id, email, role }: userModel = jwt_decode(token);

        const user: User = {
          name: fullName!,
          id: id,
          email: email,
          role: role!,
          authToken: token,
        };

        login(user);
        navigate("/");
      }
    } catch (error) {
      toastNotify("Error loggin in...", "error");
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

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}
