const CHECKOUT_URL = "https://pay.cakto.com.br/ecs6z2x";
const CHECKOUT_PLACEHOLDER = "COLOCAR_LINK_CHECKOUT_TESTE_XAMANICO_AQUI";
const LEADS_ENDPOINT = "https://servidor-frequencia-production.up.railway.app/api/leads";
const PARAMETROS_PRESERVADOS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

function montarCheckoutComParametros(url) {
  const atual = new URLSearchParams(window.location.search);
  const destino = new URL(url, window.location.href);

  PARAMETROS_PRESERVADOS.forEach((chave) => {
    const valor = atual.get(chave);
    if (valor && !destino.searchParams.has(chave)) {
      destino.searchParams.set(chave, valor);
    }
  });

  return destino.toString();
}

function emailVisivelNaTela() {
  const inputs = Array.from(document.querySelectorAll("input"));
  return inputs.some((input) => {
    const tipo = (input.getAttribute("type") || "").toLowerCase();
    const nome = (
      input.getAttribute("name") ||
      input.getAttribute("placeholder") ||
      input.getAttribute("id") ||
      ""
    ).toLowerCase();

    const rect = input.getBoundingClientRect();
    const visivel = rect.width > 0 && rect.height > 0;

    return visivel && (tipo === "email" || nome.includes("email") || nome.includes("e-mail"));
  });
}

function pegarEmail() {
  const inputs = Array.from(document.querySelectorAll("input"));
  const campo = inputs.find((input) => {
    const tipo = (input.getAttribute("type") || "").toLowerCase();
    const nome = (
      input.getAttribute("name") ||
      input.getAttribute("placeholder") ||
      input.getAttribute("id") ||
      ""
    ).toLowerCase();

    return tipo === "email" || nome.includes("email") || nome.includes("e-mail");
  });

  return campo ? campo.value.trim() : "";
}

function pegarEmailSalvo() {
  try {
    return (
      localStorage.getItem("freq_email") ||
      localStorage.getItem("testeFrequenciaEmail") ||
      localStorage.getItem("testeXamanicoEmail") ||
      ""
    ).trim();
  } catch (e) {
    return "";
  }
}

function pegarValorPorPistas(pistas) {
  const inputs = Array.from(document.querySelectorAll("input"));
  const campo = inputs.find((input) => {
    const texto = (
      input.getAttribute("name") ||
      input.getAttribute("placeholder") ||
      input.getAttribute("id") ||
      input.getAttribute("aria-label") ||
      ""
    ).toLowerCase();

    return pistas.some((pista) => texto.includes(pista));
  });

  return campo ? campo.value.trim() : "";
}

function lerJsonLocalStorage(chave) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : null;
  } catch (e) {
    return null;
  }
}

function lerLocalStorage(chave) {
  try {
    return localStorage.getItem(chave) || "";
  } catch (e) {
    return "";
  }
}

function montarPayloadLead(email) {
  const atual = new URLSearchParams(window.location.search);
  const quizAnswers =
    lerJsonLocalStorage("testeXamanicoQuiz") ||
    lerJsonLocalStorage("testeFrequenciaQuiz") ||
    lerJsonLocalStorage("freq_quiz") ||
    lerJsonLocalStorage("quizAnswers") ||
    {};

  return {
    name:
      pegarValorPorPistas(["nome", "name"]) ||
      lerLocalStorage("testeXamanicoNome") ||
      lerLocalStorage("testeFrequenciaNome") ||
      lerLocalStorage("freq_name") ||
      "",
    email,
    day:
      pegarValorPorPistas(["dia", "day"]) ||
      lerLocalStorage("testeFrequenciaDia") ||
      "",
    month:
      pegarValorPorPistas(["mes", "mês", "month"]) ||
      lerLocalStorage("testeFrequenciaMes") ||
      "",
    year:
      pegarValorPorPistas(["ano", "year"]) ||
      lerLocalStorage("testeFrequenciaAno") ||
      "",
    quizAnswers,
    quizProfile:
      lerLocalStorage("testeXamanicoPerfil") ||
      lerLocalStorage("testeFrequenciaPerfil") ||
      lerLocalStorage("freq_profile") ||
      "",
    improvementArea:
      lerLocalStorage("testeXamanicoArea") ||
      lerLocalStorage("testeFrequenciaArea") ||
      quizAnswers.area ||
      quizAnswers.foco ||
      "",
    currentChallenge:
      lerLocalStorage("testeXamanicoDesafio") ||
      lerLocalStorage("testeFrequenciaDesafio") ||
      quizAnswers.desafio ||
      quizAnswers.momento ||
      "",
    spiritualGoal:
      lerLocalStorage("testeXamanicoObjetivo") ||
      lerLocalStorage("testeFrequenciaObjetivo") ||
      quizAnswers.objetivo ||
      quizAnswers.foco ||
      "",
    utm_source: atual.get("utm_source") || "",
    utm_medium: atual.get("utm_medium") || "",
    utm_campaign: atual.get("utm_campaign") || "",
    utm_content: atual.get("utm_content") || "",
    utm_term: atual.get("utm_term") || "",
    fbclid: atual.get("fbclid") || "",
    product: "teste_xamanico",
    productName: "Teste Xamânico",
    origin: "teste-xamanico"
  };
}

async function enviarLeadAntesDoCheckout(email) {
  try {
    await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(montarPayloadLead(email)),
      keepalive: true
    });
  } catch (e) {
    // O checkout precisa continuar mesmo se o servidor local nao estiver aberto.
  }
}

function checkoutConfigurado() {
  return CHECKOUT_URL && CHECKOUT_URL !== CHECKOUT_PLACEHOLDER;
}

function redirecionarCheckout() {
  if (!checkoutConfigurado()) {
    alert("O checkout do Teste Xamanico ainda nao foi configurado. Substitua COLOCAR_LINK_CHECKOUT_TESTE_XAMANICO_AQUI em /teste-xamanico/js/checkout-override.js pelo link final da Cakto.");
    return;
  }

  try {
    window.location.href = montarCheckoutComParametros(CHECKOUT_URL);
  } catch (e) {
    alert("O link de checkout em /teste-xamanico/js/checkout-override.js parece invalido.");
  }
}

document.addEventListener("click", async function (event) {
  const botao = event.target.closest("button, a, [role='button']");
  if (!botao) return;

  const texto = (botao.innerText || botao.textContent || "").trim().toLowerCase();
  const botaoFinal =
    texto.includes("quero liberar meu nome") ||
    texto.includes("quero meu guia xamanico") ||
    texto.includes("quero meu guia xamânico") ||
    texto.includes("quero minha leitura xamanica") ||
    texto.includes("quero minha leitura xamânica") ||
    texto.includes("quero ver minhas energias ancestrais") ||
    texto.includes("comprar") ||
    texto.includes("garantir") ||
    texto.includes("acessar agora");

  if (!botaoFinal) return;

  event.preventDefault();
  event.stopPropagation();

  const email = emailVisivelNaTela() ? pegarEmail() : pegarEmailSalvo();
  if (email && /^\S+@\S+\.\S+$/.test(email)) {
    try {
      localStorage.setItem("testeXamanicoEmail", email);
      localStorage.setItem("testeFrequenciaEmail", email);
    } catch (e) {}

    await enviarLeadAntesDoCheckout(email);
  }

  redirecionarCheckout();
}, true);
