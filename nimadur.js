document.addEventListener("DOMContentLoaded", () => {
  // Burger menyu -> assets/site.js

  const glow = document.getElementById("cursorGlow");
  if (glow) {
    window.addEventListener("mousemove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  let soundEnabled = true;
  const soundBtn = document.getElementById("soundBtn");

  function playChime(freq = 440) {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } catch(e){}
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundBtn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      soundBtn.style.opacity = soundEnabled ? '1' : '0.5';
      if(soundEnabled) playChime(587.33);
    });
  }

  const isDesktop = window.matchMedia("(min-width: 769px)").matches;
  const track = document.getElementById("timelineTrack");
  const pinSection = document.getElementById("pinSection");
  const eras = document.querySelectorAll(".era");
  const dotItems = document.querySelectorAll(".dot-item");
  const progressFill = document.getElementById("progressFill");
  const heroIntro = document.getElementById("heroIntro");

  /* ==========================================================
     VAQT MASHINASI — davrlar reyestri, konsol, parvoz, xronometr
     ========================================================== */

  const ERAS = [
    { id: "egypt",       name: "Qadimgi Misr Davri",     from: -3100, to: -30,  range: "M.A. 3100 – 30" },
    { id: "greece",      name: "Qadimgi Yunoniston",     from: -800,  to: -146, range: "M.A. 800 – 146" },
    { id: "rome",        name: "Rim Imperiyasi",         from: -27,   to: 476,  range: "M.A. 27 – milodiy 476" },
    { id: "renaissance", name: "Uyg'onish Davri",        from: 1400,  to: 1600, range: "1400 – 1600" },
    { id: "modern",      name: "Modern va Zamonaviy",    from: 1900,  to: 2025, range: "1900 – hozirgi kun" }
  ];

  const consoleEl   = document.getElementById("chronoConsole");
  const warpEl      = document.getElementById("warpScreen");
  const dial        = document.getElementById("yearDial");
  const yearPrefix  = document.getElementById("yearPrefix");
  const yearDigits  = document.getElementById("yearDigits");
  const readoutEra  = document.getElementById("readoutEra");
  const readoutRng  = document.getElementById("readoutRange");
  const presetRow   = document.getElementById("presetRow");
  const launchBtn   = document.getElementById("launchBtn");
  const skipBtn     = document.getElementById("skipBtn");
  const reopenBtn   = document.getElementById("reopenConsoleBtn");
  const warpYear    = document.getElementById("warpYear");
  const warpBar     = document.getElementById("warpBar");
  const warpNote    = document.getElementById("warpNote");
  const hudYear     = document.getElementById("hudYear");
  const hudEra      = document.getElementById("hudEra");

  let lastArrived = -1;
  let travelling = false;

  // --- Yordamchi funksiyalar ---

  function fmtYear(y) {
    y = Math.round(y);
    return y < 0 ? "M.A. " + Math.abs(y) : String(y);
  }

  // Yilga mos davrni topadi: avval yil qamrab olingan davrlardan eng kechkisi,
  // topilmasa — eng yaqin davr.
  function eraIndexForYear(y) {
    let best = -1;
    let bestFrom = -Infinity;
    ERAS.forEach((e, i) => {
      if (y >= e.from && y <= e.to && e.from > bestFrom) { best = i; bestFrom = e.from; }
    });
    if (best !== -1) return best;

    let minDist = Infinity;
    ERAS.forEach((e, i) => {
      const dist = y < e.from ? e.from - y : y - e.to;
      if (dist < minDist) { minDist = dist; best = i; }
    });
    return best;
  }

  // Gorizontal aylanish progressini (0..1) yilga aylantiradi
  function yearAtProgress(p) {
    const n = ERAS.length;
    const f = Math.max(0, Math.min(1, p)) * (n - 1);
    const i = Math.min(Math.floor(f), n - 2);
    const t = f - i;
    return ERAS[i].from + (ERAS[i + 1].from - ERAS[i].from) * t;
  }

  // --- Bort xronometri ---

  function updateChrono(year) {
    if (!hudYear) return;
    hudYear.textContent = fmtYear(year);
    const era = ERAS[eraIndexForYear(Math.round(year))];
    if (hudEra && era) hudEra.textContent = era.name;
  }

  function markArrival(index) {
    // Parvoz paytida oraliq davrlarda shtamp/ovoz chiqmasin
    if (travelling || index === lastArrived || !eras[index]) return;
    lastArrived = index;
    const era = eras[index];
    era.classList.remove("arrived");
    void era.offsetWidth; // animatsiyani qayta ishga tushirish uchun reflow
    era.classList.add("arrived");
    playChime(392 + index * 48);
  }

  // Har bir davrga "qo'nildi" shtampini qo'shamiz
  eras.forEach((era, i) => {
    const stamp = document.createElement("div");
    stamp.className = "arrival-stamp";
    stamp.textContent = "Qo'nildi • " + (ERAS[i] ? ERAS[i].range : "");
    era.appendChild(stamp);
  });

  let horizontalTween;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && isDesktop) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    horizontalTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: pinSection,
        start: "top top",
        end: () => "+=" + (track.scrollWidth - window.innerWidth),
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progressFill) progressFill.style.width = (progress * 100) + "%";

          if (heroIntro) {
            if (progress > 0.02) heroIntro.classList.add("hidden");
            else heroIntro.classList.remove("hidden");
          }

          const activeIndex = Math.round(progress * (eras.length - 1));
          updateActiveDot(activeIndex);
          updateChrono(yearAtProgress(progress));
          markArrival(activeIndex);
        }
      }
    });

    eras.forEach((era) => {
      const bgText = era.querySelector(".era__bg-year");
      if (bgText) {
        const speed = parseFloat(bgText.getAttribute("data-speed")) || 0.25;
        gsap.to(bgText, {
          x: () => -(window.innerWidth * speed),
          ease: "none",
          scrollTrigger: {
            trigger: era,
            containerAnimation: horizontalTween,
            start: "left right",
            end: "right left",
            scrub: true
          }
        });
      }
    });

  }

  window.scrollToEra = function(index) {
    playChime(440 + index * 60);
    // DIQQAT: Lenis yoqilganda oynani native usulda surish mumkin emas.
    // gsap ScrollToPlugin ham, scrollIntoView ham scroll pozitsiyasini
    // to'g'ridan-to'g'ri o'zgartiradi, Lenis esa buni sezmaydi va o'z
    // ichki holati bilan desinxron bo'lib qoladi (natijada scroll
    // qotib qoladi). Shuning uchun Lenis bor bo'lsa, u orqali boramiz.
    const lenis = window.imperiumLenis;
    if (horizontalTween && horizontalTween.scrollTrigger) {
      const st = horizontalTween.scrollTrigger;
      const targetProgress = index / (eras.length - 1);
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        gsap.to(window, { scrollTo: targetScroll, duration: 1.2, ease: "power2.inOut" });
      }
    } else if (lenis) {
      lenis.scrollTo(eras[index], { duration: 1.2 });
    } else {
      eras[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  function updateActiveDot(index) {
    dotItems.forEach((dot, idx) => {
      if (idx === index) dot.classList.add("active");
      else dot.classList.remove("active");
    });
  }


  // --- Konsol boshqaruvi ---

  function syncConsole(year) {
    const idx = eraIndexForYear(year);
    const era = ERAS[idx];
    if (yearPrefix) yearPrefix.textContent = year < 0 ? "M.A." : "MILODIY";
    if (yearDigits) yearDigits.textContent = Math.abs(Math.round(year));
    if (readoutEra) readoutEra.textContent = era.name;
    if (readoutRng) readoutRng.textContent = era.range;

    if (presetRow) {
      presetRow.querySelectorAll(".preset-chip").forEach((chip) => {
        chip.classList.toggle("active", eraIndexForYear(+chip.dataset.year) === idx);
      });
    }
    return idx;
  }

  function openConsole() {
    if (!consoleEl) return;
    consoleEl.classList.remove("closed");
    document.body.classList.add("console-open");
  }

  function closeConsole() {
    if (!consoleEl) return;
    consoleEl.classList.add("closed");
    document.body.classList.remove("console-open");
  }

  // Ko'rsatilgan davrga darhol (parda ortida) o'tish
  function jumpToEra(index) {
    const lenis = window.imperiumLenis;
    if (horizontalTween && horizontalTween.scrollTrigger) {
      const st = horizontalTween.scrollTrigger;
      const targetProgress = index / (eras.length - 1);
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      if (lenis) {
        lenis.scrollTo(targetScroll, { immediate: true });
      } else {
        window.scrollTo(0, targetScroll);
      }
    } else if (eras[index]) {
      if (lenis) {
        lenis.scrollTo(eras[index], { immediate: true });
      } else {
        eras[index].scrollIntoView();
      }
    }
  }

  // --- Parvoz (warp) animatsiyasi ---

  function launch(targetYear) {
    if (travelling || !warpEl) return;
    travelling = true;

    const targetIdx = eraIndexForYear(targetYear);
    const startYear = new Date().getFullYear();
    const duration = 1500;

    closeConsole();
    warpEl.classList.add("active");

    const t0 = performance.now();

    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // tez boshlanib, sekin to'xtaydi

      if (warpYear) warpYear.textContent = fmtYear(startYear + (targetYear - startYear) * eased);
      if (warpBar) warpBar.style.width = (p * 100) + "%";
      if (warpNote) {
        warpNote.textContent =
          p < 0.35 ? "Xrono-yadro quvvat to'plamoqda…" :
          p < 0.75 ? "Asrlar qatlamidan o'tilmoqda…" :
                     "Qo'nishga tayyorgarlik…";
      }

      if (p < 1) {
        requestAnimationFrame(step);
        return;
      }

      // Parda ortida kerakli davrga o'tamiz
      jumpToEra(targetIdx);
      lastArrived = -1;
      updateChrono(ERAS[targetIdx].from);
      if (warpNote) warpNote.textContent = "Qo'nish amalga oshirilmoqda…";

      // GSAP scrub (1s) tugab, lenta joyiga o'tirgach pardani ko'taramiz —
      // aks holda bir lahza bo'sh ekran ko'rinadi.
      setTimeout(() => {
        warpEl.classList.remove("active");
        travelling = false;
        markArrival(targetIdx);
        updateActiveDot(targetIdx);
      }, 1150);
    }

    requestAnimationFrame(step);
  }

  // --- Hodisalarni ulash ---

  if (dial) {
    syncConsole(+dial.value);
    dial.addEventListener("input", () => syncConsole(+dial.value));
  }

  if (presetRow) {
    presetRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".preset-chip");
      if (!chip) return;
      if (dial) dial.value = chip.dataset.year;
      syncConsole(+chip.dataset.year);
      playChime(523.25);
    });
  }

  if (launchBtn) launchBtn.addEventListener("click", () => launch(dial ? +dial.value : -3100));
  if (skipBtn) skipBtn.addEventListener("click", closeConsole);
  if (reopenBtn) reopenBtn.addEventListener("click", openConsole);

  // Konsolning bo'sh joyiga bosilsa yopiladi
  if (consoleEl) {
    consoleEl.addEventListener("click", (e) => {
      if (e.target === consoleEl) closeConsole();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModal();
    if (consoleEl && !consoleEl.classList.contains("closed")) closeConsole();
  });

  // Sahifa ochilishida konsol ko'rinadi
  openConsole();
  updateChrono(ERAS[0].from);

  // Mobil (gorizontal pin ishlamaydigan) rejim uchun xronometr
  if (!isDesktop) {
    const syncMobileChrono = () => {
      const mid = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;
      eras.forEach((era, i) => {
        const r = era.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      updateChrono(ERAS[closest].from);
      updateActiveDot(closest);
      markArrival(closest);
    };
    window.addEventListener("scroll", syncMobileChrono, { passive: true });
    syncMobileChrono();
  }

  // --- Eksponat kartalari (data-* atributlari orqali) ---
  document.querySelectorAll(".artifact-card").forEach((card) => {
    card.addEventListener("click", () => {
      openModal(card.dataset.title, card.dataset.desc, card.dataset.date, card.dataset.material);
    });
  });

  const modalOverlay = document.getElementById("artifactModal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
});

function openModal(title, desc, date, material) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalBody").innerText = desc;
  document.getElementById("modalDate").innerText = date;
  document.getElementById("modalMaterial").innerText = material;
  document.getElementById("artifactModal").classList.add("active");
}

function closeModal() {
  document.getElementById("artifactModal").classList.remove("active");
}   

window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('is-solid');
  } else {
    header.classList.remove('is-solid');
  }
});


const hieroMap = {
  'a': '𓂝', 'b': '𓃀', 'c': '𓎡', 'd': '𓂧', 'e': '𓏟', 'f': '𓆑',
  'g': '𓎡', 'h': '𓈃', 'i': '𓏌', 'j': '𓆓', 'k': '𓎡', 'l': '𓃭',
  'm': '𓅯', 'n': '𓈖', 'o': '𓏲', 'p': ' p', 'q': '𓎛', 'r': '𓂋',
  's': '𓋴', 't': '𓏏', 'u': '𓏲', 'v': '𓆑', 'w': '𓏲', 'x': '𓎡𓋴',
  'y': '𓏌', 'z': '𓍿'
};

function convertToHieroglyph() {
  const text = document.getElementById("userInput").value.toLowerCase();
  let result = "";
  for (let char of text) {
    result += hieroMap[char] || char;
  }
  document.getElementById("hieroglyphResult").innerText = result;
}

const synth = window.speechSynthesis;
const guideText = "Imperium raqamli muzeyiga xush kelibsiz! Siz Qadimgi Yunoniston bo'limidasiz. Bu yerda siz demokratiya, falsafa, teatr va mukammal haykaltaroshlik durdonalari bilan tanishishingiz mumkin. Saytda harakatlanish uchun sichqonchadan foydalaning.";

let utterance = new SpeechSynthesisUtterance(guideText);

// O'qish tezligi va tonini erkak kishiga mosroq qilib pasaytiramiz
utterance.rate = 0.85; // Biroz sekin va aniq
utterance.pitch = 0.8; // Ovoz tonini pastroq (yo'g'onroq) qilamiz

// Qurilmadagi ovozlar ichidan O'zbek va Erkak ovozini izlash
function setBestMaleVoice() {
  let voices = synth.getVoices();
  
  // 1-o'rinda: O'zbek tilidagi Erkak ovozini qidiramiz
  let uzbekMale = voices.find(v => v.lang.includes('uz') && v.name.toLowerCase().includes('male'));
  
  // 2-o'rinda: Har qanday o'zbekcha ovoz
  let uzbekAny = voices.find(v => v.lang.includes('uz'));
  
  // 3-o'rinda: Rus tilidagi erkak ovozi (aksent bilan bo'lsa ham yo'g'onroq chiqishi uchun)
  let russianMale = voices.find(v => v.lang.includes('ru') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('pavel') || v.name.toLowerCase().includes('boris')));

  if (uzbekMale) {
    utterance.voice = uzbekMale;
  } else if (uzbekAny) {
    utterance.voice = uzbekAny;
  } else if (russianMale) {
    utterance.voice = russianMale;
  }
}

// Ovozlar yuklanganda ishga tushirish
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = setBestMaleVoice;
} else {
  setBestMaleVoice();
}

const playBtn = document.getElementById('playBtn');
const playText = document.getElementById('playText');
const audioTimer = document.getElementById('audioTimer');

let timerInterval;
let seconds = 0;

function toggleAudioGuide() {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    playText.innerText = "DAVOM ETISH";
    playBtn.classList.remove('playing');
    clearInterval(timerInterval);
  } else if (synth.paused) {
    synth.resume();
    playText.innerText = "TO'XTATISH";
    playBtn.classList.add('playing');
    startTimer();
  } else {
    synth.speak(utterance);
    playText.innerText = "TO'XTATISH";
    playBtn.classList.add('playing');
    seconds = 0;
    startTimer();
  }
}

utterance.onend = function() {
  playText.innerText = "ESHITISH";
  playBtn.classList.remove('playing');
  clearInterval(timerInterval);
  audioTimer.innerText = "00:00";
  seconds = 0;
};

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    audioTimer.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }, 1000);
}

