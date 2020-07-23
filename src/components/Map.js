import React, { useState, useCallback, useEffect } from "react";
import { Button, Navbar, Modal, Dropdown, Jumbotron } from "react-bootstrap";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
// import { formatRelative } from "date-fns";
import mapStyles from "../mapStyles";
import { Paginations, EventModal, PaginationLink, LeftNav } from "./index";
// import App from "../App";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import moment from "moment";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};
const center = {
  lat: 10.785478,
  lng: 106.696847,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  disableDoubleClickZoom: true,
};

export default function Map(props) {
  const [show, setShow] = useState(false);
  const [lat, setLat] = useState(10.785478);
  const [lng, setLng] = useState(106.696847);

  const handleShow = async (e) => {
    await setLat(e.latLng.lat());
    await setLng(e.latLng.lng());
    setShow(true);
    // reverseGeo();
  };

  const searchShow = async (e) => {
    setLat(e.lat);
    setLng(e.lng);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const [coordinates, setCoordinates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rightClick, setRightClick] = useState(null);
  const [id, setId] = useState(null);
  const [eventList, setEventList] = useState(null);
  const [userEventList, setUserEventList] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [streetAddress, setStreetAddress] = useState("");
  const [apiDate, setApiDate] = useState(moment("MMDDYYYY"));
  const [rightClickDelete, setRightClickDelete] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [modalEventsUser, setModalEventsUser] = useState([]);
  const [userMaxPageNum, setUserMaxPageNum] = useState(1);
  // eslint-disable-next-line

  const markerOptions = {
    clickable: true,
  };

  // FETCH CERTAIN DAY
  useEffect(() => {
    if (!props.user.isAuthenticated) return;

    async function fetchData() {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/event/${apiDate}`
      );
      const resp = await data.json();
      setCoordinates(resp);
    }
    fetchData();
  }, [apiDate, props.user]);

  //FETCH CERTAIN USER LEFT NAV
  useEffect(() => {
    if (!props.user.isAuthenticated) return;

    async function fetchData() {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/event/user/${filterUser}`
      );
      const resp = await data.json();
      setCoordinates(resp);
    }
    fetchData();
  }, [filterUser]);

  // FETCH TO PAGINATE
  useEffect(() => {
    if (!props.user.isAuthenticated) return;
    async function fetchData() {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/event/modal?page=${pageNum}`
      );
      const resp = await data.json();
      setModalEvents(resp.data);
      setMaxPageNum(parseInt(resp.maxPageNum));
    }
    fetchData();
  }, [pageNum, coordinates]);

  //FETCH TO PAGINATE USER

  useEffect(() => {
    if (!props.user.isAuthenticated) return;
    async function fetchData() {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/event/modal/${props.user.name}?page=${pageNum}`
      );
      const resp = await data.json();
      setModalEventsUser(resp.data);
      setUserMaxPageNum(parseInt(resp.maxPageNum));
    }
    fetchData();
  }, [pageNum, coordinates]);

  useEffect(() => {
    async function fetchData() {
      if (!props.user.isAuthenticated) return;

      const data = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY}`
      );
      const resp = await data.json();
      if (
        !resp.results ||
        resp.results.length === 0 ||
        !resp.results[0].formatted_address
      ) {
        return <div>Loading</div>;
      } else {
        setStreetAddress(resp.results[0].formatted_address);
      }
    }
    fetchData();
  }, [lat, lng]);

  const goNextPage = () => {
    setPageNum(pageNum + 1);
  };

  const goPrevPage = () => {
    setPageNum(pageNum - 1);
  };

  const eventShow = (e) => {
    setPageNum(1);
    setEventList(e);
  };

  const userEventShow = (e) => {
    setPageNum(1);
    setUserEventList(e);
  };

  const deleteEvent = async (e) => {
    if (!props.user.isAuthenticated) return;

    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/event/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/event/${apiDate}`
    );
    const resp = await data.json();
    setCoordinates(resp);
    setRightClick(null);
  };

  // SHOW ALL EVENTS
  const allEvents = async (e) => {
    if (!props.user.isAuthenticated) return;

    setApiDate("");
    const data = await fetch(`${process.env.REACT_APP_API_URL}/event`);
    const resp = await data.json();
    setCoordinates(resp);
    setRightClick(null);
  };

  // DOUBLE CLICk MAP
  const onMapClick = (event) => {
    if (props.user.isAuthenticated === true) {
      onMapClick2(event);
    } else alert("Login to create an event");
  };

  const onMapClick2 = useCallback((event) => {
    handleShow(event);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  });

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  const detailPanTo = async (id) => {
    const lat = id.lat;
    const lng = id.lng;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
    setSelected(id);
    eventShow(false);
    userEventShow(false);
    setPageNum(1);
    await allEvents();
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      {props.user.isAuthenticated ? (
        <div>
          {/* EVENT LIST */}
          <Modal show={eventList} size="xl">
            <Modal.Body className="eventModal">
              <table style={{ width: "100%" }}>
                <tbody style={{ textAlign: "center" }}>
                  <tr>
                    <td>Created by:</td>
                    <td></td>
                    <td>Title:</td>
                    <td>Date:</td>
                    <td>Details:</td>
                  </tr>
                  <tr>
                    <td colSpan={5}>
                      <Dropdown.Divider />
                    </td>
                  </tr>

                  {modalEvents.map((id) => (
                    <tr key={id._id} style={{ height: "50px" }}>
                      <td>
                        <img
                          src={`/${id.name}.png`}
                          alt="profile-pic"
                          style={{ width: "40px", marginRight: "15px" }}
                        ></img>
                      </td>
                      <td>{id.name}</td>
                      <td style={{ textAlign: "center" }}>{id.title}</td>
                      <td>{id.date}</td>
                      <td>
                        <Button onClick={() => detailPanTo(id)}>Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer className="eventModal">
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td width={50} style={{ textAlign: "center" }}>
                      <PaginationLink
                        disabled={pageNum === 1}
                        handleClick={goPrevPage}
                      >
                        Previous Page
                      </PaginationLink>
                    </td>
                    <td width={50} style={{ textAlign: "center" }}>
                      <PaginationLink
                        disabled={pageNum === maxPageNum}
                        handleClick={goNextPage}
                      >
                        Next Page
                      </PaginationLink>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="container">
                <Button
                  centered
                  style={{ width: "100%", marginLeft: "0" }}
                  variant="secondary"
                  onClick={() => eventShow(false)}
                >
                  Close
                </Button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* USER EVENTS ONLY */}
          <Modal show={userEventList} size="xl">
            <Modal.Body className="eventModal">
              <table style={{ width: "100%" }}>
                <tbody style={{ textAlign: "center" }}>
                  <tr>
                    <td>Created by:</td>
                    <td></td>
                    <td>Title:</td>
                    <td>Date:</td>
                    <td>Details:</td>
                  </tr>
                  <tr>
                    <td colSpan={5}>
                      <Dropdown.Divider />
                    </td>
                  </tr>

                  {modalEventsUser.map((id) => (
                    <tr key={id._id} style={{ height: "50px" }}>
                      <td>
                        <img
                          src={`/${id.name}.png`}
                          alt="profile-pic"
                          style={{ width: "40px", marginRight: "15px" }}
                        ></img>
                      </td>
                      <td>{id.name}</td>
                      <td style={{ textAlign: "center" }}>{id.title}</td>
                      <td>{id.date}</td>
                      <td>
                        <Button onClick={() => detailPanTo(id)}>Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer className="eventModal">
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td width={50} style={{ textAlign: "center" }}>
                      <PaginationLink
                        disabled={pageNum === 1}
                        handleClick={goPrevPage}
                      >
                        Previous Page
                      </PaginationLink>
                    </td>
                    <td width={50} style={{ textAlign: "center" }}>
                      <PaginationLink
                        disabled={pageNum === userMaxPageNum}
                        handleClick={goNextPage}
                      >
                        Next Page
                      </PaginationLink>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="container">
                <Button
                  centered
                  style={{ width: "100%", marginLeft: "0" }}
                  variant="secondary"
                  onClick={() => userEventShow(false)}
                >
                  Close
                </Button>
              </div>
            </Modal.Footer>
          </Modal>

          {/* CREATE EVENT MODAL */}
          <EventModal
            streetAddress={streetAddress}
            lng={lng}
            lat={lat}
            show={show}
            handleClose={handleClose}
            handleShow={handleShow}
            setCoordinates={setCoordinates}
            day={props.day}
            user={props.user}
            apiDate={apiDate}
          />
          <Search panTo={panTo} searchShow={searchShow} lat={lat} lng={lng} />
          <Locate panTo={panTo} />
          <section style={{ width: "100vw" }}>
            <div className="pagination">
              <Paginations
                setDay={props.setDay}
                setApiDate={setApiDate}
                allEvents={allEvents}
                setSelected={setSelected}
                setRightClick={setRightClick}
              />
            </div>
          </section>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={14}
            center={center}
            options={options}
            onDblClick={onMapClick}
            onLoad={onMapLoad}
          >
            {coordinates.map((coordinate) => (
              <Marker
                options={markerOptions}
                key={coordinate._id}
                position={{ lat: coordinate.lat, lng: coordinate.lng }}
                icon={{
                  url: `/${coordinate.name}.png`,
                  scaledSize: new window.google.maps.Size(4, 4, "rem", "rem"),
                  shape: new window.google.maps.Circle(),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(30, 30),
                }}
                // label={coordinate.title}
                title={coordinate.title}
                // POP UP EVENT DETAILS
                onClick={() => {
                  setSelected(coordinate);
                  setRightClick(null);
                }}
                onRightClick={() => {
                  setId(coordinate._id);
                  setRightClick(coordinate);
                  setSelected(null);
                  setRightClickDelete(coordinate);
                }}
              ></Marker>
            ))}
            {rightClick ? (
              <InfoWindow
                position={{ lat: rightClick.lat, lng: rightClick.lng }}
                onCloseClick={() => setRightClick(null)}
              >
                <div>
                  {props.user.name === rightClickDelete.name ? (
                    <Button type="submit" onClick={(e) => deleteEvent(e)}>
                      Delete?
                    </Button>
                  ) : (
                    <div>Only Creator Can Delete Event</div>
                  )}
                </div>
              </InfoWindow>
            ) : null}
            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => setSelected(null)}
              >
                <table style={{ width: "100%" }}>
                  {console.log(selected)}
                  <tbody style={{ textAlign: "center" }}>
                    <tr>
                      <td colSpan={2}>
                        <h5>{selected.title}</h5>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ textAlign: "left" }}>
                        <p>
                          <b>Created by: </b> {selected.name}
                        </p>
                        <hr />
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} style={{ textAlign: "left" }}>
                        <p>
                          <b>Description: </b> {selected.description}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ textAlign: "left" }}>
                        <p>
                          <b>Date: </b>
                          {selected.date}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left" }}>
                        <p>
                          <b>Start: </b> {selected.startTime}:00
                        </p>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <p>
                          <b>End: </b> {selected.endTime}:00
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <a
                          target="_blank"
                          href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`}
                        >
                          {`Open in Google Maps: `}
                        </a>
                        {selected.address}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoWindow>
            ) : null}
          </GoogleMap>
          <LeftNav
            eventShow={eventShow}
            user={props.user}
            setFilterUser={setFilterUser}
            userEventShow={userEventShow}
          />
        </div>
      ) : (
        <Jumbotron
          fluid
          style={{
            backgroundImage: "url(./splash.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="container">
            <h1 style={{ fontFamily: "Fredoka One, cursive" }}>
              JoinMe<i class="fas fa-users"></i>
            </h1>
            <h5>Never miss an opportunity to spend time with friends.</h5>
            <p>Login or Register to continue</p>
          </div>
        </Jumbotron>
      )}
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null,
          options
        );
      }}
    >
      <i class="far fa-compass"></i>
    </button>
  );
}

function Search({ panTo, searchShow, lat, lng }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => lat, lng: () => lng },
      radius: 20 * 1000,
    },
  });
  return (
    <div className="searchBar">
      <Combobox
        onSelect={async (address) => {
          console.log(address);
          setValue(address, false);
          clearSuggestions();
          try {
            const result = await getGeocode({ address });
            const { lat, lng } = await getLatLng(result[0]);
            panTo({ lat, lng });
            searchShow({ lat, lng });
            setValue("");
          } catch (error) {
            console.log("error");
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
