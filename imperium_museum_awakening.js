/* ==========================================================================
   UYG'ONISH GAZETASI - INTERAKTIV DVIGATEL
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
});

// --- 5. ARTICLE MODAL POPUP SYSTEM ---
// Eslatma: tema saytning umumiy tizimida — assets/site.js dagi
// initThemeToggle() va <html data-theme="dark">.
var articleData = {
    "uygonish-lead": {
        title: "SHARQ VA G'ARB UYG'ONISHI: TAFAKKURNING QAYTA TUG'ILISHI",
        category: "SHARQ RENESSANSI ARXIVI",
        content: `
            <p>Sharq Renessansi (IX-XII va XIV-XV asrlar) Bag'dod, Samarqand, Buxoro, Xiva va Marv kabi yirik shaharlarda ilm-fan hamda madaniyatning tengsiz rivojlanish davridir.</p>
            <p>Ushbu davrda Al-Xorazmiy, Al-Farg'oniy, Abu Rayhon Beruniy, Ibn Sino, Mirzo Ulug'bek va Alisher Navoiy kabi jahonshumul daholar yetishib chiqdi.</p>
            <p>Ular tomonidan astronomiya, algebra, tibbiyot, geometriya va adabiyot sohasida yaratilgan nodir asarlar butun insoniyat sivilizatsiyasining oltin fondiga aylangan.</p>
        `
    },
    "gharb-sanat": {
        title: "G'ARBIY ITALIYA RENESSANSI VA GUMANIZM",
        category: "G'ARBIY UYG'ONISH ARXIVI",
        content: `
            <p>G'arbiy Uyg'onish (XIV-XVI asrlar) Italiyaning Florensiya, Venetsiya va Rim shaharlarida san'at, me'morchilik va falsafaning yangi bosqichga ko'tarilishidir.</p>
            <p>Leonardo da Vinchi, Mikelanjelo, Rafael va Botichelli kabi buyuk rassom hamda haykaltaroshlar tasviriy san'atda perspektiva, anatomiya hamda insoniy go'zallikni oliy darajaga olib chiqdilar.</p>
            <p>Ushbu davr insoniyatga ozod tafakkur, gumanizm hamda me'morchilik mo'jizalarini in'om etdi.</p>
        `
    }
};

function openArticleModal(articleKey) {
    var modal = document.getElementById("articleModal");
    var categoryEl = document.getElementById("modalCategory");
    var titleEl = document.getElementById("modalTitle");
    var bodyEl = document.getElementById("modalBody");

    var data = articleData[articleKey];
    if (data) {
        if (categoryEl) categoryEl.textContent = data.category;
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

// --- 6. UYG'ONISH DAHOLARI DEKODER TIZIMI ---
var symbolData = {
    "khwarizmi": {
        title: "Al-Xorazmiy (780 — 850)",
        desc: "Sharq algebrasi va algoritm atamasining asoschisi. Uning 'Al-Kitab al-mukhtasar fi hisab al-jabr wa'l-muqabala' asari Yevropa matematikasining poydevoriga aylandi."
    },
    "davinci": {
        title: "Leonardo da Vinchi (1452 — 1519)",
        desc: "G'arbiy Uyg'onish davrining eng ko'p qirrali dahosi. Mona Liza, So'nggi Kechlik asarlari muallifi hamda anatomiya, vertolyot va muhandislik chizmalari kashfiyotchisi."
    },
    "ibnsina": {
        title: "Ibn Sino / Avitsenna (980 — 1037)",
        desc: "Tibbiyot shohi va buyuk qomusiy daho. Uning 'Tibbiyot Qonunlari' (Al-Qonun fit-Tib) kitobi 500 yildan ortiq davomida barcha Yevropa va Sharq tibbiyot maktablarida asosiy manba bo'lib xizmat qilgan."
    },
    "michelangelo": {
        title: "Mikelanjelo Buonarroti (1475 — 1564)",
        desc: "Florensiyalik buyuk haykaltarosh va me'mor. Dovud marmar haykali hamda Vatikandagi Sikstin Kapellasi shipidagi muazzam freskalar yaratuvchisi."
    }
};

function decodeThinker(symbolKey, evt) {
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
