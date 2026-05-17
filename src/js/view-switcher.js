(function () {
  "use strict";

  var navItems = document.querySelectorAll(".sidebar-nav [data-nav]");
  var panels = document.querySelectorAll(".content-panel");

  // Map sub-items to parent. "writing", "wechat", "xiaohongshu" → "projects"
  function resolveParent(navId) {
    if (navId === "writing" || navId === "wechat" || navId === "xiaohongshu" || navId === "ai-coding") {
      return "projects";
    }
    return navId;
  }

  function getInitialNav() {
    var hash = window.location.hash.replace("#", "");
    if (hash) {
      for (var i = 0; i < navItems.length; i++) {
        if (navItems[i].dataset.nav === hash) return hash;
      }
    }
    return "about";
  }

  function applyNav(navId) {
    // Update nav active states
    navItems.forEach(function (el) {
      var isActive = el.dataset.nav === navId;
      var isParent = resolveParent(el.dataset.nav) === resolveParent(navId) && el.dataset.nav === resolveParent(navId);

      // Highlight parent when sub-item is active
      if (el.dataset.nav === "projects" && resolveParent(navId) === "projects") {
        el.classList.add("active-parent");
      } else {
        el.classList.remove("active-parent");
      }

      el.classList.toggle("active", isActive);
    });

    // Handle parent expand/collapse
    var parentBtn = document.querySelector('.nav-parent[data-nav="projects"]');
    if (parentBtn) {
      var expanded = false;
      if (navId === "writing" || navId === "wechat" || navId === "xiaohongshu" || navId === "ai-coding") {
        expanded = true;
      }
      parentBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    // Show/hide panels
    panels.forEach(function (p) {
      p.classList.toggle("active", p.dataset.panel === navId);
    });

    // Update URL hash
    history.replaceState(null, "", "#" + navId);
  }

  function init() {
    var initial = getInitialNav();
    applyNav(initial);

    navItems.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var navId = this.dataset.nav;
        if (navId) applyNav(navId);
      });
    });

    // Toggle project sub-menu
    var parentBtn = document.querySelector('.nav-parent[data-nav="projects"]');
    if (parentBtn) {
      parentBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var expanded = this.getAttribute("aria-expanded") === "true";
        this.setAttribute("aria-expanded", String(!expanded));
        var children = this.parentElement.querySelector(".nav-children");
        if (children) children.classList.toggle("collapsed", expanded);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
