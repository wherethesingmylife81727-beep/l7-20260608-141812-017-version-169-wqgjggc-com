(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function applyQueryToInputs() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    if (!q) {
      return;
    }
    document.querySelectorAll("[data-filter-input]").forEach(function (input) {
      input.value = q;
      filterScope(input);
    });
  }

  function filterScope(input) {
    var scope = input.closest("main") || document;
    var keyword = normalize(input.value);
    var items = scope.querySelectorAll(".movie-card, .ranking-row");
    items.forEach(function (item) {
      var haystack = normalize(item.getAttribute("data-search") || item.textContent);
      item.hidden = keyword !== "" && haystack.indexOf(keyword) === -1;
    });
  }

  function setupFilters() {
    document.querySelectorAll("[data-filter-input]").forEach(function (input) {
      input.addEventListener("input", function () {
        filterScope(input);
      });
    });
    applyQueryToInputs();
  }

  function startVideo(video, button, src) {
    if (!video || !src) {
      return;
    }
    if (button) {
      button.classList.add("is-hidden");
    }
    if (video.dataset.ready !== "1") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = src;
      }
      video.dataset.ready = "1";
    }
    var action = video.play();
    if (action && typeof action.catch === "function") {
      action.catch(function () {});
    }
  }

  window.initPlayer = function (src) {
    ready(function () {
      var video = document.getElementById("movie-video");
      var button = document.querySelector(".player-start");
      if (!video) {
        return;
      }
      var activate = function () {
        startVideo(video, button, src);
      };
      if (button) {
        button.addEventListener("click", activate);
      }
      video.addEventListener("click", function () {
        if (video.dataset.ready !== "1") {
          activate();
        }
      });
    });
  };

  ready(function () {
    setupMenu();
    setupFilters();
  });
})();
