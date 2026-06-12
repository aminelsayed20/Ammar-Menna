

// ----- Preloader -----
(function () {
  const el = document.getElementById('preloader');
  if (!el) return;
  setTimeout(() => el.classList.add('fading'), 1700);
  setTimeout(() => el.classList.add('hidden'), 2400);
})();

// ----- Audio Player -----
(function () {
  const audio = document.getElementById('audio-player');
  const btn = document.getElementById('play-toggle');
  const playI = document.getElementById('play-icon');
  const pauseI = document.getElementById('pause-icon');

  const fill = document.getElementById('seek-fill');
  const bar = document.getElementById('seek-bar');
  const time = document.getElementById('time-display');

  if (!audio || !btn) return;

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const render = () => {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;

    if (fill) {
      fill.style.width = dur ? (cur / dur) * 100 + '%' : '0%';
    }

    if (time) {
      time.textContent = `${fmt(cur)} / ${fmt(dur)}`;
    }
  };

  audio.addEventListener('timeupdate', render);
  audio.addEventListener('loadedmetadata', render);

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playI.style.display = 'none';
      pauseI.style.display = '';
    } else {
      audio.pause();
      playI.style.display = '';
      pauseI.style.display = 'none';
    }
  });

  if (bar) {
    bar.addEventListener('click', (e) => {
      if (!audio.duration) return;

      const rect = bar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * audio.duration;
    });
  }

  render();
})();


// ===== Countdown =====
function updateCountdown() {
  const wedding = new Date('2026-06-23T17:00:00+02:00');
  const now = new Date();
  const diff = wedding - now;
  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(days).padStart(2 , '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ----- RSVP Modal -----
(function () {
  const modal = document.getElementById('rsvp-modal');
  const open  = document.getElementById('open-rsvp');
  const form  = document.getElementById('rsvp-form');
  const toast = document.getElementById('toast');

  if (!modal || !open || !form) return;

  const showModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };
  const hideModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  open.addEventListener('click', showModal);

  modal.querySelectorAll('[data-close]').forEach((el) =>
    el.addEventListener('click', hideModal)
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
  });

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 3500);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Thank you! We can't wait to celebrate with you 💛");
    form.reset();
    hideModal();
  });
})();

function handleMessage() {
  const name = document.getElementById('name').value.trim();
  const text = document.getElementById('message-note').value.trim();

  if (!name || !text) return;

  // Google Form entry IDs
  const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdPg7LezjEn-3aXcG22D9-E86cziDUI-yU504PkMMFKD-Pz6Q/formResponse";

  const formData = new FormData();

  // Replace these with your real entry IDs from Google Form
formData.append("entry.1044514513", name);
formData.append("entry.1434335250", text);

  fetch(formURL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  const success = document.getElementById('msgSuccess');

  success.querySelectorAll('.ar, .en').forEach(el => {
    el.style.display = (el.classList.contains(currentLang)) ? '' : 'none';
  });

  success.style.display = 'block';

  document.getElementById('name').value = '';
  document.getElementById('message-note').value = '';

  launchConfetti();

  setTimeout(() => {
    success.style.display = 'none';
  }, 4000);
}
