import React, { useEffect, useState } from "react";
import "./amaji.css";
import amajiImg from "./amaji.png";


const WheelTemperature = () => {
  const [latestData, setLatestData] = useState({
    innerFRIR: "N/A",
    outerFRIR: "N/A",
    centerFRIR: "N/A",
    innerFLIR: "N/A",
    outerFLIR: "N/A",
    centerFLIR: "N/A",
    innerRLIR: "N/A",
    outerRLIR: "N/A",
    centerRLIR: "N/A",
    innerRRIR: "N/A",
    outerRRIR: "N/A",
    centerRRIR: "N/A",
    chassisTemp: "N/A",
  });

  const getBoxColor = (temp) => {
    if (temp < 40) return "#3cfa62";
    if (temp < 45) return "#68fa3c";
    if (temp < 50) return "#b4fa3c";
    if (temp < 55) return "#fafa3c";
    if (temp < 60) return "#fac13c";
    if (temp < 65) return "#fa983c";
    if (temp < 70) return "#fa423c";
    if (temp >= 70) return "#fc0f08";
    return "black";
  };

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://192.168.0.199:3001");

      socket.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          setLatestData((prevData) => ({
            innerFLIR: typeof newData.innerFLIR === "number" ? newData.innerFLIR : prevData.innerFLIR,
            outerFLIR: typeof newData.outerFLIR === "number" ? newData.outerFLIR : prevData.outerFLIR,
            centerFLIR: typeof newData.centerFLIR === "number" ? newData.centerFLIR : prevData.centerFLIR,
            innerFRIR: typeof newData.innerFRIR === "number" ? newData.innerFRIR : prevData.innerFRIR,
            outerFRIR: typeof newData.outerFRIR === "number" ? newData.outerFRIR : prevData.outerFRIR,
            centerFRIR: typeof newData.centerFRIR === "number" ? newData.centerFRIR : prevData.centerFRIR,
            innerRLIR: typeof newData.innerRLIR === "number" ? newData.innerRLIR : prevData.innerRLIR,
            outerRLIR: typeof newData.outerRLIR === "number" ? newData.outerRLIR : prevData.outerRLIR,
            centerRLIR: typeof newData.centerRLIR === "number" ? newData.centerRLIR : prevData.centerRLIR,
            innerRRIR: typeof newData.innerRRIR === "number" ? newData.innerRRIR : prevData.innerRRIR,
            outerRRIR: typeof newData.outerRRIR === "number" ? newData.outerRRIR : prevData.outerRRIR,
            centerRRIR: typeof newData.centerRRIR === "number" ? newData.centerRRIR : prevData.centerRRIR,
            chassisTemp: typeof newData.chassisTemp === "number" ? newData.chassisTemp : prevData.chassisTemp,
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
      <img src={amajiImg} className="Car" alt="Car" />

      {/* Front Left Wheel */}
      <div className="fl">
        <div className="fli" style={{ backgroundColor: getBoxColor(latestData.innerFLIR) }}></div>
        <div className="flinner">{latestData.innerFLIR}°C</div>
        <div className="flc" style={{ backgroundColor: getBoxColor(latestData.centerFLIR) }}></div>
        <div className="flcenter">{latestData.centerFLIR}°C</div>
        <div className="flo" style={{ backgroundColor: getBoxColor(latestData.outerFLIR) }}></div>
        <div className="flouter">{latestData.outerFLIR}°C</div>
      </div>

      {/* Front Right Wheel */}
      <div className="fr">
        <div className="fri" style={{ backgroundColor: getBoxColor(latestData.innerFRIR) }}></div>
        <div className="frinner">{latestData.innerFRIR}°C</div>
        <div className="frc" style={{ backgroundColor: getBoxColor(latestData.centerFRIR) }}></div>
        <div className="frcenter">{latestData.centerFRIR}°C</div>
        <div className="fro" style={{ backgroundColor: getBoxColor(latestData.outerFRIR) }}></div>
        <div className="frouter">{latestData.outerFRIR}°C</div>
      </div>

      {/*Chassis temperature*/}
        <div className="chassistemp" >{latestData.chassisTemp}°C</div>

      {/* Rear Left Wheel */}
      <div className="rl">
        <div className="rli" style={{ backgroundColor: getBoxColor(latestData.innerRLIR) }}></div>
        <div className="rlinner">{latestData.innerRLIR}°C</div>
        <div className="rlc" style={{ backgroundColor: getBoxColor(latestData.centerRLIR) }}></div>
        <div className="rlcenter">{latestData.centerRLIR}°C</div>
        <div className="rlo" style={{ backgroundColor: getBoxColor(latestData.outerRLIR) }}></div>
        <div className="rlouter">{latestData.outerRLIR}°C</div>
      </div>

      {/* Rear Right Wheel */}
      <div className="rr">
        <div className="rri" style={{ backgroundColor: getBoxColor(latestData.innerRRIR) }}></div>
        <div className="rrinner">{latestData.innerRRIR}°C</div>
        <div className="rrc" style={{ backgroundColor: getBoxColor(latestData.centerRRIR) }}></div>
        <div className="rrcenter">{latestData.centerRRIR}°C</div>
        <div className="rro" style={{ backgroundColor: getBoxColor(latestData.outerRRIR) }}></div>
        <div className="rrouter">{latestData.outerRRIR}°C</div>
      </div>
    </div>
  );
};

export default WheelTemperature;