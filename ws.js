let ws;
let myId = "bike01";

function startOnline() {
  canvas.style.display = "block";
  document.getElementById("info").innerText = "Modo ONLINE";

  ws = new WebSocket("ws://localhost:3000"); // luego Render

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: "join",
      room: "TEST",
      playerId: myId
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === "state") {
      render(data.players[myId].distance);
    }
  };
}
