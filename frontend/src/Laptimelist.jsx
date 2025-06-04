import React, { useState, useEffect } from "react";
import "./Laptimelist.css";

const Laptimelist = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const socket = new WebSocket("ws://192.168.0.199:3001");

    socket.onmessage = (event) => {
      console.log("Raw event data:", event.data); // Log raw data
      try {
        const newData = JSON.parse(event.data);
        console.log("Parsed data:", newData); // Log data
        setData((prevData) => [...prevData.slice(-10), { ...newData, time: new Date().toLocaleTimeString() }]);
      } catch (error) {
        console.error("Error parsing JSON:", error, "Received:", event.data);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <ul className="listedpart">
      <h1 className= "toppart">Laptimelist</h1>
  {data.map((lap, index) => (
    <li key={index}>{lap.time} , {lap.value}</li>
  ))}
    </ul>
  );
};

export default Laptimelist;