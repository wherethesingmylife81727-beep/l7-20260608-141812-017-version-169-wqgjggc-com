(function () {
    var navButton = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (navButton && nav) {
        navButton.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            var holder = image.closest(".poster, .hero-art, .detail-poster, .rank-thumb");
            if (holder) {
                holder.classList.add("media-empty");
            }
            image.remove();
        });
    });

    var slider = document.querySelector("[data-slider]");
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-slide-dot]"));
        var index = 0;
        var show = function (next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        show(0);
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    document.querySelectorAll("[data-filter-input]").forEach(function (input) {
        var scope = document.querySelector(input.getAttribute("data-filter-input"));
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
        input.addEventListener("input", function () {
            var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                var ok = words.every(function (word) {
                    return haystack.indexOf(word) !== -1;
                });
                card.classList.toggle("hide-card", !ok);
            });
        });
    });

    document.querySelectorAll("[data-sort-select]").forEach(function (select) {
        var scope = document.querySelector(select.getAttribute("data-sort-select"));
        if (!scope) {
            return;
        }
        select.addEventListener("change", function () {
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
            var key = select.value;
            cards.sort(function (a, b) {
                var av = Number(a.getAttribute("data-" + key) || 0);
                var bv = Number(b.getAttribute("data-" + key) || 0);
                return bv - av;
            });
            cards.forEach(function (card) {
                scope.appendChild(card);
            });
        });
    });

    var quickSearch = document.querySelector("[data-quick-search]");
    if (quickSearch) {
        quickSearch.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = quickSearch.querySelector("input");
            var value = input ? input.value.trim() : "";
            var url = "./search.html";
            if (value) {
                url += "?q=" + encodeURIComponent(value);
            }
            window.location.href = url;
        });
    }

    var pageSearch = document.querySelector("[data-page-search]");
    if (pageSearch) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        pageSearch.value = query;
        pageSearch.dispatchEvent(new Event("input"));
    }

    var attachPlayer = function (video, src) {
        if (!src) {
            return;
        }
        if (video.dataset.ready === "1") {
            return;
        }
        video.dataset.ready = "1";
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            video._hls = hls;
            return;
        }
        video.src = src;
    };

    document.querySelectorAll("[data-player]").forEach(function (shell) {
        var video = shell.querySelector("video");
        var button = shell.querySelector("button");
        if (!video) {
            return;
        }
        var begin = function () {
            attachPlayer(video, video.getAttribute("data-stream") || "");
            shell.classList.add("ready");
            var played = video.play();
            if (played && played.catch) {
                played.catch(function () {});
            }
        };
        if (button) {
            button.addEventListener("click", begin);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            }
        });
    });
})();
