(function () {
  const titlePatterns = [
    "clique no mês",
    "clique no mes",
    "informe o dia",
    "em qual década",
    "em qual decada",
    "em que ano",
    "qual é o seu estado civil",
    "qual e o seu estado civil",
    "qual o maior desafio",
    "qual é o seu primeiro nome",
    "qual e o seu primeiro nome"
  ];

  const months = [
    "janeiro","fevereiro","março","marco","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro"
  ];

  const choices = [
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

  function clean(value) {
    return (value || "").toString().replace(/\s+/g, " ").trim().toLowerCase();
  }

  function norm(value) {
    return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function hasAny(text, list) {
    const n = norm(text);
    return list.some(item => n.includes(norm(item)));
  }

  function exactAny(text, list) {
    const n = norm(text);
    return list.some(item => n === norm(item));
  }

  function isDateText(text) {
    const t = clean(text);
    const n = norm(t);

    if (exactAny(t, months)) return true;
    if (/^(0?[1-9]|[12][0-9]|3[01])$/.test(t)) return true;
    if (/^(1910|1920|1930|1940|1950|1960|1970|1980|1990|2000|2010)$/.test(t)) return true;
    if (/^(19[0-9][0-9]|20[0-2][0-9])$/.test(t)) return true;

    return false;
  }

  function isChoiceText(text) {
    const n = norm(text);
    return choices.some(item => n === norm(item) || n.includes(norm(item)));
  }

  function removeKnownBadClasses(el) {
    el.classList.remove("gv-inner-title-pill");
    el.classList.remove("gv-top-text-plain");
    el.classList.remove("gv-top-question-fix");
    el.classList.remove("gv-final-title-black");
    el.classList.remove("gv-floating-title");
    el.classList.remove("gv-ax-question");
    el.classList.remove("gv-ax-band");
  }

  function isDarkBluePanel(el) {
    const st = window.getComputedStyle(el);
    const bg = st.backgroundColor || "";
    const radius = parseFloat(st.borderTopLeftRadius || "0");

    const isBlue =
      bg.includes("29, 48, 77") ||
      bg.includes("35, 54, 83") ||
      bg.includes("23, 35, 68") ||
      bg.includes("18, 36, 65") ||
      bg.includes("31, 48, 74");

    return isBlue && radius > 20;
  }

  function apply() {
    document.querySelectorAll("section.step").forEach(section => {
      if (section.id === "step1") return;

      section.classList.add("gv-remove-blue-panel");

      /* remove a bolha azul de qualquer wrapper grande */
      section.querySelectorAll("div, form").forEach(el => {
        if (isDarkBluePanel(el)) {
          el.classList.add("gv-remove-blue-panel");
        }
      });

      /* titulos */
      section.querySelectorAll("h1, h2, h3, p, span, strong, label, div").forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text || text.length > 140) return;
        if (el.closest("button, a, input, textarea, select, [role='button']")) return;

        if (hasAny(text, titlePatterns)) {
          removeKnownBadClasses(el);
          el.classList.add("gv-clean-title");
        }
      });

      /* botoes */
      section.querySelectorAll("button, a, [role='button']").forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text) return;

        if (isDateText(text)) {
          el.classList.add("gv-clean-date-btn");
          if (el.parentElement) el.parentElement.classList.add("gv-clean-grid");
        }

        if (isChoiceText(text)) {
          el.classList.add("gv-clean-choice-btn");
          if (el.parentElement) el.parentElement.classList.add("gv-clean-grid");
        }

        if (text === "< voltar" || text === "voltar" || text.includes("< voltar")) {
          el.classList.add("gv-clean-back");
        }

        if (text.includes("clique aqui para continuar")) {
          el.classList.add("gv-clean-continue");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  new MutationObserver(apply).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
