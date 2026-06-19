(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-thumb]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });

      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });

      thumbs.forEach(function(thumb, i) {
        thumb.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function(panel) {
    var search = panel.querySelector('[data-movie-search]');
    var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-value]'));
    var grid = panel.parentElement.querySelector('[data-movie-grid]');

    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var currentType = '';

    function apply() {
      var query = search ? search.value.trim().toLowerCase() : '';

      cards.forEach(function(card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var type = card.getAttribute('data-type') || '';
        var matchedQuery = !query || text.indexOf(query) !== -1;
        var matchedType = !currentType || type.indexOf(currentType) !== -1 || text.indexOf(currentType.toLowerCase()) !== -1;
        card.classList.toggle('filtered-out', !(matchedQuery && matchedType));
      });
    }

    if (search) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');

      if (q) {
        search.value = q;
      }

      search.addEventListener('input', apply);
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        currentType = button.getAttribute('data-filter-value') || '';
        buttons.forEach(function(item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });

    apply();
  });
})();
