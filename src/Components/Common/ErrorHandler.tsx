import React from "react";
import { Alert, Button } from "react-bootstrap";

interface ErrorHandlerProps {
  message: string;
  onRetry: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ message, onRetry }) => {
  return (
    <Alert variant="danger">
      <Alert.Heading>Error</Alert.Heading>
      <p>{message}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={onRetry} variant="outline-danger">
          Retry
        </Button>
      </div>
    </Alert>
  );
};

export default ErrorHandler;
