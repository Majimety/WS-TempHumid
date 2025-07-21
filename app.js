// Connect to server
let ws = new WebSocket("ws://192.168.103.167:1880/ws/temphumid") // Local server
// ws = new WebSocket("wss://game.example.com/scoreboard") // Remote server

ws.onopen = () => {
    console.log("Connection opened")
}

ws.onmessage = (event) => {
    console.log("Data received", event.data)
    const data = JSON.parse(event.data);
    const { tempValue, humidValue } = transferData(data);
    console.log('after transferData', { tempValue, humidValue } );
    
    
    if (tempValue !== null) {
        gauge_temp.set(tempValue); 
    }
    if (humidValue !== null) {
        gauge_humid.set(humidValue);
    }
}

ws.onclose = (event) => {
    console.log("Connection closed", event.code, event.reason, event.wasClean)
}

ws.onerror = () => {
    console.log("Connection closed due to error")
}

const opts = {
    angle: -0.2, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#000000' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6F6EA0',   // Colors
    colorStop: '#C0C0DB',    // just experiment with them
    strokeColor: '#EEEEEE',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
    staticLabels: {
        font: "12px sans-serif",  // Specifies font
        labels: [0, 10, 20, 30, 40, 50, 60],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
      },
  };

  const targetTemp = document.getElementById('gaugeTemp'); // your canvas element
  const targetHumid = document.getElementById('gaugeHumid'); // your canvas element
  const gauge_temp = new Gauge(targetTemp).setOptions(opts); // create sexy gauge!
  const gauge_humid = new Gauge(targetHumid).setOptions(opts); // create sexy gauge!

  gauge_temp.maxValue = 50; // set max gauge value
  gauge_temp.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge_temp.animationSpeed = 32; // set animation speed (32 is default value)

  gauge_humid.maxValue = 60; // set max gauge value
  gauge_humid.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge_humid.animationSpeed = 32; // set animation speed (32 is default value)  
  //gauge_temp.set();
  //gauge_humid.set();

  function hex2a(hexx) {
    var str = '';
    for (let i = 0; i < hexx.length; i++)
        str += String.fromCharCode(hexx[i]);
    return str;
}

function transferData(data) {
    let tempValue = null;
    let humidValue = null;

    data.forEach(item => {
        const payload = item.payload[0];
        const oid = payload.oid;
        const valueBuffer = payload.value.data;
        const strValue = hex2a(valueBuffer);

        if (oid === "1.3.6.1.4.1.34672.1.0") {
            tempValue = parseFloat(strValue);
        } else if (oid === "1.3.6.1.4.1.34672.2.0") {
            humidValue = parseFloat(strValue);
    }
    });
    return {
        tempValue,
        humidValue
    }
}