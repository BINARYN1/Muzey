const EUROPEANA_API_KEY = "api2demo";
const API_URL = "https://api.europeana.eu/record/v2/search.json";

const statusDiv = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const ROWS_PER_PAGE = 12;
let currentQuery = "sculpture";
let currentStart = 1;
let totalResults = 0;

const modal = document.getElementById('artModal');
const modal3DContainer = document.getElementById('modal3DContainer');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

// ============================================================
// MASONRY GALEREYA — CSS ustunlari (column-count) yordamida
// sahifa bilan birga oddiy scroll qilinadigan, to'liq kenglikni
// egallaydigan Pinterest-uslubidagi panjara. Har bir rasm o'z
// tabiiy nisbatida (aspect ratio) ko'rinadi, kesilmaydi.
// ============================================================
const galleryMasonry = document.getElementById('galleryMasonry');

function resetMasonry() {
  if (galleryMasonry) galleryMasonry.innerHTML = '';
}

function openArtModal(title, link3D, imageUrl) {
  modal.classList.add('active');
  modalCaption.textContent = title;

  if (link3D && (link3D.includes('sketchfab') || link3D.includes('3d') || link3D.includes('embed'))) {
    modal3DContainer.innerHTML = `<iframe src="${link3D}" allowfullscreen></iframe>`;
  } else {
    modal3DContainer.innerHTML = `<img src="${imageUrl}" alt="${title}">`;
  }
}

// Qidiruv natijalarini masonry panjarasiga qo'shish
function addTilesToWorld(items) {
  if (!galleryMasonry) return;

  items.forEach(item => {
    if (!item.edmPreview || item.edmPreview.length === 0) return; // rasmsiz yozuvlar o'tkazib yuboriladi
    const imageUrl = item.edmPreview[0];
    const title = item.title && item.title.length > 0 ? item.title[0] : "Yevropa Madaniy Merosi";
    const link3D = item.edmIsShownAt ? item.edmIsShownAt[0] : null;

    const tile = document.createElement('div');
    tile.className = 'gallery-tile';
    tile.style.opacity = '0';

    const img = document.createElement('img');
    img.alt = title;
    img.loading = 'lazy';
    img.onload = () => {
      requestAnimationFrame(() => {
        tile.style.transition = 'opacity 0.4s ease';
        tile.style.opacity = '1';
      });
    };
    img.onerror = () => tile.remove(); // chindan buzilgan rasmlar o'tkazib yuboriladi
    img.src = imageUrl;
    tile.appendChild(img);

    tile.addEventListener('click', () => openArtModal(title, link3D, imageUrl));

    galleryMasonry.appendChild(tile);
  });
}

// Burger menyu -> assets/site.js

// ============================================================
// STICKY GRID SCROLL — bo'lim boshidagi scroll-animatsiya.
// Manba: Codrops "Sticky Grid Scroll" (Theo Plawinski, MIT
// litsenziya) asosida IMPERIUM uslubiga moslashtirildi.
// GSAP + ScrollTrigger vendor/gsap.min.js va
// vendor/ScrollTrigger.min.js orqali ulanadi (galereya.html).
// Sahifaning umumiy Lenis silliq scrolli assets/site.js da
// allaqachon ScrollTrigger bilan sinxronlangan — bu yerda
// alohida Lenis nusxasi yaratilmaydi.
// ============================================================
(function initStickyGridScroll() {
  const block = document.querySelector('.ssg-block');
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!block || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const wrapper = block.querySelector('.ssg-wrapper');
  const content = block.querySelector('.ssg-content');
  const title = block.querySelector('.ssg-title');
  const extras = block.querySelectorAll('.ssg-kicker, .ssg-description, .ssg-button');
  const grid = block.querySelector('.ssg-grid');
  const items = block.querySelectorAll('.ssg-item');

  const numColumns = 3;
  const columns = Array.from({ length: numColumns }, () => []);
  items.forEach((item, index) => columns[index % numColumns].push(item));

  let titleOffsetY = 0;

  if (extras.length) {
    gsap.set(extras, { opacity: 0, pointerEvents: 'none' });
  }

  if (content && title) {
    const dy = (content.offsetHeight - title.offsetHeight) / 2;
    titleOffsetY = (dy / content.offsetHeight) * 100;
    gsap.set(title, { yPercent: titleOffsetY });
  }

  // Bo'lim ekranga kirganda wrapper pastdan yuqoriga siljib joyiga tushadi
  if (wrapper) {
    gsap.from(wrapper, {
      yPercent: -100,
      ease: 'none',
      scrollTrigger: { trigger: block, start: 'top bottom', end: 'top top', scrub: true },
    });
  }

  // Sarlavha ekranning 57% chizig'iga yetganda paydo bo'ladi — asl
  // Codrops namunasidagi chegara. Bu endi ishonchli ishlaydi, chunki
  // .ssg-block dan OLDIN .ssg-intro (100vh) joylashgan — blok tepasi
  // ekranga pastdan asta kirib keladi, xuddi asl namunadagidek.
  if (title) {
    gsap.from(title, {
      opacity: 0,
      duration: 0.7,
      ease: 'power1.out',
      scrollTrigger: { trigger: block, start: 'top 57%', toggleActions: 'play none none reset' },
    });
  }

  function gridRevealTimeline() {
    const timeline = gsap.timeline();
    const wh = window.innerHeight;
    const dy = wh - (wh - grid.offsetHeight) / 2;

    columns.forEach((column, colIndex) => {
      const fromTop = colIndex % 2 === 0;
      timeline.from(
        column,
        {
          y: dy * (fromTop ? -1 : 1),
          stagger: { each: 0.06, from: fromTop ? 'end' : 'start' },
          ease: 'power1.inOut',
        },
        'grid-reveal',
      );
    });
    return timeline;
  }

  function gridZoomTimeline() {
    const timeline = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });
    timeline.to(grid, { scale: 2.05 });
    timeline.to(columns[0], { xPercent: -40 }, '<');
    timeline.to(columns[2], { xPercent: 40 }, '<');
    timeline.to(
      columns[1],
      {
        yPercent: (index) => (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
        duration: 0.5,
        ease: 'power1.inOut',
      },
      '-=0.5',
    );
    return timeline;
  }

  function toggleExtras(isVisible) {
    if (!title || !extras.length) return;
    gsap.timeline({ defaults: { overwrite: true } })
      .to(title, { yPercent: isVisible ? 0 : titleOffsetY, duration: 0.7, ease: 'power2.inOut' })
      .to(
        extras,
        {
          opacity: isVisible ? 1 : 0,
          duration: 0.4,
          ease: `power1.${isVisible ? 'inOut' : 'out'}`,
          pointerEvents: isVisible ? 'all' : 'none',
        },
        isVisible ? '-=90%' : '<',
      );
  }

  if (grid && items.length) {
    // Asl Codrops namunasidagi chegaralar: "top 25%" dan "bottom bottom"
    // gacha. .ssg-intro borligi sababli bu endi to'liq va asta-sekin
    // ishlaydi (400vh ning deyarli hammasi bo'ylab).
    const masterTimeline = gsap.timeline({
      scrollTrigger: { trigger: block, start: 'top 25%', end: 'bottom bottom', scrub: true },
    });

    masterTimeline
      .add(gridRevealTimeline())
      .add(gridZoomTimeline(), '-=0.6')
      .add(() => toggleExtras(masterTimeline.scrollTrigger.direction === 1), '-=0.32');
  }

  // MUHIM: skript sahifa pastida ishga tushganda "Baloo 2" veb-shrifti
  // hali almashmagan bo'ladi (Google Fonts async yuklanadi) va rasmlar
  // ham hali yuklanmagan bo'lishi mumkin. ScrollTrigger start/end
  // qiymatlarini ANI shu paytdagi (hali "settle" bo'lmagan) joylashuv
  // asosida hisoblab qo'yadi — shrift almashgach matn balandligi
  // o'zgarsa, bu qiymatlar noto'g'ri qolib ketadi va butun animatsiya
  // (ochilish -> zoom -> matn) siqilib/vaqtidan oldin tugagandek
  // ko'rinadi. Shrift va sahifa to'liq yuklangach qayta hisoblatamiz.
  // DIQQAT: ScrollTrigger.refresh() ni qo'lda chaqirmang — Lenis bilan
  // desinxron qiladi (README.md). ScrollTrigger fontlar/load hodisasida
  // o'zi resize orqali qayta o'lchaydi.
})();

// High Quality Curated Fallback Museum Artworks
const CURATED_ARTWORKS = [
  {
    title: "Milo's Venus (Afrodita)",
    country: "Gretsiya / Luvr Muzeyi",
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    link3D: "https://sketchfab.com/models/4d86895eb8db431792bc4906ec1421ab/embed"
  },
  {
    title: "Mikelanjelo - David Haykali",
    country: "Italiya, Florensiya Galereyasi",
    img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",
    link3D: "https://sketchfab.com/models/ef60dfab46b449b28a9b6c00d43343c5/embed"
  },
  {
    title: "Nefertiti Byusti Durdonasi",
    country: "Misr / Berlin Muzeyi",
    img: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80",
    link3D: "https://sketchfab.com/models/01416e75b7a1496a92ec2b5a1532f7a9/embed"
  },
  {
    title: "Yunon Antik Vazasining Naqshlari",
    country: "Afina, Gretsiya",
    img: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=800&q=80",
    link3D: null
  },
  {
    title: "Rim Imperatori Kaskasi va Qalqoni",
    country: "Rim, Italiya",
    img: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80",
    link3D: null
  },
  {
    title: "Rim Kolizeyi Me'morchilik Modeli",
    country: "Italiya, Rim",
    img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    link3D: "https://sketchfab.com/models/2d2be41bdf0346db9490df0bdf4b42b6/embed"
  }
];

let favoriteCount = parseInt(localStorage.getItem('imperium_fav_count') || '0', 10);
const favCountElem = document.getElementById('favCount');
if (favCountElem) favCountElem.textContent = favoriteCount;

// Kategoriya boyicha filterlash
window.filterGalleryCategory = function(category, element) {
  document.querySelectorAll('.cat-pill').forEach(pill => pill.classList.remove('active'));
  if (element) element.classList.add('active');

  if (searchInput) searchInput.value = category;
  fetchEuropeana3D(category);
};

// Europeana API orqali eksponatlarni yuklash
async function fetchEuropeana3D(query = "3D", { append = false } = {}) {
  try {
    if (!append) {
      currentQuery = query;
      currentStart = 1;
      totalResults = 0;
      resetMasonry();
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } else if (loadMoreBtn) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Yuklanmoqda...`;
    }

    statusDiv.textContent = append ? "Ko'proq eksponatlar yuklanmoqda..." : "Europeana eksponatlari yuklanmoqda...";

    const url = `${API_URL}?wskey=${EUROPEANA_API_KEY}&query=${encodeURIComponent(currentQuery)}&qf=TYPE:IMAGE&reusability=open&media=true&thumbnail=true&rows=${ROWS_PER_PAGE}&start=${currentStart}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      statusDiv.textContent = append
        ? `Natijalar: "${currentQuery}" bo'yicha eksponatlar`
        : "Afsuski, mos keladigan eksponatlar topilmadi.";
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    statusDiv.textContent = `Natijalar: "${currentQuery}" bo'yicha eksponatlar`;
    addTilesToWorld(data.items);

    totalResults = data.totalResults || 0;
    currentStart += data.items.length;

    if (loadMoreBtn) {
      loadMoreBtn.style.display = currentStart <= totalResults ? 'inline-flex' : 'none';
    }
  } catch (error) {
    console.error("Europeana API xatosi:", error);
    statusDiv.textContent = "Xatolik yuz berdi. Internet ulanishini tekshiring.";
  } finally {
    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerHTML = `<i class="fa-solid fa-arrow-down"></i> Ko'proq yuklash`;
    }
  }
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) fetchEuropeana3D(query);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) fetchEuropeana3D(query);
  }
});

const keywords = ["statue", "chair", "vase", "architecture", "sculpture", "helmet", "crown"];
randomBtn.addEventListener('click', () => {
  const randomQuery = keywords[Math.floor(Math.random() * keywords.length)];
  searchInput.value = randomQuery;
  fetchEuropeana3D(randomQuery);
});

loadMoreBtn?.addEventListener('click', () => {
  fetchEuropeana3D(currentQuery, { append: true });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
  modal3DContainer.innerHTML = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    modal3DContainer.innerHTML = '';
  }
});

fetchEuropeana3D("sculpture");

// --- AI Chat Vidjeti Logikasi (Google Gemini API bilan) ---
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
      const systemPrompt = "Siz Imperium muzeyining aqlli yordamchisiz. Ushbu veb-sayt PDP JUNIORning F25 guruhidagi Nodirjon, Bexruzjon va Islomjon tomonidan yaratilgan web sayti. Agar foydalanuvchi saytni kim yaratgani yoki mualliflari haqida so'rasa, albatta shu uch xodimni ayting. Foydalanuvchi qaysi tilda murojaat qilsa (o'zbek, ingliz, rus va h.k.), xuddi shu tilda qisqa va do'stona javob bering. Agar foydalanuvchi biror eksponat, haykal, madaniyat yoki obyekt haqida so'rasa, javobingiz oxiriga albatta [SEARCH: english_keywords] tegini qo'shing (masalan: [SEARCH: Statue] yoki [SEARCH: Chair] yoki [SEARCH: Vase]).";

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

        const searchMatch = aiResponseText.match(/\[SEARCH:\s*(.*?)\]/i);
        if (searchMatch && searchMatch[1]) {
          const searchQuery = searchMatch[1].trim();
          searchInput.value = searchQuery;
          fetchEuropeana3D(searchQuery);
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