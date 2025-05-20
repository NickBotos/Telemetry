import "./dashboard.css";
import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import Laptimelist from "./Laptimelist";
import Bar from "./Bar";
import Oilchart from "./Oilpressure-Oiltemp-Chart";
import Tpsmapchart from "./Tps-map-chart";
import BatteryLambdaChart from "./Battery-Lambda-chart";
import "./amaji.css"
import WheelTemperature from "./Wheel-temp-diagram";
import Warning from "./icons-notifications";
import Other from "./other";
import Delta from "./Delta";


function App() {
  return (
  <div className="App" style={{ backgroundColor: "#white"}}>
      <Bar />
      <div className="container">
        <div className="left-section">
      <ErrorBoundary>
      < Oilchart/>
      </ErrorBoundary>
      <ErrorBoundary>
      <Tpsmapchart/>
      </ErrorBoundary>
      <ErrorBoundary>
      <BatteryLambdaChart/>
      </ErrorBoundary>
        </div>
      </div>
      <div className="right-section">
        <WheelTemperature/>
        <Warning/>
        <Other/>

      </div>
      <div className="middle-section">
      <Laptimelist/>
      <Delta/>
      </div>
  </div>
  );
}

export default App;