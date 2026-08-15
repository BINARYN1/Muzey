// Viktorina va AI yordamchi uchun to'liq JavaScript kodi
document.addEventListener("DOMContentLoaded", () => {
    // Burger menyu -> assets/site.js

    // Viktorina savollari va boshqaruv elementlari
    const questions = [
        {
            question: "Luvr muzeyi qaysi shaharda joylashgan?",
            options: ["Parij", "London", "Rim", "Madrid"],
            answer: 0,
            explanation: "Luvr muzeyi Fransiyaning Parij shahrida joylashgan dunyodagi eng yirik san'at muzeylaridan biridir."
        },
        {
            question: "Ermitaj muzeyi qaysi davlatda joylashgan?",
            options: ["Italiya", "Rossiya", "Fransiya", "Germaniya"],
            answer: 1,
            explanation: "Davlat Ermitaj muzeyi Rossiyaning Sankt-Peterburg shahrida joylashgan."
        },
        {
            question: "Britaniya muzeyi qayerda bunyod etilgan?",
            options: ["Berlin", "Vashington", "London", "Tokio"],
            answer: 2,
            explanation: "Britaniya muzeyi Buyuk Britaniyaning poytaxti London shahrida joylashgan."
        },
        {
            question: "Metropoliten san'at muzeyi qaysi shaharda?",
            options: ["Nyu-York", "Los-Anjeles", "Chikago", "Boston"],
            answer: 0,
            explanation: "Metropoliten muzeyi AQShning Nyu-York shahrida joylashgan."
        },
        {
            question: "Prado muzeyi qaysi mamlakatning madaniy merosi hisoblanadi?",
            options: ["Ispaniya", "Gretsiya", "Misr", "Turkiya"],
            answer: 0,
            explanation: "Prado milliy muzeyi Ispaniyaning Madrid shahrida joylashgan."
        },
        {
            question: "Qohira qadimiy Misr muzeyida narsalar asosan nima bilan bog'liq?",
            options: ["Rim imperiyasi", "Farg'ona vodiysi", "Qadimgi Misr tarixi va mumiyolar", "Mayya sivilizatsiyasi"],
            answer: 2,
            explanation: "Qohira muzeyi Qadimgi Misr sivilizatsiyasining boy tarixiy topilmalari va artefaktlarini saqlaydi."
        },
        {
            question: "Vatikan muzeylari qaysi davlat hududida joylashgan?",
            options: ["Italiya", "Vatikan", "Shveysariya", "Monako"],
            answer: 1,
            explanation: "Vatikan muzeylari bevosita Vatikan davlati hududida faoliyat yuritadi."
        },
        {
            question: "Uffitsi galereyasi qaysi Italiya shahrida joylashgan?",
            options: ["Milan", "Venetsiya", "Florensiya", "Neapol"],
            answer: 2,
            explanation: "Uffitsi galereyasi Florensiya shahrining dunyoga mashhur san'at muzeyidir."
        },
        {
            question: "Pergamon muzeyi qaysi shaharda joylashgan?",
            options: ["Berlin", "Parij", "Vena", "London"],
            answer: 0,
            explanation: "Pergamon muzeyi Germaniyaning Berlin shahridagi Muzeylar orolida joylashgan."
        },
        {
            question: "Afina akropoli muzeyi qaysi davlatda?",
            options: ["Kipr", "Gretsiya", "Italiya", "Bolgariya"],
            answer: 1,
            explanation: "Akropol muzeyi Gretsiyaning Afina shahrida qadimgi yodgorliklarni namoyish etadi."
        },
        {
            question: "Amirliklar muzeyi yoki Luvr Abu-Dabi qayerda ochilgan?",
            options: ["Birlashgan Arab Amirliklari", "Saudiya Arabistoni", "Qatar", "Quvayt"],
            answer: 0,
            explanation: "Luvr Abu-Dabi Birlashgan Arab Amirliklarining Abu-Dabi shahrida bunyod etilgan."
        },
        {
            question: "Tokio milliy muzeyi qaysi davlatning eng qadimgi muzeyi?",
            options: ["Xitoy", "Yaponiya", "Janubiy Koreya", "Vetnam"],
            answer: 1,
            explanation: "Tokio milliy muzeyi Yaponiyaning eng qadimgi va yirik muzeyi hisoblanadi."
        },
        {
            question: "Pekin shahridagi Xitoy milliy muzeyi qaysi maydonda joylashgan?",
            options: ["Tyananmen maydoni", "Qizil maydon", "Konklav maydoni", "Patszya"],
            answer: 0,
            explanation: "Xitoy milliy muzeyi Tyananmen maydonining sharqiy qismida joylashgan."
        },
        {
            question: "Van Gog muzeyi qaysi shahar markazida o'rnashgan?",
            options: ["Amsterdam", "Rotterdam", "Gaga", "Utrext"],
            answer: 0,
            explanation: "Van Gog muzeyi Niderlandiyaning Amsterdam shahrida joylashgan."
        },
        {
            question: "Reyksmuezey (Rijksmuseum) qaysi davlatga tegishli?",
            options: ["Belgiya", "Niderlandiya", "Daniya", "Shvetsariya"],
            answer: 1,
            explanation: "Reyksmuezey Niderlandiyaning Amsterdam shahridagi davlat muzeyidir."
        },
        {
            question: "Orse muzeyi (Musée d'Orsay) nimasi bilan mashhur?",
            options: ["Faqat zamonaviy avtomobillar", "XIX asr oxiri va XX asr boshlari impressionizm san'ati", "Dinozavr suyaklari", "Kosmik texnologiyalar"],
            answer: 1,
            explanation: "Orse muzeyi asosan impressionistlar va post-impressionistlarning asarlarini saqlaydi."
        },
        {
            question: "Vena san'at tarixi muzeyi qaysi davlatda?",
            options: ["Avstriya", "Vengriya", "Chexiya", "Polsha"],
            answer: 0,
            explanation: "Vena san'at tarixi muzeyi Avstriyaning Vena shahrida joylashgan."
        },
        {
            question: "Kopengagendagi Ny Carlsberg Glyptotek muzeyi qaysi davlatda?",
            options: ["Daniya", "Norvegiya", "Shvetsariya", "Finlandiya"],
            answer: 0,
            explanation: "Ny Carlsberg Glyptotek Daniyaning Kopengagen shahrida joylashgan san'at muzeyidir."
        },
        {
            question: "Madridagi qirollik saroyi va armoriya muzeyi qayerda?",
            options: ["Ispaniya", "Portugaliya", "Italiya", "Fransiya"],
            answer: 0,
            explanation: "Ispaniya Qirollik saroyi va uning muzeyi Madrid shahrida joylashgan."
        },
        {
            question: "Aleksandriya kutubxonasi va muzeyi qadimgi qaysi davlatda mashhur bo'lgan?",
            options: ["Qadimgi Misr (Ellinistik davr)", "Qadimgi Rim", "Qadimgi Bobil", "Qadimgi Hindiston"],
            answer: 0,
            explanation: "Aleksandriya kutubxonasi va muzeyi ellinistik davrdagi Misrning ilm-fan markazi bo'lgan."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let wrongAnswersCount = 0;
    let userAnswers = new Array(questions.length).fill(null);

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');
    const progressBar = document.getElementById('progress-bar');
    const correctScoreElem = document.getElementById('correct-score');
    const wrongScoreElem = document.getElementById('wrong-score');
    const questionCounter = document.getElementById('question-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const quizCard = document.getElementById('quiz-card');
    const resultScreen = document.getElementById('result-screen');
    const finalScore = document.getElementById('final-score');
    const mistakesList = document.getElementById('mistakes-list');
    const restartBtn = document.getElementById('restart-btn');

    function loadQuestion() {
        const currentQ = questions[currentQuestionIndex];
        questionText.textContent = currentQ.question;
        optionsContainer.innerHTML = '';

        currentQ.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            
            if (userAnswers[currentQuestionIndex] === index) {
                if (index === currentQ.answer) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('wrong');
                }
            }

            btn.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(btn);
        });

        questionCounter.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.innerHTML = `Natijani ko'rish <i class="fa-solid fa-flag-checkered"></i>`;
        } else {
            nextBtn.innerHTML = `Oldinga <i class="fa-solid fa-arrow-right"></i>`;
        }
    }

    function selectOption(selectedIndex) {
        const currentQ = questions[currentQuestionIndex];
        userAnswers[currentQuestionIndex] = selectedIndex;

        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === currentQ.answer) {
                btn.classList.add('correct');
            } else if (idx === selectedIndex && idx !== currentQ.answer) {
                btn.classList.add('wrong');
            }
        });

        updateScores();
    }

    function updateScores() {
        let corr = 0;
        let wrg = 0;
        userAnswers.forEach((ans, idx) => {
            if (ans !== null) {
                if (ans === questions[idx].answer) {
                    corr++;
                } else {
                    wrg++;
                }
            }
        });
        correctScoreElem.textContent = corr;
        wrongScoreElem.textContent = wrg;
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    });

    function showResults() {
        document.getElementById('question-box').parentElement.querySelector('.quiz-header').style.display = 'none';
        document.querySelector('.score-board').style.display = 'none';
        document.getElementById('question-box').style.display = 'none';
        document.getElementById('nav-buttons').style.display = 'none';

        resultScreen.classList.remove('hidden');

        let correctCount = 0;
        let mistakesHTML = '';

        userAnswers.forEach((ans, idx) => {
            const q = questions[idx];
            const isCorrect = ans === q.answer;
            if (isCorrect) correctCount++;

            mistakesHTML += `
                <div class="review-item">
                    <div class="review-question">${idx + 1}. ${q.question}</div>
                    <div class="review-details">
                        Sizning javobingiz: <strong>${ans !== null ? q.options[ans] : "Belgilanmagan"}</strong> | 
                        To'g'ri javob: <strong style="color: var(--success);">${q.options[q.answer]}</strong>
                    </div>
                    <div class="ai-explanation ${isCorrect ? '' : 'wrong-exp'}">
                        <i class="fa-solid fa-robot"></i> AI Izohi: ${q.explanation}
                    </div>
                </div>
            `;
        });

        finalScore.textContent = `${correctCount} / ${questions.length}`;
        mistakesList.innerHTML = mistakesHTML;

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    restartBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers = new Array(questions.length).fill(null);
        score = 0;
        wrongAnswersCount = 0;

        document.getElementById('question-box').parentElement.querySelector('.quiz-header').style.display = 'flex';
        document.querySelector('.score-board').style.display = 'flex';
        document.getElementById('question-box').style.display = 'block';
        document.getElementById('nav-buttons').style.display = 'flex';
        resultScreen.classList.add('hidden');

        correctScoreElem.textContent = '0';
        wrongScoreElem.textContent = '0';
        loadQuestion();
    });

    loadQuestion();

    // AI Chat vidjeti funksionalligi
    const aiToggleBtn = document.getElementById('aiToggleBtn');
    const aiChatWindow = document.getElementById('aiChatWindow');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiWelcomeBubble = document.getElementById('aiWelcomeBubble');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiUserInput = document.getElementById('aiUserInput');
    const aiChatBody = document.getElementById('aiChatBody');

    window.sendQuickAiQuery = function(queryText) {
        if (aiUserInput && aiSendBtn) {
            aiUserInput.value = queryText;
            sendAiMessage();
        }
    };

    setTimeout(() => {
        if (aiWelcomeBubble) aiWelcomeBubble.classList.add('show');
    }, 1000);

    if (aiToggleBtn && aiChatWindow) {
        aiToggleBtn.addEventListener('click', () => {
            aiChatWindow.classList.toggle('active');
            if (aiWelcomeBubble) aiWelcomeBubble.classList.remove('show');
        });
    }

    if (aiCloseBtn && aiChatWindow) {
        aiCloseBtn.addEventListener('click', () => {
            aiChatWindow.classList.remove('active');
        });
    }

    let conversationHistory = [];

    async function sendAiMessage() {
        if (!aiUserInput) return;
        const text = aiUserInput.value.trim();
        if (!text) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user';
        userMsg.textContent = text;
        aiChatBody.appendChild(userMsg);

        aiUserInput.value = '';
        aiChatBody.scrollTop = aiChatBody.scrollHeight;

        const botMsg = document.createElement('div');
        botMsg.className = 'ai-message bot';
        botMsg.textContent = "O'ylamoqda...";
        aiChatBody.appendChild(botMsg);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;

        try {
            const systemPrompt = "Siz Imperium muzeyining aqlli yordamchisiz. Ushbu veb-sayt PDP JUNIORning F25 guruhidagi Nodirjon, Bexruzjon va Islomjon tomonidan yaratilgan web sayti. Agar foydalanuvchi saytni kim yaratgani yoki mualliflari haqida so'rasa, albatta shu uch xodimni ayting. Foydalanuvchi savollariga faqat o'zbek tilida, qisqa va do'stona javob bering. Siz shuningdek muzey viktorinasi bo'yicha ham yordam berasiz.";
            const requestContents = [...conversationHistory, { role: "user", parts: [{ text: text }] }];

            const response = await fetch(`/api/gemini`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: requestContents
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                const aiResponseText = data.candidates[0].content.parts[0].text;
                botMsg.textContent = aiResponseText;

                conversationHistory.push({ role: "user", parts: [{ text: text }] });
                conversationHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
                if (conversationHistory.length > 20) conversationHistory = conversationHistory.slice(-20);
            } else {
                botMsg.textContent = "Kechirasiz, javob olishda xatolik yuz berdi.";
            }
        } catch (error) {
            console.error("Gemini AI xatosi:", error);
            botMsg.textContent = "Tarmoq bilan aloqa uzildi, iltimos qaytadan urinib ko'ring.";
        }

        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendAiMessage);
    }

    if (aiUserInput) {
        aiUserInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendAiMessage();
            }
        });
    }
});