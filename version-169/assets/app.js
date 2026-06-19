document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let active = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      active = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle("active", index === active);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle("active", index === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  const searchBlocks = document.querySelectorAll("[data-site-search]");
  searchBlocks.forEach(function (block) {
    const input = block.querySelector("[data-search-input]");
    const results = block.querySelector("[data-search-results]");
    if (!input || !results || !Array.isArray(window.MOVIE_INDEX || MOVIE_INDEX)) {
      return;
    }

    input.addEventListener("input", function () {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        results.classList.remove("is-open");
        results.innerHTML = "";
        return;
      }

      const items = MOVIE_INDEX.filter(function (item) {
        const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
        return (item.title + " " + item.oneLine + " " + item.category + " " + tags).toLowerCase().includes(query);
      }).slice(0, 6);

      results.innerHTML = items.map(function (item) {
        return '<a class="search-result-item" href="' + item.url + '"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.oneLine) + '</span></a>';
      }).join("");
      results.classList.toggle("is-open", items.length > 0);
    });

    document.addEventListener("click", function (event) {
      if (!block.contains(event.target)) {
        results.classList.remove("is-open");
      }
    });
  });

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    const section = scope.closest("section") || document;
    const grid = section.querySelector("[data-movie-grid]");
    if (!grid) {
      return;
    }
    const cards = Array.from(grid.querySelectorAll(".movie-card"));
    const textInput = scope.querySelector("[data-local-filter]");
    const yearSelect = scope.querySelector("[data-year-filter]");
    const categorySelect = scope.querySelector("[data-category-filter]");

    function applyFilter() {
      const query = textInput ? textInput.value.trim().toLowerCase() : "";
      const year = yearSelect ? yearSelect.value : "";
      const category = categorySelect ? categorySelect.value : "";

      cards.forEach(function (card) {
        const haystack = [card.dataset.title, card.dataset.type, card.dataset.region, card.dataset.category, card.dataset.tags].join(" ").toLowerCase();
        const matchQuery = !query || haystack.includes(query);
        const matchYear = !year || card.dataset.year === year;
        const matchCategory = !category || card.dataset.category === category;
        card.classList.toggle("is-filter-hidden", !(matchQuery && matchYear && matchCategory));
      });
    }

    [textInput, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });
  });
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }[char];
  });
}
