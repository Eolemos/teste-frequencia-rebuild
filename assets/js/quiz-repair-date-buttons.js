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

  function clean(value) {
    return (value || "")
      .toString()
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function norm(value) {
    return clean(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function hasAny(text, list) {
    const n = norm(text);
    return list.some(item => n.includes(norm(item)));
  }

  function isDateButtonText(text) {
    const t = clean(text);
    const n = norm(t);

    if (months.some(m => n === norm(m))) return true;

    if (/^(0?[1-9]|[12][0-9]|3[01])$/.test(t)) return true;

    if (/^(1910|1920|1930|1940|1950|1960|1970|1980|1990|2000|2010)$/.test(t)) return true;

    if (/^(19[1-9][0-9]|20[0-2][0-9])$/.test(t)) return true;

    return false;
  }

  function applyRepair() {
    document.querySelectorAll("section.step").forEach(section => {
      if (section.id === "step1") return;

      section.querySelectorAll(".gv-top-text-plain, .gv-top-question-fix").forEach(el => {
        el.classList.remove("gv-top-text-plain");
        el.classList.remove("gv-top-question-fix");
      });

      section.querySelectorAll("h1, h2, h3, p, span, strong, label, div").forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text || text.length > 120) return;
        if (el.closest("button, a, input, textarea, select, [role='button']")) return;

        if (hasAny(text, titlePatterns)) {
          el.classList.add("gv-inner-title-pill");
        }
      });

      section.querySelectorAll("button, a, [role='button']").forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text) return;

        if (isDateButtonText(text)) {
          el.classList.add("gv-date-option");
        }

        if (text === "< voltar" || text === "voltar" || text.includes("< voltar")) {
          el.classList.add("gv-back-restore");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyRepair);
  } else {
    applyRepair();
  }

  new MutationObserver(applyRepair).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
