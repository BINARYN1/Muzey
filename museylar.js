document.addEventListener("DOMContentLoaded", () => {
    // Burger menyu -> assets/site.js

    // Formasini yuborish amali
    const form = document.getElementById("museumForm");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("name").value.trim();
            showCustomToast(`Rahmat, ${name}! Xabaringiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz.`);
            form.reset();
        });
    }

    function showCustomToast(msg) {
        let toast = document.createElement("div");
        toast.className = "origin-toast";
        // Ranglar tokenlardan olinadi, shunda toast temaga ergashadi
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 18px;"></i> <span>${msg}</span>`;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%) translateY(20px)",
            background: "var(--card-bg)",
            color: "var(--text-main)",
            border: "2px solid var(--border)",
            borderRadius: "999px",
            padding: "12px 24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: "99999",
            fontWeight: "700",
            fontSize: "13px",
            opacity: "0",
            transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(20px)";
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

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