/* ==========================================================
   UMUMIY SAYT SKRIPTI
   ----------------------------------------------------------
   Ilgari bu kod 10 joyda takrorlangan edi: museylar.js,
   museyHaqida.js, xarita.js, galereya.js, 3d.js, 360zal.js,
   victarina.js, nimadur.js, script.js va zallar.html inline.
   Hammasi bir xil ikkita id ni ishlatadi: #burgerBtn, #navMenu.
   ========================================================== */
(function () {
  "use strict";

  /* --- Burger menyu --- */
  function initBurger() {
    var burgerBtn = document.getElementById("burgerBtn");
    var navMenu = document.getElementById("navMenu");
    if (!burgerBtn || !navMenu) return;

    burgerBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      burgerBtn.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        burgerBtn.classList.remove("open");
      });
    });
  }

  /* --- Tungi rejim --- */
  var STORAGE_KEY = "imperium-theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function paintToggle(btn, theme) {
    var icon = btn.querySelector("i");
    if (icon) {
      icon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"
    );
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* privat rejimda localStorage yopiq bo'lishi mumkin — muhim emas */
    }
  }

  function initThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    paintToggle(btn, currentTheme());

    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      paintToggle(btn, next);
    });
  }

  /* --- Silliq scroll (Lenis) --- */
  function initSmoothScroll() {
    if (!window.Lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;


    var lenis = new window.Lenis({
      // DIQQAT: Lenis'da `lerp` berilsa `duration`/`easing` e'tiborga
      // olinmaydi — ikkalasini birga yozish ma'nosiz. Faqat lerp.
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Telefonda barmoq bilan scroll tizimniki bo'lib qolsin —
      // u yerda brauzerning o'zi allaqachon silliq va tezroq.
      syncTouch: false,
      gestureOrientation: "vertical",
    });

    window.imperiumLenis = lenis;

    // Sahifa o'rtasida turib F5 bosilsa, brauzer scroll pozitsiyasini
    // native usulda tiklaydi. Lenis buni sezmaydi va o'z holati 0 da
    // qolib ketadi — natijada scroll bilan bog'liq hamma narsa (video,
    // ScrollTrigger) birinchi g'ildirak harakatigacha eski holatda
    // turadi. Tiklash `load` dan keyin bo'ladi, shuning uchun o'sha
    // paytda bir marta tekshirib sinxronlaymiz.
    window.addEventListener(
      "load",
      function () {
        if (Math.abs(lenis.scroll - window.scrollY) > 1) {
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        }
      },
      { once: true },
    );

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;

    if (gsap && ScrollTrigger) {
      // Bu ulanishsiz ScrollTrigger Lenis'dan orqada qoladi va
      // nimadur.html dagi gorizontal pin titraydi.
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) {
        lenis.raf(time);
        window.requestAnimationFrame(raf);
      };
      window.requestAnimationFrame(raf);
    }

    // scroll-behavior o'chirilgani uchun ichki havolalar sakrab
    // ketardi — ularni Lenis orqali silliq olib boramiz.
    // Manzilni element sifatida emas, son sifatida beramiz: element
    // bilan chaqirilganda Lenis o'rinni o'zi o'lchaydi va bu boshqa
    // scroll amali bilan bir kadrda tushib qolsa noto'g'ri chiqadi.
    // Header fixed va 90px balandlikda — shuncha joy qoldiramiz.
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 90;
        lenis.scrollTo(Math.max(0, top));
      });
    });
  }

  function init() {
    initBurger();
    initThemeToggle();
    initSmoothScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
