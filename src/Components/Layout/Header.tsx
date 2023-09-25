import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseball } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, Button } from "react-bootstrap";
import useAuth from "../Hooks/useAuth";

function Header() {
  const { user, logout } = useAuth();
  //const { theme, toggleTheme } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={NavLink} to="/">
        <div className="d-flex align-items-center p-2">
          <FontAwesomeIcon icon={faBaseball} className="pr-2" />
          {"  "}
          <span className="ml-2 custom-margin">CardCollection</span>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {user === null ? (
            <>
              <Nav.Item>
                <NavLink to="/login">
                  <Button variant="outline-light" className="p-2 custom-margin">
                    Login
                  </Button>
                </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink to="/register">
                  <Button variant="primary" className="p-2 custom-margin">
                    Register
                  </Button>
                </NavLink>
              </Nav.Item>
            </>
          ) : (
            <div>
              <Nav.Item>
                <span className="text-white pr-2">Hello, {user.name}!</span>
                <NavLink to="/">
                  <Button
                    variant="outline-light"
                    className="p-2 custom-margin"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </NavLink>
              </Nav.Item>
            </div>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
