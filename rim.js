/* ==========================================================================
   SPQR THE ROMAN GAZETTE - INTERACTIVE ENGINE & SCROLL VIDEO SYNC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. CODROPS D3ADRABBIT IMAGE ENTRANCE ANIMATION ENGINE ---
    (function initImageEntranceAnimation() {
        var entranceFrames = document.querySelectorAll(".entrance-img-frame");
        if (entranceFrames.length === 0) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        entranceFrames.forEach(function (frame) {
            if (!frame.querySelector(".entrance-curtain")) {
                var curtain = document.createElement("div");
                curtain.className = "entrance-curtain";
                frame.appendChild(curtain);
            }
            observer.observe(frame);
        });
    })();

    // --- 2. LIQUID DISTORTION COMPONENT ---
    (function initLiquidDistortion() {
        var displacement = document.querySelector("#liquid-displacement");
        var frames = document.querySelectorAll(".liquid-frame");
        if (!displacement || frames.length === 0) return;

        var currentScale = 0;
        var targetScale = 0;
        var animFrame = null;

        function animateDisplacement() {
            currentScale += (targetScale - currentScale) * 0.15;
            displacement.setAttribute("scale", currentScale.toFixed(2));

            if (Math.abs(targetScale - currentScale) > 0.1) {
                animFrame = requestAnimationFrame(animateDisplacement);
            } else {
                currentScale = targetScale;
                displacement.setAttribute("scale", currentScale.toFixed(2));
                animFrame = null;
            }
        }

        frames.forEach(function (frame) {
            frame.addEventListener("mousemove", function (e) {
                var rect = frame.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width) * 100;
                var y = ((e.clientY - rect.top) / rect.height) * 100;

                frame.style.setProperty("--mouse-x", x.toFixed(1) + "%");
                frame.style.setProperty("--mouse-y", y.toFixed(1) + "%");

                targetScale = 30; // Liquid wave intensity
                if (!animFrame) {
                    animFrame = requestAnimationFrame(animateDisplacement);
                }
            });

            frame.addEventListener("mouseleave", function () {
                targetScale = 0;
                if (!animFrame) {
                    animFrame = requestAnimationFrame(animateDisplacement);
                }
            });
        });
    })();

    // --- 3. TYPEWRITER EFFECT COMPONENT ---
    (function initTypewriter() {
        var targets = document.querySelectorAll(".typewriter-target");
        targets.forEach(function (el) {
            var wordsAttr = el.getAttribute("data-words");
            if (!wordsAttr) return;

            try {
                var words = JSON.parse(wordsAttr);
                var wordIndex = 0;
                var charIndex = 0;
                var isDeleting = false;

                function type() {
                    var currentWord = words[wordIndex];
                    var speed = 70;

                    if (isDeleting) {
                        el.textContent = currentWord.substring(0, charIndex - 1);
                        charIndex--;
                        speed = 35;
                    } else {
                        el.textContent = currentWord.substring(0, charIndex + 1);
                        charIndex++;
                        speed = 70;
                    }

                    if (!isDeleting && charIndex === currentWord.length) {
                        speed = 2200;
                        isDeleting = true;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                        speed = 400;
                    }

                    setTimeout(type, speed);
                }

                type();
            } catch (_) {}
        });
    })();

    // --- 4. FULL-PAGE SCROLL VIDEO SCRUBBING ENGINE ---
    (function initVideoScrub() {
        var heroVideo = document.querySelector("#hero-video");
        if (!heroVideo) return;

        var targetTime = 0;
        var renderedTime = 0;

        function getDuration() {
            if (heroVideo.duration && Number.isFinite(heroVideo.duration) && heroVideo.duration > 0) {
                return heroVideo.duration;
            }
            return 10;
        }

        try {
            heroVideo.load();
        } catch (_) {}

        function updateScrollTarget() {
            var scrollY = window.scrollY || window.pageYOffset || 0;
            var maxScroll = Math.max(
                1,
                document.documentElement.scrollHeight - window.innerHeight
            );
            var progress = Math.min(1, Math.max(0, scrollY / maxScroll));
            var dur = getDuration();
            targetTime = Math.min(Math.max(0, dur - 0.05), dur * progress);
        }

        window.addEventListener("scroll", updateScrollTarget, { passive: true });
        window.addEventListener("resize", updateScrollTarget, { passive: true });
        updateScrollTarget();

        function tick() {
            renderedTime += (targetTime - renderedTime) * 0.2;
            if (Math.abs(heroVideo.currentTime - renderedTime) > 0.01) {
                try {
                    heroVideo.currentTime = renderedTime;
                } catch (_) {}
            }
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    })();

    // --- 5. SCROLL REVEAL ANIMATIONS ---
    function initScrollReveal() {
        var revealElements = document.querySelectorAll(".reveal");

        function checkReveal() {
            var windowHeight = window.innerHeight;
            revealElements.forEach(function (element) {
                var elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - 80) {
                    element.classList.add("active");
                    element.classList.add("show");
                }
            });
        }

        window.addEventListener("scroll", checkReveal, { passive: true });
        checkReveal();
    }

    initScrollReveal();
});

// --- 6. ARTICLE MODAL POPUP SYSTEM ---
// Eslatma: ilgari shu yerda setGazetteTheme() bo'lgan (Dark/Sepia/Gold).
// Tema endi saytning umumiy tizimida — assets/site.js dagi
// initThemeToggle() va <html data-theme="dark">.
var articleData = {
    "roman-lead": {
        title: "QADIMGI RIM: QAYSARLAR, GLADIATORLAR VA BUYUK IMPERIYA",
        category: "SPQR SENAT ARXIVI",
        content: `
            <p>Qadimgi Rim imperiyasi O'rtayer dengizi va butun antik dunyo sivilizatsiyasining markazi edi. Rim huquqi, Senat boshqaruvi hamda me'morchilik maktabi zamonaviy davlatlar poydevoriga aylangan.</p>
            <p>Yuliy Sezar, Avgust va Mark Avreliy kabi buyuk hukmdorlar davrida Rim san'at, falsafa hamda harbiy qudrat cho'qqisiga erishgan. Rim legionlarining temir intizomi imperiya chegaralarini Shotlandiyadan tortib Fors ko'rfazigacha kengaytirdi.</p>
            <p>Arxitekturada beton va gumbaz texnologiyasining kashf qilinishi Panteon hamda Kolizey kabi tengsiz obidalarning bitkazilishiga zamin yaratdi.</p>
        `
    },
    "colosseum-story": {
        title: "BUYUK KOLIZEY VA GLADIATORLAR JANGI ANATOMIYASI",
        category: "ARENA ARXIVI",
        content: `
            <p>Kolizey (Flaviy Amfiteatri) milodiy 80-yilda bitkazilgan bo'lib, uning ochilish tantanalari 100 kun davom etgan. Amfiteatr ostidagi murakkab yer osti yo'laklari (Gipogey) orqali gladiatorlar va yirtqich hayvonlar maxsus liftlarda arenaga olib chiqilgan.</p>
            <p>Katta bayram kunlarida Kolizey suv bilan to'ldirilib, arenada haqiqiy dengiz janglari (Navmaxiyalar) o'tkazilgan.</p>
            <p>Gladiatorlar jangchilari mardlik, harbiy sharaf hamda ozodlik uchun kurashgan Rim jamiyatining eng jozibali qahramonlaridan biri edi.</p>
        `
    }
};

function openArticleModal(articleKey) {
    var modal = document.getElementById("articleModal");
    var titleEl = document.getElementById("modalTitle");
    var bodyEl = document.getElementById("modalBody");

    var data = articleData[articleKey];
    if (data) {
        titleEl.textContent = data.title;
        bodyEl.innerHTML = data.content;
        modal.classList.add("open");
    }
}

function closeArticleModal() {
    var modal = document.getElementById("articleModal");
    modal.classList.remove("open");
}

document.addEventListener("click", function (e) {
    var modal = document.getElementById("articleModal");
    if (e.target === modal) {
        closeArticleModal();
    }
});

// --- 7. LATIN MOTTO DECODER SYSTEM ---
var symbolData = {
    "spqr": {
        title: "S.P.Q.R. — Senatus Populusque Romanus",
        desc: "Senat va Rim Xalqi. Rim Respublikasi hamda Imperiyasining rasmiy muhr-shiori. U davlat hokimiyati xalq va Senat birligiga tayanishini anglatadi."
    },
    "veni": {
        title: "VENI, VIDI, VICI — Keldim, Ko'rdim, Yengdim",
        desc: "Yuliy Sezarning Zela jangidagi tezkor va yaltiroq g'alabasidan so'ng Senatga yuborgan afsonaviy uch so'zli g'alaba maktubidir."
    },
    "carpe": {
        title: "CARPE DIEM — Lahzani Qadrla",
        desc: "Rim shoiri Goratsiyning mashhur iborasi: Har bir o'tayotgan kun va lahzadan unumli foydalan, ertangi kunga ortiqcha suyanma."
    },
    "alea": {
        title: "ALEA IACTA EST — Qur'a Tashlandi",
        desc: "Yuliy Sezar miloddan avvalgi 49-yilda Rubikon daryosidan o'tayotganda aytgan tarixiy iborasi. Ortga yo'l yo'qligi va qat'iy qaror qabul qilinganini bildiradi."
    }
};

function decodeRomanMotto(symbolKey, evt) {
    var resultBox = document.getElementById("symbolResultBox");
    var cards = document.querySelectorAll(".symbol-card");

    cards.forEach(function(card) {
        card.classList.remove("active");
    });

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }

    var data = symbolData[symbolKey];
    if (data && resultBox) {
        resultBox.innerHTML = `
            <div class="symbol-result-card">
                <h4><i class="fa-solid fa-crown"></i> ${data.title}</h4>
                <p>${data.desc}</p>
            </div>
        `;
    }
}
