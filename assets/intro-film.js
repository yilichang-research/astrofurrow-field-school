'use strict';

(() => {
  const video = document.getElementById('intro-film-video');
  if (!video) return;

  const controls = document.getElementById('intro-film-controls');
  const sound = document.getElementById('intro-sound');
  const errorMessage = document.getElementById('intro-film-error');
  let attempt = 0;

  function updateSoundLabel() {
    sound.textContent = video.muted ? 'Enable Sound' : 'Mute Sound';
  }

  async function startPlayback(muted) {
    const current = ++attempt;
    video.muted = muted;
    updateSoundLabel();
    try {
      await video.play();
      if (current === attempt) errorMessage.hidden = true;
    } catch {
      if (current !== attempt) return;
      // Sound can require a user gesture even when muted playback is allowed.
      if (!muted) return startPlayback(true);
      errorMessage.hidden = !video.error;
    }
  }

  video.volume = 0.4;
  video.addEventListener('volumechange', updateSoundLabel);
  video.addEventListener('error', () => {errorMessage.hidden = false;});
  sound.addEventListener('click', () => {
    if (!video.muted) {
      ++attempt;
      video.muted = true;
      updateSoundLabel();
      if (video.paused) void startPlayback(true);
      return;
    }
    if (video.error) video.load();
    void startPlayback(false);
  });

  controls.hidden = false;
  void startPlayback(false);
})();
