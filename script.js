
"use strict";

// ============================================
// PHYSICS LAB — BY DARKHAN
// ТЕРМОДИНАМИКАНЫҢ БІРІНШІ ЗАҢЫ
// ============================================

// НЕГІЗГІ КӨМЕКШІЛЕР

const $ = id => document.getElementById(id);

function formatNumber(value) {
  return Number(value).toLocaleString("kk-KZ", {
    maximumFractionDigits: 6
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// ============================================
// 1. САБАҚ БӨЛІМДЕРІ
// ============================================

const stages = [
  {
    tag: "01 / ТҮСІНДІРУ",
    title: "Тақырыпты түсіндіру",
    description: "8 суретті түсіндірме",
    minutes: 25
  },
  {
    tag: "02 / ВИДЕО",
    title: "Қысқа бейнесабақ",
    description: "Видео және талқылау",
    minutes: 5
  },
  {
    tag: "03 / КОНСПЕКТ",
    title: "Дәптерге конспект",
    description: "10 бөлімдік конспект",
    minutes: 15
  },
  {
    tag: "04 / ЕСЕПТЕР",
    title: "Есептер шығару",
    description: "18 есеп, 3 қиындық деңгейі",
    minutes: 15
  },
  {
    tag: "05 / ОЙЫНДАР",
    title: "Командалық физика батлы",
    description: "3 команда және 8 ойын",
    minutes: 20
  },
  {
    tag: "06 / ҚОРЫТЫНДЫ",
    title: "Сабақтың қорытындысы",
    description: "Командалардың ұпайлары мен орындары",
    minutes: 0
  }
];

let currentStage = 0;
let lessonPage = 0;
let problemPage = 0;
let gameRound = 0;
let gameQuestion = 0;

// ============================================
// 2. УАҚЫТ / ТАЙМЕР
// ============================================

let remainingSeconds = 25 * 60;
let timerRunning = false;
let timerDeadline = 0;

function updateTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  $("timer").textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");

  if (currentStage === 5) {
    $("timerStatus").textContent = "Сабақ аяқталды";
  } else if (remainingSeconds === 0) {
    $("timerStatus").textContent = "Уақыт аяқталды";
  } else {
    $("timerStatus").textContent = timerRunning
      ? "Уақыт жүріп жатыр"
      : "Уақыт тоқтатылды";
  }

  $("pauseTimer").textContent =
    timerRunning ? "⏸" : "▶";
}

function resetTimer() {
  remainingSeconds = stages[currentStage].minutes * 60;

  timerRunning = currentStage !== 5;

  timerDeadline = Date.now() + remainingSeconds * 1000;

  updateTimer();
}

function pauseTimer() {
  if (currentStage === 5) return;

  if (timerRunning) {
    remainingSeconds = Math.max(
      0,
      Math.ceil((timerDeadline - Date.now()) / 1000)
    );

    timerRunning = false;
  } else if (remainingSeconds > 0) {
    timerRunning = true;
    timerDeadline = Date.now() + remainingSeconds * 1000;
  }

  updateTimer();
}

setInterval(() => {
  if (!timerRunning) return;

  remainingSeconds = Math.max(
    0,
    Math.ceil((timerDeadline - Date.now()) / 1000)
  );

  if (remainingSeconds === 0) {
    timerRunning = false;
  }

  updateTimer();
}, 250);

$("pauseTimer").addEventListener("click", pauseTimer);
$("resetTimer").addEventListener("click", resetTimer);

// ============================================
// 3. ТҮСІНДІРМЕНІҢ 8 СУРЕТІ
// SVG СУРЕТТЕР ИНТЕРНЕТСІЗ ЖҰМЫС ІСТЕЙДІ
// ============================================

function createDiagram(index) {
  const rect = (x, y, w, h, color) => `
    <rect x="${x}" y="${y}"
      width="${w}" height="${h}"
      rx="15" fill="${color}"/>
  `;

  const text = (
    x, y, value,
    size = 26,
    color = "#f0f7ff"
  ) => `
    <text x="${x}" y="${y}"
      text-anchor="middle"
      fill="${color}"
      font-family="Arial"
      font-size="${size}"
      font-weight="bold">
      ${value}
    </text>
  `;

  const arrow = (x1, y1, x2, y2) => `
    <line x1="${x1}" y1="${y1}"
      x2="${x2}" y2="${y2}"
      stroke="#80e9ff"
      stroke-width="6"
      marker-end="url(#arrowhead)"/>
  `;

  let picture = "";

  // 1. ЭНЕРГИЯ БАЛАНСЫ
  if (index === 0) {
    picture =
      rect(45, 95, 240, 160, "#225179") +
      rect(330, 95, 240, 160, "#22614f") +
      rect(615, 95, 240, 160, "#674b2c") +

      text(165, 170, "Q", 59) +
      text(450, 170, "ΔU", 50) +
      text(735, 170, "A", 59) +

      arrow(293, 176, 317, 176) +
      arrow(579, 176, 603, 176) +

      text(165, 296, "Жылу", 23) +
      text(450, 296, "Ішкі энергия", 23) +
      text(735, 296, "Жұмыс", 23);
  }

  // 2. ОҢ ЖӘНЕ ТЕРІС ТАҢБАЛАР
  if (index === 1) {
    picture =
      rect(65, 77, 355, 225, "#21547b") +
      rect(485, 77, 355, 225, "#65402b") +

      text(240, 131, "Q &gt; 0", 40, "#a7efff") +
      text(665, 131, "Q &lt; 0", 40, "#ffc08d") +

      text(240, 192, "Жылу алады", 27) +
      text(665, 192, "Жылу бөледі", 27) +

      text(450, 340, "Энергияның берілу бағыты", 25);
  }

  // 3. ПОРШЕНЬДЕГІ ГАЗ
  if (index === 2) {
    picture =
      rect(260, 144, 370, 171, "#205f85") +
      rect(247, 126, 395, 25, "#a1becd") +
      rect(419, 68, 53, 59, "#a1becd") +

      arrow(445, 122, 445, 53) +
      arrow(647, 223, 765, 223) +

      text(780, 191, "A", 41) +
      text(345, 106, "Q", 41, "#ffe3a3") +
      text(450, 349, "Газ ұлғайып, жұмыс атқарады", 24);
  }

  // 4. ИЗОХОРАЛЫҚ
  if (index === 3) {
    picture =
      rect(235, 70, 430, 237, "#235b7e") +
      rect(225, 57, 450, 25, "#9fb8ca") +

      text(450, 155, "V = const", 43) +
      text(450, 221, "A = 0", 43, "#ffda96") +
      text(450, 344, "Q = ΔU", 33);
  }

  // 5. ИЗОБАРАЛЫҚ
  if (index === 4) {
    picture =
      rect(250, 145, 370, 175, "#205e81") +
      rect(239, 126, 392, 24, "#a5bac9") +
      rect(424, 70, 53, 57, "#a5bac9") +

      arrow(450, 121, 450, 52) +
      text(741, 181, "p = const", 28) +
      text(450, 352, "A = pΔV", 35);
  }

  // 6. ИЗОТЕРМИЯЛЫҚ
  if (index === 5) {
    picture =
      rect(65, 95, 345, 190, "#245275") +
      rect(490, 95, 345, 190, "#28614e") +

      text(236, 164, "T = const", 34) +
      text(664, 164, "ΔU = 0", 35) +

      arrow(424, 190, 477, 190) +
      text(450, 341, "Q = A", 37, "#ffe3a3");
  }

  // 7. АДИАБАТАЛЫҚ
  if (index === 6) {
    picture =
      rect(75, 85, 345, 219, "#234c70") +
      rect(480, 85, 345, 219, "#66472e") +

      text(247, 160, "Q = 0", 42) +
      text(653, 160, "Сығылу", 36) +

      arrow(431, 186, 470, 186) +

      text(247, 246, "Адиабата", 28) +
      text(653, 246, "ΔU &gt; 0", 32) +

      text(450, 349, "ΔU = −A", 32);
  }

  // 8. ФОРМУЛАЛАР
  if (index === 7) {
    picture =
      rect(52, 76, 375, 110, "#20527e") +
      rect(473, 76, 375, 110, "#20527e") +
      rect(52, 205, 375, 110, "#245d50") +
      rect(473, 205, 375, 110, "#245d50") +

      text(239, 145, "Q = ΔU + A", 30) +
      text(661, 145, "ΔU = Q − A", 30) +
      text(239, 276, "A = pΔV", 34) +
      text(661, 276, "Q = cmΔt", 34);
  }

  return `
    <figure class="diagram">
      <svg viewBox="0 0 900 365"
           xmlns="http://www.w3.org/2000/svg"
           role="img"
           aria-label="Физикалық құбылыстың схемасы">

        <defs>
          <marker id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8" refY="3"
            orient="auto">

            <path d="M0,0 L0,6 L8,3 z"
              fill="#80e9ff"/>
          </marker>
        </defs>

        <rect width="900"
          height="365"
          rx="17"
          fill="#0a233e"/>

        ${picture}
      </svg>

      <figcaption>
        Термодинамикалық процестің көрнекі схемасы
      </figcaption>
    </figure>
  `;
}

// ============================================
// 4. 8 ТҮСІНДІРМЕ
// ============================================

const lessons = [
  {
    title: "Термодинамиканың бірінші заңы",
    formula: "Q = ΔU + A",

    text: `
      <p class="lead">
        Термодинамиканың бірінші заңы —
        энергияның сақталу заңының жылу
        процестеріне қолданылуы.
      </p>

      <p>
        Жүйеге берілген жылу мөлшері оның
        ішкі энергиясын өзгертуге және жүйенің
        сыртқы денелерге қарсы жұмыс атқаруына
        жұмсалады.
      </p>

      <h3>Белгіленуі</h3>

      <p>
        Q — жүйеге берілген жылу, Дж.<br>
        ΔU — ішкі энергияның өзгерісі, Дж.<br>
        A — газдың өзі атқарған жұмыс, Дж.
      </p>

      <p>
        Бұл заң энергияның жоқтан пайда
        болмайтынын және жоғалмайтынын,
        тек басқа түрге ауысатынын түсіндіреді.
      </p>
    `,

    example: `
      Газ 1000 Дж жылу алып,
      300 Дж жұмыс атқарды.
      ΔU = 1000 − 300 = 700 Дж.
    `,

    question: "Жылу мөлшері қандай екі мақсатқа жұмсалады?"
  },

  {
    title: "Жылу мен жұмыстың таңбалары",
    formula: "ΔU = Q − A",

    text: `
      <p>
        Есептерде жылу мөлшері мен газ жұмысының
        оң және теріс таңбалары маңызды.
      </p>

      <h3>Жылу мөлшері</h3>

      <p>
        Q &gt; 0 — жүйе жылу қабылдайды.<br>
        Q &lt; 0 — жүйе жылу бөледі.
      </p>

      <h3>Газдың жұмысы</h3>

      <p>
        A &gt; 0 — газ ұлғайып, жұмыс атқарады.<br>
        A &lt; 0 — газ сығылып, оған жұмыс атқарылады.
      </p>

      <p>
        Біздің формулада A деп газдың өзі
        атқарған жұмыс белгіленген.
      </p>
    `,

    example: `
      Газға сыртқы күштер 200 Дж жұмыс
      атқарса, газдың жұмысы A = −200 Дж.
    `,

    question: "Газ сығылғанда A неліктен теріс?"
  },

  {
    title: "Газдың механикалық жұмысы",
    formula: "A = pΔV",

    text: `
      <p>
        Газ поршеньді итеріп, оның орнын
        өзгерткен кезде механикалық жұмыс атқарады.
      </p>

      <p>
        Тұрақты қысымда газдың жұмысы қысым
        мен көлем өзгерісінің көбейтіндісіне тең.
      </p>

      <h3>Шамалар</h3>

      <p>
        p — қысым, Па.<br>
        ΔV — көлем өзгерісі, м³.<br>
        A — жұмыс, Дж.
      </p>

      <p>
        Газ ұлғайғанда ΔV оң,
        сығылғанда теріс болады.
      </p>

      <h3>Есеп</h3>

      <p>
        p = 200000 Па<br>
        ΔV = 0,003 м³<br>
        A = 200000 × 0,003 = 600 Дж.
      </p>
    `,

    example: `
      Поршень астындағы газ ұлғайғанда
      поршень жоғары көтеріледі.
    `,

    question: "Газдың көлемі өзгермесе, жұмысы қандай болады?"
  },

  {
    title: "Изохоралық процесс",
    formula: "V = const; A = 0; Q = ΔU",

    text: `
      <p class="lead">
        Изохоралық процесс — газдың
        көлемі өзгермейтін процесс.
      </p>

      <p>
        Көлем тұрақты болғандықтан,
        газ көлем өзгерісіне байланысты
        механикалық жұмыс атқармайды.
      </p>

      <p>
        Сондықтан A = 0.
        Бірінші заң Q = ΔU түрінде жазылады.
      </p>

      <p>
        Егер газ жылу қабылдаса,
        оның ішкі энергиясы артады.
      </p>
    `,

    example: `
      Жабық, көлемі өзгермейтін ыдыстағы
      газ 500 Дж жылу алса, ΔU = 500 Дж.
    `,

    question: "Неліктен изохоралық процесте A = 0?"
  },

  {
    title: "Изобаралық процесс",
    formula: "p = const; Q = ΔU + pΔV",

    text: `
      <p>
        Изобаралық процесс — қысым тұрақты
        болатын термодинамикалық процесс.
      </p>

      <p>
        Газ қыздырылғанда ұлғайып,
        жұмыс атқара алады.
      </p>

      <p>
        Бұл процесте A = pΔV.
        Сондықтан бірінші заң
        Q = ΔU + pΔV түріне келеді.
      </p>

      <h3>Мысал</h3>

      <p>
        Q = 1500 Дж<br>
        p = 100000 Па<br>
        ΔV = 0,005 м³
      </p>

      <p>
        A = 500 Дж.<br>
        ΔU = 1500 − 500 = 1000 Дж.
      </p>
    `,

    example: `
      Еркін қозғалатын поршень астындағы
      газ қысым тұрақты болғанда ұлғая алады.
    `,

    question: "Изобаралық процесте газ жұмысын қалай табамыз?"
  },

  {
    title: "Изотермиялық процесс",
    formula: "T = const; ΔU = 0; Q = A",

    text: `
      <p>
        Изотермиялық процесс — температура
        тұрақты болатын процесс.
      </p>

      <p>
        Идеал газдың ішкі энергиясы
        тек температураға тәуелді.
      </p>

      <p>
        Сондықтан идеал газ үшін
        температура өзгермесе,
        ΔU = 0 болады.
      </p>

      <p>
        Бірінші заң бойынша Q = A.
        Идеал газ изотермиялық ұлғайғанда
        алған жылуы жұмысқа жұмсалады.
      </p>
    `,

    example: `
      Идеал газ изотермиялық ұлғайып,
      400 Дж жұмыс атқарса, Q = 400 Дж.
    `,

    question: "Идеал газдың изотермиялық процесінде ΔU неге нөл?"
  },

  {
    title: "Адиабаталық процесс",
    formula: "Q = 0; ΔU = −A",

    text: `
      <p>
        Адиабаталық процесс — қоршаған
        ортамен жылу алмасусыз өтетін процесс.
      </p>

      <p>
        Бұл процесте Q = 0.
        Сондықтан ΔU = −A.
      </p>

      <p>
        Газ адиабаталық ұлғайғанда
        жұмыс атқарып, ішкі энергиясын
        азайтады.
      </p>

      <p>
        Газды адиабаталық сығу кезінде
        оған жұмыс атқарылады,
        ішкі энергиясы артады.
      </p>
    `,

    example: `
      Газ адиабаталық ұлғайып,
      300 Дж жұмыс атқарса,
      ΔU = −300 Дж.
    `,

    question: "Адиабаталық сығылған газдың ішкі энергиясы қалай өзгереді?"
  },

  {
    title: "Негізгі формулаларды қайталау",
    formula: "Q = ΔU + A",

    text: `
      <p>
        Термодинамиканың бірінші заңы
        энергияның сақталуын сипаттайды.
      </p>

      <h3>Негізгі формулалар</h3>

      <p>
        Q = ΔU + A<br>
        ΔU = Q − A<br>
        A = Q − ΔU<br>
        A = pΔV
      </p>

      <h3>Термодинамикалық процестер</h3>

      <p>
        Изохоралық: V = const; A = 0.<br>
        Изобаралық: p = const; A = pΔV.<br>
        Изотермиялық: T = const;
        идеал газ үшін ΔU = 0.<br>
        Адиабаталық: Q = 0.
      </p>

      <p>
        Әр есепті шығарғанда шамалардың
        таңбасын және өлшем бірліктерін тексер.
      </p>
    `,

    example: `
      Қыздыру, салқындау, ұлғаю және сығылу —
      энергияның өзгеруімен байланысты құбылыстар.
    `,

    question: "Төрт термодинамикалық процеске жеке формула жаз."
  }
];

function renderLesson() {
  const lesson = lessons[lessonPage];

  $("screen").innerHTML = `
    <article class="card">

      <span class="mini-title">
        ТҮСІНДІРМЕ ${lessonPage + 1} / 8
      </span>

      <div class="progress">
        <div style="width:${(lessonPage + 1) / 8 * 100}%"></div>
      </div>

      <h2>${lessonPage + 1}. ${lesson.title}</h2>

      ${createDiagram(lessonPage)}

      ${lesson.text}

      <div class="formula">
        ${lesson.formula}
      </div>

      <div class="example">
        <strong>💡 Мысал</strong>
        <p>${lesson.example}</p>
      </div>

      <div class="question-box">
        <strong>💬 Тексеру сұрағы</strong>
        <p>${lesson.question}</p>
      </div>

      <div class="actions">
        <button class="btn secondary" data-action="previous">
          ← Алдыңғы бет
        </button>

        <button class="btn primary" data-action="next">
          ${lessonPage === 7
            ? "Видеоға өту →"
            : "Келесі түсіндірме →"}
        </button>
      </div>

    </article>
  `;
}

// ============================================
// 5. ВИДЕО
// ============================================

function renderVideo() {
  $("screen").innerHTML = `
    <div class="card">
      <h2>🎬 Термодинамиканың бірінші заңы</h2>

      <p class="lead">
        Бейнесабақтан негізгі заңды,
        газдың жұмысын және изопроцестерді
        түсінуге тырысыңдар.
      </p>

      <div class="video-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/Hux2zcmzrN0?start=0&end=240&rel=0"
          title="Термодинамиканың бірінші заңы"
          loading="lazy"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>

      <p class="muted">
        Бейне интернет арқылы ашылады.
        Егер ендірілген видео жұмыс істемесе,
        оң жақтағы YouTube батырмасы арқылы
        қазақша бейнесабақты іздеуге болады.
      </p>

      <h3>Талқылауға арналған сұрақтар</h3>

      <p>1. Термодинамиканың бірінші заңы нені білдіреді?</p>
      <p>2. Газдың жұмысы қашан оң болады?</p>
      <p>3. Изохоралық процесте газ неге жұмыс атқармайды?</p>

      <div class="actions">
        <button class="btn primary" data-action="next">
          Конспектке өту →
        </button>
      </div>
    </div>
  `;
}

// ============================================
// 6. ДӘПТЕРГЕ АРНАЛҒАН 10 КОНСПЕКТ
// ============================================

const notes = [
  {
    title: "Термодинамиканың бірінші заңы",
    text: `
      Термодинамиканың бірінші заңы энергияның
      сақталу заңына негізделеді. Жүйеге берілген
      жылу мөлшері оның ішкі энергиясын өзгертуге
      және жұмыс атқаруға жұмсалады.
      Формуласы: Q = ΔU + A.
    `
  },
  {
    title: "Ішкі энергия",
    text: `
      Ішкі энергия — денедегі бөлшектердің ретсіз
      қозғалысының кинетикалық энергиясы мен
      өзара әрекеттесуінің потенциалдық энергиясы.
      Ол U әрпімен белгіленіп, джоульмен өлшенеді.
    `
  },
  {
    title: "Жылу мөлшері",
    text: `
      Жылу мөлшері Q — жылу алмасуда берілетін
      энергия. Q оң болса жүйе жылу алады,
      ал Q теріс болса жылу бөледі.
    `
  },
  {
    title: "Газдың жұмысы",
    text: `
      Газ сыртқы денелерге қарсы механикалық
      жұмыс атқара алады. Тұрақты қысымда
      A = pΔV. Газ ұлғайса A оң,
      сығылса A теріс.
    `
  },
  {
    title: "Ішкі энергияның өзгерісі",
    text: `
      Ішкі энергия өзгерісі ΔU = Q − A
      формуласымен табылады. ΔU оң болса
      ішкі энергия артады, теріс болса кемиді.
    `
  },
  {
    title: "Изохоралық процесс",
    text: `
      Изохоралық процесс кезінде көлем тұрақты:
      V = const. Газдың көлемдік жұмысы A = 0.
      Сондықтан Q = ΔU.
    `
  },
  {
    title: "Изобаралық процесс",
    text: `
      Изобаралық процесте қысым тұрақты:
      p = const. Газдың жұмысы A = pΔV.
      Бірінші заң: Q = ΔU + pΔV.
    `
  },
  {
    title: "Изотермиялық процесс",
    text: `
      Изотермиялық процесс кезінде
      температура тұрақты: T = const.
      Идеал газ үшін ΔU = 0,
      сондықтан Q = A.
    `
  },
  {
    title: "Адиабаталық процесс",
    text: `
      Адиабаталық процесте жүйе қоршаған
      ортамен жылу алмаспайды: Q = 0.
      Сондықтан ΔU = −A.
    `
  },
  {
    title: "Есеп шығару тәртібі",
    text: `
      Әр есепте берілген шамаларды жазады,
      қажетті формуланы таңдайды, өлшем
      бірліктерін SI жүйесіне келтіреді,
      таңбаларды тексереді, есептейді
      және жауабын көрсетеді.
    `
  }
];

function renderNotes() {
  $("screen").innerHTML = `
    <div class="card">
      <h2>📝 Дәптерге арналған конспект</h2>

      <p class="lead">
        Негізгі анықтамалар мен формулаларды
        дәптерге жазыңдар.
      </p>

      ${notes.map((note, index) => `
        <div class="note">
          <h3>${index + 1}. ${note.title}</h3>
          <p>${note.text}</p>
        </div>
      `).join("")}

      <h3>Формулалар кестесі</h3>

      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Шама немесе процесс</th>
              <th>Формула</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Бірінші заң</td>
              <td>Q = ΔU + A</td>
            </tr>
            <tr>
              <td>Ішкі энергия өзгерісі</td>
              <td>ΔU = Q − A</td>
            </tr>
            <tr>
              <td>Тұрақты қысымдағы жұмыс</td>
              <td>A = pΔV</td>
            </tr>
            <tr>
              <td>Изохора</td>
              <td>Q = ΔU</td>
            </tr>
            <tr>
              <td>Изотерма (идеал газ)</td>
              <td>Q = A</td>
            </tr>
            <tr>
              <td>Адиабата</td>
              <td>ΔU = −A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="actions">
        <button class="btn primary" data-action="next">
          Есептерге өту →
        </button>
      </div>
    </div>
  `;
}

// ============================================
// 7. 18 ФИЗИКАЛЫҚ ЕСЕП
// ============================================

// Құрылымы:
// [Сұрақ, формула, жауап, бірлік, шешуі]

const problems = [
  [
    "Газ 1500 Дж жылу алып, 400 Дж жұмыс атқарды. ΔU қанша?",
    "ΔU = Q − A",
    1100, "Дж",
    "ΔU = 1500 − 400 = 1100 Дж"
  ],
  [
    "Газдың ΔU = 700 Дж, ал A = 300 Дж. Q қанша?",
    "Q = ΔU + A",
    1000, "Дж",
    "Q = 700 + 300 = 1000 Дж"
  ],
  [
    "Газ 1200 Дж жылу алды. Ішкі энергиясы 900 Дж-ға артты. A?",
    "A = Q − ΔU",
    300, "Дж",
    "A = 1200 − 900 = 300 Дж"
  ],
  [
    "Тұрақты көлемдегі газ 500 Дж жылу алды. ΔU?",
    "ΔU = Q",
    500, "Дж",
    "A = 0; ΔU = 500 Дж"
  ],
  [
    "Адиабаталық сығылуда газға 250 Дж жұмыс атқарылды. ΔU?",
    "ΔU = −A",
    250, "Дж",
    "A = −250 Дж; ΔU = +250 Дж"
  ],
  [
    "Идеал газ изотермиялық ұлғайып, 900 Дж жұмыс атқарды. Q?",
    "Q = A",
    900, "Дж",
    "ΔU = 0; Q = 900 Дж"
  ],
  [
    "Қысым 200000 Па, көлем өзгерісі 0,003 м³. Газдың жұмысы?",
    "A = pΔV",
    600, "Дж",
    "A = 200000 × 0,003 = 600 Дж"
  ],
  [
    "Қысым 100000 Па, көлем өзгерісі 0,005 м³. A қанша?",
    "A = pΔV",
    500, "Дж",
    "A = 100000 × 0,005 = 500 Дж"
  ],
  [
    "Газға 2000 Дж жылу берілді. p = 100000 Па, ΔV = 0,006 м³. ΔU?",
    "ΔU = Q − pΔV",
    1400, "Дж",
    "A = 600 Дж; ΔU = 2000 − 600 = 1400 Дж"
  ],
  [
    "Газға Q = 1500 Дж берілді, ΔU = 250 Дж. A?",
    "A = Q − ΔU",
    1250, "Дж",
    "A = 1500 − 250 = 1250 Дж"
  ],
  [
    "Тұрақты көлемде газ 300 Дж жылу бөлді. ΔU?",
    "ΔU = Q",
    -300, "Дж",
    "Q = −300 Дж; A = 0; ΔU = −300 Дж"
  ],
  [
    "Газ адиабаталық ұлғайып, 350 Дж жұмыс атқарды. ΔU?",
    "ΔU = −A",
    -350, "Дж",
    "ΔU = 0 − 350 = −350 Дж"
  ],
  [
    "Q = 500 Дж, ΔU = −200 Дж. Газдың жұмысы A?",
    "A = Q − ΔU",
    700, "Дж",
    "A = 500 − (−200) = 700 Дж"
  ],
  [
    "Газдың ΔU = 1800 Дж. Оған сыртқы күштер 500 Дж жұмыс атқарды. Q?",
    "Q = ΔU + A",
    1300, "Дж",
    "A = −500 Дж; Q = 1800 − 500 = 1300 Дж"
  ],
  [
    "p = 300000 Па, көлем 0,002 м³-қа кеміді. A?",
    "A = pΔV",
    -600, "Дж",
    "ΔV = −0,002 м³; A = −600 Дж"
  ],
  [
    "Q = −800 Дж, ΔU = −1100 Дж. A қанша?",
    "A = Q − ΔU",
    300, "Дж",
    "A = −800 − (−1100) = 300 Дж"
  ],
  [
    "Q = 2400 Дж, p = 200000 Па, ΔV = 0,004 м³. ΔU?",
    "ΔU = Q − pΔV",
    1600, "Дж",
    "A = 800 Дж; ΔU = 2400 − 800 = 1600 Дж"
  ],
  [
    "Q = 6000 Дж, ΔU = 4200 Дж, p = 300000 Па. ΔV?",
    "ΔV = (Q − ΔU)/p",
    0.006, "м³",
    "ΔV = (6000 − 4200)/300000 = 0,006 м³"
  ]
];

// ============================================
// 8. ДЕРЕКТЕРДІ САҚТАУ
// ============================================

const STORAGE_KEY = "darkhan_thermodynamics_v2";

function loadProgress() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );
  } catch {
    return {};
  }
}

const stored = loadProgress();

const solvedProblems = new Set(
  Array.isArray(stored.solved)
    ? stored.solved
    : []
);

const openedSolutions = new Set();

const teamNames =
  Array.isArray(stored.teams) && stored.teams.length === 3
    ? stored.teams.map(String)
    : ["Энергия", "Газ", "Жылу"];

const gameAnswers =
  stored.answers &&
  typeof stored.answers === "object" &&
  !Array.isArray(stored.answers)
    ? stored.answers
    : {};

const creativeAwards =
  Array.isArray(stored.awards) && stored.awards.length === 3
    ? stored.awards
    : [null, null, null];

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      solved: [...solvedProblems],
      teams: teamNames,
      answers: gameAnswers,
      awards: creativeAwards
    }));
  } catch {
    // Сақтау мүмкін болмаса, сабақ бәрібір жұмыс істейді.
  }
}

// ============================================
// 9. ЕСЕПТЕРДІ КӨРСЕТУ
// ============================================

function renderProblem() {
  const p = problems[problemPage];
  const level = Math.floor(problemPage / 6);

  $("screen").innerHTML = `
    <div class="card">
      <h2>📝 Дәптерге 18 есеп</h2>

      <p>
        Алғашқы 6 есеп — сабақтағы негізгі жұмыс.
        Қалған 12 есеп — күрделендірілген және
        қосымша тапсырмалар.
      </p>

      <div class="level-tabs">
        ${[0, 1, 2].map(i => `
          <button class="tab ${level === i ? "active" : ""}"
            data-action="level"
            data-index="${i}">
            ${i + 1}-деңгей
          </button>
        `).join("")}
      </div>

      <p>
        <b>Дұрыс шығарылғаны:</b>
        ${solvedProblems.size} / 18
      </p>
    </div>

    <div class="card">
      <span class="mini-title">
        ЕСЕП ${problemPage + 1} / 18
      </span>

      <h2>${p[0]}</h2>

      <h3>Қажетті формула</h3>

      <div class="formula">
        ${p[1]}
      </div>

      <p>
        Берілгенін, формуласын, шешу жолын
        және жауабын дәптерге жаз.
      </p>

      <label class="field">
        Жауап (${p[3]})

        <input id="problemInput"
          type="number"
          step="any"
          placeholder="Санмен енгіз">
      </label>

      <div class="actions">
        <button class="btn primary"
          data-action="check-problem">
          ✅ Жауапты тексеру
        </button>

        <button class="btn secondary"
          data-action="show-solution">
          📖 Шешу жолы
        </button>
      </div>

      <div id="problemFeedback"
        class="feedback" hidden></div>

      <div id="solutionBox"
        class="example"
        ${openedSolutions.has(problemPage)
          ? "" : "hidden"}>

        <strong>Толық шешуі</strong>
        <p>${p[4]}</p>
      </div>

      <div class="actions">
        <button class="btn secondary"
          data-action="previous">
          ← Алдыңғы есеп
        </button>

        <button class="btn primary"
          data-action="next">
          ${problemPage === 17
            ? "Ойындарға өту →"
            : "Келесі есеп →"}
        </button>
      </div>
    </div>

    <div class="card">
      <h3>Осы деңгейдегі тапсырмалар</h3>

      <div class="task-list">
        ${problems.slice(level * 6, level * 6 + 6)
          .map((item, i) => {
            const number = level * 6 + i;

            return `
              <div class="task-item">
                ${number + 1}. ${item[0]}
                ${solvedProblems.has(number) ? "✅" : ""}
              </div>
            `;
          }).join("")}
      </div>
    </div>
  `;
}

function checkProblem() {
  const input = $("problemInput");
  const feedback = $("problemFeedback");

  if (input.value.trim() === "") {
    feedback.hidden = false;
    feedback.textContent = "Алдымен жауабыңды енгіз.";
    return;
  }

  const p = problems[problemPage];
  const value = Number(input.value);

  const tolerance = Math.max(
    0.00000001,
    Math.abs(p[2]) * 0.000001
  );

  const correct = Number.isFinite(value) &&
    Math.abs(value - p[2]) <= tolerance;

  feedback.hidden = false;

  if (correct) {
    solvedProblems.add(problemPage);
    openedSolutions.add(problemPage);

    $("solutionBox").hidden = false;

    feedback.textContent =
      `✅ Дұрыс! ${formatNumber(p[2])} ${p[3]}`;

    saveProgress();
  } else {
    feedback.textContent =
      "❌ Қате. Формуланы, таңбаларды және өлшем бірлігін тексер.";
  }
}

// ============================================
// 10. ОЙЫН СҰРАҚТАРЫН ҚҰРАСТЫРУ
// ============================================

function quiz(q, options, right, explanation, picture = -1) {
  return { q, options, right, explanation, picture };
}

function calculation(q, answer, explanation) {
  return { q, answer, explanation };
}

// ============================================
// 11. 8 КЕЗЕҢДІК КОМАНДАЛЫҚ ОЙЫН
// ============================================

const rounds = [
  {
    title: "🧠 1-ойын. Білім батлы",
    points: 10,
    minutes: 2,
    items: [
      quiz(
        "Термодинамиканың бірінші заңының формуласы?",
        ["Q = ΔU + A", "Q = A − ΔU", "Q = mgh"],
        0,
        "Жылу ішкі энергия өзгерісіне және жұмысқа жұмсалады."
      ),
      quiz(
        "Газ ұлғайғанда оның жұмысы қандай?",
        ["Әрқашан нөл", "Оң", "Теріс"],
        1,
        "Газ ұлғайса, ΔV оң болғандықтан жұмысы да оң."
      ),
      quiz(
        "Ішкі энергия өзгерісінің формуласы?",
        ["ΔU = A − Q", "ΔU = Q + A", "ΔU = Q − A"],
        2,
        "ΔU = Q − A."
      )
    ]
  },

  {
    title: "⚖️ 2-ойын. Дұрыс / бұрыс",
    points: 10,
    minutes: 2,
    items: [
      quiz(
        "Изохоралық процесте A = 0.",
        ["Дұрыс", "Бұрыс"],
        0,
        "Көлем өзгермегендіктен газ көлемдік жұмыс атқармайды."
      ),
      quiz(
        "Адиабаталық процесте Q әрқашан оң.",
        ["Дұрыс", "Бұрыс"],
        1,
        "Адиабаталық процесте Q = 0."
      ),
      quiz(
        "Идеал газдың изотермиялық процесінде ΔU = 0.",
        ["Дұрыс", "Бұрыс"],
        0,
        "Идеал газдың ішкі энергиясы температураға тәуелді."
      )
    ]
  },

  {
    title: "🖼 3-ойын. Суретпен жұмыс",
    points: 10,
    minutes: 2,
    items: [
      quiz(
        "Қай процесс V = const шартымен өтеді?",
        ["Изобара", "Изохора", "Адиабата"],
        1,
        "Изохорада көлем тұрақты болады.",
        3
      ),
      quiz(
        "Қай процесте p = const?",
        ["Изобара", "Изотерма", "Изохора"],
        0,
        "Изобарада қысым тұрақты.",
        4
      ),
      quiz(
        "Қай процесте Q = 0?",
        ["Изохора", "Изобара", "Адиабата"],
        2,
        "Адиабаталық процесте жылу алмасу болмайды.",
        6
      )
    ]
  },

  {
    title: "🧮 4-ойын. Есеп батлы",
    points: 20,
    minutes: 4,
    items: [
      calculation(
        "Q = 1500 Дж, A = 400 Дж. ΔU қанша?",
        1100,
        "ΔU = 1500 − 400 = 1100 Дж."
      ),
      calculation(
        "ΔU = 600 Дж, A = 300 Дж. Q қанша?",
        900,
        "Q = 600 + 300 = 900 Дж."
      ),
      calculation(
        "p = 200000 Па, ΔV = 0,002 м³. A қанша?",
        400,
        "A = 200000 × 0,002 = 400 Дж."
      )
    ]
  },

  {
    title: "🌍 5-ойын. Өмірлік жағдай",
    points: 10,
    minutes: 2,
    items: [
      quiz(
        "Газ сығылғанда оның жұмысының таңбасы?",
        ["Теріс", "Оң", "Нөл"],
        0,
        "Сығылған кезде көлем өзгерісі теріс."
      ),
      quiz(
        "Көлемі өзгермейтін ыдыста қандай процесс болуы мүмкін?",
        ["Изобара", "Изохора", "Изотерма"],
        1,
        "Изохора кезінде көлем тұрақты."
      ),
      quiz(
        "Жылу алмай ұлғайып жұмыс атқарған газдың ішкі энергиясы?",
        ["Артады", "Өзгермейді", "Азаяды"],
        2,
        "Q = 0, сондықтан ΔU = −A."
      )
    ]
  },

  {
    title: "🔎 6-ойын. Қатені тап",
    points: 10,
    minutes: 2,
    items: [
      quiz(
        "Q = 1000 Дж, A = 300 Дж. Студент ΔU = 1300 Дж деді. Дұрысы?",
        ["700 Дж", "1300 Дж", "300 Дж"],
        0,
        "ΔU = 1000 − 300 = 700 Дж."
      ),
      quiz(
        "Q = 0, A = 200 Дж. ΔU = +200 Дж деді. Дұрысы?",
        ["0 Дж", "−200 Дж", "+200 Дж"],
        1,
        "ΔU = −A = −200 Дж."
      ),
      quiz(
        "Газдың көлемі тұрақты. Студент A = 600 Дж деп жазды. Дұрысы?",
        ["A = 1200 Дж", "A = −600 Дж", "A = 0"],
        2,
        "Изохорада көлем өзгермейді, сондықтан A = 0."
      )
    ]
  },

  {
    title: "⚡ 7-ойын. Жылдам блиц",
    points: 5,
    minutes: 2,
    items: [
      quiz(
        "Q = 500 Дж, A = 100 Дж. ΔU?",
        ["400 Дж", "600 Дж", "100 Дж"],
        0,
        "ΔU = 500 − 100 = 400 Дж."
      ),
      quiz(
        "V = const қандай процесс?",
        ["Изотерма", "Изохора", "Изобара"],
        1,
        "V = const — изохора."
      ),
      quiz(
        "p = const қандай процесс?",
        ["Изохора", "Адиабата", "Изобара"],
        2,
        "p = const — изобара."
      ),
      quiz(
        "Адиабаталық процестегі Q?",
        ["0", "100", "−100"],
        0,
        "Q = 0."
      ),
      quiz(
        "Идеал газ үшін T = const болса, ΔU?",
        ["100 Дж", "0", "200 Дж"],
        1,
        "Температура тұрақты болғандықтан ΔU = 0."
      ),
      quiz(
        "1 кДж неше Дж?",
        ["100", "10", "1000"],
        2,
        "1 кДж = 1000 Дж."
      )
    ]
  },

  {
    title: "🎨 8-ойын. Шығармашылық финал",
    points: 30,
    minutes: 4,
    items: []
  }
];

// ============================================
// 12. КОМАНДАЛАРДЫҢ ҰПАЙЛАРЫ
// ============================================

function answerKey(roundIndex, questionIndex) {
  return `${roundIndex}_${questionIndex}`;
}

function getRoundScore(teamIndex, roundIndex) {
  if (roundIndex === 7) {
    return creativeAwards[teamIndex] ?? 0;
  }

  const round = rounds[roundIndex];
  let points = 0;

  round.items.forEach((item, index) => {
    // Әр үшінші сұрақ бір командаға тиесілі.
    if (index % 3 !== teamIndex) return;

    const saved = gameAnswers[
      answerKey(roundIndex, index)
    ];

    if (saved && saved.correct) {
      points += round.points;
    }
  });

  return points;
}

function getTeamTotal(teamIndex) {
  return rounds.reduce(
    (sum, round, index) =>
      sum + getRoundScore(teamIndex, index),
    0
  );
}

function scoreboardHTML() {
  return `
    <div class="scoreboard">
      ${teamNames.map((name, index) => `
        <div class="team-card">

          <small>${index + 1}-команда</small>

          <input
            data-team-name="${index}"
            maxlength="24"
            value="${escapeHTML(name)}"
            aria-label="${index + 1}-команда атауы">

          <strong>${getTeamTotal(index)}</strong>

          <small>ұпай / 110</small>
        </div>
      `).join("")}
    </div>
  `;
}

// ============================================
// 13. ШЫҒАРМАШЫЛЫҚ ТАПСЫРМАЛАР
// ============================================

const creativeTasks = [
  `
    Изохора, изобара, изотерма және
    адиабата процестерін бейнелейтін
    төрт схема салыңдар.

    Әрқайсысының шартын, формуласын
    және бір мысалын жазыңдар.
  `,

  `
    Өздерің термодинамиканың бірінші
    заңына байланысты есеп құрастырыңдар.

    Берілгенін, формуласын және
    толық шешу жолын көрсетіңдер.

    Газ жұмысының физикалық мағынасын
    түсіндіріңдер.
  `,

  `
    Газдың ұлғаюы мен сығылуын
    салыстыратын екі сурет салыңдар.

    A, Q, ΔU шамаларының таңбаларын
    түсіндіріңдер.

    Тақырыпқа байланысты қорытынды
    жазыңдар.
  `
];

// ============================================
// 14. ОЙЫН БЕТІ
// ============================================

function renderGame() {
  const round = rounds[gameRound];

  let taskHTML = "";

  if (gameRound === 7) {
    taskHTML = `
      <div class="card">
        <h2>🎨 Шығармашылық финал</h2>

        <p>
          Әр команда өз тапсырмасын
          дәптерге немесе тақтаға орындайды.
        </p>

        ${creativeTasks.map((task, index) => `
          <div class="creative-task">

            <h3>
              ${index + 1}-команда:
              ${escapeHTML(teamNames[index])}
            </h3>

            <p style="white-space:pre-line">
              ${task}
            </p>

            <p>
              0 ұпай — орындалмаған.<br>
              10 ұпай — жартылай дұрыс.<br>
              20 ұпай — дұрыс әрі толық.<br>
              30 ұпай — өте жақсы түсіндірілген.
            </p>

            <div class="actions">
              ${[0, 10, 20, 30].map(points => `
                <button
                  class="btn
                    ${creativeAwards[index] === points
                      ? "primary"
                      : "secondary"}"
                  data-action="award"
                  data-team="${index}"
                  data-points="${points}">
                  ${points} ұпай
                </button>
              `).join("")}
            </div>

            <p class="muted">
              ${creativeAwards[index] === null
                ? "Әлі бағаланбады."
                : `Берілген ұпай: ${creativeAwards[index]}`}
            </p>
          </div>
        `).join("")}

        <div class="actions">
          <button class="btn primary"
            data-action="results">
            🏆 ЖАЛПЫ ҚОРЫТЫНДЫНЫ КӨРУ →
          </button>
        </div>
      </div>
    `;
  } else {
    const item = round.items[gameQuestion];
    const team = gameQuestion % 3;

    const key = answerKey(gameRound, gameQuestion);
    const saved = gameAnswers[key];

    let answersHTML = "";

    if (item.options) {
      answersHTML = `
        <div class="game-options">
          ${item.options.map((option, index) => {
            let className = "game-option";

            if (saved) {
              if (index === item.right) {
                className += " correct";
              } else if (index === saved.choice) {
                className += " wrong";
              }
            }

            return `
              <button
                class="${className}"
                data-action="game-choice"
                data-index="${index}"
                ${saved ? "disabled" : ""}>

                ${String.fromCharCode(65 + index)})
                ${option}
              </button>
            `;
          }).join("")}
        </div>
      `;
    } else {
      answersHTML = `
        <label class="field">
          Жауап (Дж)

          <input id="gameNumber"
            type="number"
            step="any"
            placeholder="Санмен жаз"
            value="${saved ? saved.value : ""}"
            ${saved ? "disabled" : ""}>
        </label>

        <div class="actions">
          <button class="btn primary"
            data-action="check-game-number"
            ${saved ? "disabled" : ""}>
            ✅ Есепті тексеру
          </button>
        </div>
      `;
    }

    taskHTML = `
      <div class="card">

        <span class="mini-title">
          СҰРАҚ ${gameQuestion + 1} /
          ${round.items.length}
        </span>

        <h3>
          🎯 Кезек: ${team + 1}-команда —
          ${escapeHTML(teamNames[team])}
        </h3>

        <h2>${item.q}</h2>

        <p>
          Дұрыс жауап: +${round.points} ұпай
        </p>

        ${item.picture >= 0
          ? createDiagram(item.picture)
          : ""}

        ${answersHTML}

        <div id="gameWarning"
             class="muted"></div>

        ${saved ? `
          <div class="feedback">
            ${saved.correct
              ? `✅ Дұрыс! +${round.points} ұпай`
              : "❌ Қате жауап. 0 ұпай"}

            <br><br>

            <b>Түсіндірме:</b>
            ${item.explanation}
          </div>
        ` : ""}

        <div class="actions">
          <button class="btn secondary"
            data-action="previous">
            ← Алдыңғы сұрақ
          </button>

          <button class="btn primary"
            data-action="next">
            ${gameQuestion === round.items.length - 1
              ? "Келесі ойын →"
              : "Келесі сұрақ →"}
          </button>
        </div>
      </div>
    `;
  }

  $("screen").innerHTML = `
    <div class="card">
      <h2>🏆 Командалардың ұпайы</h2>

      <p class="muted">
        Команда атауларын өзгертуге болады.
        Әр дұрыс жауапқа ұпай автоматты қосылады.
      </p>

      ${scoreboardHTML()}
    </div>

    <div class="card">
      <h2>${round.title}</h2>

      <div class="round-tabs">
        ${rounds.map((r, index) => `
          <button
            class="tab
              ${gameRound === index ? "active" : ""}"
            data-action="round"
            data-index="${index}">
            ${index + 1}-ойын
          </button>
        `).join("")}
      </div>

      <div class="progress">
        <div style="width:${(gameRound + 1) / 8 * 100}%">
        </div>
      </div>

      <p>
        Ұсынылатын уақыт:
        ${round.minutes} минут
      </p>

      <div class="actions">
        <button class="btn secondary"
          data-action="reset-game">
          ↻ Ойын ұпайларын тазалау
        </button>

        <button class="btn primary"
          data-action="results">
          📊 Жалпы ұпайды көру
        </button>
      </div>
    </div>

    ${taskHTML}
  `;
}

// ============================================
// 15. ОЙЫН ЖАУАБЫН ТЕКСЕРУ
// ============================================

function saveGameChoice(index) {
  const key = answerKey(gameRound, gameQuestion);

  if (gameAnswers[key]) return;

  const item = rounds[gameRound].items[gameQuestion];

  gameAnswers[key] = {
    choice: index,
    correct: index === item.right
  };

  saveProgress();
  render();
}

function saveGameNumber() {
  const key = answerKey(gameRound, gameQuestion);

  if (gameAnswers[key]) return;

  const input = $("gameNumber");

  if (!input || input.value.trim() === "") {
    $("gameWarning").textContent =
      "Алдымен сандық жауапты енгіз.";
    return;
  }

  const value = Number(input.value);
  const item = rounds[gameRound].items[gameQuestion];

  const tolerance = Math.max(
    0.00000001,
    Math.abs(item.answer) * 0.000001
  );

  const correct = Number.isFinite(value) &&
    Math.abs(value - item.answer) <= tolerance;

  gameAnswers[key] = { value, correct };

  saveProgress();
  render();
}

// ============================================
// 16. ҚОРЫТЫНДЫ НӘТИЖЕЛЕР
// ============================================

function renderResults() {
  const results = teamNames.map((name, index) => {
    const scores = rounds.map((r, roundIndex) =>
      getRoundScore(index, roundIndex)
    );

    return {
      name: name.trim() || `${index + 1}-команда`,
      originalIndex: index,
      scores,
      total: scores.reduce((a, b) => a + b, 0)
    };
  });

  results.sort((a, b) => b.total - a.total);

  // Тең ұпай жинаған командаларға бірдей орын.
  results.forEach((item, index) => {
    item.rank =
      index > 0 &&
      item.total === results[index - 1].total
        ? results[index - 1].rank
        : index + 1;
  });

  const maxScore = results[0].total;

  const winners = results.filter(
    r => r.total === maxScore
  );

  const medals = {
    1: "🥇",
    2: "🥈",
    3: "🥉"
  };

  const winnerText =
    maxScore === 0
      ? "Әзірге ұпай жиналмаған"
      : winners.length > 1
        ? "Тең бірінші орын: " +
          winners.map(r => escapeHTML(r.name)).join(" және ")
        : "Жеңімпаз: " +
          escapeHTML(winners[0].name);

  $("screen").innerHTML = `
    <div class="card">
      <h2>🏆 ФИЗИКА БАТЛЫ — ҚОРЫТЫНДЫ</h2>

      <p>
        Термодинамиканың бірінші заңы
      </p>

      <div class="winner-banner">
        ${winnerText}

        ${maxScore > 0
          ? `<div>${maxScore} ұпай</div>`
          : ""}
      </div>
    </div>

    <div class="card">
      <h2>🥇 Командалардың орындары</h2>

      <div class="podium">
        ${results.map(r => `
          <div class="podium-card
            ${r.rank === 1 ? "first" : ""}">

            <div class="medal">
              ${medals[r.rank] || "🏅"}
            </div>

            <h3>${escapeHTML(r.name)}</h3>

            <strong>${r.total}</strong>

            <p>ұпай / 110</p>

            <b>${r.rank}-орын</b>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card">
      <h2>📊 Барлық 8 ойынның ұпай кестесі</h2>

      <div class="table-scroll">
        <table class="results-table">

          <thead>
            <tr>
              <th>Орын</th>
              <th>Команда</th>

              ${rounds.map((r, i) =>
                `<th>${i + 1}-ойын</th>`
              ).join("")}

              <th>Жалпы</th>
            </tr>
          </thead>

          <tbody>
            ${results.map(r => `
              <tr>
                <td>
                  ${medals[r.rank] || "🏅"}
                  ${r.rank}
                </td>

                <td>
                  <b>${escapeHTML(r.name)}</b>
                </td>

                ${r.scores.map((points, i) => `
                  <td>
                    ${i === 7 &&
                      creativeAwards[r.originalIndex] === null
                      ? "—"
                      : points}
                  </td>
                `).join("")}

                <td><b>${r.total}</b></td>
              </tr>
            `).join("")}
          </tbody>

        </table>
      </div>

      <h3>Ойын кезеңдерінің атаулары</h3>

      ${rounds.map((r, i) => `
        <p>${i + 1}. ${r.title}</p>
      `).join("")}
    </div>

    <div class="card">
      <h2>📈 Командалардың нәтижесін салыстыру</h2>

      ${results.map(r => `
        <div class="result-row">
          <b>
            ${medals[r.rank] || "🏅"}
            ${escapeHTML(r.name)}
          </b>

          <strong>${r.total} ұпай</strong>
        </div>

        <div class="progress"
          style="height:18px">

          <div style="width:${r.total / 110 * 100}%">
          </div>
        </div>
      `).join("")}
    </div>

    <div class="card">
      <h2>🎓 Сабақтың қорытындысы</h2>

      <p>
        Бүгін термодинамиканың бірінші заңын,
        газдың жұмысын және ішкі энергия
        өзгерісін қарастырдық.
      </p>

      <p>
        Изохоралық, изобаралық, изотермиялық
        және адиабаталық процестерді үйрендік.
      </p>

      <div class="formula">
        Q = ΔU + A
      </div>

      <p>
        Негізгі тұжырым:
        энергия жоғалмайды және жоқтан
        пайда болмайды, ол түрленеді
        және денелер арасында беріледі.
      </p>

      <div class="actions">
        <button class="btn secondary"
          data-action="back-to-game">
          ← Ойындарға қайту
        </button>

        <button class="btn primary"
          data-action="print">
          🖨 Қорытындыны басып шығару
        </button>
      </div>
    </div>
  `;
}

// ============================================
// 17. БӨЛІМДЕРДІ АУЫСТЫРУ
// ============================================

function goStage(index) {
  if (index < 0 || index >= stages.length) return;

  currentStage = index;

  const stage = stages[index];

  $("stageTag").textContent = stage.tag;
  $("stageTitle").textContent = stage.title;
  $("stageDescription").textContent = stage.description;

  document.querySelectorAll("[data-stage]").forEach(btn => {
    btn.classList.toggle(
      "active",
      Number(btn.dataset.stage) === index
    );
  });

  $("overallProgress").style.width =
    ((index + 1) / stages.length * 100) + "%";

  $("stageCounter").textContent =
    `${index + 1} / ${stages.length} бөлім`;

  resetTimer();
  render();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStep() {
  if (currentStage === 0) {
    if (lessonPage < lessons.length - 1) {
      lessonPage++;
      render();
    } else {
      goStage(1);
    }
  }

  else if (currentStage === 1) {
    goStage(2);
  }

  else if (currentStage === 2) {
    goStage(3);
  }

  else if (currentStage === 3) {
    if (problemPage < problems.length - 1) {
      problemPage++;
      render();
    } else {
      goStage(4);
    }
  }

  else if (currentStage === 4) {
    if (gameRound === 7) {
      goStage(5);
      return;
    }

    const round = rounds[gameRound];

    if (gameQuestion < round.items.length - 1) {
      gameQuestion++;
    } else {
      gameRound++;
      gameQuestion = 0;
    }

    render();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function previousStep() {
  if (currentStage === 0) {
    if (lessonPage > 0) {
      lessonPage--;
      render();
    }
  }

  else if (currentStage === 1) {
    lessonPage = 7;
    goStage(0);
  }

  else if (currentStage === 2) {
    goStage(1);
  }

  else if (currentStage === 3) {
    if (problemPage > 0) {
      problemPage--;
      render();
    } else {
      goStage(2);
    }
  }

  else if (currentStage === 4) {
    if (gameQuestion > 0) {
      gameQuestion--;
      render();
    }

    else if (gameRound > 0) {
      gameRound--;
      gameQuestion = rounds[gameRound].items.length - 1;
      render();
    }

    else {
      problemPage = 17;
      goStage(3);
    }
  }

  else if (currentStage === 5) {
    gameRound = 7;
    gameQuestion = 0;
    goStage(4);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  if (currentStage === 0) renderLesson();
  if (currentStage === 1) renderVideo();
  if (currentStage === 2) renderNotes();
  if (currentStage === 3) renderProblem();
  if (currentStage === 4) renderGame();
  if (currentStage === 5) renderResults();

  $("prevButton").disabled =
    currentStage === 0 && lessonPage === 0;

  $("nextButton").disabled =
    currentStage === 5;

  $("nextButton").innerHTML =
    currentStage === 4 && gameRound === 7
      ? "🏆 <span>Қорытынды</span>"
      : "➜ <span>Келесі</span>";
}

// ============================================
// 18. НЕГІЗГІ НАВИГАЦИЯ
// ============================================

$("nextButton").addEventListener("click", nextStep);
$("prevButton").addEventListener("click", previousStep);

document.querySelectorAll("[data-stage]").forEach(btn => {
  btn.addEventListener("click", () => {
    goStage(Number(btn.dataset.stage));
  });
});

// ============================================
// 19. БАРЛЫҚ ІШКІ БАТЫРМАЛАР
// ============================================

// Жаңа бет шыққанда батырмалар қайта
// жасалады. Сондықтан бір ортақ тыңдаушы
// қолданылады. Бұл "Келесі" батырмасының
// жұмыс істемей қалуын болдырмайды.

$("screen").addEventListener("click", event => {
  const btn = event.target.closest("button[data-action]");

  if (!btn || btn.disabled) return;

  const action = btn.dataset.action;

  if (action === "next") {
    nextStep();
  }

  if (action === "previous") {
    previousStep();
  }

  if (action === "level") {
    problemPage = Number(btn.dataset.index) * 6;
    render();
  }

  if (action === "check-problem") {
    checkProblem();
  }

  if (action === "show-solution") {
    openedSolutions.add(problemPage);
    $("solutionBox").hidden = false;
  }

  if (action === "round") {
    gameRound = Number(btn.dataset.index);
    gameQuestion = 0;
    render();
  }

  if (action === "game-choice") {
    saveGameChoice(Number(btn.dataset.index));
  }

  if (action === "check-game-number") {
    saveGameNumber();
  }

  if (action === "award") {
    const teamIndex = Number(btn.dataset.team);
    const points = Number(btn.dataset.points);

    creativeAwards[teamIndex] = points;

    saveProgress();
    render();
  }

  if (action === "results") {
    goStage(5);
  }

  if (action === "back-to-game") {
    gameRound = 7;
    goStage(4);
  }

  if (action === "print") {
    window.print();
  }

  if (action === "reset-game") {
    const confirmed = confirm(
      "Барлық ойын ұпайларын тазалайсыз ба?"
    );

    if (!confirmed) return;

    for (const key of Object.keys(gameAnswers)) {
      delete gameAnswers[key];
    }

    creativeAwards.fill(null);
    gameRound = 0;
    gameQuestion = 0;

    saveProgress();
    render();
  }
});

// ============================================
// 20. КОМАНДА АТАУЛАРЫН ӨЗГЕРТУ
// ============================================

$("screen").addEventListener("input", event => {
  const input = event.target;

  if (!input.matches("[data-team-name]")) return;

  const index = Number(input.dataset.teamName);

  teamNames[index] = input.value;
  saveProgress();
});

// ============================================
// 21. КАЛЬКУЛЯТОРДЫ АШУ
// ============================================

function toggleCalculator(open) {
  $("calcPanel").hidden = !open;

  $("calcToggle").setAttribute(
    "aria-expanded",
    String(open)
  );
}

$("calcToggle").addEventListener("click", () => {
  toggleCalculator($("calcPanel").hidden);
});

$("calcClose").addEventListener("click", () => {
  toggleCalculator(false);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    toggleCalculator(false);
  }
});

document.querySelectorAll("[data-calc-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    const physics = btn.dataset.calcMode === "physics";

    $("mathMode").hidden = physics;
    $("physicsMode").hidden = !physics;

    document.querySelectorAll("[data-calc-mode]").forEach(tab => {
      tab.classList.toggle("active", tab === btn);
    });
  });
});

// ============================================
// 22. МАТЕМАТИКАЛЫҚ КАЛЬКУЛЯТОР
// ============================================

let mathCurrent = "0";
let mathPrevious = null;
let mathOperator = null;
let mathWaiting = false;

function updateMathDisplay() {
  $("mathDisplay").textContent = mathCurrent;
}

function mathOperation(a, b, operator) {
  switch (operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function mathKey(key) {
  if (key === "AC") {
    mathCurrent = "0";
    mathPrevious = null;
    mathOperator = null;
    mathWaiting = false;
  }

  else if (key === "BACK") {
    mathCurrent = mathWaiting
      ? "0"
      : mathCurrent.slice(0, -1) || "0";

    if (mathCurrent === "-") mathCurrent = "0";

    mathWaiting = false;
  }

  else if (key === "SIGN") {
    if (mathCurrent !== "Қате") {
      mathCurrent = String(-Number(mathCurrent));
    }
  }

  else if (key === "%") {
    if (mathCurrent !== "Қате") {
      mathCurrent = String(Number(mathCurrent) / 100);
    }
  }

  else if (key === "=") {
    if (mathOperator !== null && !mathWaiting) {
      const result = mathOperation(
        mathPrevious,
        Number(mathCurrent),
        mathOperator
      );

      mathCurrent = Number.isFinite(result)
        ? String(Number(result.toPrecision(12)))
        : "Қате";

      mathPrevious = null;
      mathOperator = null;
      mathWaiting = true;
    }
  }

  else if (["+", "-", "*", "/"].includes(key)) {
    if (mathCurrent === "Қате") return;

    if (mathOperator !== null && !mathWaiting) {
      const result = mathOperation(
        mathPrevious,
        Number(mathCurrent),
        mathOperator
      );

      if (!Number.isFinite(result)) {
        mathCurrent = "Қате";
        updateMathDisplay();
        return;
      }

      mathCurrent = String(result);
    }

    mathPrevious = Number(mathCurrent);
    mathOperator = key;
    mathWaiting = true;
  }

  else if (key === ".") {
    if (mathWaiting) {
      mathCurrent = "0.";
      mathWaiting = false;
    } else if (!mathCurrent.includes(".")) {
      mathCurrent += ".";
    }
  }

  else {
    if (
      mathWaiting ||
      mathCurrent === "0" ||
      mathCurrent === "Қате"
    ) {
      mathCurrent = key;
      mathWaiting = false;
    } else {
      mathCurrent += key;
    }
  }

  updateMathDisplay();
}

$("mathKeys").querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    mathKey(btn.dataset.key);
  });
});

// ============================================
// 23. ФИЗИКАЛЫҚ КАЛЬКУЛЯТОР
// ============================================

const physicsConfig = {
  internal: [
    ["Q", "Q — жылу (Дж)", 1500],
    ["A", "A — газдың жұмысы (Дж)", 400]
  ],

  heat: [
    ["U", "ΔU — ішкі энергия (Дж)", 1100],
    ["A", "A — газдың жұмысы (Дж)", 400]
  ],

  work: [
    ["Q", "Q — жылу (Дж)", 1500],
    ["U", "ΔU — ішкі энергия (Дж)", 1100]
  ],

  pressureWork: [
    ["p", "p — қысым (Па)", 200000],
    ["V", "ΔV — көлем өзгерісі (м³)", 0.003]
  ],

  volume: [
    ["A", "A — газ жұмысы (Дж)", 600],
    ["p", "p — қысым (Па)", 200000]
  ],

  heating: [
    ["c", "c — жылусыйымдылық", 4200],
    ["m", "m — масса (кг)", 2],
    ["t1", "t₁ — бастапқы температура (°C)", 20],
    ["t2", "t₂ — соңғы температура (°C)", 50]
  ]
};

function renderPhysicsFields() {
  const type = $("formulaSelect").value;

  $("physicsFields").innerHTML = physicsConfig[type]
    .map(([id, label, defaultValue]) => `
      <label class="field">
        ${label}

        <input
          type="number"
          step="any"
          data-physics="${id}"
          value="${defaultValue}">
      </label>
    `).join("");

  $("physicsResult").textContent =
    "Мәндерді енгізіп, есептеу батырмасын бас.";
}

$("formulaSelect").addEventListener(
  "change",
  renderPhysicsFields
);

function calculatePhysics() {
  const values = {};

  for (const input of document.querySelectorAll("[data-physics]")) {
    if (input.value.trim() === "") {
      $("physicsResult").textContent =
        "Барлық шамаларды енгіз.";
      return;
    }

    values[input.dataset.physics] = Number(input.value);
  }

  const type = $("formulaSelect").value;
  const v = values;

  let result;
  let label = "";
  let unit = "Дж";

  if (type === "internal") {
    result = v.Q - v.A;
    label = "ΔU";
  }

  else if (type === "heat") {
    result = v.U + v.A;
    label = "Q";
  }

  else if (type === "work") {
    result = v.Q - v.U;
    label = "A";
  }

  else if (type === "pressureWork") {
    if (v.p <= 0) {
      $("physicsResult").textContent =
        "Қысым оң болуы керек.";
      return;
    }

    result = v.p * v.V;
    label = "A";
  }

  else if (type === "volume") {
    if (v.p <= 0) {
      $("physicsResult").textContent =
        "Қысым оң болуы керек.";
      return;
    }

    result = v.A / v.p;
    label = "ΔV";
    unit = "м³";
  }

  else if (type === "heating") {
    if (v.c <= 0 || v.m <= 0) {
      $("physicsResult").textContent =
        "Масса мен жылусыйымдылық оң болуы керек.";
      return;
    }

    result = v.c * v.m * (v.t2 - v.t1);
    label = "Q";
  }

  $("physicsResult").textContent =
    Number.isFinite(result)
      ? `Жауабы: ${label} = ${formatNumber(result)} ${unit}`
      : "Есептеу мүмкін емес. Шамаларды тексер.";
}

$("physicsCalculate").addEventListener(
  "click",
  calculatePhysics
);

// ============================================
// 24. САЙТТЫ ІСКЕ ҚОСУ
// ============================================

renderPhysicsFields();
updateMathDisplay();
goStage(0);

console.log("PHYSICS LAB — BY DARKHAN");
console.log("Тақырып: Термодинамиканың бірінші заңы");
console.log("8 түсіндірме • 18 есеп • 8 ойын");
console.log("3 команда • 110 ең жоғары ұпай");

