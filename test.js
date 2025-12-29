function startTest() {
  document.getElementById("info").innerText = "TEST NodeMCU";
  canvas.style.display = "none";

  ws = new WebSocket("ws://localhost:3000");

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === "pulse") {
      document.getElementById("info").innerText =
        `Pulsos recibidos: ${data.value}`;
    }
  };
}
