import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Oilchart = () => {
  const [data, setData] = useState([]);
  const latestData = data.length > 0 ? data[data.length - 1] : { oilPress: "N/A", oilTemp: "N/A" };

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

  // Custom Legend Renderer
  const renderLegend = () => (
    <div style={{ textAlign: "center", color: "white", paddingBottom: "5px" }}>
      <span style={{ color: "#ff0004", marginRight: "20px" }}>⬤ oilPress: {latestData.oilPress} kPa</span>
      <span style={{ color: "#036bfc" }}>⬤ oilTemp: {latestData.oilTemp}°C</span>
    </div>
  );

  return (
    <div style={{ width: "615px", backgroundColor: "white", padding: "10px", borderRadius: "8px" ,}}>
      <ResponsiveContainer width="100%" height={215}>
        <LineChart data={data} strokeWidth={3}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" orientation="left" stroke="#ff0004" domain={[0, 700]} label={{ value: "Oil Pressure (kPa)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#036bfc" domain={[50, 150]} label={{ value: "Oil Temp (°C)", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend content={renderLegend} />
          <Line type="monotone" dataKey="oilPress" stroke="#ff0004" yAxisId="left" strokeWidth={3}/>
          <Line type="monotone" dataKey="oilTemp" stroke="#036bfc" yAxisId="right" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Oilchart;
