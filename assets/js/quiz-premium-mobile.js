(function () {
  const premiumChoices = [
    "casado(a)",
    "namorando",
    "noivo(a)",
    "solteiro(a)",
    "separado(a)",
    "viúvo(a)",
    "viuvo(a)",
    "vida amorosa",
    "finanças",
    "financas",
    "saúde",
    "saude",
    "felicidade"
  ];

  const floatingTitles = [
    "em apenas 30 segundos",
    "clique no mês",
    "clique no mes",
    "qual é o seu estado civil",
    "qual e o seu estado civil",
    "qual o maior desafio"
  ];

  const subtitleTitles = [
    "selecione seu gênero para iniciar o teste",
    "selecione seu genero para iniciar o teste"
  ];

  const privacyTexts = [
    "privacidade garantida",
    "suas respostas são 100% anônimas e confidenciais",
    "suas respostas sao 100% anonimas e confidenciais"
  ];

  const bottomTexts = [
    "mais de",
    "pessoas já descobriram",
    "pessoas ja descobriram",
    "através deste teste",
    "atraves deste teste"
  ];

  function cleanText(value) {
    return (value || "")
      .toString()
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function normalize(value) {
    return cleanText(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function hasAny(text, list) {
    const n = normalize(text);
    return list.some(item => n.includes(normalize(item)));
  }

  function isChoiceText(text) {
    const n = normalize(text);
    return premiumChoices.some(item => n === normalize(item) || n.includes(normalize(item)));
  }

  function polishChoices(root) {
    const candidates = root.querySelectorAll(
      "button, a, [role='button'], [onclick], .option, .choice, .answer, .option-card, .choice-card, .answer-card, .quiz-option, .answer-option"
    );

    candidates.forEach(el => {
      const text = cleanText(el.innerText || el.textContent);
      if (!text) return;

      const isMonth =
        /janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro/i.test(text);

      if (isMonth) return;

      if (isChoiceText(text)) {
        el.classList.add("gv-premium-choice");
        const parent = el.parentElement;
        if (parent) parent.classList.add("gv-premium-choice-grid");
      }

      if (text === "< voltar" || text === "voltar" || text.includes("< voltar")) {
        el.classList.add("gv-back-button");
      }
    });
  }

  function polishTexts(root) {
    const candidates = root.querySelectorAll("h1, h2, h3, p, span, strong, small");

    candidates.forEach(el => {
      const text = cleanText(el.innerText || el.textContent);
      if (!text || text.length > 220) return;

      const insideButton = el.closest("button, a, [role='button']");
      if (insideButton) return;

      if (hasAny(text, floatingTitles)) {
        el.classList.add("gv-floating-title");
        if (hasAny(text, ["em apenas 30 segundos"])) {
          el.classList.add("gv-hero-title");
        }
      }

      if (hasAny(text, subtitleTitles)) {
        el.classList.add("gv-subtitle-strong");
      }

      if (hasAny(text, privacyTexts)) {
        el.classList.add("gv-info-polish");
        el.classList.add("gv-soft-readable");
      }

      if (hasAny(text, bottomTexts)) {
        el.classList.add("gv-bottom-readable");
      }
    });
  }

  function applyPremiumLook(root) {
    const scope = root && root.querySelectorAll ? root : document;
    polishChoices(scope);
    polishTexts(scope);
  }

  function boot() {
    applyPremiumLook(document);

    const observer = new MutationObserver(() => {
      applyPremiumLook(document);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
