(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var currentSlide = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  function startSlider() {
    if (slides.length <= 1) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  document.querySelectorAll('[data-slide-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      var action = button.getAttribute('data-slide-action');
      showSlide(action === 'prev' ? currentSlide - 1 : currentSlide + 1);
      startSlider();
    });
  });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-slide-index')) || 0;
      showSlide(index);
      startSlider();
    });
  });

  showSlide(0);
  startSlider();

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  document.querySelectorAll('.filter-panel').forEach(function (panel) {
    var input = panel.querySelector('.search-input');
    var buttons = Array.prototype.slice.call(panel.querySelectorAll('.filter-button'));
    var targetSelector = panel.getAttribute('data-target') || '.movie-card';
    var scope = document.querySelector(panel.getAttribute('data-scope') || 'body');
    var cards = Array.prototype.slice.call((scope || document).querySelectorAll(targetSelector));
    var empty = document.querySelector(panel.getAttribute('data-empty') || '.empty-result');
    var activeFilter = '';

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var matchesText = !query || haystack.indexOf(query) !== -1;
        var matchesFilter = !activeFilter || haystack.indexOf(activeFilter) !== -1;
        var isVisible = matchesText && matchesFilter;

        card.classList.toggle('hidden-card', !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    var searchButton = panel.querySelector('.search-button');

    if (searchButton) {
      searchButton.addEventListener('click', applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter = normalize(button.getAttribute('data-filter'));
        applyFilter();
      });
    });

    applyFilter();
  });
})();
