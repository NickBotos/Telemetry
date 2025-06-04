import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Tpsmapchart = () => {
  const [data, setData] = useState([]);
  const latestData = data.length > 0 ? data[data.length - 1] : { tps: "N/A", map: "N/A" };

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://192.168.0.199:3001");

      socket.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          console.log("Received data:", newData);

          if (newData.oilPress !== undefined && newData.oilTemp !== undefined) {
            setData((prevData) => [
              ...prevData.slice(-50),
              { ...newData, time: new Date().toLocaleTimeString() }
            ]);
          } else {
            console.warn("Unexpected data format:", newData);
          }
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

  // Custom Renderer
  const renderLegend = () => (
    <div style={{ textAlign: "center", color: "white", paddingBottom: "5px" }}>
      <span style={{ color: "#ff00ea", marginRight: "20px" }}>⬤ tps: {latestData.tps} %</span>
      <span style={{ color: "#ff6200" }}>⬤ map: {latestData.map}kPA</span>
    </div>
  );

  return (
    <div style={{ width: "615px", backgroundColor: "white", padding: "10px", borderRadius: "8px" }}>
      <ResponsiveContainer width="100%" height={215}>
        <LineChart data={data} strokeWidth={3}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" orientation="left" stroke="#ff00ea" domain={[0, 100]} label={{ value: "Tps %", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#ff6200" domain={[0, 120]} label={{ value: "Map kPA", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend content={renderLegend} />
          <Line type="monotone" dataKey="tps" stroke="#ff00ea" yAxisId="left" strokeWidth={3}/>
          <Line type="monotone" dataKey="map" stroke="#ff6200" yAxisId="right" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Tpsmapchart;
