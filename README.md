# 🌡️ Temperature & Humidity WebSocket Dashboard
This project is a real-time dashboard for displaying temperature and humidity data using WebSocket communication between a Python server and a web client. The client visualizes the data using animated gauges.

# 📦 Features
- Real-time updates using WebSocket protocol (ws://)
- Displays:
  - Temperature gauge
  - Humidity gauge
- Simple frontend with Gauge.js
- Lightweight backend using raw Python socket (no external dependencies)
- Custom OID parsing and decoding from SNMP-style payloads

# 🖥️ Web Client (Frontend)
The frontend is written in HTML + JavaScript.

## What it does:
- Connects to a WebSocket server (ws://192.168.103.167:1880/ws/temphumid)
- Parses incoming JSON data
- Decodes hex data into readable temperature and humidity values
- Displays data on two animated gauges using Gauge.js

## Example Payload Format:
```bash
[
  {
    "payload": [
      {
        "oid": "1.3.6.1.4.1.34672.1.0",
        "value": { "data": [53, 50, 46, 49] } // represents string "52.1"
      },
      {
        "oid": "1.3.6.1.4.1.34672.2.0",
        "value": { "data": [54, 48, 46, 57] } // represents string "60.9"
      }
    ]
  }
]
```
# 🐍 Python WebSocket Server (Backend)
The backend is a minimal WebSocket server written using Python's built-in socket library.

## What it does:
- Listens on TCP port 80
- Performs a WebSocket handshake (RFC6455)
- Accepts messages from a WebSocket client
- Decodes masked WebSocket frames from the client
- Prints payload data (useful for debugging)

### 🛠️ Requirements
- Python 3.x
- A modern browser
- Local WebSocket server setup at ws://192.168.103.167:1880/ws/temphumid
- Place gauge.min.js in the project directory

# 📁 File Structure
```bash
project/
│
├── index.html        # Main HTML page with canvas for gauges
├── app.js            # JavaScript logic (WebSocket, parsing, rendering)
├── gauge.min.js      # Gauge library (download from Gauge.js repo)
├── server.py         # Minimal WebSocket server using Python sockets
└── README.md         # This file
```
# 🚀 Getting Started
Run the server:
```bash
sudo python3 server.py
```

## Open the HTML file:
```bash
open index.html
```
Ensure the client connects to the correct WebSocket endpoint.

# 📌 Notes
- This project is designed primarily for local LAN testing.
- For production use, switch to wss:// (WebSocket over TLS) and implement proper authentication and security.
- Ensure that port 1880 is open and not blocked by firewalls or network restrictions.
- The Python server code is minimal and intended for demonstration purposes — it only reads and prints messages received from the client.
- The client-side JavaScript expects a specific JSON structure and predefined OIDs for temperature and humidity data.
- Update IP addresses and ports in the code to match your local network configuration.
- The gauge charts are smoothly animated and include color-coded ranges to visually indicate normal, warning, and critical values.
