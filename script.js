/* =========================
   عدّل البيانات دي بسهولة
   ========================= */
const noorDetails = {
  firstMeetingPlace: "",     // مثال: قدام الكلية
  firstMeetingDate: "",      // مثال: 20 يوليو 2026
  firstWords: "",            // أول كلام بينكم
  favoriteSport: "",         // رياضتها المفضلة
  collegeName: "كلية تربية رياضية",
  studyYear: "",             // السنة الدراسية
  favoriteColor: "",
  favoriteSong: "",
  specialMoment: "",
  specialSentence: "",
  personalNickname: "",
  whatsappLink: "https://wa.me/201282266003"
};

const confessions = [
  "أنا ساعات بفتح الشات ومبيبقاش عندي كلام معين أنا ببقى عايز أكلمك إنتي وخلاص",
  "كل مرة أقول مش هكلمك علشان متحسيش إني بزن ألاقي نفسي بفكر فيكي أكتر",
  "اسمك بقى من الحاجات اللي بتغير مودي من غير مجهود",
  "أنا مش مهتم أعرف لونك المفضل وخلاص أنا عايز أعرف إيه اللي بيفرحك بجد وإيه اللي بيزعلك",
  "عايز أعرف طموحك والحاجة اللي نفسك توصليلها وإيه أكتر حاجة بتحبيها في كليتك",
  "عايز أعرف نور وهي مبسوطة ونور وهي متعصبة ونور وهي مركزة ونور وهي بتضحك من قلبها",
  "أنا مش بدور على كلام يومين وبعدها كل واحد يختفي أنا عايز أعرفك بجد وبشكل محترم",
  "ممكن تكوني شايفة إني بحاول كتير بس السبب إنك فعلًا لفتيني بطريقة مش بتحصل معايا كل يوم",
  "أصعب تمرين بالنسبالي حاليًا إني أحاول أشيلك من دماغي وواضح إني بسقط فيه كل مرة 😂",
  "أنا مش عايز أبقى شخص تقيل عليكي أنا نفسي أبقى شخص وجوده مريح بالنسبالك"
];

const responseContent = {
  yes: {
    icon: "🤍",
    title: "كفاية عندي إنك وافقتي نبدأ",
    text: "مش هستعجل حاجة ومش هضغط عليكي هناخد الموضوع واحدة واحدة وعلى راحتك يا نور"
  },
  time: {
    icon: "⏳",
    title: "خدي كل الوقت اللي محتاجاه",
    text: "مش مستني منك قرار تحت ضغط الأهم عندي إنك تكوني مرتاحة"
  },
  no: {
    icon: "🤍",
    title: "قرارك على راسي يا نور",
    text: "شكرًا إنك قريتي كلامي للآخر مش هضغط عليكي ولا هضايقك وأتمنالك من قلبي كل حاجة حلوة"
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const loader = $("#loader");
const header = $("#siteHeader");
const progress = $("#readingProgress");
const backToTop = $("#backToTop");
const bgMusic = $("#bgMusic");
const musicToggle = $("#musicToggle");
const toast = $("#toast");
let toastTimer;
let confessionIndex = 0;
let starClicks = 0;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("is-hidden"), 2450);
  buildPersonalTimeline();
  setupRevealObserver();
  setupAmbientCanvas();
});

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (!$(".modal.open")) document.body.classList.remove("modal-open");
}

$$('[data-close-modal]').forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
});

$$('.modal').forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal(modal);
  });
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") $$(".modal.open").forEach(closeModal);
});

$("#openMusicChoice").addEventListener("click", () => openModal($("#musicModal")));

$("#playMusic").addEventListener("click", async () => {
  try {
    await bgMusic.play();
    musicToggle.classList.add("is-active");
    closeModal($("#musicModal"));
    showToast("الموسيقى اشتغلت 🎧");
  } catch {
    closeModal($("#musicModal"));
    showToast("حط ملف romantic.mp3 جنب ملفات الموقع علشان الموسيقى تشتغل");
  }
});

$("#skipMusic").addEventListener("click", () => {
  closeModal($("#musicModal"));
  showToast("تمام خلي التركيز كله في الكلام 😂");
});

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicToggle.classList.add("is-active");
      showToast("الموسيقى اشتغلت");
    } catch {
      showToast("ضيف ملف romantic.mp3 داخل مجلد الموقع");
    }
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("is-active");
    showToast("الموسيقى اتوقفت");
  }
});

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("scrolled", scrollTop > 50);
  backToTop.classList.toggle("show", scrollTop > 600);
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

function setupRevealObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .13 });
  $$(".reveal").forEach(el => observer.observe(el));
}

$("#nextConfession").addEventListener("click", () => {
  confessionIndex = (confessionIndex + 1) % confessions.length;
  const text = $("#confessionText");
  text.classList.remove("swap");
  void text.offsetWidth;
  text.textContent = confessions[confessionIndex];
  text.classList.add("swap");
  $("#confessionCount").textContent = `${confessionIndex + 1} / ${confessions.length}`;
});

$$('.questions-list button').forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("is-open");
    showToast("السؤال ده إجابته عند نور وبس 🤍");
  });
});

$$('.decision-btn').forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.choice;
    const data = responseContent[type];
    $("#responseIcon").textContent = data.icon;
    $("#responseTitle").textContent = data.title;
    $("#responseText").textContent = data.text;

    const whatsappBtn = $("#whatsappBtn");
    if (type === "yes" && noorDetails.whatsappLink.trim()) {
      whatsappBtn.href = noorDetails.whatsappLink.trim();
      whatsappBtn.hidden = false;
    } else {
      whatsappBtn.hidden = true;
    }
    openModal($("#responseModal"));
  });
});

$("#secretStar").addEventListener("click", () => {
  starClicks += 1;
  if (starClicks < 3) {
    showToast(`فاضل ${3 - starClicks} ضغطة للرسالة السرية`);
  } else {
    starClicks = 0;
    openModal($("#secretModal"));
  }
});

$("#shareBtn").addEventListener("click", async () => {
  const shareData = {
    title: "حاجة صغيرة لنور",
    text: "المكان ده معمول علشانك إنتي وبس",
    url: location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(location.href);
      showToast("لينك الموقع اتنسخ");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("معرفتش أشارك الرابط من المتصفح ده");
  }
});

function buildPersonalTimeline() {
  const labels = {
    firstMeetingPlace: "أول مكان شوفتك فيه",
    firstMeetingDate: "أول تاريخ فاكره",
    firstWords: "أول كلام بينا",
    favoriteSport: "الرياضة الأقرب ليكي",
    collegeName: "كليتك",
    studyYear: "السنة الدراسية",
    favoriteColor: "لونك المفضل",
    favoriteSong: "أغنيتك المفضلة",
    specialMoment: "موقف مميز",
    specialSentence: "جملة منك فضلت في دماغي",
    personalNickname: "اسم بحب أناديكي بيه"
  };

  const ignored = new Set(["whatsappLink"]);
  const items = Object.entries(noorDetails)
    .filter(([key, value]) => !ignored.has(key) && String(value).trim())
    .map(([key, value]) => ({ label: labels[key] || key, value }));

  if (!items.length) return;
  const section = $("#detailsSection");
  const timeline = $("#personalTimeline");
  timeline.innerHTML = items.map(item => `
    <article class="timeline-item reveal">
      <span>${escapeHtml(item.label)}</span>
      <p>${escapeHtml(item.value)}</p>
    </article>
  `).join("");
  section.hidden = false;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

// قلوب بسيطة عند الضغط
window.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  const heart = document.createElement("span");
  heart.className = "click-heart";
  heart.textContent = Math.random() > .5 ? "♡" : "✦";
  heart.style.left = `${e.clientX}px`;
  heart.style.top = `${e.clientY}px`;
  heart.style.color = Math.random() > .5 ? "#d7a7be" : "#d7b36a";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1300);
});

// إضاءة تتبع حركة الماوس
const cursorGlow = $(".cursor-glow");
window.addEventListener("pointermove", e => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
}, { passive: true });

function setupAmbientCanvas() {
  const canvas = $("#ambientCanvas");
  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!ctx || reduceMotion) return;

  let particles = [];
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(70, Math.floor(innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.4 + .3,
      speed: Math.random() * .18 + .04,
      alpha: Math.random() * .45 + .08
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -5) { p.y = innerHeight + 5; p.x = Math.random() * innerWidth; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,210,225,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();
  addEventListener("resize", resize);
  draw();
}
