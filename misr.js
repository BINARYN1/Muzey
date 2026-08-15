/* ==========================================================================
   THE EGYPTIAN GAZETTE - INTERACTIVE ENGINE & SCROLL VIDEO SYNC
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
    "lead-story": {
        title: "5000 YILLIK SIRLAR VA FIR'AVNLAR SIVILIZATSIYASI",
        category: "BOSH MAQOLA ARXIVI",
        content: `
            <p>Qadimgi Misr sivilizatsiyasi Nil daryosi atrofida miloddan avvalgi 3100-yillarda tashkil topgan bo'lib, insoniyat tarixidagi eng rivojlangan va sirli jamiyatlardan biriga aylandi.</p>
            <p>Fir'avnlar davlat boshlig'i bo'lish bilan birga, xalq tomonidan ilohiy zot va ma'buda Amon-Ra o'g'li deb e'tirof etilgan. Piramidalar, Luksor ibodatxonasi va Karnak inshootlari ularning buyukligi va arxitektura sohasidagi tengsiz bilimlaridan guvohlik beradi.</p>
            <p>Bundan tashqari, mumyolash san'ati va tibbiy bilimlar Misrliklarning o'limdan keyingi hayotga bo'lgan e'tiqodi bilan uzviy bog'liq bo'lib, me'morchilik va fan taraqqiyotini belgilab bergan.</p>
        `
    },
    "pyramid-story": {
        title: "GIZA PIRAMIDALARI VA BUYUK SPHINX ANATOMIYASI",
        category: "ARXEOLOGIK TADQIQOT",
        content: `
            <p>Giza ehromlari majmuasi buyuk fir'avnlar Xufu (Xeops), Xafra va Menkaura sharafiga barpo etilgan. Eng yirik ehrom bo'lmish Buyuk Xeops piramidasi 2.3 milliondan ortiq ulkan tosh bloklardan iborat.</p>
            <p>Har bir tosh blokning og'irligi 2.5 tondan 15 tonnagacha yetadi. Qadimgi me'morlar ushbu toshlarni astronomik aniqlik bilan shimol, janub, sharq va g'arb tomonlarga yo'naltirganlar.</p>
            <p>Buyuk Sphinx esa fir'avn Xafraning yuzi va sher tanasi ko'rinishida yo'nilgan bo'lib, ming yillardan buyon piramidalar darvozasini qo'riqlab kelmoqda.</p>
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

// --- 7. HIEROGLYPH DECODER SYSTEM ---
var symbolData = {
    "ankh": {
        title: "ANKH (☥) — ABADIY HAYOT KALITI",
        desc: "Ankh Misr mifologiyasida hayot, abadiylik va ma'budlarning cheksiz qudrati simvoli hisoblanadi. Fir'avnlar qo'lida ushlab turgan ushbu kalit o'limdan keyingi qayta tug'ilish va ilohiy himoya ramzidir."
    },
    "eye": {
        title: "HORUS KO'ZI (𓁹) — MUQADDAS HIMOYACHI",
        desc: "Horus ko'zi (Udjatch) yomon ko'zlardan, kasalliklardan va yovuz ruhlardan asrovchi eng qudratli tumor sanaladi. U salomatlik, unumdorlik va fir'avnlar saltanatining daxlsizligini anglatadi."
    },
    "shen": {
        title: "SHEN UZUK (𓋹) — CHEKSIZ SALTANAT",
        desc: "Tugallanmas ilohiy ip halqasi bo'lib, uning ichiga fir'avn ismlari (kartush) yozilgan. U davlat va hukmdor ismini abadiylikka muhrlash hamda ilohiy muhofaza ostiga olish vazifasini bajargan."
    },
    "scarab": {
        title: "SKARABEY (𓃭) — QUYOSH QAYTADAN TUG'ILISHI",
        desc: "Muqaddas qo'ng'iz Skarabey har tong yangitdan ko'tariluvchi Xepri quyosh ma'budini ifodalaydi. U umid, yangilanish hamda inson ruhi (Ka)ning o'lmasligini timsollaydi."
    }
};

function decodeSymbol(symbolKey, evt) {
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
                <h4><i class="fa-solid fa-gem"></i> ${data.title}</h4>
                <p>${data.desc}</p>
            </div>
        `;
    }
}