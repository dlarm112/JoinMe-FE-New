import React, { useState, useEffect } from "react";
import { Pagination, Button, Row, Col } from "react-bootstrap";
import moment from "moment";

export default function Paginations(props) {
  const date = new Date();

  const [day, setDay] = useState("");
  const [day2, setDay2] = useState("");
  const [day3, setDay3] = useState("");
  const [day4, setDay4] = useState("");
  const [day5, setDay5] = useState("");
  const [day6, setDay6] = useState("");
  const [day7, setDay7] = useState("");

  const [day11, setDay11] = useState(true);
  const [day22, setDay22] = useState("");
  const [day33, setDay33] = useState("");
  const [day44, setDay44] = useState("");
  const [day55, setDay55] = useState("");
  const [day66, setDay66] = useState("");
  const [day77, setDay77] = useState("");

  const [display, setDisplay] = useState("");
  const [display2, setDisplay2] = useState("");

  function myFunction() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    weekday[7] = "Sunday";
    weekday[8] = "Monday";
    weekday[9] = "Tuesday";
    weekday[10] = "Wednesday";
    weekday[11] = "Thursday";
    weekday[12] = "Friday";
    weekday[13] = "Saturday";

    setDay(weekday[d.getDay()].substring(0, 3).toUpperCase());
    setDay2(weekday[d.getDay() + 1].substring(0, 3).toUpperCase());
    setDay3(weekday[d.getDay() + 2].substring(0, 3).toUpperCase());
    setDay4(weekday[d.getDay() + 3].substring(0, 3).toUpperCase());
    setDay5(weekday[d.getDay() + 4].substring(0, 3).toUpperCase());
    setDay6(weekday[d.getDay() + 5].substring(0, 3).toUpperCase());
    setDay7(weekday[d.getDay() + 6].substring(0, 3).toUpperCase());

    clickedPagination(1);
  }

  useEffect(() => {
    myFunction();
    setDisplay2(
      moment(setDisplay(date.setDate(date.getDate()))).format("MMM Do YYYY")
    );
  }, []);

  useEffect(() => {
    props.setRightClick(null);
    props.setSelected(null);
    setDisplay2(moment(display).format("MMM Do YYYY"));
    props.setDay(display);
    props.setApiDate(moment(display).format("MMDDYYYY"));
    console.log(props.allWeek)
    if (props.allWeek) {
      clickedPagination(100);
    }
  }, [display, props.allWeek]);



  const clickedPagination = async (e) => {
    if (e < 20) {
      setDisplay(date.setDate(date.getDate() + (e - 1)));
      props.setDay(display);
      props.setAllWeek(false)
    }else if (e === 100){
      setDisplay2("All Week")
    }

    props.setApiDate(moment(display).format("MMDDYYYY"));
    if (e === 1) {
      setDay11(true);
      setDay22(false);
      setDay33(false);
      setDay44(false);
      setDay55(false);
      setDay66(false);
      setDay77(false);
    } else if (e === 2) {
      setDay11(false);
      setDay22(true);
      setDay33(false);
      setDay44(false);
      setDay55(false);
      setDay66(false);
      setDay77(false);
    } else if (e === 3) {
      setDay11(false);
      setDay22(false);
      setDay33(true);
      setDay44(false);
      setDay55(false);
      setDay66(false);
      setDay77(false);
    } else if (e === 4) {
      setDay11(false);
      setDay22(false);
      setDay33(false);
      setDay44(true);
      setDay55(false);
      setDay66(false);
      setDay77(false);
    } else if (e === 5) {
      setDay11(false);
      setDay22(false);
      setDay33(false);
      setDay44(false);
      setDay55(true);
      setDay66(false);
      setDay77(false);
    } else if (e === 6) {
      setDay11(false);
      setDay22(false);
      setDay33(false);
      setDay44(false);
      setDay55(false);
      setDay66(true);
      setDay77(false);
    } else if (e === 7) {
      setDay11(false);
      setDay22(false);
      setDay33(false);
      setDay44(false);
      setDay55(false);
      setDay66(false);
      setDay77(true);
    } else if (e === 100) {
      props.allEvents();
      setDay11(false);
      setDay22(false);
      setDay33(false);
      setDay44(false);
      setDay55(false);
      setDay66(false);
      setDay77(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        className="dateBottom"
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "20px",
          marginBottom: "35px",
          width: "20rem",
          padding: "10px",
        }}
      >
        <Row style={{ textAlign: "center" }} noGutters>
          <Col md={7}>{display2}</Col>
          <Col md={5}>
            <Button
              onClick={() => clickedPagination(100)}
              size="sm"
              variant="outline-primary"
            >
              All Events
            </Button>
          </Col>
        </Row>
      </div>
      <div className="paginationBox">
        <Pagination size="md">
          <Pagination.Item active={day11} onClick={() => clickedPagination(1)}>
            {day}
          </Pagination.Item>
          <Pagination.Item active={day22} onClick={() => clickedPagination(2)}>
            {day2}
          </Pagination.Item>
          <Pagination.Item active={day33} onClick={() => clickedPagination(3)}>
            {day3}
          </Pagination.Item>
          <Pagination.Item active={day44} onClick={() => clickedPagination(4)}>
            {day4}
          </Pagination.Item>
          <Pagination.Item active={day55} onClick={() => clickedPagination(5)}>
            {day5}
          </Pagination.Item>
          <Pagination.Item active={day66} onClick={() => clickedPagination(6)}>
            {day6}
          </Pagination.Item>
          <Pagination.Item active={day77} onClick={() => clickedPagination(7)}>
            {day7}
          </Pagination.Item>
        </Pagination>
      </div>
    </div>
  );
}
