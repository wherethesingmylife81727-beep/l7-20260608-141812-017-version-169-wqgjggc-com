(function () {
  document.querySelectorAll('.player-box').forEach(function (box) {
    var video = box.querySelector('video');
    var overlay = box.querySelector('.player-overlay');
    var button = box.querySelector('.play-now');
    var sourceTag = video ? video.querySelector('source') : null;
    var hlsInstance = null;

    if (!video || !sourceTag) {
      return;
    }

    function sourceUrl() {
      return sourceTag.getAttribute('src');
    }

    function prepareVideo() {
      if (video.getAttribute('data-ready') === '1') {
        return;
      }

      var src = sourceUrl();

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = src;
      }

      video.setAttribute('data-ready', '1');
    }

    function beginPlayback(event) {
      if (event) {
        event.preventDefault();
      }

      prepareVideo();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var attempt = video.play();

      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', beginPlayback);
    }

    if (button) {
      button.addEventListener('click', beginPlayback);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('emptied', function () {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
