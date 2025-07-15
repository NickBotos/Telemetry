const express = require("express");
const cors = require("cors");
const { SerialPort, ReadlineParser } = require("serialport");
const WebSocket = require("ws");

const app = express();
const port = 3000;

app.use(cors());

// Set up SerialPort and parser
const serialPort = new SerialPort({
  path: "COM4",
  baudRate: 115200,
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Sensor data object
let sensorData = {
  laptime: 0,
  chassisTemp: 0,
  frontBrakePress: 0,
  rearBrakePress: 0,
  outerFRIR: 0,
  innerFRIR: 0,
  centerFRIR: 0,
  outerFLIR: 0,
  innerFLIR: 0,
  centerFLIR: 0,
  outerRLIR: 0,
  innerRLIR: 0,
  centerRLIR: 0,
  outerRRIR: 0,
  innerRRIR: 0,
  centerRRIR: 0,
  speed: 0,
  gear: 0,
  rpm: 0,
  map: 0,
  lambda: 0,
  fuelUsed: 0,
  fuelPress: 0,
  ignitionTiming: 0,
  oilPress: 0,
  oilTemp: 0,
  iat: 0,
  tps: 0,
  batV: 0,
  coolantTemp: 0,
  liveDelta: 0,
};

// WebSocket server
const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.send(JSON.stringify(sensorData));

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Broadcast to all connected WebSocket clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Handle incoming serial data
parser.on("data", (data) => {
  try {
    const values = data.trim().split(" ");
    if (values.length === 13) {
      sensorData = {
        //laptime: parseInt(values[0]),
        chassisTemp: parseInt(values[0]),
        // frontBrakePress: parseInt(values[2]),
        // rearBrakePress: parseInt(values[3]),
        // outerFRIR: parseInt(values[1]),
        // innerFRIR: parseInt(values[2]),
        // centerFRIR: parseInt(values[3]),
        // outerFLIR: parseInt(values[4]),
        // innerFLIR: parseInt(values[5]),
        // centerFLIR: parseInt(values[6]),
        // outerRLIR: parseInt(values[7]),
        // innerRLIR: parseInt(values[8]),
        // centerRLIR: parseInt(values[9]),
        // outerRRIR: parseInt(values[10]),
        // innerRRIR: parseInt(values[11]),
        // centerRRIR: parseInt(values[12]),
        //speed: parseInt(values[0]),
        gear: parseInt(values[1]),
        rpm: parseInt(values[2]),
        map: parseFloat(values[3]),
        lambda: parseFloat(values[4]),
        fuelUsed: parseInt(values[5]),
        fuelPress: parseInt(values[6]),
        //ignitionTiming: parseInt(values[8]),
        oilPress: parseFloat(values[7]),
        oilTemp: parseInt(values[8]),
        iat: parseFloat(values[9]),
        tps: parseInt(values[10]),
        batV: parseFloat(values[11]),
        coolantTemp: parseInt(values[12]),
        //liveDelta: parseInt(values[30]),

        //testing onlymd
        
        // laptime: parseInt(values[0]),
        // chassisTemp: parseInt(values[1]),
        // frontBrakePress: parseInt(values[2]),
        // rearBrakePress: parseInt(values[3]),
        // outerFRIR: parseInt(values[4]),
        // innerFRIR: parseInt(values[5]),
        // centerFRIR: parseInt(values[6]),
        // outerFLIR: parseInt(values[7]),
        // innerFLIR: parseInt(values[8]),
        // centerFLIR: parseInt(values[9]),
        // outerRLIR: parseInt(values[10]),
        // innerRLIR: parseInt(values[11]),
        // centerRLIR: parseInt(values[12]),
        // outerRRIR: parseInt(values[13]),
        // innerRRIR: parseInt(values[14]),
        // centerRRIR: parseInt(values[15]),
        // speed: parseInt(values[16]),
        // gear: parseInt(values[17]),
        // rpm: parseInt(values[18]),
        // map: parseInt(values[19]),
        // lambda: parseInt(values[20]),
        // fuelUsed: parseInt(values[21]),
        // fuelPress: parseInt(values[22]),
        // ignitionTiming: parseInt(values[23]),
        // oilPress: parseInt(values[24]),
        // oilTemp: parseInt(values[25]),
        // iat: parseInt(values[26]),
        // tps: parseInt(values[27]),
        // batV: parseInt(values[28]),
        // coolantTemp: parseInt(values[29]),
        // liveDelta: parseInt(values[30]),
      };
      console.log("Parsed Data:", sensorData);
      broadcast(sensorData);
    }
  } catch (error) {
    console.error("Error parsing data:", error);
  }
});

// REST API to get latest data
app.get("/api", (req, res) => {
  res.json(sensorData);
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on http://192.168.0.199:${port}`);
});

// serialPort.on("data", (data) => {
//   buffer = Buffer.concat([buffer, data]);

//   // process full packets (67 bytes)
//   while (buffer.length >= 67) {
//     const packet = buffer.slice(0, 67);
//     buffer = buffer.slice(67);

//     try {
//       sensorData = parseSensorData(packet);
//       console.log("Parsed Data:", sensorData);
//       broadcast(sensorData);
//     } catch (error) {
//       console.error("Error parsing packet:", error);
//     }
//   }
// });

// function parseSensorData(buffer) {
//   let offset = 0;

//   return {
//     laptime: buffer.readUInt16LE(offset), offset += 2,
//     chassisTemp: buffer.readUInt16LE(offset), offset += 2,
//     frontBrakePress: buffer.readUInt16LE(offset), offset += 2,
//     rearBrakePress: buffer.readUInt16LE(offset), offset += 2,

//     outerFRIR: buffer.readUInt16LE(offset), offset += 2,
//     innerFRIR: buffer.readUInt16LE(offset), offset += 2,
//     centerFRIR: buffer.readUInt16LE(offset), offset += 2,
//     outerFLIR: buffer.readUInt16LE(offset), offset += 2,
//     innerFLIR: buffer.readUInt16LE(offset), offset += 2,
//     centerFLIR: buffer.readUInt16LE(offset), offset += 2,
//     outerRLIR: buffer.readUInt16LE(offset), offset += 2,
//     innerRLIR: buffer.readUInt16LE(offset), offset += 2,
//     centerRLIR: buffer.readUInt16LE(offset), offset += 2,
//     outerRRIR: buffer.readUInt16LE(offset), offset += 2,
//     innerRRIR: buffer.readUInt16LE(offset), offset += 2,
//     centerRRIR: buffer.readUInt16LE(offset), offset += 2,

//     speed: buffer.readUInt16LE(offset), offset += 2,
//     gear: buffer.readUInt16LE(offset), offset += 2,
//     rpm: buffer.readUInt32LE(offset), offset += 4,
//     map: buffer.readUInt16LE(offset), offset += 2,
//     lambda: buffer.readUInt16LE(offset), offset += 2,
//     fuelUsed: buffer.readUInt16LE(offset), offset += 2,
//     fuelPress: buffer.readUInt32LE(offset), offset += 4,
//     ignitionTiming: buffer.readUInt16LE(offset), offset += 2,
//     oilPress: buffer.readUInt32LE(offset), offset += 4,
//     oilTemp: buffer.readUInt32LE(offset), offset += 4,
//     iat: buffer.readUInt16LE(offset), offset += 2,
//     tps: buffer.readUInt16LE(offset), offset += 2,
//     batV: buffer.readUInt32LE(offset), offset += 4,
//     coolantTemp: buffer.readUInt8(offset), offset += 1,
//     liveDelta: buffer.readUInt16LE(offset), offset += 2,
//   };
// }

// // API for debugging
// app.get("/api", (req, res) => {
//   res.json(sensorData);
// });

// app.listen(port, () => {
//   console.log(`Server running on http://192.168.0.199:${port}`);
// });
// const express = require("express");
// const cors = require("cors");
// const { SerialPort } = require("serialport");
// const WebSocket = require("ws");

// const app = express();
// const port = 3000;

// app.use(cors());

// // Set up SerialPort
// const serialPort = new SerialPort({
//   path: "COM5",
//   baudRate: 115200,
// });

// let buffer = Buffer.alloc(0);

// // Default sensor data
// let sensorData = {
//   laptime: 0,
//   chassisTemp: 0,
//   frontBrakePress: 0,
//   rearBrakePress: 0,
//   outerFRIR: 0,
//   innerFRIR: 0,
//   centerFRIR: 0,
//   outerFLIR: 0,
//   innerFLIR: 0,
//   centerFLIR: 0,
//   outerRLIR: 0,
//   innerRLIR: 0,
//   centerRLIR: 0,
//   outerRRIR: 0,
//   innerRRIR: 0,
//   centerRRIR: 0,
//   speed: 0,
//   gear: 0,
//   rpm: 0,
//   map: 0,
//   lambda: 0,
//   fuelUsed: 0,
//   fuelPress: 0,
//   ignitionTiming: 0,
//   oilPress: 0,
//   oilTemp: 0,
//   iat: 0,
//   tps: 0,
//   batV: 0,
//   coolantTemp: 0,
//   liveDelta: 0,
// };

// // WebSocket Server
// const wss = new WebSocket.Server({ port: 3001 });

// wss.on("connection", (ws) => {
//   console.log("WebSocket client connected");
//   ws.send(JSON.stringify(sensorData));

//   ws.on("close", () => {
//     console.log("WebSocket client disconnected");
//   });
// });

// // Broadcast data to all WebSocket clients
// const broadcast = (data) => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// };

// // SerialPort buffer parsing
// serialPort.on("data", (data) => {
//   buffer = Buffer.concat([buffer, data]);

//   while (buffer.length >= 62) {
//     const packet = buffer.slice(0, 62);
//     buffer = buffer.slice(62);

//     try {
//       sensorData = parseSensorData(packet);
//       console.log("Parsed Data:", sensorData);
//       broadcast(sensorData);
//     } catch (err) {
//       console.error("Parsing error:", err);
//     }
//   }
// });

// // Helper parser
// // function parseSensorData(buffer) {
// //   let offset = 0;

// //   const read16 = () => {
// //     const val = buffer.readUInt16LE(offset);
// //     offset += 2;
// //     return val;
// //   };

// //   const read32 = () => {
// //     const val = buffer.readUInt32LE(offset);
// //     offset += 4;
// //     return val;
// //   };

// //   const read8 = () => {
// //     const val = buffer.readUInt8(offset);
// //     offset += 1;
// //     return val;
// //   };

// //   return {
// //     laptime: read16(),
// //     chassisTemp: read16(),
// //     frontBrakePress: read16(),
// //     rearBrakePress: read16(),
// //     outerFRIR: read16(),
// //     innerFRIR: read16(),
// //     centerFRIR: read16(),
// //     outerFLIR: read16(),
// //     innerFLIR: read16(),
// //     centerFLIR: read16(),
// //     outerRLIR: read16(),
// //     innerRLIR: read16(),
// //     centerRLIR: read16(),
// //     outerRRIR: read16(),
// //     innerRRIR: read16(),
// //     centerRRIR: read16(),
// //     speed: read16(),
// //     gear: read16(),
// //     rpm: read16(),
// //     map: read16(),
// //     lambda: read16(),
// //     fuelUsed: read16(),
// //     fuelPress: read16(),
// //     ignitionTiming: read16(),
// //     oilPress: read16(),
// //     oilTemp: read16(),
// //     iat: read16(),
// //     tps: read16(),
// //     batV: read16(),
// //     coolantTemp: read16(),
// //     liveDelta: read16(),
// //   };
// // }

// function parseSensorData(buffer) {
//   let offset = 0;
//   const read16 = () => buffer.readUInt16LE(offset += 2 - 2);
  
//   return {
//     laptime: read16(),
//     chassisTemp: read16(),
//     frontBrakePress: read16(),
//     rearBrakePress: read16(),
//     outerFRIR: read16(),
//     innerFRIR: read16(),
//     centerFRIR: read16(),
//     outerFLIR: read16(),
//     innerFLIR: read16(),
//     centerFLIR: read16(),
//     outerRLIR: read16(),
//     innerRLIR: read16(),
//     centerRLIR: read16(),
//     outerRRIR: read16(),
//     innerRRIR: read16(),
//     centerRRIR: read16(),
//     speed: read16(),
//     gear: read16(),
//     rpm: read16(),
//     map: read16(),
//     lambda: read16(),
//     fuelUsed: read16(),
//     fuelPress: read16(),
//     ignitionTiming: read16(),
//     oilPress: read16(),
//     oilTemp: read16(),
//     iat: read16(),
//     tps: read16(),
//     batV: read16(),
//     coolantTemp: read16(),
//     liveDelta: read16(),
//   };
// }

// // REST API to get latest data
// app.get("/api", (req, res) => {
//   res.json(sensorData);
// });

// app.listen(port, () => {
//   console.log(`Server running on http://192.168.0.199:${port}`);
// });
