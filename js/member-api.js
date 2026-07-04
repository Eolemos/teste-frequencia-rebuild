(function () {
  const TOKEN_KEY = "frequenciaAccessToken";
  const LEGACY_TOKEN_KEY = "frequencia_access_token";
  const params = new URLSearchParams(window.location.search);
  const apiBaseFromUrl = params.get("apiBase") || "";
  if (apiBaseFromUrl) localStorage.setItem("frequencia_api_base", apiBaseFromUrl);

  const API_BASE = (
    apiBaseFromUrl ||
    localStorage.getItem("frequencia_api_base") ||
    window.TESTE_FREQUENCIA_API_BASE ||
    "https://servidor-frequencia-production.up.railway.app"
  ).replace(/\/+$/, "");

  function tokenFromUrl() {
    return new URLSearchParams(window.location.search).get("token") || "";
  }

  function getToken() {
    const token =
      tokenFromUrl().trim() ||
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY) ||
      "";
    if (token) setToken(token);
    return token;
  }

  function setToken(token) {
    const cleanToken = String(token || "").trim();
    if (cleanToken) {
      localStorage.setItem(TOKEN_KEY, cleanToken);
      localStorage.setItem(LEGACY_TOKEN_KEY, cleanToken);
    }
    return cleanToken;
  }

  function pageUrl(page, token) {
    return `${page}.html?token=${encodeURIComponent(token)}`;
  }

  async function request(path, options = {}) {
    const hasBody = Object.prototype.hasOwnProperty.call(options, "body");
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      },
      body: hasBody ? JSON.stringify(options.body) : undefined
    });

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = { ok: false, message: "Resposta invalida do servidor." };
    }

    if (!response.ok || data.ok === false || data.success === false) {
      const message = data.message || data.reason || `Erro ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  function post(path, body) {
    return request(path, { method: "POST", body });
  }

  function showError(target, error) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    element.innerHTML = `<div class="panel error"><strong>Algo deu errado.</strong><p>${error.message || error}</p></div>`;
  }

  function setLoading(target, text) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (element) element.innerHTML = `<div class="panel"><p>${text || "Preparando seus dados..."}</p></div>`;
  }

  function showTokenLogin(target) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;

    element.innerHTML = `
      <form id="tokenLoginForm" class="panel">
        <label>
          Cole seu token de acesso
          <input name="token" autocomplete="one-time-code" required />
        </label>
        <button type="submit">Entrar</button>
      </form>
    `;

    element.querySelector("#tokenLoginForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector("button");
      button.disabled = true;
      button.textContent = "Carregando...";
      const token = setToken(event.currentTarget.elements.token.value);
      window.location.href = pageUrl("membros", token);
    });
  }

  function backToPanelHtml(token) {
    return `<a class="button secondary" href="${pageUrl("membros", token || getToken())}">Voltar ao painel</a>`;
  }

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function secondsLabel(seconds) {
    const value = Math.max(0, Number(seconds || 0));
    const minutes = Math.floor(value / 60);
    const rest = Math.floor(value % 60);
    if (minutes <= 0) return `${rest}s`;
    return `${minutes}min ${String(rest).padStart(2, "0")}s`;
  }

  window.MemberApi = {
    API_BASE,
    getToken,
    setToken,
    pageUrl,
    backToPanelHtml,
    showError,
    setLoading,
    showTokenLogin,
    formatDate,
    secondsLabel,
    access: (token) => request(`/api/access/${encodeURIComponent(token)}`),
    submitAccess: (token, payload) => post(`/api/access/${encodeURIComponent(token)}/submit`, payload),
    generateDelivery: (token) => post(`/api/access/${encodeURIComponent(token)}/generate`, {}),
    delivery: (token) => request(`/api/delivery/${encodeURIComponent(token)}`),
    member: (token) => request(`/api/member/${encodeURIComponent(token)}`),
    diagnostic: (token) => request(`/api/member/${encodeURIComponent(token)}/diagnostic`),
    saveDiagnostic: (token, payload) => post(`/api/member/${encodeURIComponent(token)}/diagnostic`, payload),
    frequency: (token) => request(`/api/member/${encodeURIComponent(token)}/frequency`),
    heartbeat: (token, seconds) => post(`/api/member/${encodeURIComponent(token)}/frequency/progress`, { seconds }),
    progress: (token) => request(`/api/member/${encodeURIComponent(token)}/progress`),
    bonus: (token) => request(`/api/member/${encodeURIComponent(token)}/bonus`)
  };
})();
