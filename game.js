const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function render(distance) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(distance * 20, 150, 40, 20);
}
