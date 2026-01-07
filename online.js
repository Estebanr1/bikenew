import {
  ref,
  set,
  update,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* =========================
   ESTADO ONLINE
========================= */

let roomId = null;
let playerId = null;
let onlineMode = false;
let roomListener = null;

/*
Estas variables DEBEN existir en tu juego:
- speed
- distance
- startRace()
- updateRival(data)
*/

/* =========================
   CREAR SALA
========================= */
window.createOnlineRoom = async function () {
  roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  playerId = "p1";
  onlineMode = true;

  await set(ref(db, "rooms/" + roomId), {
    status: "waiting",
    createdAt: Date.now(),
    players: {
      p1: {
        speed: 0,
        distance: 0,
        lastUpdate: Date.now()
      }
    }
  });

  if (typeof showRoomCode === "function") {
    showRoomCode(roomId);
  }

  listenRoom();
};

/* =========================
   UNIRSE A SALA
========================= */
window.joinOnlineRoom = async function (code) {
  if (!code) return;

  roomId = code.toUpperCase();
  playerId = "p2";
  onlineMode = true;

  await update(ref(db, "rooms/" + roomId), {
    status: "playing",
    "players/p2": {
      speed: 0,
      distance: 0,
      lastUpdate: Date.now()
    }
  });

  listenRoom();
};

/* =========================
   ESCUCHAR SALA
========================= */
function listenRoom() {
  const roomRef = ref(db, "rooms/" + roomId);

  roomListener = onValue(roomRef, snap => {
    const data = snap.val();
    if (!data) return;

    if (data.status === "playing" && typeof startRace === "function") {
      startRace();
    }

    const rivalId = playerId === "p1" ? "p2" : "p1";
    const rival = data.players?.[rivalId];

    if (rival && typeof updateRival === "function") {
      updateRival(rival);
    }
  });
}

/* =========================
   ENVIAR ESTADO (LLAMAR EN TU LOOP)
========================= */
window.sendOnlineState = function () {
  if (!onlineMode || !roomId || !playerId) return;

  update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    speed,
    distance,
    lastUpdate: Date.now()
  });
};

/* =========================
   SALIR DE SALA
========================= */
window.leaveOnlineRoom = async function () {
  onlineMode = false;

  if (roomListener) {
    roomListener();
    roomListener = null;
  }

  if (roomId) {
    await remove(ref(db, "rooms/" + roomId));
  }

  roomId = null;
  playerId = null;
};

/* =========================
   UTILIDAD
========================= */
window.isOnline = function () {
  return onlineMode;
};
