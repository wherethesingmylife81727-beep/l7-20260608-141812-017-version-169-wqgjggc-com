(function () {
    var form = document.querySelector('[data-search-tool]');
    var input = document.querySelector('[data-search-input]');
    var typeSelect = document.querySelector('[data-search-type]');
    var results = document.querySelector('[data-search-results]');

    if (!form || !input || !results || !Array.isArray(MOVIES)) {
        return;
    }

    function card(movie) {
        var tags = [movie.region, movie.year, movie.type].filter(Boolean).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
            '<a href="' + movie.url + '" class="poster-link" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="type-badge">' + escapeHtml(movie.type) + '</span>' +
            '<span class="play-badge">▶</span>' +
            '</a>' +
            '<div class="movie-info">' +
            '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
            '<div class="movie-meta">' + tags + '</div>' +
            '<p>' + escapeHtml(movie.oneLine || '') + '</p>' +
            '</div>' +
            '</article>';
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function matches(movie, query, type) {
        var text = [
            movie.title,
            movie.region,
            movie.type,
            movie.year,
            movie.genre,
            movie.category,
            movie.oneLine,
            (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        var okQuery = !query || text.indexOf(query) !== -1;
        var okType = !type || text.indexOf(type) !== -1;
        return okQuery && okType;
    }

    function render() {
        var query = input.value.trim().toLowerCase();
        var type = typeSelect ? typeSelect.value.trim().toLowerCase() : '';
        var filtered = MOVIES.filter(function (movie) {
            return matches(movie, query, type);
        }).slice(0, 120);
        results.innerHTML = filtered.map(card).join('');
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (initial) {
        input.value = initial;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        render();
    });

    input.addEventListener('input', render);
    if (typeSelect) {
        typeSelect.addEventListener('change', render);
    }
    render();
})();
