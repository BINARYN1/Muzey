/* ==========================================================
   MUZEY HAQIDA — CHEKSIZ PARALLAX SCROLL
   ----------------------------------------------------------
   Codrops "Infinite Scroll with Parallax" (Joe Ben Taylor, MIT
   litsenziya) asosidagi Lenis+GSAP sozlamalari IMPERIUM uchun
   moslashtirildi (assets/site.js dagi umumiy initSmoothScroll()
   qasddan ishlatilmaydi — u window'ga o'z Lenis nusxasini
   o'rnatib, shu sahifadagi maxsus wrapper/content Lenis'i bilan
   to'qnashib qolardi).
   ========================================================== */

/* --- Burger menyu --- */
function initBurger() {
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");
    if (!burgerBtn || !navMenu) return;

    burgerBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        burgerBtn.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            burgerBtn.classList.remove("open");
        });
    });
}

/* --- Tungi rejim --- */
function initThemeToggle() {
    const STORAGE_KEY = "imperium-theme";
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    const currentTheme = () =>
        document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

    const paint = (theme) => {
        const icon = btn.querySelector("i");
        if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
        btn.setAttribute("aria-label", theme === "dark" ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish");
    };

    paint(currentTheme());

    btn.addEventListener("click", () => {
        const next = currentTheme() === "dark" ? "light" : "dark";
        if (next === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* muhim emas */ }
        paint(next);
    });
}

/* --- Cheksiz parallax scroll (Lenis + GSAP ScrollTrigger) --- */
function setupInfiniteParallax() {
    if (!window.gsap || !window.Lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById("ishWrapper");
    const content = document.getElementById("ishContent");
    if (!wrapper || !content) return;

    const lenis = new Lenis({
        infinite: true,
        wrapper: wrapper,
        content: content,
        syncTouch: true,
    });

    if (window.Snap) {
        const snap = new Snap(lenis, {
            type: "mandatory",
            debounce: 500,
            duration: 0.9,
            easing: (t) => 1 - Math.pow(1 - t, 4),
        });
        snap.addElements(content.querySelectorAll(".ish-hero"), { align: "start" });
    }

    ScrollTrigger.scrollerProxy(wrapper, {
        scrollTop(value) {
            if (arguments.length) {
                lenis.scrollTo(value, { immediate: true });
            } else {
                return lenis.scroll;
            }
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: wrapper.clientWidth, height: wrapper.clientHeight };
        },
        pinType: "transform",
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Har bir hero uchun rasm parallax animatsiyasi
    content.querySelectorAll(".ish-hero").forEach((hero) => {
        const image = hero.querySelector(".ish-hero-image");
        if (!image) return;

        gsap.fromTo(
            image,
            { yPercent: -50 },
            {
                yPercent: 50,
                ease: "none",
                scrollTrigger: {
                    scroller: wrapper,
                    trigger: hero,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    fastScrollEnd: true,
                },
            }
        );
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initBurger();
    initThemeToggle();
    setupInfiniteParallax();

    // AI Chat Vidjeti Logikasi (Google Gemini API bilan)
    const toggleBtn = document.getElementById("aiToggleBtn");
    const chatWindow = document.getElementById("aiChatWindow");
    const closeBtn = document.getElementById("aiCloseBtn");
    const welcomeBubble = document.getElementById("aiWelcomeBubble");
    const sendBtn = document.getElementById("aiSendBtn");
    const userInput = document.getElementById("aiUserInput");
    const chatBody = document.getElementById("aiChatBody");

    window.sendQuickAiQuery = function(queryText) {
        if (userInput && sendBtn) {
            userInput.value = queryText;
            handleUserMessage();
        }
    };

    let conversationHistory = [];

    if (toggleBtn && chatWindow) {
        setTimeout(() => {
            welcomeBubble?.classList.add("show");
            setTimeout(() => {
                welcomeBubble?.classList.remove("show");
            }, 5000);
        }, 1000);

        toggleBtn.addEventListener("click", () => {
            chatWindow.classList.toggle("active");
            welcomeBubble?.classList.remove("show");
        });

        closeBtn?.addEventListener("click", () => {
            chatWindow.classList.remove("active");
        });

        async function handleUserMessage() {
            let text = userInput.value.trim();
            if (!text) return;

            let userMsgDiv = document.createElement("div");
            userMsgDiv.className = "ai-message user";
            userMsgDiv.innerText = text;
            chatBody.appendChild(userMsgDiv);

            userInput.value = "";
            chatBody.scrollTop = chatBody.scrollHeight;

            let botMsgDiv = document.createElement("div");
            botMsgDiv.className = "ai-message bot";
            botMsgDiv.innerText = "O'ylamoqda...";
            chatBody.appendChild(botMsgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            try {
                const systemPrompt = "Siz Imperium muzeyining aqlli yordamchisiz. Ushbu veb-sayt PDP JUNIORning F25 guruhidagi Nodirjon, Bexruzjon va Islomjon tomonidan yaratilgan web sayti. Agar foydalanuvchi saytni kim yaratgani yoki mualliflari haqida so'rasa, albatta shu uch xodimni ayting. Foydalanuvchi qaysi tilda murojaat qilsa (o'zbek, ingliz, rus va h.k.), xuddi shu tilda qisqa va do'stona javob bering.";

                const requestContents = [...conversationHistory, { role: "user", parts: [{ text: text }] }];

                let response = await fetch(`/api/gemini`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents: requestContents
                    })
                });

                let data = await response.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                    let aiResponseText = data.candidates[0].content.parts[0].text;
                    botMsgDiv.innerText = aiResponseText;

                    conversationHistory.push({ role: "user", parts: [{ text: text }] });
                    conversationHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
                    if (conversationHistory.length > 20) conversationHistory = conversationHistory.slice(-20);
                } else {
                    botMsgDiv.innerText = "Kechirasiz, javob olishda xatolik yuz berdi.";
                }
            } catch (error) {
                console.error("Gemini AI xatosi:", error);
                botMsgDiv.innerText = "Tarmoq bilan aloqa uzildi, iltimos qaytadan urinib ko'ring.";
            }

            chatBody.scrollTop = chatBody.scrollHeight;
        }

        sendBtn?.addEventListener("click", handleUserMessage);
        userInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleUserMessage();
        });
    }
});
