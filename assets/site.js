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
    if (burgerBtn.dataset.boundBurger === "true") return;
    burgerBtn.dataset.boundBurger = "true";

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
    if (btn.dataset.boundTheme === "true") return;
    btn.dataset.boundTheme = "true";

    paintToggle(btn, currentTheme());

    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      paintToggle(btn, next);
    });
  }

  /* --- Tilni tanlash va Google Translate integratsiyasi --- */
  var LANG_STORAGE_KEY = "imperium-lang";

  function getSavedLang() {
    var match = document.cookie.match(/googtrans=\/[^/]+\/([a-z-]+)/i);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || "uz";
    } catch (e) {
      return "uz";
    }
  }

  function setGoogleTransCookie(lang) {
    var host = window.location.hostname;
    var path = "/";
    if (lang === "uz" || !lang) {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path + ";";
      if (host) {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path + "; domain=" + host + ";";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path + "; domain=." + host + ";";
      }
    } else {
      var val = "/auto/" + lang;
      document.cookie = "googtrans=" + val + "; path=" + path + ";";
      if (host) {
        document.cookie = "googtrans=" + val + "; path=" + path + "; domain=" + host + ";";
        document.cookie = "googtrans=" + val + "; path=" + path + "; domain=." + host + ";";
      }
    }
  }

  function changeLanguage(lang) {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {}

    setGoogleTransCookie(lang);

    var combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang === "uz" ? "" : lang;
      combo.dispatchEvent(new Event("change"));
      if (lang === "uz") {
        setTimeout(function () {
          window.location.reload();
        }, 120);
      }
    } else {
      window.location.reload();
    }
  }

  function injectGoogleTranslate() {
    if (!document.getElementById("google_translate_element")) {
      var div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";
      document.body.appendChild(div);
    }

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "uz",
              includedLanguages: "uz,en,ru,fr,de,tr,ar",
              autoDisplay: false
            },
            "google_translate_element"
          );
        }
      };
    }

    if (!document.getElementById("google-translate-script")) {
      var script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
  }

  function initLanguageSelector() {
    var headerRight = document.querySelector(".header-right-group");
    if (!headerRight) return;
    if (document.getElementById("langSelector")) return;

    var themeToggle = document.getElementById("themeToggle");
    var currentLang = getSavedLang();

    var langLabels = {
      uz: "UZ",
      en: "EN",
      ru: "RU",
      fr: "FR",
      de: "DE",
      tr: "TR",
      ar: "AR"
    };

    var currentLabel = langLabels[currentLang] || currentLang.toUpperCase();

    var selector = document.createElement("div");
    selector.className = "lang-selector";
    selector.id = "langSelector";
    selector.innerHTML =
      '<button class="lang-btn" id="langBtn" type="button" aria-label="Tilni tanlash" aria-expanded="false">' +
      '<i class="fa-solid fa-globe lang-globe"></i>' +
      '<span class="lang-code" id="langCurrentCode">' + currentLabel + '</span>' +
      '<i class="fa-solid fa-chevron-down lang-chevron"></i>' +
      '</button>' +
      '<div class="lang-dropdown" id="langDropdown" role="menu">' +
      '<button type="button" class="lang-item' + (currentLang === "uz" ? " active" : "") + '" data-lang="uz"><span class="lang-flag">🇺🇿</span> O\'zbekcha</button>' +
      '<button type="button" class="lang-item' + (currentLang === "en" ? " active" : "") + '" data-lang="en"><span class="lang-flag">🇬🇧</span> English</button>' +
      '<button type="button" class="lang-item' + (currentLang === "ru" ? " active" : "") + '" data-lang="ru"><span class="lang-flag">🇷🇺</span> Русский</button>' +
      '<button type="button" class="lang-item' + (currentLang === "fr" ? " active" : "") + '" data-lang="fr"><span class="lang-flag">🇫🇷</span> Français</button>' +
      '<button type="button" class="lang-item' + (currentLang === "de" ? " active" : "") + '" data-lang="de"><span class="lang-flag">🇩🇪</span> Deutsch</button>' +
      '<button type="button" class="lang-item' + (currentLang === "tr" ? " active" : "") + '" data-lang="tr"><span class="lang-flag">🇹🇷</span> Türkçe</button>' +
      '<button type="button" class="lang-item' + (currentLang === "ar" ? " active" : "") + '" data-lang="ar"><span class="lang-flag">🇸🇦</span> العربية</button>' +
      '</div>';

    if (themeToggle) {
      headerRight.insertBefore(selector, themeToggle);
    } else {
      headerRight.appendChild(selector);
    }

    var langBtn = selector.querySelector("#langBtn");

    langBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = selector.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function () {
      selector.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    });

    selector.querySelectorAll(".lang-item").forEach(function (opt) {
      opt.addEventListener("click", function (e) {
        e.stopPropagation();
        var targetLang = this.getAttribute("data-lang");
        selector.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
        changeLanguage(targetLang);
      });
    });

    injectGoogleTranslate();
  }

  /* --- Silliq scroll (Lenis) --- */
  function initSmoothScroll() {
    if (!window.Lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.getElementById("ishWrapper") || window.__skipSiteSmoothScroll) return;

    var lenis = new window.Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: "vertical",
    });

    window.imperiumLenis = lenis;

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
    initLanguageSelector();
    initSmoothScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
