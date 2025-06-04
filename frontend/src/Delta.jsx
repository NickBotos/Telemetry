import React from "react";
import { useEffect, useState } from "react";
import"./delta.css";

const Other = () => {
  const [latestData, setLatestData] = useState({
    liveDelta: null,
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
            liveData: newData.liveDelta ?? prevData.liveData,
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
return(
    <div>
        <h2 className="liveDelta">Live Delta:</h2>
        <div className="liveDeltaValue">{latestData.liveDelta}</div>
    </div>
)
};
export default Other;