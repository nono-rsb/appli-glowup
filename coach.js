/* ============================================================
   GlowUp — Coach caméra
   Détection de pose (MediaPipe Tasks Vision) pour compter
   automatiquement les pompes et les squats + feedback de posture.
   ============================================================ */

const $ = (s) => document.querySelector(s);

const overlay = $("#coachOverlay");
const video = $("#coachVideo");
const canvas = $("#coachCanvas");
const ctx = canvas.getContext("2d");
const countEl = $("#coachCount");
const fbEl = $("#coachFeedback");
const statusEl = $("#coachStatus");

let landmarker = null;      // PoseLandmarker
let stream = null;          // MediaStream
let running = false;
let rafId = null;
let exo = "squat";          // "squat" | "pushup"
let reps = 0;
let phase = "up";           // machine à états haut/bas
let lastVideoTime = -1;

/* ---- Utilitaires géométrie ---- */
function angle(a, b, c) {
  // angle au point b (en degrés) entre a-b-c
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const mag = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y);
  if (mag === 0) return 180;
  let cos = dot / mag;
  cos = Math.max(-1, Math.min(1, cos));
  return Math.acos(cos) * 180 / Math.PI;
}
function vis(p) { return p && (p.visibility === undefined || p.visibility > 0.4); }

/* Indices MediaPipe Pose */
const L = { sh: 11, el: 13, wr: 15, hip: 23, knee: 25, ank: 27 };
const R = { sh: 12, el: 14, wr: 16, hip: 24, knee: 26, ank: 28 };

/* ---- Feedback UI ---- */
function setFeedback(text, type) {
  fbEl.textContent = text;
  fbEl.className = "coach-feedback" + (type ? " " + type : "");
}
function setStatus(t) { statusEl.textContent = t; }

/* ---- Logique de comptage ---- */
function processSquat(lm) {
  const legs = [];
  if (vis(lm[L.hip]) && vis(lm[L.knee]) && vis(lm[L.ank])) legs.push(angle(lm[L.hip], lm[L.knee], lm[L.ank]));
  if (vis(lm[R.hip]) && vis(lm[R.knee]) && vis(lm[R.ank])) legs.push(angle(lm[R.hip], lm[R.knee], lm[R.ank]));
  if (!legs.length) { setFeedback("Recule pour montrer tes jambes", "warn"); return; }
  const kneeAngle = legs.reduce((a, b) => a + b, 0) / legs.length;
  if (phase === "up" && kneeAngle < 95) { phase = "down"; setFeedback("Bien bas 👍", "good"); }
  else if (phase === "down" && kneeAngle > 160) { phase = "up"; addRep(); }
  else if (phase === "up") { setFeedback(kneeAngle < 140 ? "Descends encore…" : "Prêt·e"); }
}
function processPushup(lm) {
  const arms = [];
  if (vis(lm[L.sh]) && vis(lm[L.el]) && vis(lm[L.wr])) arms.push(angle(lm[L.sh], lm[L.el], lm[L.wr]));
  if (vis(lm[R.sh]) && vis(lm[R.el]) && vis(lm[R.wr])) arms.push(angle(lm[R.sh], lm[R.el], lm[R.wr]));
  if (!arms.length) { setFeedback("Montre tes bras à la caméra", "warn"); return; }
  const elbow = arms.reduce((a, b) => a + b, 0) / arms.length;
  if (phase === "up" && elbow < 95) { phase = "down"; setFeedback("Descends bien 👍", "good"); }
  else if (phase === "down" && elbow > 158) { phase = "up"; addRep(); }
  else if (phase === "up") { setFeedback(elbow < 140 ? "Plie les coudes…" : "Prêt·e"); }
}
function addRep() {
  reps++;
  countEl.textContent = reps;
  $("#coachLog").textContent = `Valider (${reps})`;
  setFeedback("Rep ! 💥", "good");
  if (navigator.vibrate) navigator.vibrate(60);
}

/* ---- Dessin du squelette ---- */
const CONNECTIONS = [
  [11,12],[11,13],[13,15],[12,14],[14,16],
  [11,23],[12,24],[23,24],
  [23,25],[25,27],[24,26],[26,28],
];
function draw(lm) {
  canvas.width = video.videoWidth || canvas.clientWidth;
  canvas.height = video.videoHeight || canvas.clientHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 4; ctx.strokeStyle = "rgba(185,140,255,.9)";
  CONNECTIONS.forEach(([a, b]) => {
    if (vis(lm[a]) && vis(lm[b])) {
      ctx.beginPath();
      ctx.moveTo(lm[a].x * canvas.width, lm[a].y * canvas.height);
      ctx.lineTo(lm[b].x * canvas.width, lm[b].y * canvas.height);
      ctx.stroke();
    }
  });
  ctx.fillStyle = "#ff9ec7";
  lm.forEach(p => { if (vis(p)) { ctx.beginPath(); ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, 7); ctx.fill(); } });
}

/* ---- Boucle de détection ---- */
function loop() {
  if (!running) return;
  if (landmarker && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    try {
      const res = landmarker.detectForVideo(video, performance.now());
      if (res && res.landmarks && res.landmarks[0]) {
        const lm = res.landmarks[0];
        draw(lm);
        if (exo === "squat") processSquat(lm); else processPushup(lm);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setFeedback("Place-toi bien dans le cadre", "warn");
      }
    } catch (e) { /* frame ignorée */ }
  }
  rafId = requestAnimationFrame(loop);
}

/* ---- Chargement du modèle (lazy) ---- */
async function ensureModel() {
  if (landmarker) return true;
  setStatus("Chargement du modèle de détection…");
  try {
    const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14");
    const { PoseLandmarker, FilesetResolver } = vision;
    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    landmarker = await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
    setStatus("");
    return true;
  } catch (e) {
    setStatus("Impossible de charger le modèle (connexion requise). Réessaie en ligne.");
    return false;
  }
}

/* ---- Caméra ---- */
async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setStatus("La caméra n'est pas disponible dans ce contexte. Ouvre l'app en https ou installe-la.");
    return;
  }
  const ok = await ensureModel();
  if (!ok) return;
  try {
    setStatus("Activation de la caméra…");
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 }, audio: false });
    video.srcObject = stream;
    await video.play();
    running = true;
    $("#coachStart").textContent = "⏸ Pause";
    setStatus("Détection active — recule pour que tout ton corps soit visible.");
    loop();
  } catch (e) {
    setStatus("Accès caméra refusé. Autorise la caméra dans ton navigateur.");
  }
}
function stopCamera() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  video.srcObject = null;
  ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
  $("#coachStart").textContent = "▶ Démarrer la caméra";
}

/* ---- Contrôles ---- */
function renderExoSeg() {
  const seg = $("#coachExo");
  seg.innerHTML = "";
  [["squat", "🦵 Squats"], ["pushup", "💪 Pompes"]].forEach(([key, label]) => {
    const b = document.createElement("button");
    b.textContent = label;
    if (key === exo) b.classList.add("active");
    b.addEventListener("click", () => { exo = key; resetCount(); renderExoSeg(); });
    seg.appendChild(b);
  });
}
function resetCount() {
  reps = 0; phase = "up";
  countEl.textContent = "0";
  $("#coachLog").textContent = "Valider (0)";
  setFeedback(running ? "C'est parti !" : "Démarre la caméra");
}

function openCoach() {
  overlay.classList.add("open");
  renderExoSeg();
  resetCount();
  setStatus("");
}
function closeCoach() {
  stopCamera();
  overlay.classList.remove("open");
}

$("#coachBtn") && $("#coachBtn").addEventListener("click", openCoach);
$("#coachClose").addEventListener("click", closeCoach);
$("#coachStart").addEventListener("click", () => { running ? stopCamera() : startCamera(); });
$("#coachReset").addEventListener("click", resetCount);
$("#coachLog").addEventListener("click", () => {
  if (window.glowupLogReps) window.glowupLogReps(exo, reps);
  closeCoach();
});
