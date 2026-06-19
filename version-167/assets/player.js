function initMoviePlayer(source) {
  var video = document.querySelector('.movie-video');
  var overlay = document.querySelector('[data-play-overlay]');
  var playerBox = document.querySelector('[data-player-box]');
  var hlsInstance = null;
  var loaded = false;

  if (!video || !source) {
    return;
  }

  function load() {
    if (loaded) {
      return Promise.resolve();
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return new Promise(function(resolve) {
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
          resolve();
        });
      });
    }

    video.src = source;
    return Promise.resolve();
  }

  function play() {
    load().then(function() {
      if (overlay) {
        overlay.classList.add('hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function() {});
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', play);
  }

  if (playerBox) {
    playerBox.addEventListener('click', function(event) {
      if (event.target === video && video.paused) {
        play();
      }
    });
  }

  video.addEventListener('play', function() {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  });

  video.addEventListener('pause', function() {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove('hidden');
    }
  });

  window.addEventListener('beforeunload', function() {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
