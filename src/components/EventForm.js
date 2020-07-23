import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Rheostat from "rheostat";
import moment from "moment";

export default function EventForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(props.streetAddress);
  // eslint-disable-next-line
  const [newDay, setNewDay] = useState(props.day);
  const time = props.day;
  // RHEOSTAT INPUT
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24);
  const [tempStartTime, setTempStartTime] = useState(0);
  const [tempEndTime, setTempEndTime] = useState(24);

  const createEvent = async (e) => {
    if (!props.user.isAuthenticated) return;
    const lat = props.lat;
    const lng = props.lng;
    const date = (moment(time).format("dddd") + ' ' + moment(time).format(
      "MMM Do YYYY"
    ))
    e.preventDefault();
    const eventData = {
      name: props.user.name,
      title,
      description,
      startTime,
      endTime,
      lat,
      lng,
      time: new Date(),
      date: date,
      address: address,
      rawDate: time,
      creatorID: props.user._id,
      apiDate: props.apiDate,
    };
    console.log(eventData);
    // eslint-disable-next-line
    const newEvent = await fetch(`${process.env.REACT_APP_API_URL}/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    const data = await fetch(`${process.env.REACT_APP_API_URL}/event/${props.apiDate}`);
    const resp = await data.json();
    props.setCoordinates(resp);
    console.log("resp", resp);
    props.handleClose();
  };

  const cancelFunc = () => {
    props.handleClose();
  };

  const handleChange = (e) => {
    setStartTime(e.values[0]);
    setEndTime(e.values[1]);
  };
  const handleValuesUpdated = (e) => {
    setTempStartTime(e.values[0]);
    setTempEndTime(e.values[1]);
  };

  useEffect(() => {
    setAddress(props.streetAddress);
    setNewDay(props.day);
  }, [props.streetAddress, props.day]);

  return (
    <div>
      <Form onSubmit={createEvent}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <div style={{ fontWeight: "bold" }}>Date:</div>
          <div>
            {`${moment(time).format("dddd")}, ${moment(time).format(
              "MMM Do YYYY"
            )}`}
          </div>
        </Form.Group>

        <Form.Group controlId="startEndTime">
          <Form.Label>Start/End Time</Form.Label>
          <Rheostat
            min={0}
            max={24}
            values={[startTime, endTime]}
            onChange={handleChange}
            onValuesUpdated={handleValuesUpdated}
          />
        </Form.Group>
        <Form.Group>
          <div className="row textCenter" style={{ paddingBottom: "10px" }}>
            <div className="col-6">Start: {tempStartTime}:00</div>
            <div className="col-6">End: {tempEndTime}:00</div>
          </div>{" "}
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <div className="row textCenter">
          <div className="col-6">
            <Button variant="secondary" onClick={() => cancelFunc()}>
              Cancel
            </Button>
          </div>
          <div className="col-6">
            <Button variant="primary" type="submit">
              JoinMe!
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
