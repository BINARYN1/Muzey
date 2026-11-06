/* ==========================================================================
   RESTAVRATSIYA BYULLETENI - INTERACTIVE ENGINE
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

    // --- 2. LIQUID DISTORTION COMPONENT (artifact-icon hover uchun emas,
    //        faqat .liquid-frame belgilangan elementlar uchun) ---
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

                targetScale = 30;
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

    // --- 4. SCROLL REVEAL ANIMATIONS ---
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

    // --- 5. OLDIN/KEYIN SOLISHTIRISH SLAYDERI ENGINE ---
    // Har bir .compare mustaqil. Pointer Events API orqali sichqoncha +
    // barmoq bilan silliq sudrash. Range input klaviatura/a11y fallback.
    document.querySelectorAll(".compare").forEach(function (compare) {
        var beforeWrap = compare.querySelector(".compare__before-wrap");
        var divider    = compare.querySelector(".compare__divider");
        var handle     = compare.querySelector(".compare__handle-btn");
        var range      = compare.querySelector(".compare__range");
        if (!beforeWrap || !divider || !handle || !range) return;

        function setPos(pct) {
            pct = Math.max(0, Math.min(100, pct));
            beforeWrap.style.width = pct + "%";
            divider.style.left     = pct + "%";
            handle.style.left      = pct + "%";
            range.value            = pct;
        }

        function toPercent(clientX) {
            var r = compare.getBoundingClientRect();
            return ((clientX - r.left) / r.width) * 100;
        }

        setPos(50);

        range.addEventListener("input", function () { setPos(+range.value); });

        var dragging = false;

        compare.addEventListener("pointerdown", function (e) {
            dragging = true;
            compare.setPointerCapture(e.pointerId);
            compare.classList.add("is-dragging");
            setPos(toPercent(e.clientX));
        });

        compare.addEventListener("pointermove", function (e) {
            if (!dragging) return;
            setPos(toPercent(e.clientX));
        });

        function stopDrag() {
            dragging = false;
            compare.classList.remove("is-dragging");
        }
        compare.addEventListener("pointerup", stopDrag);
        compare.addEventListener("pointercancel", stopDrag);

        compare.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("dragstart", function (e) { e.preventDefault(); });
        });
    });
});

// --- 6. ARTICLE MODAL POPUP SYSTEM ---
var articleData = {
    "lab-intro": {
        title: "IMPERIUM RESTAVRATSIYA LABORATORIYASI HAQIDA",
        category: "LABORATORIYA ARXIVI",
        content: `
            <p>Imperium restavratsiya laboratoriyasi 2019-yildan beri qadimiy eksponatlarni zamonaviy nanotexnologiyalar, 3D lazer skanerlash va spektroskopik tahlil yordamida asl holatiga qaytarish bilan shug'ullanadi.</p>
            <p>Har bir jarayon asarga mutlaqo tegmasdan, uning tabiiy tarkibi va tuzilishini 100% saqlab qolgan holda amalga oshiriladi. Laboratoriyada 12 nafar mutaxassis restavrator faoliyat yuritadi.</p>
            <p>Sahifadagi Dendur ibodatxonasi solishtiruvi — bu saytdagi yagona haqiqiy "oldin/keyin" ko'rgazma bo'lib, ikkala tomon ham haqiqiy tarixiy fotosuratlarga asoslangan (soxta filtr ishlatilmagan).</p>
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

// --- 7. RESTAVRATSIYA BOSQICHLARI DEKODER TIZIMI ---
var processStepData = {
    "diagnostika": {
        title: "3D Lazer Skanerlash va Mikro-Xaritalash",
        desc: "Asar sirtidagi eng kichik (0.01 mm aniqlikdagi) darzlar, mikro-yoriqlar va eroziya nuqtalari yuqori aniqlikdagi 3D lidar skanerlar yordamida to'liq xaritalashtiriladi. Bu jarayon asarga mutlaqo tegmasdan amaldagi holatini 100% aniq raqamlashtiradi.",
        metric1Label: "Skanerlash Aniqligi", metric1Val: "0.005 mm",
        metric2Label: "Vaqt Sarfi", metric2Val: "12-48 Soat",
        metric3Label: "Texnologiya", metric3Val: "Sub-mm LiDAR",
        image: "images/artifact_rome_armor.jpg"
    },
    "spektroskopiya": {
        title: "Spektroskopik Tahlil va Pigment Identifikatsiyasi",
        desc: "Rentgen-flyuoressent (XRF) va infraqizil spektroskopiya orqali asarning asl bo'yoq formulalari, metall qotishmasi va kimyoviy tarkibi o'rganiladi. Bu asarning aynan qaysi asrda va qanday moddalardan ishlanganini tasdiqlaydi.",
        metric1Label: "Rentgen Spektri", metric1Val: "XRF Ko'p Qatlamli",
        metric2Label: "Pigment Aniqligi", metric2Val: "99.9% Asl",
        metric3Label: "Tahlil Chuqurligi", metric3Val: "15 Qatlam",
        image: "images/artifact_islamic_tile.jpg"
    },
    "tozalash": {
        title: "Selektiv Lazer va Molekulyar Tozalash",
        desc: "Imkoni boricha asl sirtga zarar yetkazmagan holda, yuz yillar davomida to'plangan tutun, zang, kir va oksidlanish qatlamlari tozalash lazeri hamda neytral fermentativ formulalar bilan tozalab chiqiladi.",
        metric1Label: "Lazer Chastotasi", metric1Val: "1064 nm Nd:YAG",
        metric2Label: "Sirt Harorati", metric2Val: "< 28°C Xavfsiz",
        metric3Label: "Tozalash Darajasi", metric3Val: "Selektiv 100%",
        image: "images/artifact_egypt_diorite.jpg"
    },
    "konservatsiya": {
        title: "Inert Gazli Mikroklimat Kapsulasi",
        desc: "Restavratsiya yakunlangach, asar kislorodsiz, namligi va harorati avtomatik boshqariladigan argon gazli maxsus germetik vitrinaga joylashtiriladi. Bu kelgusi 500 yil davomida qayta yemirilishning oldini oladi.",
        metric1Label: "Atmosfera", metric1Val: "99.9% Argon",
        metric2Label: "UV Muhofaza", metric2Val: "100% Bloklash",
        metric3Label: "Saqlash Muddati", metric3Val: "500+ Yil",
        image: "images/artifact_greece_marble.jpg"
    }
};

function decodeProcessStep(stepKey, evt) {
    var resultBox = document.getElementById("symbolResultBox");
    var cards = document.querySelectorAll(".symbol-card");

    cards.forEach(function (card) { card.classList.remove("active"); });
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }

    var data = processStepData[stepKey];
    if (data && resultBox) {
        resultBox.innerHTML =
            '<div class="step-result">' +
                '<img src="' + data.image + '" alt="' + data.title + '">' +
                '<div>' +
                    '<h4>' + data.title + '</h4>' +
                    '<p>' + data.desc + '</p>' +
                    '<div class="step-metrics">' +
                        '<div class="step-metric"><span class="metric-label">' + data.metric1Label + '</span><span class="metric-value">' + data.metric1Val + '</span></div>' +
                        '<div class="step-metric"><span class="metric-label">' + data.metric2Label + '</span><span class="metric-value">' + data.metric2Val + '</span></div>' +
                        '<div class="step-metric"><span class="metric-label">' + data.metric3Label + '</span><span class="metric-value">' + data.metric3Val + '</span></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    decodeProcessStep("diagnostika", null);
});
