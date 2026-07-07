(function () {
  var BASE = "/teste-xamanico";
  var playerToMp4 = {
    "6a3d6c5b6e2c9c5a59169ab0": "diagnostico_destino_1.mp4",
    "6a3d6c6ed8a1f8a3e9edce9b": "diagnostico_destino_2.mp4",
    "6a3d6c7f33aff9176542f8eb": "diagnostico_destino_3.mp4",
    "6a3d6ccd02a941bb30574740": "diagnostico_destino_4.mp4",
    "6a3d6e4702a941bb30574843": "diagnostico_destino_5.mp4",
    "6a3d6e6069f3e258e2cea859": "diagnostico_destino_6.mp4",
    "6a3d9493583018d5609e2efe": "diagnostico_destino_7.mp4",
    "6a3d6c9cd8a1f8a3e9edcec8": "diagnostico_destino_5.mp4",
    "6a3d6cb2b84c1d6bd60690e1": "diagnostico_destino_9.mp4",
    "6a3d6ec0b46ed3da55697a72": "diagnostico_dinheiro.mp4",
    "6a3d6f0eab74e8fd0f26b316": "diagnostico_felicidade.mp4",
    "6a3d755f939c8f300cf46d33": "diagnostico_saude.mp4",
    "6a3d7456cbea5b52000eef26": "diagnostico_mulher_casada.mp4",
    "6a3d6f579f8674db4f7a52f1": "diagnostico_homem_casado.mp4",
    "6a3d733a02a941bb305752f1": "diagnostico_homem_solteiro.mp4",
    "6a3d74a7cbea5b52000eefbd": "diagnostico_mulher_solteira.mp4",
    "6a2b239e8950ec706cbf71a9": "final_pitch.mp4"
  };
  var finalPlayerId = "6a2b239e8950ec706cbf71a9";
  var p2Players = {
    "6a3d6ec0b46ed3da55697a72": true,
    "6a3d6f0eab74e8fd0f26b316": true,
    "6a3d755f939c8f300cf46d33": true,
    "6a3d7456cbea5b52000eef26": true,
    "6a3d6f579f8674db4f7a52f1": true,
    "6a3d733a02a941bb305752f1": true,
    "6a3d74a7cbea5b52000eefbd": true
  };
  var p2RevealTimes = {
    "6a3d6ec0b46ed3da55697a72": 2281,
    "6a3d6f0eab74e8fd0f26b316": 2283,
    "6a3d755f939c8f300cf46d33": 2274,
    "6a3d7456cbea5b52000eef26": 2309,
    "6a3d6f579f8674db4f7a52f1": 2307,
    "6a3d733a02a941bb305752f1": 2278,
    "6a3d74a7cbea5b52000eefbd": 2283
  };

  function addStyles() {
    if (document.getElementById("xamanico-local-player-style")) return;
    var style = document.createElement("style");
    style.id = "xamanico-local-player-style";
    style.textContent = [
      ".xamanico-local-player{width:100%;max-width:430px;margin:0 auto 24px;color:#fff}",
      ".xamanico-local-player__frame{position:relative;width:100%;aspect-ratio:9/16;background:#000;overflow:hidden}",
      ".xamanico-local-player__frame video{display:block;width:100%;height:100%;object-fit:cover}",
      ".xamanico-local-player__tap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.12);z-index:5;cursor:pointer}",
      ".xamanico-local-player__tap-box{padding:24px;border:2px solid #fff;border-radius:9px;background:rgba(27,128,28,.9);color:#fff;text-align:center;font:700 22px/1.2 Arial,sans-serif;cursor:pointer}",
      ".xamanico-local-player__tap-box span{display:block;margin-top:12px}",
      ".xamanico-local-player__next{display:none;justify-content:center;margin-top:16px;padding:0 10px}",
      ".xamanico-local-player__next.is-visible{display:flex}",
      ".xamanico-local-player__next button{display:inline-flex;align-items:center;justify-content:center;min-height:56px;width:100%;max-width:410px;padding:14px 22px;border:0;border-radius:999px;background:#13ed3c;color:#fff;text-align:center;font:700 18px/1.15 Arial,sans-serif;box-shadow:0 4px 18px rgba(19,237,60,.35);cursor:pointer}",
      ".xamanico-local-player__cta{display:none;justify-content:center;margin-top:16px}",
      ".xamanico-local-player__cta.is-visible{display:flex}",
      ".xamanico-local-player__cta a{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:14px 30px;border-radius:999px;background:#13ed3c;color:#fff;text-decoration:none;font:700 20px Arial,sans-serif;box-shadow:0 4px 18px rgba(19,237,60,.35)}"
    ].join("");
    document.head.appendChild(style);
  }

  function mountLocalPlayer(container, playerId, options) {
    if (!container || !playerId) return false;
    if (container.dataset && container.dataset.localPlayerMounted === playerId) return true;

    var mp4Name = playerToMp4[playerId];
    if (!mp4Name) return false;

    options = options || {};
    addStyles();
    container.dataset.localPlayerMounted = playerId;
    container.style.display = "block";
    container.style.margin = "0 auto";
    container.style.width = "100%";
    container.style.maxWidth = window.innerWidth <= 450 ? "100%" : "430px";

    var htmlVideoId = "xamanico-local-" + playerId;
    var source = BASE + "/video/mp4/" + mp4Name;
    var checkout = options.checkout || window.__xamanicoCheckoutUrl || "https://pay.cakto.com.br/ecs6z2x";
    var pitchTime = Number(options.pitchTime || 0);
    var stage = options.stage || inferStage(playerId, container);
    var p2RevealTime = Number(options.p2RevealTime || p2RevealTimes[playerId] || 0);

    container.innerHTML = [
      '<div class="xamanico-local-player">',
      '<div class="xamanico-local-player__frame">',
      '<video id="' + htmlVideoId + '" playsinline muted preload="auto" src="' + source + '">',
      "</video>",
      '<div class="xamanico-local-player__tap"><button type="button" class="xamanico-local-player__tap-box">Seu video ja comecou<span>Clique para ouvir</span></button></div>',
      "</div>",
      '<div class="xamanico-local-player__next"><button type="button">Quero ver minhas energias ancestrais</button></div>',
      '<div class="xamanico-local-player__cta"><a href="' + checkout + '">Comprar agora</a></div>',
      "</div>"
    ].join("");

    var player = container.querySelector("video");
    var tap = container.querySelector(".xamanico-local-player__tap");
    var nextStep = container.querySelector(".xamanico-local-player__next");
    var cta = container.querySelector(".xamanico-local-player__cta");
    var completed = false;

    function getApp() {
      return window.__xamanicoApp || null;
    }

    function dispatchProgressEvent(name) {
      if (!window.CustomEvent) return;
      window.dispatchEvent(new CustomEvent(name, {
        detail: {
          stage: stage,
          playerId: playerId,
          mp4: mp4Name
        }
      }));
    }

    function revealEmailOptin() {
      var app = getApp();
      if (app && typeof app.showEmailOptinModal === "function") {
        app.showEmailOptinModal();
        return;
      }
      var modal = document.getElementById("email-optin-modal") || document.getElementById("email-opt-in-modal");
      if (!modal) return;
      modal.hidden = false;
      modal.removeAttribute("hidden");
      modal.classList.remove("parte2-hidden");
      modal.style.display = "";
      if (modal.scrollIntoView) modal.scrollIntoView({ block: "start" });
    }

    function revealPitchStep() {
      if (nextStep) nextStep.classList.add("is-visible");
      var app = getApp();
      if (app) {
        app.parte3 = true;
        app.parte4 = true;
        if (typeof app.$nextTick === "function") {
          app.$nextTick(function () {
            var button = document.querySelector(".parte2-fullscreen + section .button-form") || document.querySelector(".button-form.pulsating-button");
            if (button && button.scrollIntoView) button.scrollIntoView({ block: "center" });
          });
        }
        return;
      }
      var buttons = document.querySelectorAll("button");
      Array.prototype.some.call(buttons, function (button) {
        if (button.textContent && button.textContent.indexOf("Quero ver minhas energias ancestrais") !== -1) {
          button.hidden = false;
          button.style.display = "";
          if (button.scrollIntoView) button.scrollIntoView({ block: "center" });
          return true;
        }
        return false;
      });
    }

    function goToPitch() {
      var app = getApp();
      if (app && typeof app.showPitch === "function") {
        app.showPitch();
        return;
      }
      if (app) {
        app.parte5 = true;
        app.parte4 = false;
        app.parte3 = false;
        app.showPlayer = false;
      }
    }

    function revealCta() {
      if (cta) cta.classList.add("is-visible");
    }

    function completeStage() {
      if (completed) return;
      completed = true;
      dispatchProgressEvent("xamanico:mp4-ended");
      if (stage === "p1") {
        revealEmailOptin();
      } else if (stage === "p2") {
        revealPitchStep();
      } else if (stage === "final") {
        revealCta();
      }
    }

    function playWithSound() {
      player.muted = false;
      player.volume = 1;
      player.removeAttribute("muted");
      resumePlayback();
      if (tap) tap.style.display = "none";
      window.setTimeout(function () {
        if (player.paused) resumePlayback();
      }, 150);
    }

    function resumePlayback() {
      var promise = player.play();
      if (promise && promise.catch) promise.catch(function () {});
    }

    if (tap) tap.addEventListener("click", playWithSound);
    if (nextStep) nextStep.addEventListener("click", goToPitch);
    player.addEventListener("timeupdate", function () {
      if (stage === "final" && pitchTime > 0 && player.currentTime >= pitchTime) revealCta();
      if (stage === "p2" && p2RevealTime > 0 && player.currentTime >= p2RevealTime) {
        completeStage();
        return;
      }
      if (player.duration && isFinite(player.duration) && player.duration - player.currentTime <= 1.25) {
        completeStage();
      }
    });
    player.addEventListener("ended", completeStage);
    resumePlayback();

    return true;
  }

  function inferPlayerIdFromElement(element) {
    if (!element || !element.id) return "";
    if (element.id.indexOf("vid-") === 0) return element.id.slice(4);
    if (element.id === "ab-68ccae2e1563ea2ce057a320") return "6a2b239e8950ec706cbf71a9";
    return "";
  }

  function inferStage(playerId, element) {
    if (playerId === finalPlayerId || element.id === "ab-68ccae2e1563ea2ce057a320") return "final";
    if (p2Players[playerId]) return "p2";
    return "p1";
  }

  function scanAndMountLocalPlayers() {
    var players = document.querySelectorAll("vturb-smartplayer");
    Array.prototype.forEach.call(players, function (element) {
      if (element.querySelector("video")) return;
      var playerId = inferPlayerIdFromElement(element);
      if (!playerId) return;
      var options = element.id === "ab-68ccae2e1563ea2ce057a320" ? { stage: "final", pitchTime: 945 } : {};
      mountLocalPlayer(element, playerId, options);
    });
  }

  function startAutoMount() {
    scanAndMountLocalPlayers();
    if (window.MutationObserver) {
      var observer = new MutationObserver(scanAndMountLocalPlayers);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    window.setInterval(scanAndMountLocalPlayers, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAutoMount);
  } else {
    startAutoMount();
  }

  window.__xamanicoMountLocalPlayer = mountLocalPlayer;
  window.__xamanicoPlayerToMp4 = playerToMp4;
  window.__xamanicoP2RevealTimes = p2RevealTimes;
})();
