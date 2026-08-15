# Imperium Museum — HTML, CSS va JavaScript

Bu loyiha React, Next.js va boshqa frameworklarsiz yozilgan.

## Fayllar

- `index.html` — saytning to‘liq HTML tuzilishi
- `style.css` — dizayn va CSS animatsiyalari
- `script.js` — video-scroll va interaktiv effektlar
- `media/` — video va poster
- `vendor/` — GSAP hamda ScrollTrigger fayllari

### `assets/` — barcha sahifalar uchun umumiy fayllar

- `assets/theme.css` — yagona rang tokenlari (`:root`) va tungi rejim
  (`[data-theme="dark"]`). Ilgari bu blok 8 faylda takrorlangan edi.
- `assets/site-header.css` — header, burger tugmasi va mobil menyu uslublari.
  Ilgari 8 faylda bayt-baytiga takrorlangan edi.
- `assets/site.js` — burger menyu, tema almashtirgich va silliq scroll
  (Lenis) ishga tushirilishi. Ilgari 10 joyda takrorlangan edi.
- `assets/lenis.css` — Lenis uchun zarur uslublar.
- `vendor/lenis.min.js` — silliq scroll kutubxonasi (GSAP kabi lokal).

`index.html`, `nimadur.html` va `zallar.html` header uslubini o‘zida
saqlaydi — ularning strukturasi va breakpointi (1250px, ochiluvchi menyu)
boshqacha.

## Tungi rejim

Header'dagi oy/quyosh tugmasi orqali yoqiladi. Tanlov `localStorage` ning
`imperium-theme` kalitida saqlanadi; standart holat — yorug‘.

Har sahifaning `<head>` ida CSS'dan **oldin** kichik skript bor — u sahifa
chizilishidan avval `data-theme` ni o‘rnatadi, shunda tungi rejimda oq
chaqnash bo‘lmaydi. Uni CSS havolalaridan keyinga ko‘chirmang.

Yangi rang qo‘shganda `assets/theme.css` dagi ikkala blokka ham qiymat
yozing. E'lon qilinmagan o‘zgaruvchi nomlarini (`--ink-muted`, `--text-gold`,
`--font-title`, `--bg-color`, `--font-headline`, `--font-serif`,
`--text-light`) u yerda **aniqlamang**: hozir ular ishlamaydi, aniqlansa
uxlab yotgan qoidalar birdan ishlab, ko‘rinishni o‘zgartiradi.

`restavratsiya.html` va `imperium_museum_awakening.html` bu tizimga
kirmaydi — ularning o‘z Dark/Sepia/Gold almashtirgichi bor.

### Gazeta sahifalari (`misr.html`, `rim.html`)

Ular umumiy header va tema tizimiga ulangan, lekin kontent uslubi
(vintage gazeta: Cinzel/IM Fell English, masthead, ticker lentasi,
drop-cap) o‘zicha qoladi. Ilgari ularning o‘z Dark/Sepia/Gold
almashtirgichi bor edi — endi header’dagi umumiy oy/quyosh tugmasi
ishlatiladi.

Ranglari `misr.css` / `rim.css` boshidagi ikkita blokda:
`:root` — yorug‘ rejim (Misr: papirus, Rim: marmar), `[data-theme="dark"]`
— tungi rejim (avvalgi standart ko‘rinish).

**Nomlar `--gz-` prefiksi bilan yoziladi.** `assets/theme.css` ham
`--bg-dark`, `--card-bg`, `--accent-red` nomlarini e’lon qiladi va
gazeta CSS’i undan **keyin** ulanadi; prefikssiz yozilsa gazeta qiymati
umumiy header’nikini bosib ketadi.

`rim.css` da `--gz-line-rgb` alohida ahamiyatga ega: butun sahifadagi
silver chiziq va yarim shaffof yuzalar shu kanaldan chiqadi
(`rgba(var(--gz-line-rgb), x)`). Ilgari ular `rgba(255,255,255,x)` deb
qattiq yozilgan edi va yorug‘ rejimda ko‘rinmay qolardi.

Gazeta mastheadi endi `sticky` emas — sahifa oqimida, fixed
`.site-header` ostida turadi. Shu sababli `body` ga `padding-top: 90px`
(1100px dan pastda 80px) berilgan.

**Rasm filtrlari `--img-filter` orqali beriladi**, `filter` orqali emas:

```css
.history-image-frame img { --img-filter: sepia(0.3) contrast(1.1); }
```

Kirish animatsiyasi (`.entrance-img-frame`) `filter: var(--img-filter, )
blur(10px)` deb yozadi va `.revealed` da blur’ni 0 ga tushiradi. To‘g‘ridan
to‘g‘ri `filter:` yozilsa, `.entrance-img-frame.revealed img` (selektor kuchi
0,2,1) uni bosib ketadi va rang ishlovi umuman ko‘rinmaydi — ilgari shunday
bo‘lgan. Blur ikkala holatda ham ro‘yxatda qoladi, aks holda filter
funksiyalari soni mos kelmay o‘tish silliq bo‘lmaydi.

Typewriter yozilgan elementlarga `min-height` berilgan (`.lead-headline`,
`.booking-title`, `.article-subheading`, `.masthead-subtitle`) — busiz matn
uzaygan sari sahifa pastga suriladi.

## Silliq scroll (Lenis)

Sichqoncha g‘ildiragi pog‘onali ishlaydi — har “tiq” ~100px sakraydi.
`index.html` da bu videoning bir zumda ~0.15 soniya oldinga sakrashini
talab qiladi va sakrash-kutish tarzida ko‘rinadi. Lenis har tiqni silliq
siljishga aylantiradi.

Ishlaganda `<html>` ga `lenis` klassi qo‘shiladi. Sozlash `assets/site.js`
dagi `initSmoothScroll()` da. Bilish kerak bo‘lgan qoidalar:

- **`lerp` va `duration` ni birga bermang** — `lerp` berilsa, `duration`
  e’tiborga olinmaydi.
- **Oynani native usulda surmang.** `window.scrollTo`, `scrollIntoView`
  va GSAP `ScrollToPlugin` Lenis’ni desinxron qiladi (scroll qotib
  qoladi, birinchi g‘ildirak harakatigacha). O‘rniga
  `window.imperiumLenis.scrollTo(...)`. Shu sabab `nimadur.js` dagi
  `scrollToEra()` Lenis bo‘lsa u orqali boradi.
- **`ScrollTrigger.refresh()` ni qo‘lda chaqirmang** — refresh o‘lchov
  uchun scroll’ni vaqtincha 0 ga qo‘yadi, Lenis qaytaradi va
  ScrollTrigger progress’ni 0 deb eslab qoladi.
- Ichida o‘z scroll’i bo‘lgan bloklarga `data-lenis-prevent` qo‘ying
  (masalan `xarita.html` dagi `#map`).
- `prefers-reduced-motion` yoqilgan bo‘lsa Lenis umuman ishga tushmaydi.

## Ishga tushirish

`index.html` faylini brauzerda oching.

Eng yaxshi natija uchun papkani VS Code’da ochib, `index.html` ustida **Open with Live Server** ni bosing.

Hech qanday `npm install` yoki build buyrug‘i kerak emas.
