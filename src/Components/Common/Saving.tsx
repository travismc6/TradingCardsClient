import React from "react";
import { Spinner } from "react-bootstrap";

const Saving: React.FC = () => (
  <div
    style={{
      position: "fixed", // instead of "absolute"
      top: 0,
      left: 0,
      width: "100vw", // viewport width
      height: "100vh", // viewport height
      zIndex: 1000,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* React-Bootstrap Spinner */}
    <Spinner animation="border" role="status">
      <span className="sr-only">Saving...</span>
    </Spinner>
  </div>
);

export default Saving;
