// ===== Audio: arranca en el segundo 55 =====
const INICIO_CANCION = 55; // segundos
const audio = document.getElementById("cancion");
const botonMusica = document.getElementById("play-pausa");

function actualizarBoton() {
  const sonando = !audio.paused;
  botonMusica.innerHTML = sonando ? `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>` : `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`;
  botonMusica.setAttribute("aria-label", sonando ? "Pausar música" : "Reproducir música");
}

function reproducir() {
  if (audio.currentTime < INICIO_CANCION) {
    if (audio.readyState >= 1) audio.currentTime = INICIO_CANCION;
    else audio.addEventListener("loadedmetadata", () => { audio.currentTime = INICIO_CANCION; }, { once: true });
  }
  audio.play().catch(() => {});
}

// Al terminar vuelve al segundo 55
audio.addEventListener("ended", () => {
  audio.currentTime = INICIO_CANCION;
  audio.play().catch(() => {});
});
audio.addEventListener("play", actualizarBoton);
audio.addEventListener("pause", actualizarBoton);

botonMusica.addEventListener("click", () => {
  if (audio.paused) reproducir();
  else audio.pause();
});

// ===== Pausar la música si cambian de pestaña o cierran la página =====
function pausarMusica() {
  if (!audio.paused) audio.pause();
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausarMusica();
});
window.addEventListener("pagehide", pausarMusica);

// ===== Abrir invitación =====
const intro = document.getElementById("intro");
document.getElementById("abrir").addEventListener("click", () => {
  gsap.to(intro, { opacity: 0, duration: 0.6, onComplete: () => { intro.hidden = true; } });
  document.getElementById("contenido").hidden = false;
  botonMusica.hidden = false;
  reproducir();
  actualizarBoton();
  iniciarAnimaciones();
  setTimeout(() => ScrollTrigger.refresh(), 100);
});

// ===== Decoración de murciélagos y estrellas de fondo =====
const fondo = document.querySelector("main .fondo-decorativo");
const iconos = ["🦇","🎃","👻","⭐","🕷️","🌙","🎈","🍬"];
for (let i = 0; i < 22; i++) {
  const el = document.createElement("span");
  el.className = "deco";
  el.textContent = iconos[i % iconos.length];
  el.style.left = Math.random() * 100 + "%";
  el.style.top = Math.random() * 100 + "%";
  el.style.animationDelay = Math.random() * 4 + "s";
  el.style.fontSize = (1.4 + Math.random() * 1.6) + "rem";
  fondo.appendChild(el);
}

// ===== Cuenta regresiva: días, horas y minutos =====
const fechaEvento = new Date("2026-10-30T16:00:00-05:00");
const elDias = document.getElementById("dias");
const elHoras = document.getElementById("horas");
const elMinutos = document.getElementById("minutos");
const elSegundos = document.getElementById("segundos");
function actualizarContador() {
  let d = fechaEvento - new Date();
  if (d <= 0) { elDias.textContent = elHoras.textContent = elMinutos.textContent = elSegundos.textContent = "00"; return; }
  const dias = Math.floor(d / 864e5); d -= dias * 864e5;
  const horas = Math.floor(d / 36e5); d -= horas * 36e5;
  const minutos = Math.floor(d / 6e4); d -= minutos * 6e4;
  const segundos = Math.floor(d / 1000);
  elDias.textContent = String(dias).padStart(2, "0");
  elHoras.textContent = String(horas).padStart(2, "0");
  elMinutos.textContent = String(minutos).padStart(2, "0");
  elSegundos.textContent = String(segundos).padStart(2, "0");
}
actualizarContador();
setInterval(actualizarContador, 1000);

// ===== Animaciones GSAP =====
gsap.registerPlugin(ScrollTrigger);
let animado = false;
function iniciarAnimaciones() {
  if (animado) return;
  animado = true;

  gsap.timeline({ defaults: { ease: "back.out(1.7)" } })
    .from(".lateral.izq", { x: -120, opacity: 0, rotation: -12, duration: 1 })
    .from(".lateral.der", { x: 120, opacity: 0, rotation: 12, duration: 1 }, "<")
    .from(".hero-card", { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.6")
    .from(".etiqueta", { y: -20, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(".logo-huntrix span", { scale: 0, opacity: 0, rotation: -10, stagger: 0.12, duration: 0.7 }, "-=0.2")
    .from(".logo-sub", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(".foto-cumple", { scale: 0, rotation: -6, duration: 1 }, "-=0.2")
    .from(".nombre", { y: 30, opacity: 0, duration: 0.7 }, "-=0.4");

  gsap.to(".foto-cumple", { boxShadow: "0 0 45px #7cff6b", repeat: -1, yoyo: true, duration: 1.2, ease: "sine.inOut" });

  gsap.to(".lateral.izq", { y: -120, rotation: -8, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".lateral.der", { y: 120, rotation: 8, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: true } });

  gsap.utils.toArray(".seccion:not(#inicio)").forEach(sec => {
    gsap.from(sec.querySelectorAll(".titulo-seccion, .texto-centro, .glass, .btn, .confirmacion"), {
      scrollTrigger: { trigger: sec, start: "top 80%", toggleActions: "play none none none" },
      y: 40, opacity: 0, scale: 0.95, duration: 0.7, stagger: 0.12, ease: "power3.out"
    });
  });
}

// ===== Formulario RSVP → WhatsApp +52 984 168 4486 =====
const form = document.getElementById("form-rsvp");
const confirmacion = document.getElementById("confirmacion");
form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre-invitado").value.trim();
  const personas = document.getElementById("personas").value;
  const mensaje = document.getElementById("mensaje").value.trim();
  const texto = `🦇 Confirmación Cumple 4 de Alana Valentina 🎃\nNombre: ${nombre}\nPersonas: ${personas}\nFecha: viernes 30 de octubre de 2026\nLugar: Splashland, Playa del Carmen` + (mensaje ? `\nMensaje: ${mensaje}` : "");
  window.open(`https://wa.me/529841684486?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  confirmacion.hidden = false;
  gsap.from(confirmacion, { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(2)" });
  form.reset();
});
