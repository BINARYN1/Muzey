// Leaflet CSS va JS kutubxonalarini yuklash
const leafletCSS = document.createElement("link");
leafletCSS.rel = "stylesheet";
leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
document.head.appendChild(leafletCSS);

const leafletJS = document.createElement("script");
leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
leafletJS.onload = initMap;
document.head.appendChild(leafletJS);

// Burger menyu -> assets/site.js

// Dunyoning turli burchaklaridan barcha 40 ta mashhur muzey ma'lumotlari
const museumsData = [
    // Fransiya
    {
        name: "Luvr muzeyi", country: "Fransiya (Parij)", lat: 48.8606, lon: 2.3376,
        img: "https://www.bvjhostelparis.com/wp-content/uploads/2024/06/VOYAGE-SCOLAIRE-PARIS-reservation-groupe-Musee-du-LOUVRE.jpg",
        desc: "Dunyodagi eng yirik san'at muzeyi va tarixiy obida.",
        highlights: ["Mona Liza", "Miloslik Venera", "Samofrakiya Nikasi"]
    },
    {
        name: "Orse muzeyi", country: "Fransiya (Parij)", lat: 48.8599, lon: 2.3266,
        img: "https://cdn.sortiraparis.com/images/80/83517/421527-visuel-paris-musee-d-orsay.jpg",
        desc: "Sobiq vokzal binosida joylashgan impressionizm maskani.",
        highlights: ["Vang Gog asarlari", "Mane asarlari", "Dega haykallari"]
    },
    {
        name: "Pompidu markazi", country: "Fransiya (Parij)", lat: 48.8606, lon: 2.3522,
        img: "https://s.zagranitsa.com/images/guides/16562/original/1963b38f9a42629cc2505fcbd06e4f7b.jpg?1427974893",
        desc: "Zamonaviy san'at va madaniyat markazi.",
        highlights: ["Pikasso asarlari", "Dyupon kolleksiyasi", "Zamonaviy dizayn"]
    },

    // AQSh
    {
        name: "Metropoliten san'at muzeyi", country: "AQSh (Nyu-York)", lat: 40.7794, lon: -73.9632,
        img: "https://data.daryo.uz/media/2021/04/1200px-Metropolitan_Museum_of_Art_The_Met_-_Central_Park_NYC.jpg",
        desc: "G'arbiy yarimshardagi eng boy san'at to'plami.",
        highlights: ["Dendur ibodatxonasi", "Renessans ustalari", "Misr zallari"]
    },
    {
        name: "Smitson tabiiy tarix muzeyi", country: "AQSh (Vashington)", lat: 38.8913, lon: -77.0261,
        img: "https://upload.wikimedia.org/wikipedia/commons/e/ea/National_Museum_of_Natural_History_-_2026_%2855255088887%29.jpg",
        desc: "Dunyodagi eng yirik fan va tabiat muzeyi.",
        highlights: ["Dinozavrlar", "Umid olmosi", "Mamontlar"]
    },
    {
        name: "Guggenxeym muzeyi (Nyu-York)", country: "AQSh (Nyu-York)", lat: 40.7829, lon: -73.9589,
        img: "https://mus3ums.com/media/museums/images/full/18/e0/18e00d7e9e344511bfadf3086b442c86.jpg",
        desc: "Frank Lloyd Rayt loyihasidagi spiral shaklidagi muzey.",
        highlights: ["Kandinskiy asarlari", "Abstrakt san'at", "Modernistlar"]
    },
    {
        name: "Chikago san'at instituti", country: "AQSh (Chikago)", lat: 41.8796, lon: -87.6237,
        img: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Art_Institute_of_Chicago_%2851575570710%29.jpg",
        desc: "Amerikaning yetakchi san'at muzey va maktabi.",
        highlights: ["Serjant asarlari", "Impresseonistlar", "Qadimiy qurollar"]
    },

    // Buyuk Britaniya
    {
        name: "Britaniya muzeyi", country: "Buyuk Britaniya (London)", lat: 51.5194, lon: -0.1270,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsNGmS94lHCkEE16JgVdWSSeKZclXNfyECrQAXr7Kr8m4k8dt4Qulxb5zO&s=10",
        desc: "Insoniyat tarixi va arxeologiya markazi.",
        highlights: ["Rozetta toshi", "Misr mumiyalari", "Partenon haykallari"]
    },
    {
        name: "Teyt Modern", country: "Buyuk Britaniya (London)", lat: 51.5076, lon: -0.0994,
        img: "https://upload.wikimedia.org/wikipedia/commons/0/00/Tate_Modern_-_Bankside_Power_Station.jpg",
        desc: "Sobiq elektr stansiyasida joylashgan zamonaviy galereya.",
        highlights: ["Pikasso", "Dushan", "Turbina zali installyatsiyalari"]
    },
    {
        name: "Viktoriya va Albert muzeyi", country: "Buyuk Britaniya (London)", lat: 51.4966, lon: -0.1722,
        img: "https://artwalk.london/wp-content/uploads/2017/07/V-A-1.jpg",
        desc: "Dunyodagi eng yirik amaliy san'at va dizayn muzeyi.",
        highlights: ["Moda tarixi", "Zargarlik buyumlari", "Skulpturalar"]
    },
    {
        name: "Tabiiy tarix muzeyi (London)", country: "Buyuk Britaniya (London)", lat: 51.4967, lon: -0.1764,
        img: "https://elleuzbekistan.com/wp-content/uploads/2025/03/4-jpg.webp",
        desc: "Noyob biologik va geologik namunalar saqlanadigan maskan.",
        highlights: ["Dinozavr suyaklari", "Moviy kit skeleti", "Meteoritlar"]
    },

    // Italiya
    {
        name: "Uffitsi galereyasi", country: "Italiya (Florensiya)", lat: 43.7677, lon: 11.2553,
        img: "https://toskanagid.com/upload/image/blog/galereya-uffitsi/galereya-uffitsi.jpg",
        desc: "Uyg'onish davri san'atining dunyodagi eng boy xazinasi.",
        highlights: ["Veneraning tug'ilishi", "Botichelli", "Leonardo da Vinchi"]
    },
    {
        name: "Vatikan muzeylari", country: "Vatikan", lat: 41.9065, lon: 12.4536,
        img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/etm0f2a1rdzzqodwvvip.jpg",
        desc: "Rim papalari to'plagan buyuk san'at asarlari.",
        highlights: ["Sikstin kapellasi", "Rafael zallari", "Qadimiy haykallar"]
    },
    {
        name: "Kollizey va Arxeologiya muzeyi", country: "Italiya (Rim)", lat: 41.8902, lon: 12.4922,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg",
        desc: "Qadimgi Rim amfiteatri va ochiq osmon ostidagi muzey.",
        highlights: ["Arena", "Gladiatorlar tarixi", "Qadimiy qazilmalar"]
    },

    // Ispaniya
    {
        name: "Prado muzeyi", country: "Ispaniya (Madrid)", lat: 40.4138, lon: -3.6921,
        img: "https://risel.com/wp-content/uploads/2025/02/the-prado-museum-2023-11-27-05-34-30-utc-scaled.jpg",
        desc: "Ispaniyaning bosh san'at muzeyi.",
        highlights: ["Velaskes asarlari", "Goya", "El Greko"]
    },
    {
        name: "Guggenxeym muzeyi (Bilbao)", country: "Ispaniya (Bilbao)", lat: 43.2687, lon: -2.9340,
        img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Museo_Guggenheim%2C_Bilbao_%2831273245344%29.jpg",
        desc: "Titan qoplamali betakror zamonaviy arxitektura muzeyi.",
        highlights: ["Jeff Kunis haykallari", "Avant-gard san'at"]
    },

    // Rossiya
    {
        name: "Ermitaj muzeyi", country: "Rossiya (Sankt-Peterburg)", lat: 59.9398, lon: 30.3146,
        img: "https://www.advantour.com/russia/images/city/st-peterburg/landmarks-and-attractions/saint-petersburg-landmarks-and-attractions-hermitage.jpg",
        desc: "Dunyodagi eng yirik tarixiy va badiiy muzeylardan biri.",
        highlights: ["Qishki saroy", "Rembrandt", "Oltin xazina"]
    },
    {
        name: "Tretyakov galereyasi", country: "Rossiya (Moskva)", lat: 55.7415, lon: 37.6208,
        img: "https://yuz.uz/file/news/5efbf3f44fa2d1fef2af0cc1f4cda430.jpg",
        desc: "Rus tasviriy san'atining milliy xazinasi.",
        highlights: ["Rublyov 'Uchlik'", "Ivan Ivanov asarlari", "Rus klassikasi"]
    },

    // Germaniya va Niderlandiya
    {
        name: "Pergamon muzeyi", country: "Germaniya (Berlin)", lat: 52.5211, lon: 13.3969,
        img: "https://pohcdn.com/sites/default/files/styles/paragraph__text_with_image___twi_image/public/2020-05/pergamon-museum-1.jpg",
        desc: "Qadimgi Sharq va antik davr me'morchiligi muzeyi.",
        highlights: ["Ishtar darvozasi", "Pergamon mehrobxonasi", "Bobil devorlari"]
    },
    {
        name: "Rijksmuseum", country: "Niderlandiya (Amsterdam)", lat: 52.3600, lon: 4.8852,
        img: "https://www.rijksmuseum.nl/assets/fdd2733b-030d-46be-ac53-932f3b719e77?w=1920&h=1080&fx=3333&fy=2025&c=c454422478deb97d5028ef15fe8ee1444efc831752f549ed9579f8f86f2b6708",
        desc: "Gollandiya oltin asri san'ati muzeyi.",
        highlights: ["Tungi qo'riqchi", "Vermeyer asarlari", "Tarixiy artefaktlar"]
    },
    {
        name: "Van Gog muzeyi", country: "Niderlandiya (Amsterdam)", lat: 52.3584, lon: 4.8811,
        img: "https://vangoghmuseumtickets.tours/wp-content/uploads/2025/01/visiting-van-gogh-museum.jpg",
        desc: "Dunyodagi eng yirik Vang Gog asarlari to'plami.",
        highlights: ["Kartoshka yeb o'tirganlar", "Kungaboqarlar", "Rassom xatlari"]
    },

    // Gretsiya va Avstriya
    {
        name: "Akropol muzeyi", country: "Gretsiya (Afina)", lat: 37.9684, lon: 23.7285,
        img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/b0/e6/7b/b-c-night-view-of-the.jpg?w=900&h=500&s=1",
        desc: "Qadimgi Yunoniston arxeologik yodgorliklari.",
        highlights: ["Partenon haykallari", "Arxaik haykallar", "Keramika"]
    },
    {
        name: "San'at tarixi muzeyi", country: "Avstriya (Vena)", lat: 48.2038, lon: 16.3592,
        img: "https://live.staticflickr.com/65535/49767754706_064497985e_b.jpg",
        desc: "Gabsburglar sulolasi to'plagan boy san'at galereyasi.",
        highlights: ["Bruegel asarlari", "Karamchyo", "Qirollik idishlari"]
    },

    // Misr va Turkiya
    {
        name: "Katta Misr muzeyi", country: "Misr (Giza)", lat: 29.9976, lon: 31.1141,
        img: "https://www.afisha.uz/uploads/media/2025/11/1f26d0719a1fe4213ca120de837fb498_lf.webp",
        desc: "Qadimgi Misr sivilizatsiyasining ulkan yangi muzeyi.",
        highlights: ["Tutanxamon xazinasi", "Ramses II haykali", "Mumiyalar"]
    },
    {
        name: "Topkapi saroy muzeyi", country: "Turkiya (Istanbul)", lat: 41.0115, lon: 28.9833,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXVL0gCEL4-xY199kNQ8PnDYwJcBK1cRgbR4bVVh_Rmair9tlT6q6Iw3GM&s=10",
        desc: "Usmonlilar imperiyasi sultonlarining qarorgohi va muzeyi.",
        highlights: ["Qoshiqchi olmosi", "Muqaddas omonatlar", "Sulton xazinalari"]
    },
    {
        name: "Ayasofya muzeyi", country: "Turkiya (Istanbul)", lat: 41.0086, lon: 28.9802,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN0U1m57RMFgjUQiTuaJGFGVv9QhxDmX699blI0GFPflTzKNwWn_uqPio&s=10",
        desc: "Jahon me'morchiligining buyuk obidasi va muzey.",
        highlights: ["Qadimiy mozaikalar", "Gumbaz", "Tarixiy ustunlar"]
    },

    // Osiyo va Amerika
    {
        name: "Pekin saroy muzeyi (Taqiqlangan shahar)", country: "Xitoy (Pekin)", lat: 39.9163, lon: 116.3972,
        img: "https://www.thepalacemuseumstationery.com/wp-content/uploads/2023/12/111.webp",
        desc: "Xitoy imperatorlari saroy majmuasi.",
        highlights: ["Imperator taxti", "Chinni buyumlar", "Qo'lyozmalar"]
    },
    {
        name: "Seul milliy muzeyi", country: "Janubiy Koreya (Seul)", lat: 37.5239, lon: 126.9800,
        img: "https://static.wixstatic.com/media/0505b9_818ec43afd17427bb6bcbc915c4de580~mv2.jpg/v1/fill/w_800,h_533,al_c,q_85,enc_avif,quality_auto/0505b9_818ec43afd17427bb6bcbc915c4de580~mv2.jpg",
        desc: "Koreya tarixi va madaniyati bosh muzeyi.",
        highlights: ["Oltin tojlar", "Seladon kulolligi", "Qadimiy yozuvlar"]
    },

    // O'zbekiston va Markaziy Osiyo
    {
        name: "Amir Temur tarixi davlat muzeyi", country: "O'zbekiston (Toshkent)", lat: 41.3108, lon: 69.2797,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRljjFGaTkF5jCrXDSZoxE1K-g2O1pJ5aRVnuqOGdj88bi0tdbGOIRQ4nsM&s=10",
        desc: "Temuriylar sulolasi davri tarixi va madaniyati muzeyi.",
        highlights: ["Qur'oni Usmon nusxasi", "Qurol-yarog'lar", "Miniatyuralar"]
    },
    {
        name: "O'zbekiston davlat san'at muzeyi", country: "O'zbekiston (Toshkent)", lat: 41.3065, lon: 69.2635,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuPc5kP6e5hcuhKoJA7favlaaKNxF_aQUTiQ_yUa4b6ASiWIt0yoszqcE&s=10",
        desc: "Markaziy Osiyodagi eng boy milliy san'at galereyasi.",
        highlights: ["Qadimiy tasviriy san'at", "Amaliy san'at", "Sharq ustalari"]
    },
    {
        name: "Ichan Qalqa muzey-qo'riqxonasi", country: "O'zbekiston (Xiva)", lat: 41.3783, lon: 60.3639,
        img: "https://static.xabar.uz/uploads/9/720__O92RTjPKrWojCbnaLznqZSxzl4_CdLlD.jpg",
        desc: "Ochiq osmon ostidagi tarixiy me'morchilik muzeyi.",
        highlights: ["Kalta Minor", "Kunya Arx", "Juma masjidi"]
    },
    {
        name: "Afrosiyob muzeyi", country: "O'zbekiston (Samarqand)", lat: 39.6636, lon: 66.9850,
        img: "https://avatars.mds.yandex.net/get-altay/1032555/2a00000187a9746e819db083cd9cb081d136/L_height",
        desc: "Qadimgi Samarqand tarixi va arxeologik topilmalari.",
        highlights: ["7-asr devoriy rasmlari", "Qadimgi tangalar", "Sopol idishlar"]
    },
    {
        name: "Buxoro davlat me'moriy-badiiy muzeyi", country: "O'zbekiston (Buxoro)", lat: 39.7747, lon: 64.4090,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDUxo1Ayr3N7sKHb5R3yimHKiqx0TSwmNE1dbymvOFroaAEjjslg1MOZ8&s=10",
        desc: "Qadimiy Ark qo'rg'onida joylashgan tarixiy muzey.",
        highlights: ["Buxoro xonligi taxti", "Qadimiy tangalar va zargarlik", "Qo'lyozmalar"]
    },
    {
        name: "Savitskiy nomidagi Qoraqalpoq davlat san'at muzeyi", country: "O'zbekiston (Nukus)", lat: 42.4619, lon: 59.6166,
        img: "https://meros.uz/uploads/wonder/wonder//a0f4837d5c7b1ee49089ee6340ac5036.jpg",
        desc: "Dunyodagi ikkinchi eng yirik rus avangard san'at to'plami.",
        highlights: ["Avangard rasmlar", "Qoraqalpoq amaliy san'ati", "Qadimiy arxeologiya"]
    }
];

let map;
const createdMarkers = [];

// GEMINI API SOZLAMALARI
const geminiUrl = `/api/gemini`;
let conversationHistory = [];

function initMap() {
    map = L.map('map', {
        center: [30, 10],
        zoom: 3,
        minZoom: 2,
        worldCopyJump: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    museumsData.forEach((museum) => {
        const marker = L.marker([museum.lat, museum.lon]).addTo(map);

        let highlightsHTML = museum.highlights.map(item => `<li>${item}</li>`).join('');

        const popupContent = `
            <div class="museum-card">
                <div class="museum-img-container">
                    <span class="museum-badge">Muzey</span>
                    <img src="${museum.img}" alt="${museum.name}" class="museum-img">
                </div>
                <div class="museum-body">
                    <div class="museum-country">${museum.country}</div>
                    <h3>${museum.name}</h3>
                    <p class="museum-desc">${museum.desc}</p>
                    <div class="museum-highlights">
                        <h4>Asosiy eksponatlar:</h4>
                        <ul>${highlightsHTML}</ul>
                    </div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, { maxWidth: 320 });
        
        createdMarkers.push({
            name: museum.name.toLowerCase(),
            country: museum.country.toLowerCase(),
            lat: museum.lat,
            lon: museum.lon,
            markerInstance: marker
        });
    });
}

function toggleChat() {
    const chatBox = document.getElementById('aiChatWindow') || document.getElementById('aiChatBox');
    chatBox?.classList.toggle('active');

    const tooltip = document.getElementById('aiWelcomeBubble') || document.getElementById('welcomeTooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        tooltip.classList.add('fade-out');
    }
}

window.sendQuickAiQuery = function(queryText) {
    const input = document.getElementById('aiUserInput') || document.getElementById('aiInput');
    if (input) {
        input.value = queryText;
        sendAIMessage();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("aiToggleBtn");
    const chatWindow = document.getElementById("aiChatWindow");
    const closeBtn = document.getElementById("aiCloseBtn");
    const welcomeBubble = document.getElementById("aiWelcomeBubble");
    const sendBtn = document.getElementById("aiSendBtn");
    const userInput = document.getElementById("aiUserInput");

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

        sendBtn?.addEventListener("click", sendAIMessage);
        userInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendAIMessage();
        });
    }
});

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendAIMessage();
    }
}

async function sendAIMessage() {
    const input = document.getElementById('aiUserInput') || document.getElementById('aiInput');
    const text = input ? input.value.trim() : '';
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';

    const lowerText = text.toLowerCase();

    // 1. Sayt mualliflari haqidagi savolga lokal xavfsiz javob
    if (lowerText.includes('yaratgan') || lowerText.includes('kimlar') || lowerText.includes('muallif') || lowerText.includes('kim qilgan') || lowerText.includes('kimsan') || lowerText.includes('yasalgan')) {
        setTimeout(() => {
            appendMessage("PDP JUNIORning f25 guruhidagi Nodirjon Bexruzjon islomjon tomonidan yasalgan web sayt.", 'bot');
        }, 300);
        return;
    }

    // 2. Muzey xaritasidan qidirish
    const matchedMuseum = createdMarkers.find(m => 
        lowerText.includes(m.name) || 
        m.name.includes(lowerText) ||
        lowerText.includes(m.country.split(' ')[0])
    );

    if (matchedMuseum) {
        setTimeout(() => {
            appendMessage(`Ajoyib! Siz so'ragan joy: "${matchedMuseum.markerInstance.getPopup().getContent().match(/<h3>(.*?)<\/h3>/)[1]}". Xaritaning ushbu nuqtasiga yo'naltirildingiz.`, 'bot');
            
            const targetLat = matchedMuseum.lat + 0.005; 
            
            map.flyTo([targetLat, matchedMuseum.lon], 14, {
                animate: true,
                duration: 1.5
            });

            setTimeout(() => {
                matchedMuseum.markerInstance.openPopup();
            }, 1600);
        }, 300);
        return;
    }

    // 3. Gemini API So'rovi
    appendMessage("O'ylayapman...", 'bot-thinking');

    try {
        const systemPrompt = "Sen muzeylar xaritasidagi aqlli AI yordamchisisan. Agar foydalanuvchi sayt muallifi yoki kim yaratgani haqida so'rasa, har doim 'PDP JUNIORning f25 guruhidagi Nodirjon Bexruzjon islomjon tomonidan yasalgan web sayt' deb javob ber. Foydalanuvchi qaysi tilda murojaat qilsa (o'zbek, ingliz, rus va h.k.), xuddi shu tilda aniq, to'g'ri va do'stona javob ber.";

        const requestContents = [...conversationHistory, { role: "user", parts: [{ text: text }] }];

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: requestContents
            })
        });

        const data = await response.json();

        removeThinkingMessage();

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            appendMessage(aiReply, 'bot');

            conversationHistory.push({ role: "user", parts: [{ text: text }] });
            conversationHistory.push({ role: "model", parts: [{ text: aiReply }] });
            if (conversationHistory.length > 20) conversationHistory = conversationHistory.slice(-20);
        } else {
            appendMessage("Kechirasiz, javob olishda muammo bo'ldi. Qaytadan urinib ko'ring.", 'bot');
        }
    } catch (error) {
        console.error("Gemini API Xatosi:", error);
        removeThinkingMessage();
        appendMessage("Ulanishda xatolik yuz berdi. Internetni tekshiring.", 'bot');
    }
}

function appendMessage(text, sender) {
    const chatBody = document.getElementById('aiChatBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeThinkingMessage() {
    const thinkingMsg = document.querySelector('.ai-message.bot-thinking');
    if (thinkingMsg) {
        thinkingMsg.remove();
    }
}

// Avtomatik tooltip
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const tooltip = document.getElementById('welcomeTooltip');
        if (tooltip) {
            tooltip.classList.add('fade-out');
        }
    }, 5000);
});