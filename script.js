/* =====================================
   СТАРТОВОЕ СЕРДЦЕ
===================================== */

const heartOverlay = document.getElementById("heartOverlay");
const heartIcon = document.getElementById("heartIcon");

let heartClicks = 0;
const maxHeartClicks = 10;
const heartScales = [1.15, 1.35, 1.65, 2.05, 2.6, 3.4, 4.6, 6.5, 9.5, 14];

heartIcon.addEventListener("click", function () {
  if (heartIcon.classList.contains("explode")) return;

  heartClicks++;
  heartIcon.classList.remove("pulse");

  const scale = heartScales[heartClicks - 1];
  heartIcon.style.setProperty("--final-scale", scale);
  heartIcon.style.transform = `scale(${scale})`;

  if (heartClicks === maxHeartClicks) {
    setTimeout(explodeHeart, 350);
  }
});

function explodeHeart() {
  const rect = heartIcon.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  heartIcon.classList.add("explode");

  const particleCount = 70;
  const particles = ["❤", "♥", "♡"];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 700;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    particle.style.left = centerX + "px";
    particle.style.top = centerY + "px";
    particle.style.fontSize = 16 + Math.random() * 45 + "px";
    particle.style.setProperty("--x", x + "px");
    particle.style.setProperty("--y", y + "px");
    particle.style.setProperty("--rotation", (Math.random() * 1080 - 540) + "deg");

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1500);
  }

  setTimeout(() => heartOverlay.classList.add("hidden"), 700);
}


/* =====================================
   ФОТО-КАРУСЕЛЬ
===================================== */

const carouselTrack = document.getElementById("carouselTrack");
const slides = Array.from(carouselTrack.children);
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const carouselDots = document.getElementById("carouselDots");

let currentSlide = 0;

function getVisibleSlides() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function getMaximumSlide() {
  return Math.max(0, slides.length - getVisibleSlides());
}

function createDots() {
  carouselDots.innerHTML = "";
  const totalDots = getMaximumSlide() + 1;

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    if (i === currentSlide) dot.classList.add("active");

    dot.addEventListener("click", function () {
      currentSlide = i;
      updateCarousel();
    });

    carouselDots.appendChild(dot);
  }
}

function updateCarousel() {
  const firstSlide = slides[0];
  if (!firstSlide) return;

  const slideWidth = firstSlide.offsetWidth;
  const gap = 18;

  carouselTrack.style.transform =
    `translateX(-${currentSlide * (slideWidth + gap)}px)`;

  const dots = Array.from(carouselDots.children);
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function nextSlide() {
  const maximum = getMaximumSlide();
  currentSlide = currentSlide >= maximum ? 0 : currentSlide + 1;
  updateCarousel();
}

function previousSlide() {
  const maximum = getMaximumSlide();
  currentSlide = currentSlide <= 0 ? maximum : currentSlide - 1;
  updateCarousel();
}

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", previousSlide);

createDots();

let carouselInterval = setInterval(nextSlide, 4000);

function stopAutoSlide() { clearInterval(carouselInterval); }
function startAutoSlide() {
  stopAutoSlide();
  carouselInterval = setInterval(nextSlide, 4000);
}

carouselTrack.addEventListener("mouseenter", stopAutoSlide);
carouselTrack.addEventListener("mouseleave", startAutoSlide);

window.addEventListener("resize", function () {
  const maximum = getMaximumSlide();
  if (currentSlide > maximum) currentSlide = maximum;
  createDots();
  updateCarousel();
});


/* =====================================
   МУЗЫКА
===================================== */

const music = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
let musicIsPlaying = false;

musicButton.addEventListener("click", function () {
  if (musicIsPlaying) {
    music.pause();
    musicButton.textContent = "▶";
    musicIsPlaying = false;
  } else {
    music.play()
      .then(() => {
        musicButton.textContent = "❚❚";
        musicIsPlaying = true;
      })
      .catch(() => {
        alert("Добавь музыку рядом с index.html");
      });
  }
});


/* =====================================
   КАЧЕСТВА
===================================== */

document.querySelectorAll(".quality-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("open"));
});


/* =====================================
   СЕКРЕТ
===================================== */

const secretButton = document.getElementById("secretButton");
const secretMessage = document.getElementById("secretMessage");

secretButton.addEventListener("click", function () {
  secretMessage.classList.toggle("active");
  secretButton.textContent = secretMessage.classList.contains("active")
    ? "Скрыть ♡"
    : "Узнать ♡";
});


/* =====================================
   ВИДЕО-КАРУСЕЛЬ
===================================== */

(() => {
  const track = document.getElementById("videoTrack");
  if (!track) return;

  const slides = [...track.children];
  const dots = [...document.querySelectorAll(".vc-dot")];
  let i = 0;

  slides.forEach((slide) => {
    const video = slide.querySelector("video");
    if (!video) return;

    const apply = () => {
      if (!slide.dataset.orientation && video.videoWidth && video.videoHeight) {
        slide.dataset.orientation =
          video.videoWidth < video.videoHeight ? "vertical" : "horizontal";
      }
    };

    if (video.readyState >= 1) apply();
    else video.addEventListener("loadedmetadata", apply, { once: true });
  });

  const go = (n) => {
    i = (n + slides.length) % slides.length;

    const width = slides[0].offsetWidth;
    track.style.transform = `translateX(-${i * width}px)`;

    dots.forEach((d, k) => d.classList.toggle("active", k === i));

    slides.forEach((s, k) => {
      const v = s.querySelector("video");
      if (v && k !== i) v.pause();
    });
  };

  document.getElementById("vcNext").onclick = () => go(i + 1);
  document.getElementById("vcPrev").onclick = () => go(i - 1);
  dots.forEach((d, k) => (d.onclick = () => go(k)));

  let x0 = 0;
  track.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => {
    const dx = x0 - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) go(i + (dx > 0 ? 1 : -1));
  }, { passive: true });

  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  go(i - 1);
    if (e.key === "ArrowRight") go(i + 1);
  });

  addEventListener("resize", () => go(i));
  addEventListener("load",   () => go(i));
})();