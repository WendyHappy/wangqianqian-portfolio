(function () {
  "use strict";

  var pills = document.querySelectorAll(".view-pill");
  var filterables = document.querySelectorAll("[data-tags]");

  function getActiveView() {
    var hash = window.location.hash.replace("#view=", "");
    if (hash && document.querySelector('.view-pill[data-view="' + hash + '"]')) {
      return hash;
    }
    var stored = localStorage.getItem("portfolio-view");
    if (stored && document.querySelector('.view-pill[data-view="' + stored + '"]')) {
      return stored;
    }
    return "all";
  }

  function applyView(viewId) {
    var selectedFilters = [];

    pills.forEach(function (p) {
      var active = p.dataset.view === viewId;
      p.classList.toggle("active", active);
      p.setAttribute("aria-pressed", active ? "true" : "false");

      if (active && p.dataset.filters) {
        try {
          selectedFilters = JSON.parse(p.dataset.filters);
        } catch (e) {}
      }
    });

    filterables.forEach(function (el) {
      var tags = (el.dataset.tags || "").split(",").map(function (t) {
        return t.trim();
      });

      if (viewId === "all") {
        el.classList.remove("hidden");
        return;
      }

      var visible = selectedFilters.some(function (f) {
        return tags.indexOf(f) !== -1;
      });

      el.classList.toggle("hidden", !visible);
    });

    localStorage.setItem("portfolio-view", viewId);
    if (viewId !== "all") {
      history.replaceState(null, "", "#view=" + viewId);
    } else {
      history.replaceState(null, "", window.location.pathname);
    }
  }

  function init() {
    var active = getActiveView();
    applyView(active);

    pills.forEach(function (p) {
      p.addEventListener("click", function () {
        applyView(p.dataset.view);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
