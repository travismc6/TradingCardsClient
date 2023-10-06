import { Route, Routes } from "react-router-dom";
import Header from "../Components/Layout/Header";
import Home from "../Components/Home";
import Footer from "../Components/Layout/Footer";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import CardDetails from "../Components/Details/CardDetails";
import Register from "../Components/Authentication/Register";
import Login from "../Components/Authentication/Login";
import { AuthProvider } from "../Components/Hooks/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <div className="pb-5">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/card/:id" element={<CardDetails />}></Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
