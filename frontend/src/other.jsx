import React, { useEffect, useState } from "react";
import "./other.css";

const Other = () => {
  const [latestData, setLatestData] = useState({
    iat: null,
    frontBrakePress: null,
    fuelUsed: null,
  });

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("wss://ws.art-telemetry.xyz");

      socket.onmessage = (event) => {
        console.log("Raw WebSocket Data:", event.data);
        try {
          const newData = JSON.parse(event.data);
          console.log("Parsed Data:", newData);

          setLatestData((prevData) => ({
            ...prevData,
            iat: newData.iat ?? prevData.iat,
            frontBrakePress: newData.frontBrakePress ?? prevData.frontBrakePress,
            fuelUsed: newData.fuelUsed ?? prevData.fuelUsed,
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
      <h2 className="iat">IAT: {latestData.iat}</h2>
      <h2 className="frontBrakePress">Front Brake Press: {latestData.frontBrakePress}</h2>
      <h2 className="fuelUsed">Fuel Used: {latestData.fuelUsed}</h2>
    </div>
  );
};

export default Other;