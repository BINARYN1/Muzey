(() => {
  "use strict";

  const ready = (callback) => {
    const startAfterHydration = () => window.setTimeout(callback, 160);
    if (document.readyState === "complete") {
      startAfterHydration();
    } else {
      window.addEventListener("load", startAfterHydration, { once: true });
    }
  };

  ready(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const story = document.querySelector(".scroll-story");
    const stage = document.querySelector(".sticky-stage");
    const video = document.querySelector("#museum-video");
    const loader = document.querySelector(".video-loader");
    const progressFill = document.querySelector("#progress-fill");
    const progressNumber = document.querySelector("#progress-number");
    const header = document.querySelector(".site-header");
    // Burger menyu -> assets/site.js (u yerda alohida ishga tushadi,
    // shuning uchun quyidagi erta return unga ta'sir qilmaydi)

    if (!story || !stage || !video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let storyProgress = 0;
    let targetVideoTime = 0;
    let renderedVideoTime = 0;
    let lastSeekAt = 0;
    let duration = 10;
    let videoReady = false;

    const hideLoader = () => {
      videoReady = true;
      video.classList.add("is-ready");
      loader?.classList.add("is-hidden");
    };

    const prepareVideo = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 10;
      renderedVideoTime = Math.min(0.01, duration);
      targetVideoTime = renderedVideoTime;
      try {
        video.currentTime = renderedVideoTime;
      } catch (_) {
        // The next animation frame retries after metadata is available.
      }
      hideLoader();
    };

    if (video.readyState >= 1) {
      prepareVideo();
    } else {
      video.addEventListener("loadedmetadata", prepareVideo, { once: true });
      video.addEventListener("canplay", hideLoader, { once: true });
    }

    window.setTimeout(hideLoader, 2800);

    document.querySelectorAll("img").forEach((image) => {
      image.addEventListener(
        "error",
        () => {
          if (!image.src.includes("imperium-poster.jpg")) {
            image.src = "media/imperium-poster.jpg";
          }
        },
        { once: true },
      );
    });

    const syncVideo = (frameTime) => {
      if (videoReady) {
        // Bu tekislash g'ildirakning pog'onaliligini yumshatish uchun
        // qo'yilgan edi. Lenis yoqilganda scroll allaqachon silliq
        // bo'ladi, ustiga yana tekislash qo'shsak video scroll'dan
        // sezilarli orqada suzadi — shuning uchun to'g'ridan-to'g'ri
        // kuzatamiz (42ms seek cheklovi baribir joyida qoladi).
        const easing =
          prefersReducedMotion || window.imperiumLenis ? 1 : 0.19;
        renderedVideoTime += (targetVideoTime - renderedVideoTime) * easing;

        if (
          Number.isFinite(renderedVideoTime) &&
          frameTime - lastSeekAt > 42 &&
          Math.abs(video.currentTime - renderedVideoTime) > 0.012
        ) {
          try {
            const isFarBehind =
              Math.abs(targetVideoTime - video.currentTime) > 0.55;
            const nextTime = isFarBehind ? targetVideoTime : renderedVideoTime;
            video.currentTime = Math.max(
              0,
              Math.min(duration - 0.015, nextTime),
            );
            if (isFarBehind) renderedVideoTime = targetVideoTime;
            lastSeekAt = frameTime;
          } catch (_) {
            // Seeking can briefly fail while the browser is buffering.
          }
        }
      }
      requestAnimationFrame(syncVideo);
    };
    requestAnimationFrame(syncVideo);

    if (!gsap || !ScrollTrigger) {
      window.addEventListener(
        "scroll",
        () => {
          const rect = story.getBoundingClientRect();
          const max = story.offsetHeight - window.innerHeight;
          const progress = Math.min(1, Math.max(0, -rect.top / max));
          targetVideoTime = duration * progress;
          if (progress <= 0) {
            targetVideoTime = 0;
            renderedVideoTime = 0;
            if (videoReady) {
              try {
                video.currentTime = 0;
              } catch (_) {
                // Ignored: seeking can briefly fail while buffering.
              }
            }
          }
          header?.classList.toggle("is-solid", progress > 0.035);
          header?.classList.toggle("is-visible", progress >= 0.995);
          const storyStarted = progress > 0.002;
          document
            .querySelector(".hero-intro")
            ?.classList.toggle("is-visible", storyStarted);
          document
            .querySelector(".scroll-hint")
            ?.classList.toggle("is-visible", storyStarted);
          document
            .querySelector(".story-progress")
            ?.classList.toggle("is-visible", storyStarted);
        },
        { passive: true },
      );

      // GSAP/ScrollTrigger unavailable: reveal content without scroll animation.
      const revealNow = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            observer.unobserve(entry.target);
          }
        });
      };
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(revealNow, {
          threshold: 0.15,
        });
        document
          .querySelectorAll(".reveal")
          .forEach((element) => observer.observe(element));
      } else {
        document.querySelectorAll(".reveal").forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
        });
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const clock = { progress: 0 };
    const master = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    master.to(clock, { progress: 1, duration: 1 }, 0);

    // Screen shows only the video at rest; the hero text/UI reveals the
    // instant the visitor starts scrolling.
    master.fromTo(
      ".hero-intro",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.03 },
      0,
    );
    master.fromTo(
      ".scroll-hint",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.015 },
      0,
    );
    master.fromTo(
      ".story-progress",
      { opacity: 0 },
      { opacity: 1, duration: 0.02 },
      0,
    );

    master.to(
      ".scroll-hint",
      { opacity: 0, y: 20, duration: 0.035 },
      0.035,
    );
    master.to(
      ".hero-intro",
      {
        opacity: 0,
        y: -48,
        scale: 0.94,
        filter: "blur(8px)",
        duration: 0.075,
      },
      0.105,
    );

    master.fromTo(
      ".scene-label--portal",
      { opacity: 0, x: 45, filter: "blur(12px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.045 },
      0.145,
    );
    master.to(
      ".scene-label--portal",
      { opacity: 0, x: 25, filter: "blur(8px)", duration: 0.035 },
      0.26,
    );

    const portalTargets = window.innerWidth < 760
      ? [
          { x: "-27vw", y: "-24vh", rotation: -7 },
          { x: "22vw", y: "-19vh", rotation: 8 },
          { x: "20vw", y: "24vh", rotation: 5 },
        ]
      : [
          { x: "-35vw", y: "-23vh", rotation: -9 },
          { x: "31vw", y: "-20vh", rotation: 8 },
          { x: "30vw", y: "24vh", rotation: 5 },
        ];

    gsap.utils.toArray(".portal-card").forEach((card, index) => {
      const target = portalTargets[index];
      master.fromTo(
        card,
        {
          opacity: 0,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 0.18,
          rotation: 0,
          filter: "blur(18px)",
        },
        {
          opacity: 1,
          x: target.x,
          y: target.y,
          scale: 1,
          rotation: target.rotation,
          filter: "blur(0px)",
          duration: 0.075,
        },
        0.19 + index * 0.008,
      );
      master.to(
        card,
        {
          opacity: 0,
          scale: 0.72,
          filter: "blur(12px)",
          duration: 0.045,
        },
        0.315 + index * 0.006,
      );
    });

    gsap.utils.toArray(".depth-card").forEach((card, index) => {
      const fromX = index % 2 === 0 ? -110 : 110;
      const fromY = index < 2 ? -55 : 55;
      master.fromTo(
        card,
        {
          opacity: 0,
          x: fromX,
          y: fromY,
          scale: 0.65,
          rotation: index % 2 ? 7 : -7,
          filter: "blur(14px)",
        },
        {
          opacity: 0.92,
          x: 0,
          y: 0,
          scale: index === 0 || index === 2 ? 0.88 : 1,
          rotation: index % 2 ? 3 : -3,
          filter: "blur(0px)",
          duration: 0.06,
        },
        0.34 + index * 0.012,
      );
      master.to(
        card,
        {
          opacity: 0,
          x: index % 2 ? 70 : -70,
          scale: 0.78,
          filter: "blur(10px)",
          duration: 0.04,
        },
        0.455 + index * 0.006,
      );
    });

    master.fromTo(
      ".orbit-heading",
      { opacity: 0, x: -40, filter: "blur(12px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.05 },
      0.47,
    );
    master.to(
      ".orbit-heading",
      { opacity: 0, y: -30, filter: "blur(9px)", duration: 0.045 },
      0.74,
    );

    gsap.utils.toArray(".orbit-card").forEach((card, index) => {
      const fromRight = index % 2 === 1;
      const start = 0.53 + index * 0.047;
      master.fromTo(
        card,
        {
          opacity: 0,
          x: fromRight ? 150 : -150,
          y: 30,
          scale: 0.58,
          rotationY: fromRight ? -35 : 35,
          filter: "blur(15px)",
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotationY: 0,
          filter: "blur(0px)",
          duration: 0.035,
        },
        start,
      );
      master.to(
        card,
        {
          opacity: 0,
          x: fromRight ? -90 : 90,
          y: -25,
          scale: 0.72,
          rotationY: fromRight ? 18 : -18,
          filter: "blur(10px)",
          duration: 0.035,
        },
        start + 0.075,
      );
    });

    master.fromTo(
      ".final-copy",
      { opacity: 0, x: -65, filter: "blur(14px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.055 },
      0.86,
    );

    gsap.utils.toArray(".deck-card").forEach((card, index) => {
      master.fromTo(
        card,
        {
          opacity: 0,
          y: 170,
          scale: 0.75,
          rotation: 0,
          rotationY: -28,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: (index - 2) * 5,
          rotationY: 0,
          duration: 0.05,
        },
        0.865 + index * 0.011,
      );
    });

    ScrollTrigger.create({
      trigger: story,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        storyProgress = self.progress;
        targetVideoTime = Math.min(
          duration - 0.015,
          Math.max(0, duration * self.progress),
        );
        if (self.progress <= 0) {
          // Force an exact, immediate reset to the first frame instead of
          // letting the eased sync loop asymptotically approach it — that
          // could leave the video resting a hair after 0 when scrolling
          // back to the very top.
          targetVideoTime = 0;
          renderedVideoTime = 0;
          if (videoReady) {
            try {
              video.currentTime = 0;
            } catch (_) {
              // Ignored: seeking can briefly fail while buffering.
            }
          }
        }
        master.progress(self.progress);

        const percent = Math.round(self.progress * 100);
        if (progressNumber) {
          progressNumber.textContent = String(percent).padStart(2, "0");
        }
        if (progressFill) {
          progressFill.style.transform = `scaleY(${self.progress})`;
        }
        header?.classList.toggle("is-solid", self.progress > 0.035);
        header?.classList.toggle("is-visible", self.progress >= 0.995);
      },
    });

    // DIQQAT: bu yerda ScrollTrigger.refresh() ni qo'lda chaqirmang.
    // Refresh o'lchov uchun scroll'ni vaqtincha 0 ga qo'yadi, Lenis esa
    // uni darrov qaytaradi — natijada ScrollTrigger progress'ni 0 deb
    // yodda saqlab qoladi va video birinchi kadrda qotib qoladi.

    const trailLayer = document.querySelector("#cursor-trail");
    const trailSources = Array.from(
      document.querySelectorAll(".collection-card img"),
    ).map((image) => image.getAttribute("src"));
    // Warm the browser cache ahead of time so a new trail card never stalls
    // waiting on a fresh network fetch for one of these (lazy-loaded) images.
    trailSources.forEach((src) => {
      const preload = new Image();
      preload.referrerPolicy = "no-referrer";
      preload.src = src;
    });
    const liveTrail = [];
    let trailIndex = 0;
    let lastPoint = { x: -9999, y: -9999 };
    let lastTrailAt = 0;

    const removeTrailCard = (card) => {
      const index = liveTrail.indexOf(card);
      if (index >= 0) liveTrail.splice(index, 1);
      card.remove();
    };

    const trimTrail = () => {
      if (liveTrail.length <= 4) return;
      const oldest = liveTrail.shift();
      gsap.killTweensOf(oldest);
      gsap.to(oldest, {
        opacity: 0,
        scale: 0.6,
        duration: 0.22,
        ease: "power1.out",
        overwrite: true,
        onComplete: () => oldest.remove(),
      });
    };

    const spawnTrailCard = (x, y) => {
      if (!trailLayer || !trailSources.length) return;
      const card = document.createElement("div");
      const image = document.createElement("img");
      card.className = "trail-card";
      image.alt = "";
      image.decoding = "async";
      image.src = trailSources[trailIndex % trailSources.length];
      image.referrerPolicy = "no-referrer";
      image.addEventListener(
        "error",
        () => {
          image.src = "media/imperium-poster.jpg";
        },
        { once: true },
      );
      trailIndex += 1;
      card.append(image);
      trailLayer.append(card);
      liveTrail.push(card);

      trimTrail();

      const rotation = gsap.utils.random(-10, 10);
      const timeline = gsap.timeline({
        onComplete: () => removeTrailCard(card),
      });
      gsap.set(card, {
        x: x - 66,
        y: y - 87,
        opacity: 0,
        scale: 0.55,
        rotation,
        force3D: true,
      });
      timeline.to(card, {
        opacity: 1,
        scale: 1,
        rotation,
        duration: 0.5,
        ease: "power2.out",
      });
      timeline.to(card, {
        opacity: 0,
        scale: 0.7,
        y: y - 110,
        duration: 0.7,
        ease: "power1.inOut",
      }, "+=0.32");
    };

    if (finePointer && !prefersReducedMotion) {
      stage.addEventListener("pointermove", (event) => {
        if (storyProgress > 0.17) return;
        const now = performance.now();
        const distance = Math.hypot(
          event.clientX - lastPoint.x,
          event.clientY - lastPoint.y,
        );
        if (distance < 130 || now - lastTrailAt < 90) return;
        lastPoint = { x: event.clientX, y: event.clientY };
        lastTrailAt = now;
        spawnTrailCard(event.clientX, event.clientY);
      });
    }

    const collectionGrid = document.querySelector(".collection-grid");
    document.querySelectorAll(".collection-card").forEach((card) => {
      const media = card.querySelector(".collection-card__media");

      const focus = () => {
        collectionGrid?.classList.add("has-focus");
        card.classList.add("is-focused");
      };
      const blur = () => {
        collectionGrid?.classList.remove("has-focus");
        card.classList.remove("is-focused");
        if (media) {
          media.style.setProperty("--rx", "0deg");
          media.style.setProperty("--ry", "0deg");
        }
      };

      card.addEventListener("pointerenter", focus);
      card.addEventListener("focus", focus);
      card.addEventListener("pointerleave", blur);
      card.addEventListener("blur", blur);

      if (finePointer && media) {
        // Sichqoncha soniyasiga yuzlab hodisa yuboradi. Ilgari har bir
        // hodisada getBoundingClientRect() chaqirilib (majburiy reflow)
        // ustiga yangi GSAP tween yaratilardi — video scroll bilan seek
        // qilinayotgan paytda aynan shu qotishga sabab bo'lardi.
        // Endi hodisalar bitta kadrga yig'iladi: kadr boshiga bitta
        // o'lcham o'qish va ikkita o'zgaruvchi yozish.
        let pointer = null;
        let tiltFrame = 0;

        const applyTilt = () => {
          tiltFrame = 0;
          if (!pointer) return;
          const rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const px = (pointer.x - rect.left) / rect.width;
          const py = (pointer.y - rect.top) / rect.height;
          media.style.setProperty("--ry", `${(px - 0.5) * 7}deg`);
          media.style.setProperty("--rx", `${(0.5 - py) * 7}deg`);
        };

        card.addEventListener(
          "pointermove",
          (event) => {
            pointer = { x: event.clientX, y: event.clientY };
            if (tiltFrame) return;
            tiltFrame = window.requestAnimationFrame(applyTilt);
          },
          { passive: true },
        );

        card.addEventListener("pointerleave", () => {
          pointer = null;
          if (tiltFrame) {
            window.cancelAnimationFrame(tiltFrame);
            tiltFrame = 0;
          }
        });
      }
    });

    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 55 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    ScrollTrigger.create({
      trigger: "#story",
      start: "top 20%",
      end: "bottom top",
      onEnter: () => header?.classList.add("is-solid", "is-visible"),
      onLeaveBack: () => header?.classList.remove("is-solid", "is-visible"),
    });

  });
})();
