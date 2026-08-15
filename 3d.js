window.onload = () => {
    showToast("Muzey 3D tizimi muvaffaqiyatli yuklandi!", "success");
    fetch3DExhibits("Ancient Sculpture");
};

// Burger menyu -> assets/site.js

// Eventlarni bog'lash
document.getElementById('searchBtn').addEventListener('click', handleSearch);
document.getElementById('museumInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

function handleSearch() {
    let queryText = document.getElementById('museumInput').value.trim();
    if (!queryText) {
        showToast("Iltimos, qidirish uchun so'z kiriting!", "error");
        return;
    }
    
    let btn = document.getElementById('searchBtn');
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => { btn.style.transform = 'none'; }, 150);

    fetch3DExhibits(queryText);
}

function quickSearch(tagValue) {
    document.getElementById('museumInput').value = tagValue;
    
    let input = document.getElementById('museumInput');
    input.style.transform = 'scale(1.02)';
    setTimeout(() => { input.style.transform = 'none'; }, 200);

    fetch3DExhibits(tagValue);
}

// Sketchfab API orqali modellarni olish
function fetch3DExhibits(searchQuery) {
    let loader = document.getElementById('loader');
    let progressBar = document.getElementById('progressBar');
    let container = document.getElementById('exhibitsContainer');
    let title = document.getElementById('galleryTitle');
    let subTitle = document.getElementById('gallerySub');

    title.style.opacity = '0';
    title.style.transform = 'translateY(-10px)';
    subTitle.style.opacity = '0';

    loader.style.display = 'block';
    loader.style.opacity = '1';
    progressBar.style.width = '10%';

    let progressInterval = setInterval(() => {
        let currentWidth = parseInt(progressBar.style.width);
        if (currentWidth < 85) {
            progressBar.style.width = (currentWidth + Math.floor(Math.random() * 15) + 5) + '%';
        }
    }, 150);

    container.innerHTML = '';

    let sketchfabUrl = `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(searchQuery)}&categories=cultural-heritage-history&sort_by=-likeCount&staffpicked=true&min_face_count=1000&limit=12`;

    fetch(sketchfabUrl)
    .then(res => res.json())
    .then(data => {
        clearInterval(progressInterval);
        progressBar.style.width = '100%';

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { 
                loader.style.display = 'none'; 
                progressBar.style.width = '0%'; 
            }, 300);
        }, 300);

        title.innerText = `"${searchQuery}" eksponatlari`;
        subTitle.innerText = `Sketchfab tizimidan olingan interaktiv 3D modellar`;
        
        title.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        subTitle.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s';
        
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
        subTitle.style.opacity = '1';

        if (!data.results || data.results.length === 0) {
            showToast(`"${searchQuery}" bo'yicha hech narsa topilmadi`, "error");
            container.innerHTML = `<p class="empty-text" style="opacity: 0; transition: opacity 0.5s ease;">Kechirasiz, "${searchQuery}" bo'yicha hech qanday 3D haykal topilmadi.</p>`;
            setTimeout(() => {
                document.querySelector('.empty-text').style.opacity = '1';
            }, 50);
            return;
        }

        showToast(`"${searchQuery}" bo'yicha ${data.results.length} ta 3D model topildi!`, "success");

        data.results.forEach((model, index) => {
            let card = document.createElement('div');
            card.className = 'exhibit-3d-card';
            
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            
            card.innerHTML = `
                <iframe 
                    title="${model.name}"
                    src="https://sketchfab.com/models/${model.uid}/embed?autostart=0&ui_controls=1&ui_infos=0&dark_mode=1"
                    allowfullscreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking">
                </iframe>
            `;
            container.appendChild(card);

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 70 * index);
        });
    })
    .catch(err => {
        clearInterval(progressInterval);
        loader.style.display = 'none';
        progressBar.style.width = '0%';
        console.error("Sketchfab API xatosi:", err);
        showToast("Tarmoq xatoligi yuz berdi!", "error");
        
        container.innerHTML = '<p class="empty-text" style="opacity: 0; transition: opacity 0.5s ease;">Tarmoq xatoligi sababli yuklab bo\'lmadi.</p>';
        setTimeout(() => {
            document.querySelector('.empty-text').style.opacity = '1';
        }, 50);
    });
}

// Toastify yordamchi funksiyasi
function showToast(message, type = "success") {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        offset: {
            y: 95 
        },
        stopOnFocus: true, 
        oldestFirst: false, 
        style: {
            background: type === "success" 
                ? "linear-gradient(135deg, #151310, #1c1813)" 
                : "linear-gradient(135deg, #2a1512, #3d1a16)",
            borderLeft: type === "success" ? "4px solid #c9a76c" : "4px solid #e06c58",
        }
    }).showToast();
}

// AI Chat Vidjeti Logikasi (Google Gemini API bilan)
document.addEventListener("DOMContentLoaded", () => {
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
            const systemPrompt = "Siz Imperium muzeyining aqlli yordamchisiz. Ushbu veb-sayt PDP JUNIORning F25 guruhidagi Nodirjon, Bexruzjon va Islomjon tomonidan yaratilgan web sayti. Agar foydalanuvchi saytni kim yaratgani yoki mualliflari haqida so'rasa, albatta shu uch xodimni ayting. Foydalanuvchi savollariga faqat o'zbek tilida, qisqa va do'stona javob bering. Agar foydalanuvchi biror 3D eksponat, haykal, madaniyat yoki obyekt haqida so'rasa yoki ko'rsatishni so'rasa, javobingiz oxiriga albatta [SEARCH: english_keywords] tegini qo'shing (masalan: [SEARCH: Roman Statue] yoki [SEARCH: Egyptian Artifact] yoki [SEARCH: Greek Statue]).";

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
                    quickSearch(searchQuery);
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