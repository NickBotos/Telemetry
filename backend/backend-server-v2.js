const express = require("express");
const cors = require("cors");
const { SerialPort, ReadlineParser } = require("serialport");
const WebSocket = require("ws");


const app = express();
const port = 3000;

app.use(cors());

// Set up SerialPort
const serialPort = new SerialPort({
  path: "COM13", 
  baudRate: 115200,
});

const parser = serialPort.pipe(new ReadlineParser({delimiter:"\n"}));

// Store sensor data
let sensorData = {
  laptime: 0,
  chassisTemp: 0,
  frontBrakePress: 0,
  rearBrakePress: 0,
  outerFRIR: 0,
  innerFRIR : 0,
  centerFRIR : 0,
  outerFLIR : 0,
  innerFLIR : 0,
  centerFLIR : 0,
  outerRLIR : 0,
  innerRLIR : 0,
  centerRLIR : 0,
  outerRRIR : 0,
  innerRRIR : 0,
  centerRRIR : 0,
  Speed : 0,
  gear : 0,
  rpm : 0,
  map : 0,
  lamda : 0,
  fuelUsed : 0,
  fuelPress : 0,
  ignitionTiming : 0,
  oilPress : 0,
  oilTemp : 0,
  iat : 0,
  tps : 0,
  batV : 0,
  coolantTemp : 0,
  liveDelta: 0,
};

// WebSocket Server
const wss = new WebSocket.Server({ port: 3001});

wss.on("connection", (ws) => {
  console.log("A device connected to WebSocket");

  // Send the latest data immediately upon connection
  ws.send(JSON.stringify(sensorData));

  ws.on("close", () => {
    console.log("A device disconnected");
  });
});

// Broadcast to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// serial data and broadcast
parser.on("data", (data) => {
  try {
    const values = data.trim().split(" ");
    if (values.length === 31) {
      sensorData = {
        laptime: parseFloat(values[0]),
        chassisTemp: parseFloat(values[1]),
        frontBrakePress: parseFloat(values[2]),
        rearBrakePress: parseFloat(values[3]),
        outerFRIR: parseFloat(values[4]),
        innerFRIR: parseFloat(values[5]),
        centerFRIR: parseFloat(values[6]),
        outerFLIR: parseFloat(values[7]),
        innerFLIR: parseFloat(values[8]),
        centerFLIR: parseFloat(values[9]),
        outerRLIR: parseFloat(values[10]),
        innerRLIR: parseFloat(values[11]),
        centerRLIR: parseFloat(values[12]),
        outerRRIR: parseFloat(values[13]),
        innerRRIR: parseFloat(values[14]),
        centerRRIR: parseFloat(values[15]),
        speed: parseFloat(values[16]),
        gear: parseInt(values[17]),
        rpm: parseInt(values[18]),
        map: parseInt(values[19]),
        lambda: parseFloat(values[20]),
        fuelUsed: parseInt(values[21]),
        fuelPress: parseInt(values[22]),
        ignitionTiming: parseInt(values[23]),
        oilPress: parseInt(values[24]),
        oilTemp: parseInt(values[25]),
        iat: parseInt(values[26]),
        tps: parseInt(values[27]),
        batV: parseInt(values[28]),
        coolantTemp: parseInt(values[29]),
        liveDelta: parseFloat(values[30]),
      };
      console.log("Parsed Data:", sensorData);
    }

      // Broadcast new data to all connected WebSocket clients
      broadcast(sensorData);
    }
    catch (error) {
    console.error("Error parsing data:", error);
  }
});

// API for testing
app.get("/api", (req, res) => {
  res.json(sensorData);
});

app.listen(port, () => {
  console.log(`Server running on http://192.168.0.111:${port}`);
});