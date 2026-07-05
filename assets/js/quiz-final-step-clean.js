(function () {
  const optionTexts = [
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

  const titleTexts = [
    "qual é o seu estado civil",
    "qual e o seu estado civil",
    "qual o maior desafio",
    "qual é o seu primeiro nome",
    "qual e o seu primeiro nome"
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

  function isExactOption(text) {
    const n = norm(text);
    return optionTexts.some(item => n === norm(item) || n.includes(norm(item)));
  }

  function applyFinalClean() {
    const finalSteps = document.querySelectorAll("section.step#step6, section.step#step7, section.step#step8");

    finalSteps.forEach(section => {
      section.classList.add("gv-final-clean-wrap");

      /* limpa classes ruins nos títulos */
      section.querySelectorAll(".gv-inner-title-pill, .gv-top-text-plain, .gv-top-question-fix").forEach(el => {
        if (hasAny(el.innerText || el.textContent, titleTexts)) {
          el.classList.remove("gv-inner-title-pill");
          el.classList.remove("gv-top-text-plain");
          el.classList.remove("gv-top-question-fix");
          el.classList.add("gv-final-title-black");
        }
      });

      section.querySelectorAll("h1, h2, h3, p, span, strong, label, div").forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text || text.length > 140) return;
        if (el.closest("button, a, input, textarea, select, [role='button']")) return;

        if (hasAny(text, titleTexts)) {
          el.classList.remove("gv-inner-title-pill");
          el.classList.remove("gv-top-text-plain");
          el.classList.remove("gv-top-question-fix");
          el.classList.add("gv-final-title-black");
        }
      });

      section.querySelectorAll("button, a, [role='button']").forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text) return;

        if (isExactOption(text)) {
          el.classList.add("gv-final-option-card");

          const parent = el.parentElement;
          if (parent) {
            parent.classList.add("gv-final-options-grid");
          }
        }

        if (text === "< voltar" || text === "voltar" || text.includes("< voltar")) {
          el.classList.add("gv-final-back");
        }

        if (section.id === "step8" && text.includes("clique aqui para continuar")) {
          el.classList.add("gv-final-continue");
        }
      });

      if (section.id === "step8") {
        section.querySelectorAll("input").forEach(input => {
          input.classList.add("gv-final-name-input");
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFinalClean);
  } else {
    applyFinalClean();
  }

  new MutationObserver(applyFinalClean).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
