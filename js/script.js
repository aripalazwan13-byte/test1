/* =========================================================
   KONFIGURASI UNDANGAN — ubah data di bagian ini
   Waktu countdown menggunakan zona waktu WIB (UTC+7).
   ========================================================= */
const WEDDING_CONFIG = {
  groom: "Risky",
  bride: "Dara",
  dateLabel: "Minggu, 20 Desember 2026",
  // Format: YYYY-MM-DDTHH:mm:ss+07:00
  weddingDate: "2026-12-20T08:00:00+07:00",
  mapsUrl: "https://maps.google.com/?q=Lokasi+Pernikahan",
  calendarTitle: "Pernikahan Ardi & Nadia",
  calendarLocation: "Kediaman Mempelai Wanita",
  calendarDescription: "Undangan pernikahan Ardi dan Nadia"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function applyInvitationData() {
  $$("[data-groom]").forEach(el => { el.textContent = WEDDING_CONFIG.groom; });
  $$("[data-bride]").forEach(el => { el.textContent = WEDDING_CONFIG.bride; });
  $$("[data-date-label]").forEach(el => { el.textContent = WEDDING_CONFIG.dateLabel; });
  document.title = `Undangan Pernikahan ${WEDDING_CONFIG.groom} & ${WEDDING_CONFIG.bride}`;
  $("#mapsLink").href = WEDDING_CONFIG.mapsUrl;

  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  if (guest && guest.trim()) {
    $("#guestName").textContent = guest.trim().replace(/\+/g, " ").slice(0, 100);
  }
}

function openInvitation() {
  const cover = $("#cover");
  const invitation = $("#invitation");
  cover.classList.add("cover-leaving");
  cover.style.transition = "opacity .65s ease, transform .65s ease";
  cover.style.opacity = "0";
  cover.style.transform = "scale(1.015)";
  window.setTimeout(() => {
    cover.classList.add("hidden");
    invitation.classList.remove("hidden");
    invitation.setAttribute("aria-hidden", "false");
    document.body.classList.add("invitation-open");
    window.scrollTo({ top: 0, behavior: "auto" });
    observeRevealElements();
    startPetalAnimation();
    startMusic();
  }, 620);
}

const music = $("#weddingMusic");
const musicToggle = $("#musicToggle");
let musicStarted = false;

async function startMusic() {
  if (!music) return;
  try {
    await music.play();
    musicStarted = true;
    updateMusicButton(true);
  } catch (error) {
    // Browser bisa menolak audio jika file belum tersedia atau playback diblokir.
    updateMusicButton(false);
    $("#musicText").textContent = "Putar";
  }
}

function updateMusicButton(playing) {
  musicToggle.classList.toggle("playing", playing);
  musicToggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  $("#musicIcon").textContent = playing ? "♫" : "▶";
  $("#musicText").textContent = playing ? "Musik" : "Putar";
}

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();
    updateMusicButton(false);
  }
});

function observeRevealElements() {
  const elements = $$(".reveal:not([data-observed])");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  elements.forEach(el => {
    el.dataset.observed = "true";
    observer.observe(el);
  });
}

let petalTimer = null;
function startPetalAnimation() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || petalTimer) return;
  const layer = $("#petalLayer");
  if (!layer) return;

  const makePetal = () => {
    if (document.hidden || $("#invitation").classList.contains("hidden")) return;
    // Batasi jumlah elemen agar tetap ringan di perangkat Android.
    if (layer.childElementCount >= 8) return;
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > 0.5 ? "✿" : "✧";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.round(Math.random() * 100 - 50)}px`);
    petal.style.animationDuration = `${8 + Math.random() * 5}s`;
    petal.style.fontSize = `${10 + Math.random() * 8}px`;
    layer.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove(), { once: true });
  };

  petalTimer = window.setInterval(makePetal, 1700);
  makePetal();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && music && !music.paused) music.pause();
  else if (!document.hidden && musicStarted && music && music.paused) {
    // Tidak tự động tiếp tục nhạc; người dùng có thể bấm nút phát.
    updateMusicButton(false);
  }
});

function updateCountdown() {
  const target = new Date(WEDDING_CONFIG.weddingDate).getTime();
  if (Number.isNaN(target)) {
    $("#countdownMessage").textContent = "Periksa format tanggal di js/script.js.";
    return;
  }
  const diff = target - Date.now();
  if (diff <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => { $(`#${id}`).textContent = "00"; });
    $("#countdownMessage").textContent = "Hari bahagia kami telah tiba. Terima kasih atas doa Anda.";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  $("#days").textContent = String(days).padStart(2, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}

function downloadCalendarEvent() {
  const start = new Date(WEDDING_CONFIG.weddingDate);
  if (Number.isNaN(start.getTime())) {
    alert("Format tanggal belum benar. Periksa WEDDING_CONFIG di js/script.js.");
    return;
  }
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const toICS = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeICS = text => String(text).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Undangan Digital//ID",
    "BEGIN:VEVENT",
    `DTSTART:${toICS(start)}`,
    `DTEND:${toICS(end)}`,
    `SUMMARY:${escapeICS(WEDDING_CONFIG.calendarTitle)}`,
    `LOCATION:${escapeICS(WEDDING_CONFIG.calendarLocation)}`,
    `DESCRIPTION:${escapeICS(WEDDING_CONFIG.calendarDescription)}`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "undangan-pernikahan.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

$("#openInvitation").addEventListener("click", openInvitation);
$("#calendarButton").addEventListener("click", downloadCalendarEvent);

$("#rsvpForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#senderName").value.trim();
  const attendance = $("#attendance").value;
  const message = $("#message").value.trim();
  if (!name || !attendance || !message) return;

  const item = document.createElement("article");
  item.className = "wish-item";
  const heading = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = name;
  const status = document.createElement("small");
  status.textContent = attendance;
  heading.append(strong, status);
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  item.append(heading, paragraph);
  $("#wishList").prepend(item);
  $("#formFeedback").textContent = "Terima kasih! Ucapan ditampilkan pada halaman ini.";
  $("#rsvpForm").reset();
});

applyInvitationData();
updateCountdown();
window.setInterval(updateCountdown, 1000);
observeRevealElements();
