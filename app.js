/* ============================================================
   GlowUp — app logique (vanilla JS, données locales)
   ============================================================ */

const STORE_KEY = "glowup.v1";
const todayKey = () => new Date().toISOString().slice(0, 10);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Contenu statique ---------- */

const QUOTES = [
  "La discipline bat la motivation. Montre-toi, même à 60%.",
  "Tu ne te compares qu'à la personne que tu étais hier.",
  "Les petits gestes répétés font les grandes transformations.",
  "Ton corps entend tout ce que ton esprit dit. Sois bienveillant·e.",
  "Le glow-up commence à l'intérieur : sommeil, eau, mouvement.",
  "1% mieux chaque jour = 37x mieux en un an.",
  "La constance est plus rare que le talent. Sois constant·e.",
  "Prends soin de toi comme de quelqu'un que tu aimes.",
];

const FOCUS_TEMPLATE = [
  { id: "eau", emoji: "💧", text: "Boire 2L d'eau" },
  { id: "sommeil", emoji: "😴", text: "7-8h de sommeil" },
  { id: "bouger", emoji: "🚶", text: "Bouger 30 min" },
  { id: "peau", emoji: "🧴", text: "Routine peau matin + soir" },
  { id: "ecran", emoji: "📵", text: "Pas d'écran 30 min avant de dormir" },
  { id: "posture", emoji: "🧍", text: "Corriger ma posture" },
];

const CHALLENGES = [
  { t: "Semaine hydratation", d: "2L d'eau par jour, 7 jours d'affilée. Ta peau te dira merci." },
  { t: "Semaine sommeil", d: "Au lit avant 23h chaque soir. Récupération = meilleure version." },
  { t: "Semaine posture", d: "Épaules en arrière, menton parallèle au sol. Rappel toutes les heures." },
  { t: "Semaine sans sucre ajouté", d: "Zéro sucre ajouté. Énergie stable, peau plus nette." },
  { t: "Semaine cardio", d: "20 min de marche rapide ou course chaque jour." },
];

const ROUTINE_MATIN = [
  "Boire un grand verre d'eau au réveil",
  "S'étirer 5 min / mobilité",
  "Nettoyant doux visage",
  "Crème hydratante + SPF ☀️",
  "Petit-déj protéiné",
  "Intention / objectif du jour",
];
const ROUTINE_SOIR = [
  "Double nettoyage visage",
  "Soin ciblé (sérum / hydratant)",
  "Brossage dents + fil dentaire",
  "Préparer la tenue de demain",
  "Journal / gratitude",
  "Écran off 30 min avant dodo",
];

const DEFAULT_HABITS = [
  { id: "h1", emoji: "💧", name: "Boire 2L d'eau" },
  { id: "h2", emoji: "🏋️", name: "Sport / mouvement" },
  { id: "h3", emoji: "🧴", name: "Skincare" },
  { id: "h4", emoji: "📖", name: "Lecture 10 min" },
  { id: "h5", emoji: "🧘", name: "Méditation / respiration" },
];

const HABIT_EMOJIS = ["💧","🏋️","🧴","📖","🧘","🥗","😴","🚶","☀️","💊","📵","✍️","🦷","🧍","🏃","🚫"];

const WORKOUTS = {
  "Full body": [
    { n: "Pompes", s: "4 × 12" },
    { n: "Squats", s: "4 × 15" },
    { n: "Fentes", s: "3 × 12/jambe" },
    { n: "Gainage", s: "3 × 45s" },
    { n: "Superman", s: "3 × 15" },
  ],
  "Haut du corps": [
    { n: "Pompes", s: "4 × max" },
    { n: "Dips (chaise)", s: "3 × 12" },
    { n: "Pike push-ups", s: "3 × 10" },
    { n: "Rowing élastique", s: "4 × 12" },
    { n: "Gainage latéral", s: "3 × 30s" },
  ],
  "Bas du corps": [
    { n: "Squats", s: "4 × 20" },
    { n: "Fentes bulgares", s: "3 × 10/jambe" },
    { n: "Hip thrust", s: "4 × 15" },
    { n: "Mollets", s: "4 × 20" },
    { n: "Chaise murale", s: "3 × 45s" },
  ],
  "Cardio / HIIT": [
    { n: "Jumping jacks", s: "4 × 40s" },
    { n: "Burpees", s: "4 × 30s" },
    { n: "Mountain climbers", s: "4 × 40s" },
    { n: "High knees", s: "4 × 30s" },
    { n: "Récup active", s: "1 min" },
  ],
  "Mobilité / Stretch": [
    { n: "Salutation au soleil", s: "5 cycles" },
    { n: "Étirement ischios", s: "2 × 40s" },
    { n: "Ouverture hanches", s: "2 × 40s" },
    { n: "Cat-cow", s: "10 reps" },
    { n: "Étirement épaules", s: "2 × 30s" },
  ],
};

const LOOK = {
  "🧴 Peau": [
    { h: "Routine minimale efficace", p: "3 étapes suffisent : nettoyer, hydrater, protéger.", li: ["Matin : nettoyant doux → hydratant → SPF 30+ (l'anti-âge n°1)", "Soir : nettoyant → hydratant (+ sérum si besoin)", "1-2×/semaine : exfoliation douce", "Ne touche pas tes boutons, change ta taie d'oreiller souvent"] },
    { h: "Le SPF, non négociable", p: "70% du vieillissement de la peau vient du soleil. Applique-le tous les jours, même nuageux.", li: [] },
  ],
  "💇 Cheveux": [
    { h: "Cheveux sains", p: "La régularité prime sur les produits chers.", li: ["Lave selon ton type (2-3×/sem souvent suffit)", "Eau tiède, pas brûlante", "Trouve une coupe adaptée à ta forme de visage", "Coupe régulière pour éviter les fourches"] },
    { h: "Barbe / rasage", p: "", li: ["Rase dans le sens du poil pour éviter les irritations", "Hydrate après", "Si barbe : taille régulière + huile à barbe"] },
  ],
  "🧍 Posture": [
    { h: "Pourquoi c'est le hack n°1", p: "Une bonne posture change instantanément ta silhouette et ta confiance. Gratuit et immédiat.", li: ["Épaules en arrière et basses", "Menton légèrement rentré, parallèle au sol", "Renforce le dos (rows, superman)", "Étire les pectoraux souvent", "Écran à hauteur des yeux"] },
  ],
  "👕 Style": [
    { h: "Basiques qui marchent", p: "Des vêtements bien ajustés > vêtements chers mal taillés.", li: ["Privilégie la coupe (ni trop serré, ni trop large)", "Palette de couleurs neutres qui se combinent", "Investis dans 1 paire de chaussures propres", "Vêtements toujours propres et repassés"] },
  ],
  "🦷 Détails": [
    { h: "Les petits +", p: "Ce sont les détails qui font la différence.", li: ["Sourire soigné : brossage 2×/jour + fil dentaire", "Ongles propres et coupés", "Parfum léger (une seule signature)", "Sourcils nets", "Hydrate tes lèvres et tes mains"] },
  ],
  "😴 Fondations": [
    { h: "Le glow-up invisible", p: "Aucune crème ne bat un bon sommeil, de l'eau et une bonne alimentation.", li: ["7-9h de sommeil = peau réparée, yeux moins gonflés", "2L d'eau/jour", "Moins de sucre & d'ultra-transformé", "Bouge tous les jours", "Gère ton stress (respiration, nature)"] },
  ],
};

const MOODS = [
  { v: 1, e: "😞", l: "Dur" },
  { v: 2, e: "😕", l: "Bof" },
  { v: 3, e: "😐", l: "Ok" },
  { v: 4, e: "🙂", l: "Bien" },
  { v: 5, e: "😄", l: "Top" },
];

const SKIN_LEVELS = [
  { v: 1, e: "😣", l: "Irritée" },
  { v: 2, e: "😕", l: "Terne" },
  { v: 3, e: "😐", l: "Correcte" },
  { v: 4, e: "🙂", l: "Nette" },
  { v: 5, e: "✨", l: "Glowy" },
];

const CARE_EMOJIS = ["💇","🧖","💆","💅","🪒","🧴","🦷","👁️","🛁","✂️","🧼","💈"];

const SMART_REMINDERS = [
  { time: "08:30", label: "☀️ As-tu mis ton SPF ?" },
  { time: "22:00", label: "🧴 Double nettoyage + soin visage" },
  { time: "12:30", label: "💧 Hydrate-toi (eau + lèvres)" },
  { time: "23:00", label: "🦷 Brossage + fil dentaire" },
  { time: "20:00", label: "🧍 Check posture : épaules en arrière" },
];

/* ---------- État ---------- */

function freshDay() {
  return { focus: {}, routineM: {}, routineS: {}, habits: {}, mood: null, gratitude: "", win: "", workout: null };
}

function loadState() {
  let s;
  try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch { s = null; }
  if (!s) {
    s = { habitDefs: DEFAULT_HABITS.slice(), days: {}, bestStreak: 0, weekChallenge: weekIndex(), reminders: null };
  }
  s.days = s.days || {};
  s.habitDefs = s.habitDefs || DEFAULT_HABITS.slice();
  if (!s.reminders) s.reminders = [
    { id: "r1", time: "08:00", label: "Routine du matin ☀️", on: true },
    { id: "r2", time: "13:00", label: "Bouge un peu + bois de l'eau 💧", on: true },
    { id: "r3", time: "21:30", label: "Routine du soir & journal 🌙", on: true },
  ];
  s.profile = s.profile || { height: null };
  s.measures = s.measures || [];
  s.records = s.records || { squat: 0, pushup: 0 };
  s.badgesSeen = s.badgesSeen || [];
  if (!s.careTasks) s.careTasks = [
    { id: "c1", emoji: "💇", name: "Coupe de cheveux", every: 28, last: null },
    { id: "c2", emoji: "🧖", name: "Gommage visage", every: 7, last: null },
    { id: "c3", emoji: "💆", name: "Masque hydratant", every: 7, last: null },
    { id: "c4", emoji: "💅", name: "Couper les ongles", every: 10, last: null },
  ];
  if (!s.days[todayKey()]) s.days[todayKey()] = freshDay();
  return s;
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
}

function weekIndex() { return Math.floor(Date.now() / (7 * 864e5)); }

let state = loadState();
const day = () => state.days[todayKey()];

/* ---------- Utils ---------- */

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}

function lastNDates(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

function dayScore(key) {
  const d = state.days[key];
  if (!d) return 0;
  let total = 0, done = 0;
  total += FOCUS_TEMPLATE.length; done += Object.values(d.focus || {}).filter(Boolean).length;
  total += ROUTINE_MATIN.length; done += Object.values(d.routineM || {}).filter(Boolean).length;
  total += ROUTINE_SOIR.length; done += Object.values(d.routineS || {}).filter(Boolean).length;
  total += state.habitDefs.length; done += state.habitDefs.filter(h => d.habits && d.habits[h.id]).length;
  if (d.workout) done += 1; total += 1;
  if (d.mood) done += 1; total += 1;
  return total ? Math.round((done / total) * 100) : 0;
}

function computeStreak() {
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dayScore(key) >= 40) streak++;
    else { if (i === 0) continue; break; }
  }
  if (streak > (state.bestStreak || 0)) { state.bestStreak = streak; }
  return streak;
}

/* ---------- Navigation ---------- */

function switchView(name) {
  $$(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderAll();
}

$$(".tab").forEach(t => t.addEventListener("click", () => switchView(t.dataset.tab)));

/* ---------- Rendu : Accueil ---------- */

function renderAccueil() {
  const h = new Date().getHours();
  const greet = h < 6 ? "Bonne nuit 🌙" : h < 12 ? "Bonjour ☀️" : h < 18 ? "Bon après-midi 👋" : "Bonsoir 🌆";
  $("#greeting").textContent = greet;
  const qi = new Date().getDate() % QUOTES.length;
  $("#quote").textContent = "« " + QUOTES[qi] + " »";

  const score = dayScore(todayKey());
  $("#dayScore").textContent = score + "%";
  const circ = 2 * Math.PI * 52;
  $("#ringFg").style.strokeDashoffset = circ * (1 - score / 100);

  const streak = computeStreak();
  $("#streakCount").textContent = streak;
  $("#statStreak").textContent = streak;

  const habitsDone = state.habitDefs.filter(x => day().habits[x.id]).length;
  $("#statHabits").textContent = habitsDone + "/" + state.habitDefs.length;

  const wk = lastNDates(7).filter(k => state.days[k] && state.days[k].workout).length;
  $("#statWorkouts").textContent = wk;

  const moods = lastNDates(7).map(k => state.days[k] && state.days[k].mood).filter(Boolean);
  const avg = moods.length ? (moods.reduce((a, b) => a + b, 0) / moods.length) : 0;
  $("#statMood").textContent = avg ? (MOODS.find(m => Math.round(avg) === m.v) || {}).e || "—" : "—";

  // Focus list
  const fl = $("#focusList");
  fl.innerHTML = "";
  FOCUS_TEMPLATE.forEach(f => {
    const done = !!day().focus[f.id];
    const el = document.createElement("div");
    el.className = "focus-item" + (done ? " done" : "");
    el.innerHTML = `<span class="fi-emoji">${f.emoji}</span><span class="fi-text">${f.text}</span><span class="fi-check">✓</span>`;
    el.addEventListener("click", () => { day().focus[f.id] = !done; saveState(); renderAccueil(); });
    fl.appendChild(el);
  });

  // Challenge
  const c = CHALLENGES[weekIndex() % CHALLENGES.length];
  $("#challengeCard").innerHTML = `<h3>🎯 ${c.t}</h3><p>${c.d}</p>`;
}

/* ---------- Rendu : Routine ---------- */

function renderRoutine() {
  const buildList = (items, storeKey, container) => {
    const el = $(container);
    el.innerHTML = "";
    items.forEach((txt, i) => {
      const done = !!day()[storeKey][i];
      const it = document.createElement("div");
      it.className = "check-item" + (done ? " done" : "");
      it.innerHTML = `<span class="ci-box">✓</span><span class="ci-txt">${txt}</span>`;
      it.addEventListener("click", () => { day()[storeKey][i] = !done; saveState(); renderRoutine(); });
      el.appendChild(it);
    });
  };
  buildList(ROUTINE_MATIN, "routineM", "#routineMatin");
  buildList(ROUTINE_SOIR, "routineS", "#routineSoir");

  const total = ROUTINE_MATIN.length + ROUTINE_SOIR.length;
  const done = Object.values(day().routineM).filter(Boolean).length + Object.values(day().routineS).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#routineBar").style.width = pct + "%";
  $("#routinePct").textContent = pct + "%";
}

/* ---------- Rendu : Habitudes ---------- */

function renderHabits() {
  const el = $("#habitList");
  el.innerHTML = "";
  state.habitDefs.forEach(h => {
    const done = !!day().habits[h.id];
    // mini streak (7j)
    const week = lastNDates(7).map(k => state.days[k] && state.days[k].habits && state.days[k].habits[h.id]);
    let hs = 0;
    for (let i = 6; i >= 0; i--) { if (week[i]) hs++; else if (i === 6) continue; else break; }
    const card = document.createElement("div");
    card.className = "habit" + (done ? " done" : "");
    card.innerHTML = `
      <div class="habit-top">
        <span class="habit-emoji">${h.emoji}</span>
        <div style="flex:1">
          <div class="habit-name">${h.name}</div>
          <div class="habit-streak">🔥 ${hs}j · ${week.filter(Boolean).length}/7 cette semaine</div>
        </div>
        <button class="habit-del" title="Supprimer">✕</button>
        <button class="habit-toggle">✓</button>
      </div>
      <div class="habit-week">${week.map(w => `<span class="hw-dot ${w ? "on" : ""}"></span>`).join("")}</div>`;
    card.querySelector(".habit-toggle").addEventListener("click", () => {
      day().habits[h.id] = !done; saveState(); renderHabits();
      if (!done) toast("Bien joué ! 🔥");
    });
    card.querySelector(".habit-del").addEventListener("click", () => {
      if (confirm(`Supprimer « ${h.name} » ?`)) {
        state.habitDefs = state.habitDefs.filter(x => x.id !== h.id);
        saveState(); renderHabits();
      }
    });
    el.appendChild(card);
  });
}

/* ---------- Modal habitude ---------- */

let selectedEmoji = HABIT_EMOJIS[0];
function openHabitModal() {
  $("#habitInput").value = "";
  selectedEmoji = HABIT_EMOJIS[0];
  const box = $("#habitEmojis");
  box.innerHTML = "";
  HABIT_EMOJIS.forEach(e => {
    const b = document.createElement("button");
    b.textContent = e;
    if (e === selectedEmoji) b.classList.add("sel");
    b.addEventListener("click", () => {
      selectedEmoji = e;
      $$("#habitEmojis button").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
    });
    box.appendChild(b);
  });
  $("#habitModal").classList.add("open");
}
$("#addHabitBtn").addEventListener("click", openHabitModal);
$("#cancelHabit").addEventListener("click", () => $("#habitModal").classList.remove("open"));
$("#habitModal").addEventListener("click", e => { if (e.target.id === "habitModal") $("#habitModal").classList.remove("open"); });
$("#confirmHabit").addEventListener("click", () => {
  const name = $("#habitInput").value.trim();
  if (!name) { toast("Donne un nom à ton habitude"); return; }
  state.habitDefs.push({ id: "h" + Date.now(), emoji: selectedEmoji, name });
  saveState(); $("#habitModal").classList.remove("open"); renderHabits(); toast("Habitude ajoutée ✨");
});

/* ---------- Rendu : Entraînement ---------- */

let currentWorkout = Object.keys(WORKOUTS)[0];
function renderTraining() {
  const seg = $("#workoutSeg");
  seg.innerHTML = "";
  Object.keys(WORKOUTS).forEach(name => {
    const b = document.createElement("button");
    b.textContent = name;
    if (name === currentWorkout) b.classList.add("active");
    b.addEventListener("click", () => { currentWorkout = name; renderTraining(); });
    seg.appendChild(b);
  });

  const det = $("#workoutDetail");
  det.innerHTML = "";
  WORKOUTS[currentWorkout].forEach(ex => {
    const e = document.createElement("div");
    e.className = "ex";
    e.innerHTML = `<span class="ex-name">${ex.n}</span><span class="ex-sets">${ex.s}</span>`;
    det.appendChild(e);
  });

  const btn = $("#logWorkoutBtn");
  btn.textContent = day().workout ? "Séance validée ✓ (modifier)" : "Valider ma séance ✓";

  const hist = $("#workoutHistory");
  hist.innerHTML = "";
  const labels = ["L", "M", "M", "J", "V", "S", "D"];
  lastNDates(7).forEach(k => {
    const d = new Date(k);
    const on = state.days[k] && state.days[k].workout;
    const el = document.createElement("div");
    el.className = "wd" + (on ? " on" : "");
    el.innerHTML = `<small>${labels[(d.getDay() + 6) % 7]}</small>${on ? "✓" : "·"}`;
    hist.appendChild(el);
  });

  // Coach : records & totaux
  $("#prSquat").textContent = (state.records && state.records.squat) || 0;
  $("#prPush").textContent = (state.records && state.records.pushup) || 0;
  $("#totSquat").textContent = sumCoach("squat");
  $("#totPush").textContent = sumCoach("pushup");
  const cw = $("#coachWeek");
  cw.innerHTML = "";
  lastNDates(7).forEach(k => {
    const d = new Date(k);
    const c = state.days[k] && state.days[k].coach;
    const n = c ? (c.squat || 0) + (c.pushup || 0) : 0;
    const el = document.createElement("div");
    el.className = "wd" + (n ? " on" : "");
    el.innerHTML = `<small>${labels[(d.getDay() + 6) % 7]}</small>${n || "·"}`;
    cw.appendChild(el);
  });
}
function sumCoach(exo) {
  return Object.values(state.days).reduce((a, d) => a + ((d.coach && d.coach[exo]) || 0), 0);
}
$("#logWorkoutBtn").addEventListener("click", () => {
  day().workout = day().workout ? null : currentWorkout;
  saveState(); renderTraining();
  toast(day().workout ? "Séance validée 💪" : "Séance annulée");
});

/* ---------- Rendu : Mental ---------- */

function renderMental() {
  const mp = $("#moodPicker");
  mp.innerHTML = "";
  MOODS.forEach(m => {
    const b = document.createElement("button");
    b.className = "mood-btn" + (day().mood === m.v ? " sel" : "");
    b.innerHTML = `${m.e}<small>${m.l}</small>`;
    b.addEventListener("click", () => { day().mood = m.v; saveState(); renderMental(); toast("Humeur enregistrée"); });
    mp.appendChild(b);
  });
  $("#gratitude").value = day().gratitude || "";
  $("#journalWin").value = day().win || "";
}
$("#saveJournalBtn").addEventListener("click", () => {
  day().gratitude = $("#gratitude").value;
  day().win = $("#journalWin").value;
  saveState();
  $("#journalSaved").textContent = "Enregistré ✓ " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  toast("Journal enregistré 📝");
});

/* ---------- Respiration 4-7-8 ---------- */

let breathRunning = false, breathTimer = null, breathCountdown = null;
$("#breathBtn").addEventListener("click", () => {
  if (breathRunning) { stopBreath(); return; }
  breathRunning = true;
  $("#breathBtn").textContent = "Arrêter";
  let cycle = 0;
  const circle = $("#breathCircle"), txt = $("#breathText");
  const phases = [
    { c: "in", t: "Inspire…", d: 4000 },
    { c: "hold", t: "Retiens…", d: 7000 },
    { c: "out", t: "Expire…", d: 8000 },
  ];
  let pi = 0;
  const run = () => {
    if (!breathRunning) return;
    const p = phases[pi];
    circle.classList.remove("in", "hold", "out");
    circle.classList.add(p.c);
    circle.style.transitionDuration = (p.d / 1000) + "s";
    let remaining = Math.round(p.d / 1000);
    txt.textContent = p.t + " " + remaining;
    clearInterval(breathCountdown);
    breathCountdown = setInterval(() => { remaining--; if (remaining > 0) txt.textContent = p.t + " " + remaining; }, 1000);
    breathTimer = setTimeout(() => {
      pi = (pi + 1) % 3;
      if (pi === 0) { cycle++; if (cycle >= 4) { stopBreath(true); return; } }
      run();
    }, p.d);
  };
  run();
});
function stopBreath(done) {
  breathRunning = false;
  clearTimeout(breathTimer);
  clearInterval(breathCountdown);
  const circle = $("#breathCircle");
  circle.classList.remove("in", "hold", "out");
  circle.style.transitionDuration = "1s";
  $("#breathText").textContent = done ? "Bravo 🌿" : "Prêt·e ?";
  $("#breathBtn").textContent = "Démarrer 4·7·8";
  if (done) toast("Séance de respiration terminée 🌿");
}

/* ---------- Rendu : Lookmaxing ---------- */

let currentLook = Object.keys(LOOK)[0];
function renderLook() {
  const cats = $("#lookCats");
  cats.innerHTML = "";
  Object.keys(LOOK).forEach(name => {
    const b = document.createElement("button");
    b.textContent = name;
    if (name === currentLook) b.classList.add("active");
    b.addEventListener("click", () => { currentLook = name; renderLook(); });
    cats.appendChild(b);
  });
  const content = $("#lookContent");
  content.innerHTML = "";
  LOOK[currentLook].forEach(card => {
    const el = document.createElement("div");
    el.className = "look-card";
    el.innerHTML = `<h4>${card.h}</h4>${card.p ? `<p>${card.p}</p>` : ""}${card.li.length ? `<ul>${card.li.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}`;
    content.appendChild(el);
  });
  if (typeof renderSkin === "function") renderSkin();
  if (typeof renderCare === "function") renderCare();
  if (typeof renderSkinPhotos === "function") renderSkinPhotos();
  if (typeof renderSmartReminders === "function") renderSmartReminders();
}

/* ---------- Rendu : Progrès ---------- */

function renderProgres() {
  const activeDays = Object.keys(state.days).filter(k => dayScore(k) >= 40).length;
  $("#pTotalDays").textContent = activeDays;
  $("#pBestStreak").textContent = state.bestStreak || 0;
  $("#pJournal").textContent = Object.values(state.days).filter(d => (d.gratitude && d.gratitude.trim()) || (d.win && d.win.trim())).length;
  $("#pWorkouts").textContent = Object.values(state.days).filter(d => d.workout).length;

  const chart = $("#scoreChart");
  chart.innerHTML = "";
  lastNDates(14).forEach(k => {
    const sc = dayScore(k);
    const d = new Date(k);
    const bar = document.createElement("div");
    bar.className = "cbar";
    bar.innerHTML = `<div class="fill" style="height:${Math.max(sc, 2)}%"></div><span class="clbl">${d.getDate()}</span>`;
    chart.appendChild(bar);
  });

  const mc = $("#moodChart");
  mc.innerHTML = "";
  lastNDates(14).forEach(k => {
    const m = state.days[k] && state.days[k].mood;
    const d = new Date(k);
    const bar = document.createElement("div");
    bar.className = "cbar";
    const emo = m ? MOODS.find(x => x.v === m).e : "·";
    bar.innerHTML = `<div class="fill" style="height:${m ? m * 18 : 6}px">${m ? emo : ""}</div><span class="clbl">${d.getDate()}</span>`;
    mc.appendChild(bar);
  });
  if (typeof renderPhotos === "function") renderPhotos();
  if (typeof renderMeasures === "function") renderMeasures();
  if (typeof renderBadges === "function") renderBadges();
}
$("#resetBtn").addEventListener("click", () => {
  if (confirm("Effacer toutes tes données GlowUp ? Cette action est irréversible.")) {
    localStorage.removeItem(STORE_KEY);
    state = loadState();
    toast("Données réinitialisées");
    renderAll();
  }
});

/* ---------- Rendu global ---------- */

function renderAll() {
  saveState();
  renderAccueil();
  renderRoutine();
  renderHabits();
  renderTraining();
  renderMental();
  renderLook();
  renderProgres();
}

/* Reset visuel du champ "enregistré" quand on tape */
["gratitude", "journalWin"].forEach(id => {
  const el = $("#" + id);
  el && el.addEventListener("input", () => { $("#journalSaved").textContent = ""; });
});

/* ============================================================
   RAPPELS / NOTIFICATIONS
   ============================================================ */

function notifPermission() { return ("Notification" in window) ? Notification.permission : "unsupported"; }

function updateNotifState() {
  const el = $("#notifState");
  const p = notifPermission();
  const btn = $("#enableNotifBtn");
  if (p === "unsupported") { el.textContent = "Ton navigateur ne supporte pas les notifications."; btn.style.display = "none"; }
  else if (p === "granted") { el.textContent = "✅ Notifications activées. Tes rappels se déclencheront aux heures choisies."; btn.style.display = "none"; }
  else if (p === "denied") { el.textContent = "❌ Notifications bloquées. Autorise-les dans les réglages du navigateur."; btn.style.display = "block"; }
  else { el.textContent = "Active les notifications pour recevoir tes rappels quotidiens."; btn.style.display = "block"; }
}

function fireNotif(title, body) {
  if (notifPermission() !== "granted") { toast("🔔 " + body); return; }
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(reg => reg.showNotification(title, { body, vibrate: [80, 40, 80] })).catch(() => new Notification(title, { body }));
    } else { new Notification(title, { body }); }
  } catch { toast("🔔 " + body); }
}

let reminderTimers = [];
function scheduleReminders() {
  reminderTimers.forEach(t => clearTimeout(t));
  reminderTimers = [];
  if (notifPermission() !== "granted") return;
  state.reminders.filter(r => r.on).forEach(r => {
    const [h, m] = r.time.split(":").map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const delay = next - now;
    if (delay > 0 && delay < 26 * 3600e3) {
      const id = setTimeout(() => { fireNotif("GlowUp ✨", r.label); scheduleReminders(); }, delay);
      reminderTimers.push(id);
    }
  });
}

function renderReminders() {
  const box = $("#reminderRows");
  box.innerHTML = "";
  state.reminders.forEach(r => {
    const row = document.createElement("div");
    row.className = "reminder-row" + (r.on ? " on" : "");
    row.innerHTML = `
      <div class="rm-line">
        <input type="time" value="${r.time}" />
        <button class="rm-toggle ${r.on ? "on" : ""}" title="Activer/désactiver"></button>
        <button class="rm-del" title="Supprimer">✕</button>
      </div>
      <input type="text" class="rm-label" value="${r.label.replace(/"/g, "&quot;")}" placeholder="Message du rappel" />`;
    const timeEl = row.querySelector('input[type=time]');
    const labelEl = row.querySelector('input[type=text]');
    timeEl.addEventListener("change", () => { r.time = timeEl.value; saveState(); scheduleReminders(); });
    labelEl.addEventListener("change", () => { r.label = labelEl.value; saveState(); });
    row.querySelector(".rm-toggle").addEventListener("click", () => { r.on = !r.on; saveState(); renderReminders(); scheduleReminders(); });
    row.querySelector(".rm-del").addEventListener("click", () => { state.reminders = state.reminders.filter(x => x.id !== r.id); saveState(); renderReminders(); scheduleReminders(); });
    box.appendChild(row);
  });
  updateNotifState();
}

$("#settingsBtn").addEventListener("click", () => { renderReminders(); $("#reminderModal").classList.add("open"); });
$("#closeReminder").addEventListener("click", () => $("#reminderModal").classList.remove("open"));
$("#reminderModal").addEventListener("click", e => { if (e.target.id === "reminderModal") $("#reminderModal").classList.remove("open"); });
$("#addReminderBtn").addEventListener("click", () => {
  state.reminders.push({ id: "r" + Date.now(), time: "18:00", label: "Nouveau rappel", on: true });
  saveState(); renderReminders(); scheduleReminders();
});
$("#enableNotifBtn").addEventListener("click", async () => {
  if (!("Notification" in window)) { toast("Non supporté ici"); return; }
  const p = await Notification.requestPermission();
  updateNotifState(); scheduleReminders();
  if (p === "granted") { toast("Notifications activées 🔔"); fireNotif("GlowUp ✨", "C'est parti ! Tu recevras tes rappels ici."); }
});
$("#testNotifBtn").addEventListener("click", () => fireNotif("GlowUp ✨", "Ceci est un rappel de test. Reste régulier·e 💪"));

/* ============================================================
   PHOTOS DE PROGRESSION (stockage local séparé)
   ============================================================ */

const PHOTO_KEY = "glowup.photos.v1";
function loadPhotos() { try { return JSON.parse(localStorage.getItem(PHOTO_KEY)) || []; } catch { return []; } }
function savePhotos(p) { try { localStorage.setItem(PHOTO_KEY, JSON.stringify(p)); return true; } catch { return false; } }
let photos = loadPhotos();

function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height = height * maxDim / width; width = maxDim; }
        else if (height > maxDim) { width = width * maxDim / height; height = maxDim; }
        const c = document.createElement("canvas");
        c.width = width; c.height = height;
        c.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

$("#addPhotoBtn").addEventListener("click", () => $("#photoInput").click());
$("#photoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  toast("Traitement de la photo…");
  try {
    const data = await compressImage(file, 800, 0.72);
    photos.unshift({ id: "p" + Date.now(), date: todayKey(), data });
    if (!savePhotos(photos)) {
      photos.shift();
      toast("Stockage plein — supprime d'anciennes photos");
    } else { renderPhotos(); toast("Photo ajoutée 📸"); }
  } catch { toast("Impossible de lire cette image"); }
  e.target.value = "";
});

function renderPhotos() {
  const g = $("#photoGallery");
  g.innerHTML = "";
  if (!photos.length) { g.innerHTML = `<div class="photo-empty">Aucune photo pour l'instant.<br>Ajoute ta première photo « avant » 📸</div>`; return; }
  photos.forEach(p => {
    const d = document.createElement("div");
    d.className = "photo-thumb";
    const dateFr = new Date(p.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
    d.innerHTML = `<img src="${p.data}" alt="Progression ${dateFr}"><span class="pt-date">${dateFr}</span>`;
    d.addEventListener("click", () => openPhotoViewer(p));
    g.appendChild(d);
  });
}

function openPhotoViewer(p) {
  $("#photoViewerImg").src = p.data;
  $("#photoViewerDate").textContent = new Date(p.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("#photoViewer").classList.add("open");
  $("#photoDeleteBtn").onclick = () => {
    if (confirm("Supprimer cette photo ?")) {
      photos = photos.filter(x => x.id !== p.id);
      savePhotos(photos); renderPhotos();
      $("#photoViewer").classList.remove("open");
    }
  };
}
$("#photoViewerClose").addEventListener("click", () => $("#photoViewer").classList.remove("open"));

/* ============================================================
   PONT AVEC LE COACH CAMÉRA (coach.js)
   ============================================================ */

window.glowupLogReps = function (exo, reps) {
  const label = exo === "squat" ? "squats" : "pompes";
  let msg = `${reps} ${label} validés 💪`;
  if (reps > 0) {
    const d = day();
    d.coach = d.coach || { squat: 0, pushup: 0 };
    d.coach[exo] = (d.coach[exo] || 0) + reps;
    d.workout = d.workout || (exo === "squat" ? "Bas du corps" : "Haut du corps");
    state.records = state.records || { squat: 0, pushup: 0 };
    if (reps > (state.records[exo] || 0)) {
      state.records[exo] = reps;
      msg = `🏆 Nouveau record : ${reps} ${label} !`;
    }
    saveState();
  }
  toast(msg);
  renderAll();
};

/* ============================================================
   MENSURATIONS & COURBE DE POIDS
   ============================================================ */

function imcCategory(imc) {
  if (imc < 18.5) return { t: "Maigreur", c: "var(--warn)" };
  if (imc < 25) return { t: "Normal", c: "var(--good)" };
  if (imc < 30) return { t: "Surpoids", c: "var(--warn)" };
  return { t: "Obésité", c: "var(--bad)" };
}

function renderMeasures() {
  const head = $("#measureHead");
  const ms = state.measures.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const last = ms[ms.length - 1];
  const first = ms[0];
  head.innerHTML = "";
  if (!last) {
    head.innerHTML = `<div class="photo-empty" style="width:100%">Aucune mesure. Ajoute ton poids pour suivre ton évolution 📉</div>`;
  } else {
    const cards = [];
    cards.push(`<div class="mh"><b>${last.poids ?? "—"}</b><span>poids (kg)</span></div>`);
    if (first && last.poids != null && first.poids != null && first !== last) {
      const diff = +(last.poids - first.poids).toFixed(1);
      const cls = diff > 0 ? "up" : diff < 0 ? "down" : "";
      cards.push(`<div class="mh"><b class="${cls}">${diff > 0 ? "+" : ""}${diff}</b><span>depuis le début</span></div>`);
    }
    const h = state.profile.height;
    if (h && last.poids != null) {
      const imc = last.poids / Math.pow(h / 100, 2);
      const cat = imcCategory(imc);
      cards.push(`<div class="mh"><b>${imc.toFixed(1)}</b><span>IMC</span><span class="imc-tag" style="background:${cat.c};color:#0e0e12">${cat.t}</span></div>`);
    }
    if (last.waist != null) cards.push(`<div class="mh"><b>${last.waist}</b><span>tour taille (cm)</span></div>`);
    if (last.bras != null) cards.push(`<div class="mh"><b>${last.bras}</b><span>tour bras (cm)</span></div>`);
    head.innerHTML = cards.join("");
  }
  drawWeightChart(ms.filter(m => m.poids != null));
}

function drawWeightChart(pts) {
  const el = $("#weightChart");
  if (pts.length < 2) {
    el.innerHTML = `<div class="photo-empty" style="border:none;padding:14px 0">Ajoute au moins 2 mesures de poids pour voir ta courbe.</div>`;
    return;
  }
  const w = 320, h = 130, pad = 22;
  const vals = pts.map(p => p.poids);
  const min = Math.min(...vals), max = Math.max(...vals), range = (max - min) || 1;
  const x = i => pad + (i / (pts.length - 1)) * (w - 2 * pad);
  const y = v => pad + (1 - (v - min) / range) * (h - 2 * pad);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.poids).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1).toFixed(1)} ${h - pad} L${x(0).toFixed(1)} ${h - pad} Z`;
  const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.poids).toFixed(1)}" r="3"/>`).join("");
  const dLabel = (iso) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}`; };
  el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Courbe de poids">
    <defs><linearGradient id="wgrad" x1="0" x2="1"><stop offset="0" stop-color="#b98cff"/><stop offset="1" stop-color="#ff9ec7"/></linearGradient></defs>
    <path class="wc-area" d="${area}"/>
    <path class="wc-line" d="${line}"/>
    ${dots}
    <text x="${pad}" y="12">${max} kg</text>
    <text x="${pad}" y="${h - 6}">${min} kg</text>
    <text x="${w - pad}" y="${h - 6}" text-anchor="end">${dLabel(pts[pts.length - 1].date)}</text>
    <text x="${pad}" y="${h - 6}" dx="34">${dLabel(pts[0].date)}</text>
  </svg>`;
}

$("#addMeasureBtn").addEventListener("click", () => {
  const last = state.measures.slice().sort((a, b) => a.date < b.date ? -1 : 1).pop();
  $("#mPoids").value = last && last.poids != null ? last.poids : "";
  $("#mTaille").value = state.profile.height || "";
  $("#mWaist").value = last && last.waist != null ? last.waist : "";
  $("#mBras").value = last && last.bras != null ? last.bras : "";
  $("#measureModal").classList.add("open");
});
$("#cancelMeasure").addEventListener("click", () => $("#measureModal").classList.remove("open"));
$("#measureModal").addEventListener("click", e => { if (e.target.id === "measureModal") $("#measureModal").classList.remove("open"); });
$("#confirmMeasure").addEventListener("click", () => {
  const num = (id) => { const v = parseFloat($(id).value.replace(",", ".")); return isNaN(v) ? null : v; };
  const poids = num("#mPoids"), taille = num("#mTaille"), waist = num("#mWaist"), bras = num("#mBras");
  if (poids == null && waist == null && bras == null) { toast("Entre au moins une valeur"); return; }
  if (taille != null) state.profile.height = taille;
  const key = todayKey();
  const existing = state.measures.find(m => m.date === key);
  if (existing) { if (poids != null) existing.poids = poids; if (waist != null) existing.waist = waist; if (bras != null) existing.bras = bras; }
  else state.measures.push({ id: "m" + Date.now(), date: key, poids, waist, bras });
  saveState(); $("#measureModal").classList.remove("open"); renderMeasures(); renderBadges();
  toast("Mesure enregistrée 📏");
});

/* ============================================================
   BADGES DE MOTIVATION
   ============================================================ */

function computeBadges() {
  const days = state.days;
  const activeDays = Object.keys(days).filter(k => dayScore(k) >= 40).length;
  const workouts = Object.values(days).filter(d => d.workout).length;
  const journalN = Object.values(days).filter(d => (d.gratitude && d.gratitude.trim()) || (d.win && d.win.trim())).length;
  const perfectDay = Object.keys(days).some(k => dayScore(k) === 100);
  const totPush = sumCoach("pushup"), totSquat = sumCoach("squat");
  const skinDays = Object.values(days).filter(d => d.skin && d.skin.rating).length;
  return [
    { e: "🌱", n: "Premier pas", d: "1er jour actif", got: activeDays >= 1 },
    { e: "🔥", n: "Série de 7", d: "7 jours d'affilée", got: (state.bestStreak || 0) >= 7 },
    { e: "⚡", n: "Série de 30", d: "30 jours d'affilée", got: (state.bestStreak || 0) >= 30 },
    { e: "🏋️", n: "Sportif·ve", d: "10 séances", got: workouts >= 10 },
    { e: "💪", n: "100 pompes", d: "cumulées", got: totPush >= 100 },
    { e: "🦵", n: "100 squats", d: "cumulés", got: totSquat >= 100 },
    { e: "📸", n: "Avant/après", d: "1re photo", got: (typeof photos !== "undefined" ? photos.length : 0) >= 1 },
    { e: "📝", n: "Introspection", d: "7 entrées journal", got: journalN >= 7 },
    { e: "⭐", n: "Journée parfaite", d: "100% un jour", got: perfectDay },
    { e: "🧖", n: "Skincare", d: "peau notée 7j", got: skinDays >= 7 },
    { e: "📏", n: "Mesuré·e", d: "3 mesures", got: state.measures.length >= 3 },
    { e: "🏅", n: "Discipliné·e", d: "30 jours actifs", got: activeDays >= 30 },
  ];
}

function renderBadges() {
  const grid = $("#badgeGrid");
  const badges = computeBadges();
  grid.innerHTML = "";
  badges.forEach(b => {
    const el = document.createElement("div");
    el.className = "badge" + (b.got ? " got" : "");
    el.innerHTML = `<span class="b-emoji">${b.e}</span><span class="b-name">${b.n}</span><span class="b-desc">${b.d}</span>`;
    grid.appendChild(el);
  });
  // Nouveau badge débloqué ?
  badges.filter(b => b.got && !state.badgesSeen.includes(b.n)).forEach(b => {
    state.badgesSeen.push(b.n);
    setTimeout(() => toast(`🏅 Badge débloqué : ${b.n} !`), 300);
  });
  saveState();
}

/* ============================================================
   SUIVI PEAU + PHOTOS PEAU
   ============================================================ */

function renderSkin() {
  const sp = $("#skinPicker");
  sp.innerHTML = "";
  const cur = day().skin || {};
  SKIN_LEVELS.forEach(s => {
    const b = document.createElement("button");
    b.className = "skin-btn" + (cur.rating === s.v ? " sel" : "");
    b.innerHTML = `${s.e}<small>${s.l}</small>`;
    b.addEventListener("click", () => {
      day().skin = { rating: s.v, note: (day().skin && day().skin.note) || "" };
      saveState(); renderSkin(); renderBadges();
    });
    sp.appendChild(b);
  });
  $("#skinNote").value = cur.note || "";
}
$("#saveSkinBtn").addEventListener("click", () => {
  const cur = day().skin || {};
  day().skin = { rating: cur.rating || null, note: $("#skinNote").value };
  saveState();
  $("#skinSaved").textContent = "Enregistré ✓";
  toast("État de la peau enregistré 🧖");
});
$("#skinNote") && $("#skinNote").addEventListener("input", () => { $("#skinSaved").textContent = ""; });

const SKINPHOTO_KEY = "glowup.skinphotos.v1";
function loadSkinPhotos() { try { return JSON.parse(localStorage.getItem(SKINPHOTO_KEY)) || []; } catch { return []; } }
function saveSkinPhotos(p) { try { localStorage.setItem(SKINPHOTO_KEY, JSON.stringify(p)); return true; } catch { return false; } }
let skinPhotos = loadSkinPhotos();

$("#addSkinPhotoBtn").addEventListener("click", () => $("#skinPhotoInput").click());
$("#skinPhotoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  toast("Traitement…");
  try {
    const data = await compressImage(file, 800, 0.72);
    skinPhotos.unshift({ id: "sp" + Date.now(), date: todayKey(), data });
    if (!saveSkinPhotos(skinPhotos)) { skinPhotos.shift(); toast("Stockage plein"); }
    else { renderSkinPhotos(); toast("Photo peau ajoutée 📷"); }
  } catch { toast("Image illisible"); }
  e.target.value = "";
});
function renderSkinPhotos() {
  const g = $("#skinGallery");
  g.innerHTML = "";
  if (!skinPhotos.length) { g.innerHTML = `<div class="photo-empty">Aucune photo peau.</div>`; return; }
  skinPhotos.forEach(p => {
    const d = document.createElement("div");
    d.className = "photo-thumb";
    const dateFr = new Date(p.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
    d.innerHTML = `<img src="${p.data}" alt="Peau ${dateFr}"><span class="pt-date">${dateFr}</span>`;
    d.addEventListener("click", () => {
      $("#photoViewerImg").src = p.data;
      $("#photoViewerDate").textContent = new Date(p.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      $("#photoViewer").classList.add("open");
      $("#photoDeleteBtn").onclick = () => {
        if (confirm("Supprimer cette photo ?")) {
          skinPhotos = skinPhotos.filter(x => x.id !== p.id);
          saveSkinPhotos(skinPhotos); renderSkinPhotos();
          $("#photoViewer").classList.remove("open");
        }
      };
    });
    g.appendChild(d);
  });
}

/* ============================================================
   SOINS & FRÉQUENCES
   ============================================================ */

function daysBetween(a, b) { return Math.round((a - b) / 864e5); }
function renderCare() {
  const el = $("#careList");
  el.innerHTML = "";
  const today = new Date(todayKey());
  state.careTasks.forEach(c => {
    let subTxt, subCls;
    if (!c.last) { subTxt = "Jamais fait — à planifier"; subCls = "soon"; }
    else {
      const since = daysBetween(today, new Date(c.last));
      const left = c.every - since;
      if (left > 1) { subTxt = `Prochain dans ${left} j · tous les ${c.every} j`; subCls = "ok"; }
      else if (left >= 0) { subTxt = left === 0 ? "À faire aujourd'hui" : "À faire demain"; subCls = "soon"; }
      else { subTxt = `En retard de ${-left} j`; subCls = "late"; }
    }
    const row = document.createElement("div");
    row.className = "care";
    row.innerHTML = `
      <span class="care-emoji">${c.emoji}</span>
      <div class="care-info"><div class="care-name">${c.name}</div><div class="care-sub ${subCls}">${subTxt}</div></div>
      <button class="care-do">Fait ✓</button>
      <button class="care-del" title="Supprimer">✕</button>`;
    row.querySelector(".care-do").addEventListener("click", () => { c.last = todayKey(); saveState(); renderCare(); toast(`${c.name} : c'est noté ✓`); });
    row.querySelector(".care-del").addEventListener("click", () => {
      if (confirm(`Supprimer « ${c.name} » ?`)) { state.careTasks = state.careTasks.filter(x => x.id !== c.id); saveState(); renderCare(); }
    });
    el.appendChild(row);
  });
}

let selectedCareEmoji = CARE_EMOJIS[0];
$("#addCareBtn").addEventListener("click", () => {
  $("#careName").value = ""; $("#careEvery").value = "";
  selectedCareEmoji = CARE_EMOJIS[0];
  const box = $("#careEmojis");
  box.innerHTML = "";
  CARE_EMOJIS.forEach(e => {
    const b = document.createElement("button");
    b.textContent = e;
    if (e === selectedCareEmoji) b.classList.add("sel");
    b.addEventListener("click", () => { selectedCareEmoji = e; $$("#careEmojis button").forEach(x => x.classList.remove("sel")); b.classList.add("sel"); });
    box.appendChild(b);
  });
  $("#careModal").classList.add("open");
});
$("#cancelCare").addEventListener("click", () => $("#careModal").classList.remove("open"));
$("#careModal").addEventListener("click", e => { if (e.target.id === "careModal") $("#careModal").classList.remove("open"); });
$("#confirmCare").addEventListener("click", () => {
  const name = $("#careName").value.trim();
  const every = parseInt($("#careEvery").value, 10);
  if (!name) { toast("Donne un nom au soin"); return; }
  if (!every || every < 1) { toast("Indique une fréquence en jours"); return; }
  state.careTasks.push({ id: "c" + Date.now(), emoji: selectedCareEmoji, name, every, last: null });
  saveState(); $("#careModal").classList.remove("open"); renderCare(); toast("Soin ajouté 🗓️");
});

/* ============================================================
   RAPPELS PEAU INTELLIGENTS (ajout rapide)
   ============================================================ */

function renderSmartReminders() {
  const box = $("#smartReminders");
  box.innerHTML = "";
  SMART_REMINDERS.forEach(sr => {
    const added = state.reminders.some(r => r.label === sr.label);
    const chip = document.createElement("button");
    chip.className = "smart-chip" + (added ? " added" : "");
    chip.textContent = (added ? "✓ " : "+ ") + sr.label;
    chip.addEventListener("click", () => {
      if (state.reminders.some(r => r.label === sr.label)) {
        state.reminders = state.reminders.filter(r => r.label !== sr.label);
        toast("Rappel retiré");
      } else {
        state.reminders.push({ id: "r" + Date.now(), time: sr.time, label: sr.label, on: true });
        toast("Rappel ajouté 🔔 (" + sr.time + ")");
      }
      saveState(); renderSmartReminders(); scheduleReminders();
    });
    box.appendChild(chip);
  });
}

/* ---------- Init ---------- */
renderPhotos();
updateNotifState();
scheduleReminders();
renderAll();

/* ---------- PWA service worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
