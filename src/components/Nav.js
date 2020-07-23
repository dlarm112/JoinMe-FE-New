import React, { useState } from "react";
import { Navbar, Button, Modal, Form, Badge } from "react-bootstrap";
const Joi = require("joi-browser");

export default function Nav(props) {
  const [show, setShow] = useState(null);
  const [showRegister, setShowRegister] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().min(5).label("Username"),
  };

  const loginShow = async (e) => {
    setShow(e);
  };

  const registerShow = (e) => {
    setShowRegister(e);
  };

  const loginFunc = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        email,
        password,
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      localStorage.setItem("token", data.token);
      props.setUser({ ...data.user, isAuthenticated: true });
    } catch (err) {
      console.log(err);
    }
    setShow(false);
  };

  const registerFunc = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        email,
        password,
      };
      const loginData = {
        email,
        password,
      };
      console.log(userData);

      const newRegister = await fetch(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      localStorage.setItem("token", data.token);
      props.setUser({ ...data.user, isAuthenticated: true });
      registerShow(false);
    } catch (err) {
      console.log(err);
    }
  };

  const logOut = () => {
    props.setUser({ isAuthenticated: false });
    localStorage.removeItem("token");
    window.location.reload(true);
  };

  return (
    <div>
      <Navbar className="navBar">
        <div className="container">
          <Navbar.Brand className="navText">
            JoinMe<i class="fas fa-users"></i>
          </Navbar.Brand>
          {!props.user.isAuthenticated ? (
            <Form inline>
              <Button className="navBtn" onClick={() => loginShow(true)}>
                Login
              </Button>
              <Button className="navBtn" onClick={() => registerShow(true)}>
                Register
              </Button>
            </Form>
          ) : (
            <div>
              <Badge pill variant="dark" style={{fontSize:"14px"}}>
                Hello {props.user.name}
              </Badge>
              <Button className="navBtn" onClick={() => logOut()}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </Navbar>

      {/* EVENT LIST */}

      {/* LOGIN */}
      <Modal show={show}>
        <Modal.Header>Login</Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => loginFunc(e)}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
              />
              <hr></hr>
              <Button onClick={() => loginShow(false)}>Cancel</Button>
              <Button type="submit">Login</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      {/* REGISTER */}
      <Modal show={showRegister}>
        <Modal.Header>Register New Account</Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => registerFunc(e)}>
            <Form.Group controlId="name">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <hr></hr>
              <Button onClick={() => registerShow(false)}>Cancel</Button>
              <Button type="submit">Register</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
