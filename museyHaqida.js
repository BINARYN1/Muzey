document.addEventListener("DOMContentLoaded", () => {
    // Burger menyu -> assets/site.js

    // Statistik raqamlarning animatsiyasi
    const statsContainer = document.getElementById("stats-container");
    const statNumbers = document.querySelectorAll(".stat-number");
    let hasAnimated = false;

    // Raqamlarni 0 dan berilgan qiymatgacha sanash funksiyasi
    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const duration = 2000; // 2 sekund davomida
            const stepTime = 20; // Har 20ms da yangilanadi
            const steps = duration / stepTime;
            const increment = target / steps;
            
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    // Yakuniy qiymatni formatlab chiqarish (masalan: 15,000)
                    counter.innerText = target.toLocaleString() + "+";
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.ceil(current).toLocaleString();
                }
            }, stepTime);
        });
    }

    // Ekran skroll qilinib, statistikaga yetganda sanashni boshlash
    function checkScroll() {
        if (!statsContainer) return;

        const containerPosition = statsContainer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.1;

        if (containerPosition < screenPosition && !hasAnimated) {
            animateCounters();
            hasAnimated = true; // Faqat bir marta ishlashi uchun
        }
    }

    // Skroll hodisasini tinglash
    window.addEventListener("scroll", checkScroll);
    
    // Agar sahifa yuklanganda statistika allaqachon ekranda bo'lsa
    checkScroll();

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
                const systemPrompt = "Siz Imperium muzeyining aqlli yordamchisiz. Ushbu veb-sayt PDP JUNIORning F25 guruhidagi Nodirjon, Bexruzjon va Islomjon tomonidan yaratilgan web sayti. Agar foydalanuvchi saytni kim yaratgani yoki mualliflari haqida so'rasa, albatta shu uch xodimni ayting. Foydalanuvchi savollariga faqat o'zbek tilida, qisqa va do'stona javob bering.";

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