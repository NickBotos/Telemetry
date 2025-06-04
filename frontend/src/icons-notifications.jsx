import React, { useEffect, useState } from "react";
import { FaOilCan } from "react-icons/fa";
import { PiEngine } from "react-icons/pi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { BsSpeedometer } from "react-icons/bs";
import "./icons.css";

const Warning = () => {
  const [latestData, setLatestData] = useState({
    oilTemp: null,
    coolantTemp: null,
    fuelPress: null,
    oilPress: null,
  });

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://192.168.0.199:3001");

      socket.onmessage = (event) => {
        console.log("Raw WebSocket Data:", event.data);
        try {
          const newData = JSON.parse(event.data);
          console.log("Parsed Data:", newData);

          setLatestData((prevData) => ({
            ...prevData,
            oilTemp: newData.oilTemp ?? prevData.oilTemp,
            coolantTemp: newData.coolantTemp ?? prevData.coolantTemp,
            fuelPress: newData.fuelPress ?? prevData.fuelPress,
            oilPress: newData.oilPress ?? prevData.oilPress,
          }));
        } catch (error) {
          console.error("WebSocket parse error:", error);
        }
      };

      socket.onerror = (error) => console.error("WebSocket error:", error);
      socket.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting in 2s...");
        setTimeout(connectWebSocket, 2000);
      };
    };

    connectWebSocket();
  }, []);

  return (
    <div>
      <FaOilCan
        className={`oil ${
          latestData.oilTemp !== null && latestData.oilTemp > 120
            ? "text-red-600 animate-pulse"
            : "text-green-600"
        }`}
      />
      <h2 className="oiltemp">Oil temp</h2>
      <PiEngine
        className={`engine ${
          latestData.coolantTemp !== null && latestData.coolantTemp > 110
            ? "text-red-600 animate-pulse"
            : "text-green-600"
        }`}
      />
      <h2 className="enginetemp">Engine temp</h2>
      <BsFillFuelPumpFill
        className={`fuel ${
          latestData.fuelPress !== null && latestData.fuelPress < 300
            ? "text-red-600 animate-pulse"
            : "text-green-600"
        }`}
      />
      <h2 className="fuelpress">Fuel press</h2>
      <BsSpeedometer
        className={`oilpress ${
          latestData.oilPress !== null && latestData.oilPress < 250
            ? "text-red-600 animate-pulse"
            : "text-green-600"
        }`}
        />
        <h2 className="oilpressure">Oil Pressure</h2>
    </div>
  );
};

export default Warning;