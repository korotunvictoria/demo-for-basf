(() => {
  "use strict";

  const { questions, groups, introduction } = window.CourseContent;
  const storage = window.CourseStorage;
  const total = questions.length;
  const passPercent = 70;
  const formatPercent = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
  const byId = new Map(questions.map(question => [question.id, question]));
  const main = document.querySelector("#main");
  const notice = document.querySelector("#notice");
  const topics = [
    ["Автомобиль и ДТП", "car"],
    ["Бытовые приборы", "kettle"],
    ["Рабочее место", "monitor"],
    ["Командировки и площадки", "helmet"],
    ["Химические вещества", "flask"],
    ["Управление инцидентами", "clipboard"],
    ["Пожарная безопасность", "fire"],
    ["Электробезопасность", "plug"]
  ];
  const icons = {
    map: '<path d="M3 3h11v11H3zm15 0h11v11H18zM3 18h11v11H3zm15 0h11v11H18z"/>',
    book: '<path fill-rule="evenodd" d="M2 5h10l4 2 4-2h10v21H20l-4 2-4-2H2zm3 3v15h8l2 1V10l-3-2zm13 2v14l2-1h7V8h-7z"/>',
    car: '<path fill-rule="evenodd" d="M4 13l3-7h18l3 7 2 3v9h-4v3h-4v-3H10v3H6v-3H2v-9zm4 0h16l-1.6-4H9.6zM6 18v3h5v-3zm15 0v3h5v-3z"/>',
    kettle: '<path fill-rule="evenodd" d="M11 6h9v3h4a6 6 0 0 1 0 12h-2v4H8L5 15 1 11h8l2-2zm11 6v6h2a3 3 0 0 0 0-6z"/><path d="M7 27h17v3H7z"/>',
    monitor: '<path fill-rule="evenodd" d="M2 4h28v18H18v4h6v3H8v-3h6v-4H2zm4 4v10h20V8z"/>',
    helmet: '<path d="M14 3h4v4h2c5 2 7 6 7 11h3v5H2v-5h3c0-5 2-9 7-11h2zM6 25h20v3H6z"/>',
    flask: '<path fill-rule="evenodd" d="M11 2h10v4h-2v8l9 12a2.5 2.5 0 0 1-2 4H6a2.5 2.5 0 0 1-2-4l9-12V6h-2zm5 13-4 6h8l-4-6z"/><path d="M22 7h3v3h-3zM26 3h3v3h-3z"/>',
    clipboard: '<path fill-rule="evenodd" d="M12 2h8v3h7v25H5V5h7zm2 4v3h4V6zm-4 9v3h12v-3zm0 6v3h8v-3z"/>',
    fire: '<path fill-rule="evenodd" d="M18 1c0 7 9 9 9 18a11 11 0 0 1-22 0c0-5 3-9 6-12 0 4 2 5 3 6 3-4 4-8 4-12zm-1 16c-1 4-5 4-5 8a4 4 0 0 0 8 0c0-3-2-6-3-8z"/>',
    plug: '<path d="M10 2h4v8h4V2h4v8h4v4c0 5-3 9-8 10v6h-4v-6c-5-1-8-5-8-10v-4h4z"/>',
    workstation: '<path fill-rule="evenodd" d="M2 3h19v13h-8v4h5v3H5v-3h5v-4H2zm3 3v7h13V6z"/><path d="M25 12h4v11h-6v3h5v3H15v-3h5v-3h-2v-3h7z"/>',
    scissors: '<path fill-rule="evenodd" d="M2 2h15l4 4v7h-3V8h-5V5H5v22h6v3H2z M15 14a5 5 0 0 1 7 6l8-8-1 6-5 5 5 5-2 2-5-5a5 5 0 1 1-3-3l1-1a5 5 0 1 1-5-7zm-1 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0zm0 7a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"/>',
    printer: '<path fill-rule="evenodd" d="M7 2h18v7h4l2 3v12h-6v6H7v-6H1V12l2-3h4zm3 3v4h12V5zm0 16v6h12v-6zm13-7v3h4v-3z"/>'
  };
  const groupIcons = ["workstation", "scissors", "printer"];
  const scenes = [
    { photo: "desk", alt: "Сотрудница сидит за рабочим столом. Сбоку видны плечо, локоть и подлокотник кресла.", note: "Ориентир при настройке — 90° в локте." },
    { photo: "desk", alt: "Сотрудница и монитор видны сбоку.", caption: "Рабочее место с внешним монитором", note: "Измеряйте от глаз до поверхности экрана." },
    { photo: "keyboard", alt: "Вид сверху на клавиатуру, кисти сотрудницы и ближайший край стола.", note: "Измеряйте от края стола перед собой до переднего края клавиатуры." },
    { photo: "knife", after: "knife-safe", alt: "Нож с выдвинутым лезвием лежит между открытой и закрытой коробками.", afterAlt: "Нож лежит на столе, лезвие полностью убрано в корпус.", note: "Лезвие убрано полностью." },
    { photo: "scissors", after: "scissors-safe", alt: "Закрытые ножницы лежат рядом с подставкой с отделениями.", afterAlt: "Ножницы стоят остриём вниз, ручки видны над подставкой.", note: "Сверху остаются ручки ножниц." },
    { photo: "staple", after: "staple-safe", alt: "На обороте пачки один конец скобы выступает над бумагой.", afterAlt: "У края бумаги видны антистеплер и снятая скоба.", note: "Скоба снята антистеплером." },
    { photo: "printer", alt: "Сотрудник забирает листы из лотка. Рука у края корпуса принтера.", steps: "Отойти от принтера. Сообщить руководителю и в техслужбу." },
    { photo: "mug", after: "mug-safe", alt: "В переговорной видны сетевой фильтр, ноутбук и свободная тумба у стены.", afterAlt: "Кружка стоит на тумбе в стороне от розеток и техники.", note: "Кружка на тумбе, вдали от техники." },
    { photo: "spill", alt: "Кружка опрокинулась. Чай попал в гнездо сетевого фильтра.", steps: "Предупредить коллег. Связаться с техслужбой." }
  ];
  // Crop in the original 960 × 720 coordinate system so the guides follow the photographs.
  const photoBounds = {
    knife: [120, 840, 126], "knife-safe": [120, 840, 126],
    scissors: [121, 839, 125], "scissors-safe": [121, 839, 9],
    staple: [126, 834, 88], "staple-safe": [126, 834, 62],
    mug: [8, 952, 6], "mug-safe": [8, 952, 6], spill: [9, 951, 6]
  };
  const scenePhotos = new Set(
    scenes.flatMap(scene => scene.after ? [scene.photo, scene.after] : [scene.photo])
  );
  const imagePaths = ["assets/logo.png", "assets/cover.jpg", ...[...scenePhotos].map(name => `assets/${name}.jpg`)];
  const loadedImages = new Map();
  let ready = false;
  let loading = false;

  function icon(name) {
    return `<svg viewBox="0 0 32 32" class="icon" aria-hidden="true">${icons[name]}</svg>`;
  }

  function escape(text) {
    return String(text).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function cleanChoices(source) {
    return Object.fromEntries(questions.flatMap(question => {
      const choice = source?.[question.id];
      return Number.isInteger(choice) && choice >= 0 && choice < question.options.length
        ? [[question.id, choice]] : [];
    }));
  }

  function restore(stored) {
    const data = stored?.version === 1 ? stored : {};
    const answers = cleanChoices(data.answers);
    const drafts = cleanChoices(data.drafts);
    const retryIds = questions.filter(question => Object.hasOwn(answers, question.id)
      && answers[question.id] !== question.correct && data.retry?.ids?.includes?.(question.id)).map(question => question.id);
    const retry = retryIds.length ? {
      ids: retryIds,
      answers: Object.fromEntries(Object.entries(cleanChoices(data.retry.answers)).filter(([id]) => retryIds.includes(id)))
    } : null;
    return {
      version: 1,
      screen: ["map", "overview", "exercise", "result"].includes(data.screen) ? data.screen : "map",
      started: Boolean(data.started),
      hasOpenedExercise: data.hasOpenedExercise ?? (
        data.screen === "exercise" || Number.isInteger(data.groupIndex) ||
        Boolean(data.cursor && data.cursor !== questions[0].id) ||
        Object.keys(answers).length > 0 || Object.keys(drafts).length > 0
      ),
      cursor: byId.has(data.cursor) ? data.cursor : questions[0].id,
      answers,
      drafts,
      mode: retry && data.mode === "retry" ? "retry" : "normal",
      groupIndex: Number.isInteger(data.groupIndex) && groups[data.groupIndex]?.ids.includes(data.cursor) ? data.groupIndex : null,
      retry
    };
  }

  const state = restore(storage.load());

  function results(ids = questions.map(question => question.id)) {
    const submitted = { ...state.answers, ...state.retry?.answers };
    const completed = ids.filter(id => Object.hasOwn(state.answers, id)).length;
    const correct = ids.filter(id => submitted[id] === byId.get(id).correct).length;
    const done = completed === ids.length;
    const scaledScore = ids.length ? correct / ids.length : 0;
    const percent = Number((scaledScore * 100).toFixed(2));
    return { total: ids.length, completed, correct, done, scaledScore, percent, passed: done && correct * 100 >= ids.length * passPercent };
  }

  function retryPending() {
    return state.retry?.ids.find(id => !Object.hasOwn(state.retry.answers, id));
  }

  function retryAvailable(result) {
    return result.done && !result.passed && !state.retry;
  }

  function sync() {
    if (!state.started) return;
    if (!storage.save(state, results())) {
      document.querySelector("#announcement").textContent = "Не удалось сохранить прогресс. Проверьте настройки браузера или учебной платформы.";
    }
  }

  function go(screen, focus = true) {
    state.screen = screen;
    render(focus);
    sync();
  }

  function openQuestion(id, mode, groupIndex = null) {
    state.hasOpenedExercise = true;
    state.cursor = id;
    state.mode = mode;
    state.groupIndex = groupIndex;
    go("exercise");
  }

  function firstUnanswered(ids) {
    return ids.find(id => !Object.hasOwn(state.answers, id));
  }

  function continueDemo() {
    if (!state.hasOpenedExercise) {
      state.started = true;
      go("overview");
    } else if (retryPending()) {
      const id = state.retry.ids.includes(state.cursor) ? state.cursor : retryPending();
      openQuestion(id, "retry");
    } else if (results().done) {
      go("result");
    } else {
      openQuestion(state.cursor, "normal", state.groupIndex);
    }
  }

  function mapPage() {
    const result = results();
    const primaryText = retryPending() ? "Продолжить повтор" : result.done ? "Посмотреть результат" : state.started ? "Продолжить" : "Начать";
    const topicStatus = result.done ? "Пройдено" : state.started ? `В процессе · ${result.completed} из ${total} заданий` : "Доступно в демо";
    const topicList = topics.map(([name, symbol], index) => index === 2
      ? `<li><button class="topic ${result.done ? "done" : "available"}" type="button" data-action="overview">
          ${icon(symbol)}<span class="topic-copy"><strong>${name}</strong><span class="topic-state">${topicStatus}</span></span>
          <span class="topic-tail">${result.done ? `<span class="score-tag">✓ ${result.correct} из ${total} верно</span>` : "→"}</span>
        </button></li>`
      : `<li><button class="topic" type="button" data-action="unavailable" data-topic="${index}">
          ${icon(symbol)}<span class="topic-copy"><strong>${escape(name)}</strong></span><span class="topic-tail" aria-hidden="true">→</span>
        </button></li>`).join("");
    return `<section class="hero">
      <div class="hero-inner"><div class="hero-copy">
        <h1>Решения<br>по безопасности</h1>
        <p>Потренируйтесь принимать безопасные решения в рабочих ситуациях.</p>
        <button class="primary" type="button" data-action="continue">${primaryText}</button>
      </div><img data-photo="assets/cover.jpg" alt="Коллеги обсуждают лист проверки по охране труда. Рядом каска и защитные очки." width="1040" height="585"></div>
    </section>
    <section class="wrap map" aria-labelledby="map-title">
      <div class="map-head"><h2 id="map-title">Все темы</h2>
        <div class="map-progress"><span>Темы демо · пройдено ${result.done ? 1 : 0} из 1</span>
          <progress value="${result.done ? 1 : 0}" max="1" aria-label="Пройдено тем демо"></progress>
        </div>
      </div>
      <ul class="topic-list">${topicList}</ul>
    </section>`;
  }

  function overviewPage() {
    const result = results();
    const next = firstUnanswered(questions.map(question => question.id));
    const groupList = groups.map((group, index) => {
      const section = results(group.ids);
      const caption = section.done ? `✓ Пройдено · ${section.correct} из ${section.total} верно` : `${section.completed} из ${section.total} заданий`;
      return `<li><button class="group ${section.done ? "done" : group.ids.includes(next) ? "next" : ""}" type="button" data-action="group" data-group="${index}">
        ${icon(groupIcons[index])}<strong>${escape(group.title)}</strong>
        <span class="group-intro">${escape(group.intro)}</span><span class="group-progress">${caption}</span>
      </button></li>`;
    }).join("");
    return `<section class="wrap page" aria-labelledby="page-title">
      <div class="page-head"><p class="eyebrow">Рабочее место · ${result.completed} из ${total} заданий</p>
      <h1 id="page-title">Рабочее место</h1><p class="text-muted">${escape(introduction)}</p></div>
      <ul class="group-list">${groupList}</ul>
      <div class="actions">
        ${result.done ? '<button class="primary" type="button" data-action="result">Посмотреть результат</button>' :
          `<button class="primary" type="button" data-action="first">${result.completed || Object.keys(state.drafts).length ? "Продолжить задания" : "К первому заданию"}</button>`}
      </div>
    </section>`;
  }

  function guide(path) {
    return `<path class="guide" d="${path}"/><path class="guide-core" d="${path}"/>`;
  }

  function tag(text, x, y, width) {
    return `<rect class="tag" x="${x}" y="${y}" width="${width}" height="8" rx="1.2"/><text x="${x + width / 2}" y="${y + 5.8}" text-anchor="middle">${text}</text>`;
  }

  function photoCheck(x, y) {
    const path = `M${x - 3.8} ${y}l2.5 2.5 5.5 -5.5`;
    return `<path class="guide" d="${path}"/><path class="guide-check" d="${path}"/>`;
  }

  function photoOverlay(index, revealed) {
    let markup = "";
    if (index === 7 && !revealed) markup = tag("А", 12, 31, 8) + tag("Б", 85, 31, 8) + tag("В", 32, 55, 8);
    if (revealed) {
      switch (index) {
        case 0: markup = guide("M72 37V56.8H49M72 52.6H67.8V56.8") + tag("90°", 57, 45, 13); break;
        case 1: markup = guide("M13.2 15.1H62.1M13.2 13.2V17M62.1 13.2V17") + tag("60–70 см", 26, 6.7, 24); break;
        case 2: markup = guide("M38 40V70M35 40H41M35 70H41") + tag("10–30 см", 40, 54, 25); break;
        case 3: markup = photoCheck(37, 55); break;
        case 4: markup = photoCheck(71, 12); break;
        case 5: markup = photoCheck(69, 53); break;
        case 7: markup = photoCheck(86, 30); break;
      }
    }
    return markup ? `<svg class="overlay" viewBox="0 0 100 75" aria-hidden="true">${markup}</svg>` : "";
  }

  function sceneMarkup(index, answer) {
    const scene = scenes[index];
    const revealed = answer !== undefined;
    const showingAfter = revealed && Boolean(scene.after);
    const name = showingAfter ? scene.after : scene.photo;
    const [left, right, top] = photoBounds[name] ?? [0, 960, 0];
    const width = right - left;
    const height = width * .75;
    const frameStyle = `--canvas-width:${960 / width * 100}%;--canvas-height:${720 / height * 100}%;--canvas-left:${-left / width * 100}%;--canvas-top:${-top / height * 100}%`;
    const caption = revealed ? scene.note : scene.caption;
    return `<figure class="scene" style="${frameStyle}">
      <div class="scene-image"><div class="scene-canvas">
        <img data-photo="assets/${name}.jpg" alt="${escape(showingAfter ? scene.afterAlt : scene.alt)}" width="800" height="600">
        ${photoOverlay(index, revealed)}
      </div></div>
      ${caption ? `<figcaption class="scene-note">${caption}</figcaption>` : ""}
      ${revealed && scene.steps ? `<figcaption class="scene-steps"><span class="scene-check" aria-hidden="true">✓</span>
        <span><span class="sr-only">Правильное действие. </span>${scene.steps}</span></figcaption>` : ""}
    </figure>`;
  }

  function currentAnswer() {
    if (state.mode === "retry") return state.retry.answers[state.cursor];
    return state.retry?.answers[state.cursor] ?? state.answers[state.cursor];
  }

  function exercisePage() {
    const question = byId.get(state.cursor);
    const index = questions.indexOf(question);
    const group = groups.find(item => item.ids.includes(question.id));
    const answer = currentAnswer();
    const retry = state.mode === "retry";
    const route = retry ? state.retry.ids : state.groupIndex === null ? questions.map(item => item.id) : group.ids;
    const position = route.indexOf(question.id) + 1;
    const poolSize = route.length;
    const nextLabel = position !== poolSize ? "Далее" : results().done ? "К результату" : "К подразделам";
    const [, situation, prompt] = question.prompt.match(/^(.*[.!?…])\s+([^.!?…]+\?)$/u) ?? ["", "", question.prompt];
    const step = `${retry ? "Повтор ошибок" : "Задание"} ${position} из ${poolSize}`;
    const panel = answer === undefined
      ? `<div class="exercise-heading"><p class="meta">${step}</p>
        ${situation ? `<p class="context">${escape(situation)}</p>` : ""}
        <h1 id="page-title">${escape(prompt)}</h1></div>
        <fieldset class="answers" aria-labelledby="page-title">
          ${question.options.map((option, optionIndex) => `<label class="answer">
            <input type="radio" name="answer" value="${optionIndex}" ${state.drafts[question.id] === optionIndex ? "checked" : ""}>
            <span>${escape(option.text)}</span>
          </label>`).join("")}
        </fieldset>
        <div class="actions"><button type="button" class="primary" data-action="submit" ${state.drafts[question.id] === undefined ? "disabled" : ""}>Ответить</button></div>`
      : `<div class="exercise-heading"><p class="meta">${step}</p>
        <p class="verdict ${answer === question.correct ? "" : "review"}">${answer === question.correct ? "✓ Верно" : "Есть что поправить"}</p>
        <h1 id="page-title">${escape(question.title)}</h1></div>
        <div class="feedback-card">
          <p class="choice">Ваш ответ · ${escape(question.options[answer].text)}</p>
          <p>${escape(question.options[answer].feedback)}</p>
        </div>
        <div class="actions"><button class="primary" type="button" data-action="next">${nextLabel}</button></div>`;
    return `<section class="wrap exercise" aria-labelledby="page-title">
      <div class="exercise-grid">
        <div class="scene-column">
          <div class="exercise-top"><button class="quiet" type="button" data-action="overview">‹ Рабочее место</button></div>
          ${sceneMarkup(index, answer)}
        </div>
        <div class="exercise-pane">${panel}</div>
      </div>
    </section>`;
  }

  function resultPage() {
    const result = results();
    const messages = retryPending() ? "Повтор ещё не завершён." : result.passed ? "Порог успешности достигнут." : "Порог успешности пока не достигнут.";
    return `<section class="wrap page result" aria-labelledby="page-title">
      <div class="page-head"><p class="eyebrow">Рабочее место</p><h1 id="page-title">Раздел пройден</h1>
      <p class="text-muted">Вы ответили на все ${total} вопросов демо.</p></div>
      <div class="result-summary"><strong class="metric">${formatPercent.format(result.percent)}%</strong>
        <div><strong>${result.correct} из ${total} ответов верны</strong><p>${messages} Для зачёта нужно ${passPercent}%.</p></div>
      </div>
      <ul class="result-details">${groups.map(group => {
        const info = results(group.ids);
        return `<li>${escape(group.title)} · ${info.correct} из ${info.total} верно</li>`;
      }).join("")}</ul>
      <div class="actions">
        ${retryPending() ? '<button class="primary" type="button" data-action="continue">Продолжить повтор</button>' : ""}
        ${retryAvailable(result) ? '<button class="primary" type="button" data-action="retry">Повторить ошибки</button>' : ""}
        <button class="${retryPending() || retryAvailable(result) ? "secondary" : "primary"}" type="button" data-action="map">К карте тем</button>
        <button class="quiet" type="button" data-action="overview">К подразделам</button>
      </div>
    </section>`;
  }

  function showUnavailable(name) {
    document.querySelector("#notice-topic").textContent = name;
    notice.showModal();
  }

  function render(focus = false) {
    document.querySelectorAll(".topbar [data-action='map']").forEach(button => {
      if (state.screen === "map") button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (state.screen === "result" && !results().done) state.screen = "overview";
    switch (state.screen) {
      case "overview": main.innerHTML = overviewPage(); break;
      case "exercise": main.innerHTML = exercisePage(); break;
      case "result": main.innerHTML = resultPage(); break;
      default: main.innerHTML = mapPage();
    }
    main.querySelectorAll("img[data-photo]").forEach(placeholder => {
      const image = loadedImages.get(placeholder.dataset.photo);
      image.alt = placeholder.alt;
      image.width = placeholder.width;
      image.height = placeholder.height;
      placeholder.replaceWith(image);
    });
    if (focus) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
  }

  document.addEventListener("change", event => {
    if (event.target.name !== "answer") return;
    state.drafts[state.cursor] = Number(event.target.value);
    document.querySelector('[data-action="submit"]').disabled = false;
    sync();
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    if (!ready) {
      if (button.dataset.action === "load") startCourse(true);
      return;
    }
    const actions = {
      map: () => go("map"),
      continue: continueDemo,
      overview: () => { state.started = true; go("overview"); },
      first: () => {
        if (retryPending()) return continueDemo();
        const next = firstUnanswered(questions.map(question => question.id));
        if (next) openQuestion(next, "normal");
      },
      group: () => {
        const index = Number(button.dataset.group);
        const ids = groups[index].ids;
        openQuestion(firstUnanswered(ids) ?? ids[0], "normal", index);
      },
      submit: () => {
        const draft = state.drafts[state.cursor];
        if (draft === undefined || currentAnswer() !== undefined) return;
        if (state.mode === "retry") state.retry.answers[state.cursor] = draft;
        else state.answers[state.cursor] = draft;
        delete state.drafts[state.cursor];
        go("exercise");
      },
      next: () => {
        const retry = state.mode === "retry";
        const ids = retry ? state.retry.ids : state.groupIndex === null ? questions.map(question => question.id) : groups[state.groupIndex].ids;
        const next = ids[ids.indexOf(state.cursor) + 1];
        if (next) openQuestion(next, state.mode, state.groupIndex);
        else if (results().done) go("result");
        else go("overview");
      },
      result: () => go("result"),
      retry: () => {
        if (!retryAvailable(results())) return;
        const ids = questions.filter(question => state.answers[question.id] !== question.correct).map(question => question.id);
        state.retry = { ids, answers: {} };
        openQuestion(ids[0], "retry");
      },
      memo: () => showUnavailable("Памятка"),
      unavailable: () => showUnavailable(topics[Number(button.dataset.topic)][0]),
      "close-notice": () => notice.close()
    };
    actions[button.dataset.action]?.();
  });

  function preload(path) {
    if (loadedImages.has(path)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timeout = window.setTimeout(fail, 20000);
      function fail() {
        window.clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        reject(new Error(path));
      }
      image.onerror = fail;
      image.onload = async () => {
        try {
          if (image.decode) await image.decode();
        } catch {
          fail();
          return;
        }
        if (image.onload === null) return;
        window.clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        loadedImages.set(path, image);
        resolve();
      };
      image.src = path;
    });
  }

  async function startCourse(focus = false) {
    if (loading) return;
    loading = true;
    main.innerHTML = '<div class="wrap load-state"><p role="status">Загружаются изображения курса…</p></div>';
    const results = await Promise.allSettled(imagePaths.map(preload));
    loading = false;
    if (results.some(result => result.status === "rejected")) {
      main.innerHTML = `<div class="wrap load-state">
        <p role="alert">Часть изображений не загрузилась.</p>
        <button class="primary" type="button" data-action="load">Повторить загрузку</button>
      </div>`;
      if (focus) main.focus();
      return;
    }
    ready = true;
    document.querySelectorAll(".topbar button").forEach(button => { button.disabled = false; });
    render(focus);
    sync();
  }

  document.querySelectorAll("[data-icon]").forEach(node => { node.innerHTML = icon(node.dataset.icon); });
  startCourse();
})();
