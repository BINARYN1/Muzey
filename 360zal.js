function changeMuseum(iframeUrl, titleText, btn) {
    // Barcha tugmalardan active klassini olib tashlash
    document.querySelectorAll('.hall-btn').forEach(b => b.classList.remove('active'));

    // Bosilgan tugmaga active klassini qo'shish
    btn.classList.add('active');

    // Yangi panorama yuklanguncha indikatorni ko'rsatish
    showPanoramaLoader();

    // Iframe manzilini va matnni yangilash
    document.getElementById('museumFrame').src = iframeUrl;
    document.getElementById('hallInfoText').innerText = titleText;
}

let panoramaLoaderTimer = null;

function showPanoramaLoader() {
    const loader = document.getElementById('panoramaLoader');
    if (loader) loader.classList.remove('hidden');
    // Agar load hodisasi kelmasa, indikator abadiy qolib ketmasin
    clearTimeout(panoramaLoaderTimer);
    panoramaLoaderTimer = setTimeout(hidePanoramaLoader, 15000);
}

function hidePanoramaLoader() {
    clearTimeout(panoramaLoaderTimer);
    const loader = document.getElementById('panoramaLoader');
    if (loader) loader.classList.add('hidden');
}

// Google panoramasi sekin ochiladi. iframe'ning load hodisasi faqat HTML
// qobig'i kelganda ishga tushadi, rasm esa keyinroq — shuning uchun
// indikator qo'shimcha kutishdan keyin olib tashlanadi.
document.addEventListener('DOMContentLoaded', () => {
    const frame = document.getElementById('museumFrame');
    if (!frame) return;
    showPanoramaLoader();
    frame.addEventListener('load', () => setTimeout(hidePanoramaLoader, 2500));
});

// AI Chat Vidjeti Logikasi (Google Gemini API bilan)
document.addEventListener("DOMContentLoaded", () => {
    // Burger menyu -> assets/site.js

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
            const systemPrompt = `Siz Imperium muzeyining aqlli yordamchisiz. Ushbu veb-sayt PDP JUNIORning F25 guruhidagi Nodirjon, Bexruzjon va Islomjon tomonidan yaratilgan web sayti. Agar foydalanuvchi saytni kim yaratgani yoki mualliflari haqida so'rasa, albatta shu uch xodimni ayting. Foydalanuvchi qaysi tilda murojaat qilsa (o'zbek, ingliz, rus va h.k.), xuddi shu tilda qisqa va do'stona javob bering.

Bizning loyihamizda 10 ta maxsus 360° zallar (muzeylar va tarixiy obidalar) mavjud:
1. Vatikan Muzeyi
2. Luvr Muzeyi
3. Orse Muzeyi
4. Aleksandriya Kutubxonasi
5. Van Gog Muzeyi
6. Uffizi Muzeyi
7. Kolizey
8. Dojlar Saroyi
9. Versal Saroyi
10. Madrid Qirollik Saroyi

Agar foydalanuvchi yuqoridagi 10 ta joydan biri haqida ma'lumot so'rasa, o'sha joy haqida qiziqarli, qisqa va aniq ma'lumot bering hamda uni 360 darajada ko'rish uchun "chap tomondagi (yoki menyudagi) mos tugmani bosing" deb tavsiya bering. O'zingiz avtomatik sahifani o'zgartirmang.

Agar foydalanuvchi biror 3D eksponat, haykal, madaniyat yoki obyekt haqida so'rasa yoki ko'rsatishni so'rasa, javobingiz oxiriga albatta [SEARCH: english_keywords] tegini qo'shing (masalan: [SEARCH: Roman Statue] yoki [SEARCH: Egyptian Artifact]).`;

            const requestContents = [...conversationHistory, { role: "user", parts: [{ text: text }] }];

            let response = await fetch(`/api/gemini`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: requestContents
                })
            });

            let data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                let aiResponseText = data.candidates[0].content.parts[0].text;

                // 3D eksponat qidiruvi tegi bor-yo'qligini teshirish
                const searchMatch = aiResponseText.match(/\[SEARCH:\s*(.*?)\]/i);
                if (searchMatch && searchMatch[1]) {
                    const searchQuery = searchMatch[1].trim();
                    if (typeof quickSearch === 'function') {
                        quickSearch(searchQuery);
                    }
                    aiResponseText = aiResponseText.replace(/\[SEARCH:\s*.*?\]/gi, '').trim();
                }

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