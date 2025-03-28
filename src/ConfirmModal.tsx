// components/ConfirmModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bekreft handling</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Nei
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Ja
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
