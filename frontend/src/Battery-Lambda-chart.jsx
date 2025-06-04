import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const BatteryLambdaChart = () => {
  const [data, setData] = useState([]);
  const latestData = data.length > 0 ? data[data.length - 1] : { lambda: "N/A", battery: "N/A" };

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://192.168.0.199:3001");
      socket.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          console.log("Received data:", newData);

          if (newData.lambda !== undefined && newData.batV !== undefined) {
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
      <span style={{ color: "#3a029c", marginRight: "20px" }}>⬤ lambda: {latestData.lambda} </span>
      <span style={{ color: "#fcbe03" }}>⬤ battery: {latestData.batV} V</span>
    </div>
  );

  return (
    <div style={{ width: "615px", backgroundColor: "white", padding: "10px", borderRadius: "8px" }}>
      <ResponsiveContainer width="100%" height={215}>
        <LineChart data={data} strokeWidth={3}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" orientation="left" stroke="#3a029c" domain={[0, 1.7]} label={{ value: "lambda", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#fcbe03" domain={[0, 20]} label={{ value: "Battery V", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend content={renderLegend} />
          <Line type="monotone" dataKey="lambda" stroke="#3a029c" yAxisId="left" strokeWidth={3} />
          <Line type="monotone" dataKey="batV" stroke="#fcbe03" yAxisId="right" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BatteryLambdaChart;
