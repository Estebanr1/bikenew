let localDistance = 0;

function startLocal() {
  canvas.style.display = "block";
  document.getElementById("info").innerText = "Modo LOCAL";
  localDistance = 0;
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    localDistance += 0.1;
    render(localDistance);
  }
});
