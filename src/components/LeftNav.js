import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

export default function LeftNav(props) {
  const friendArray = [
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Derek",
    },
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Charles",
    },
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Ilona",
    },
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Bitna",
    },
  ];

  const setUser = (id) => {
    props.setFilterUser(id.name);
  };

  return (
    <div className="leftNav">
      <DropdownButton id="dropdown-item-button" title="">
        {props.user.isAuthenticated ? (
          <div className="dropdownMenu">
            <Dropdown.Item as="button" onClick={() => props.eventShow(true)}>
              All Events
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={() => props.userEventShow(true)}
            >
              Your Events
            </Dropdown.Item>
            <br></br>
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              Friend List
            </p>
            <Dropdown.Divider />

            {friendArray.map((id) => (
              <Dropdown.Item
                as="button"
                key={id.name}
                onClick={() => setUser(id)}
              >
                <div>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <td>
                        <img
                          className="friendPic"
                          src={`/${id.name}.png`}
                          alt="profile-pic"
                        ></img>
                      </td>
                      <td>{id.name}</td>
                    </tr>
                  </table>
                </div>
              </Dropdown.Item>
            ))}
          </div>
        ) : (
          <div className="dropdownMenu">
            <Dropdown.Item disabled>Please Login</Dropdown.Item>
          </div>
        )}
      </DropdownButton>
    </div>
  );
}
