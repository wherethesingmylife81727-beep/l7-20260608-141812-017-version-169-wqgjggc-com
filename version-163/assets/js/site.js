(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function movieCard(movie) {
        return [
            "<article class=\"movie-card\">",
            "<a class=\"movie-poster\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">",
            "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
            "<span class=\"poster-shade\"></span>",
            "<span class=\"poster-play\">▶</span>",
            "<span class=\"poster-year\">" + escapeHtml(movie.year) + "</span>",
            "</a>",
            "<div class=\"movie-card-body\">",
            "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
            "<p>" + escapeHtml(movie.oneLine) + "</p>",
            "<div class=\"movie-meta\"><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.region) + "</span></div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function initMobileMenu() {
        var button = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initSearchForms() {
        document.querySelectorAll("[data-site-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    if (input) {
                        input.focus();
                    }
                    return;
                }
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
            });
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            });
        });
        timer = window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function initCardFilter() {
        document.querySelectorAll("[data-card-filter]").forEach(function (input) {
            var scope = input.closest("[data-filter-scope]") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var haystack = String(card.getAttribute("data-search") || "").toLowerCase();
                    card.classList.toggle("hidden-card", keyword && haystack.indexOf(keyword) === -1);
                });
            });
        });
    }

    function initSearchPage() {
        var mount = document.querySelector("[data-search-results]");
        var title = document.querySelector("[data-search-title]");
        var input = document.querySelector("[data-search-input]");
        if (!mount || !window.searchMovies) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get("q") || "").trim();
        if (input) {
            input.value = query;
        }
        if (!query) {
            mount.innerHTML = "<div class=\"search-empty\">输入片名、地区、类型或关键词，快速查找想看的内容。</div>";
            return;
        }
        var lower = query.toLowerCase();
        var results = window.searchMovies.filter(function (movie) {
            return String(movie.title + " " + movie.region + " " + movie.type + " " + movie.year + " " + movie.genre + " " + movie.tags + " " + movie.oneLine).toLowerCase().indexOf(lower) !== -1;
        });
        if (title) {
            title.textContent = "搜索结果：" + query;
        }
        if (!results.length) {
            mount.innerHTML = "<div class=\"search-empty\">没有找到匹配内容，换个关键词试试。</div>";
            return;
        }
        mount.innerHTML = "<div class=\"movie-grid grid-five\">" + results.map(movieCard).join("") + "</div>";
    }

    window.initMoviePlayer = function (videoId, triggerId, url) {
        var video = document.getElementById(videoId);
        var trigger = document.getElementById(triggerId);
        if (!video || !url) {
            return;
        }
        var loaded = false;
        var hlsInstance = null;
        function attach() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new Hls({
                    enableWorker: true
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }
            loaded = true;
        }
        function start() {
            attach();
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
            video.controls = true;
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {});
            }
        }
        if (trigger) {
            trigger.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (!loaded) {
                start();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        initMobileMenu();
        initSearchForms();
        initHero();
        initCardFilter();
        initSearchPage();
    });
})();
