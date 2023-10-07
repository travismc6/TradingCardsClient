import React from "react";
import { Modal, Button } from "react-bootstrap";

interface InfoModalProps {
  show: boolean;
  message: string;
  title: string;
  onConfirm: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({
  show,
  message,
  title,
  onConfirm,
}) => {
  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
