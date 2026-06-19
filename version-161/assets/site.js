(function () {
    function selectAll(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    var menuToggle = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");
    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = selectAll(".hero-slide", hero);
        var dots = selectAll("[data-hero-dot]", hero);
        var current = 0;
        var timer = null;

        function setSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function nextSlide() {
            setSlide(current + 1);
        }

        function startTimer() {
            timer = window.setInterval(nextSlide, 5200);
        }

        function resetTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            startTimer();
        }

        selectAll("[data-hero-next]", hero).forEach(function (button) {
            button.addEventListener("click", function () {
                nextSlide();
                resetTimer();
            });
        });

        selectAll("[data-hero-prev]", hero).forEach(function (button) {
            button.addEventListener("click", function () {
                setSlide(current - 1);
                resetTimer();
            });
        });

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                setSlide(dotIndex);
                resetTimer();
            });
        });

        setSlide(0);
        startTimer();
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var filterCards = selectAll("[data-search]");
    var noResults = document.querySelector("[data-no-results]");

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function applyFilter(value) {
        var query = normalize(value);
        var visible = 0;
        filterCards.forEach(function (card) {
            var haystack = normalize(card.getAttribute("data-search"));
            var match = !query || haystack.indexOf(query) !== -1;
            card.classList.toggle("hidden-card", !match);
            if (match) {
                visible += 1;
            }
        });
        if (noResults) {
            noResults.classList.toggle("show", visible === 0);
        }
    }

    if (filterInput && filterCards.length) {
        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get("q") || "";
        if (queryValue) {
            filterInput.value = queryValue;
        }
        applyFilter(filterInput.value);
        filterInput.addEventListener("input", function () {
            applyFilter(filterInput.value);
        });
    }

    var player = document.getElementById("movieVideo");
    var playCover = document.getElementById("playCover");
    var playerShell = document.querySelector(".player-shell");

    if (player && playCover && typeof playerUrl === "string" && playerUrl) {
        var isAttached = false;
        var hlsInstance = null;

        function attachStream() {
            if (isAttached) {
                return;
            }
            if (player.canPlayType("application/vnd.apple.mpegurl")) {
                player.src = playerUrl;
                isAttached = true;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(playerUrl);
                hlsInstance.attachMedia(player);
                isAttached = true;
                return;
            }
            player.src = playerUrl;
            isAttached = true;
        }

        function startPlayer() {
            attachStream();
            if (playerShell) {
                playerShell.classList.add("is-playing");
            }
            var playPromise = player.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        playCover.addEventListener("click", startPlayer);
        player.addEventListener("click", function () {
            if (player.paused) {
                startPlayer();
            }
        });
        player.addEventListener("play", function () {
            if (playerShell) {
                playerShell.classList.add("is-playing");
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
