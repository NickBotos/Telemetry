import React, { useState, useEffect } from "react";


const Bar = () => {
  const [latestData, setLatestData] = useState({
    speed: "N/A",
    rpm: "N/A",
    coolantTemp: "N/A",
    oilTemp: "N/A",
    gear: "N/A",
  });

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("wss://ws.art-telemetry.xyz");
      socket.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          console.log("Received newData:", newData);

      setLatestData((prevData) => ({
          speed: typeof newData.speed === "object" ? Number(newData.speed.value) : Number(newData.speed) || prevData.speed,
          rpm: typeof newData.rpm === "number" ? newData.rpm : prevData.rpm,
          coolantTemp: typeof newData.coolantTemp === "object" ? Number(newData.coolantTemp.temp) : Number(newData.coolantTemp) || prevData.coolantTemp,
          oilTemp: typeof newData.oilTemp === "number" ? newData.oilTemp : prevData.oilTemp,
          gear: typeof newData.gear === "number" ? newData.gear : prevData.gear,
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
  <div style={{ backgroundColor: "white" }}
    className="flex justify-between items-center bg-gray-900 text-black p-2 px-6 rounded-lg border border-gray-700  text-3xl">
    <div className="flex flex-col items-center">
      <span className="font-bold ">{latestData.speed} km/h</span>
        <div className="flex items-center gap-1 text-black text-xs">
          
          <span>Speed</span>
        </div>
    </div>
    <div className="flex flex-col items-center"> 
      <span className="font-bold">{latestData.rpm} RPM</span>
      <div className="flex items-center gap-1 text-black text-xs">
        
        <span>RPM</span>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <span className="font-bold">{latestData.oilTemp} °C</span>
      <div className="flex items-center gap-1 text-black text-xs">
        
        <span>Oil Temp</span>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <span className="font-bold">{latestData.coolantTemp} °C</span>
      <div className="flex items-center gap-1 text-black text-xs">
        
        <span>Engine Temp</span>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <span className="font-bold">{latestData.gear}</span>
      <div className="flex items-center gap-1 text-black text-xs">
        
        <span>Gear</span>
      </div>
    </div>
  </div>
  );
};

export default Bar
