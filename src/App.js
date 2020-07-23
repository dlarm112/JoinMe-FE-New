import React, { useState, useEffect } from "react";
// import Home from "./views/Home";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Map, Nav } from "./components/index";
import "rheostat/initialize";
import "rheostat/css/rheostat.css";
// import axios from "axios";
import "./App.css";

function App(props) {
  const [user, setUser] = useState({ isAuthenticated: false });
  const [day, setDay] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        console.log("no token provided");
        return;
      }
      const res = await fetch("http://localhost:5000/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": `${token}`,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setUser({ ...data.user, isAuthenticated: true });
      } else {
        setUser({ isAuthenticated: false });
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  console.log(user);
  return (
    <div>
      <Nav setUser={setUser} user={user} />
      <Map user={user} setDay={setDay} day={day}/>
    </div>
  );
}

export default App;
