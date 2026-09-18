document.addEventListener('DOMContentLoaded', () => {
  const visitorCount = document.getElementById('visitor-count');
  const profileWrapper = document.getElementById('profile-wrapper');
  const profileBlock = document.getElementById('profile-block');
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const mediaPlayerEl = document.getElementById('media-player');
  const bgVideo = document.getElementById('bg-video');
  const bgAudio = document.getElementById('bg-audio');

  const mpCover = document.getElementById('mp-cover');
  const mpTitle = document.getElementById('mp-title');
  const mpArtist = document.getElementById('mp-artist');
  const playBtn = document.getElementById('mp-play');
  const seek = document.getElementById('mp-seek');
  const fill = document.getElementById('mp-progress-fill');
  const progressDot = document.getElementById('mp-progress-dot');
  const currentTimeEl = document.getElementById('mp-current-time');
  const totalTimeEl = document.getElementById('mp-total-time');
  const prevBtn = document.getElementById('mp-prev');
  const nextBtn = document.getElementById('mp-next');

  const volumeSlider = document.getElementById('mp-volume');
  const volumeFill = document.getElementById('mp-volume-fill');
  const volumeBtn = document.getElementById('mp-volume-btn');
  const volumeIcon = document.getElementById('mp-volume-icon');

  const playIcon = `<svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
  const pauseIcon = `<svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"></path></svg>`;

  const volHighIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>`;
  const volLowIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
  const volMuteIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;

  const TRACKS = [
    {
      id: 'prada_party',
      title: 'PRADA PARTY',
      artist: 'Kai Angel',
      video: 'assets/prada_party.mp4',
      audio: 'assets/music/prada_party.mp3',
      cover: 'assets/music/prada_party.webp',
      syncVideo: true
    },
    {
      id: 'pleasure',
      title: 'pleasure',
      artist: 'Kai Angel',
      video: 'assets/pleasure.mp4',
      audio: 'assets/music/pleasure.mp3',
      cover: 'assets/music/pleasure.webp',
      syncVideo: false
    }
  ];

  let currentTrackIdx = Math.floor(Math.random() * TRACKS.length);
  let isPlaying = false;
  let currentVolume = 0.75;
  let lastVolume = 0.75;
  let isSeeking = false;
  let hasEntered = false;

  function streamText(element, fullText, speed = 40, onComplete = null) {
    if (!element || !fullText) {
      if (onComplete) onComplete();
      return;
    }
    element.textContent = '';
    element.classList.add('typing-active');
    let charIndex = 0;
    function typeChar() {
      if (charIndex < fullText.length) {
        charIndex++;
        element.textContent = fullText.slice(0, charIndex);
        setTimeout(typeChar, speed);
      } else {
        element.classList.remove('typing-active');
        if (onComplete) onComplete();
      }
    }
    typeChar();
  }

  function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function getActiveAudio() {
    const track = TRACKS[currentTrackIdx];
    return track.syncVideo ? bgVideo : bgAudio;
  }

  function updateVolumeUI(val) {
    if (volumeSlider) volumeSlider.value = val;
    if (volumeFill) volumeFill.style.width = (val * 100) + '%';
    if (volumeIcon) {
      if (val === 0) {
        volumeIcon.innerHTML = volMuteIcon;
      } else if (val < 0.5) {
        volumeIcon.innerHTML = volLowIcon;
      } else {
        volumeIcon.innerHTML = volHighIcon;
      }
    }
  }

  function applyVolume(val) {
    currentVolume = val;
    if (bgVideo) {
      const track = TRACKS[currentTrackIdx];
      bgVideo.volume = track.syncVideo ? val : 0;
      if (!track.syncVideo) bgVideo.muted = true;
    }
    if (bgAudio) {
      bgAudio.volume = val;
    }
    updateVolumeUI(val);
  }

  function loadTrack(idx, autoPlay = false) {
    currentTrackIdx = (idx + TRACKS.length) % TRACKS.length;
    const track = TRACKS[currentTrackIdx];

    if (window.gsap && bgVideo) {
      gsap.to(bgVideo, {
        opacity: 0.3,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setTrackMedia(track, autoPlay);
          gsap.to(bgVideo, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        }
      });
    } else {
      setTrackMedia(track, autoPlay);
    }
  }

  function setTrackMedia(track, autoPlay) {
    if (mpTitle) {
      if (window.gsap) {
        gsap.fromTo(mpTitle, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.35 });
      }
      mpTitle.textContent = track.title;
    }
    if (mpArtist) {
      if (window.gsap) {
        gsap.fromTo(mpArtist, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.05 });
      }
      mpArtist.textContent = track.artist;
    }
    if (mpCover) {
      mpCover.src = track.cover;
      if (window.gsap) {
        gsap.fromTo(mpCover, { scale: 0.88, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
      }
    }

    if (fill) fill.style.width = '0%';
    if (progressDot) progressDot.style.left = '0%';
    if (seek) seek.value = 0;
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (totalTimeEl) totalTimeEl.textContent = '0:00';

    if (!hasEntered && !autoPlay) {
      return;
    }

    if (track.syncVideo) {
      if (bgAudio) {
        bgAudio.pause();
        bgAudio.removeAttribute('src');
      }
      if (bgVideo) {
        if (!bgVideo.src.includes(track.video)) {
          bgVideo.src = track.video;
        }
        bgVideo.muted = !hasEntered;
        bgVideo.volume = currentVolume;
        bgVideo.loop = true;
        bgVideo.currentTime = 0;
        if (autoPlay && hasEntered) {
          bgVideo.play().then(() => {
            isPlaying = true;
            if (playBtn) playBtn.innerHTML = pauseIcon;
            bgVideo.classList.add('is-loaded');
          }).catch(() => {});
        }
      }
    } else {
      if (bgVideo) {
        if (!bgVideo.src.includes(track.video)) {
          bgVideo.src = track.video;
        }
        bgVideo.muted = true;
        bgVideo.volume = 0;
        bgVideo.loop = true;
        bgVideo.currentTime = 0;
        bgVideo.play().then(() => {
          bgVideo.classList.add('is-loaded');
        }).catch(() => {});
      }
      if (bgAudio) {
        bgAudio.src = track.audio;
        bgAudio.volume = currentVolume;
        bgAudio.loop = false;
        bgAudio.currentTime = 0;
        if (autoPlay && hasEntered) {
          bgAudio.play().then(() => {
            isPlaying = true;
            if (playBtn) playBtn.innerHTML = pauseIcon;
          }).catch(() => {});
        }
      }
    }
  }

  function handleTimeUpdate(el) {
    if (isSeeking || !el || !el.duration || isNaN(el.duration)) return;
    const pct = (el.currentTime / el.duration) * 100;
    if (fill) fill.style.width = pct + '%';
    if (progressDot) progressDot.style.left = pct + '%';
    if (seek) seek.value = pct;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(el.currentTime);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(el.duration);
  }

  if (bgVideo) {
    bgVideo.addEventListener('timeupdate', () => {
      if (TRACKS[currentTrackIdx].syncVideo) handleTimeUpdate(bgVideo);
    });
    bgVideo.addEventListener('loadedmetadata', () => {
      if (TRACKS[currentTrackIdx].syncVideo && totalTimeEl) totalTimeEl.textContent = formatTime(bgVideo.duration);
    });
    bgVideo.addEventListener('ended', () => {
      if (TRACKS[currentTrackIdx].syncVideo) {
        loadTrack(currentTrackIdx + 1, true);
      } else {
        bgVideo.currentTime = 0;
        bgVideo.play().catch(() => {});
      }
    });
  }

  if (bgAudio) {
    bgAudio.addEventListener('timeupdate', () => {
      if (!TRACKS[currentTrackIdx].syncVideo) handleTimeUpdate(bgAudio);
    });
    bgAudio.addEventListener('loadedmetadata', () => {
      if (!TRACKS[currentTrackIdx].syncVideo && totalTimeEl) totalTimeEl.textContent = formatTime(bgAudio.duration);
    });
    bgAudio.addEventListener('ended', () => {
      loadTrack(currentTrackIdx + 1, true);
    });
  }

  if (seek) {
    seek.addEventListener('mousedown', () => { isSeeking = true; });
    seek.addEventListener('touchstart', () => { isSeeking = true; });
    seek.addEventListener('input', () => {
      const activeEl = getActiveAudio();
      if (activeEl && activeEl.duration && !isNaN(activeEl.duration)) {
        const pct = parseFloat(seek.value);
        activeEl.currentTime = (pct / 100) * activeEl.duration;
        if (fill) fill.style.width = pct + '%';
        if (progressDot) progressDot.style.left = pct + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(activeEl.currentTime);
      }
    });
    seek.addEventListener('mouseup', () => { isSeeking = false; });
    seek.addEventListener('touchend', () => { isSeeking = false; });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const track = TRACKS[currentTrackIdx];
      if (track.syncVideo) {
        if (bgVideo.paused) {
          bgVideo.muted = false;
          bgVideo.volume = currentVolume;
          bgVideo.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = pauseIcon;
          }).catch(() => {});
        } else {
          bgVideo.pause();
          isPlaying = false;
          playBtn.innerHTML = playIcon;
        }
      } else {
        if (bgAudio.paused) {
          bgAudio.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = pauseIcon;
          }).catch(() => {});
          if (bgVideo && bgVideo.paused) bgVideo.play().catch(() => {});
        } else {
          bgAudio.pause();
          isPlaying = false;
          playBtn.innerHTML = playIcon;
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const activeEl = getActiveAudio();
      if (activeEl && activeEl.currentTime > 3) {
        activeEl.currentTime = 0;
      } else {
        loadTrack(currentTrackIdx - 1, isPlaying || hasEntered);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      loadTrack(currentTrackIdx + 1, isPlaying || hasEntered);
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const val = parseFloat(volumeSlider.value);
      lastVolume = val > 0 ? val : 0.75;
      applyVolume(val);
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      if (currentVolume > 0) {
        lastVolume = currentVolume;
        applyVolume(0);
      } else {
        applyVolume(lastVolume || 0.75);
      }
    });
  }

  applyVolume(0.75);
  loadTrack(currentTrackIdx, false);

  function setupGlassTracking(element) {
    if (!element) return;
    let ticking = false;
    let lastEvent = null;

    element.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (lastEvent) {
            const rect = element.getBoundingClientRect();
            const x = ((lastEvent.clientX - rect.left) / rect.width) * 100;
            const y = ((lastEvent.clientY - rect.top) / rect.height) * 100;
            element.style.setProperty('--mx', `${x}%`);
            element.style.setProperty('--my', `${y}%`);

            if (window.gsap && element === profileBlock) {
              const mouseX = lastEvent.clientX - rect.left - rect.width / 2;
              const mouseY = lastEvent.clientY - rect.top - rect.height / 2;
              gsap.to(profileBlock, {
                rotationX: (mouseY / rect.height) * 8,
                rotationY: -(mouseX / rect.width) * 8,
                duration: 0.35,
                ease: 'power2.out',
                transformPerspective: 1200
              });
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    element.addEventListener('mouseleave', () => {
      if (window.gsap && element === profileBlock) {
        gsap.to(profileBlock, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' });
      }
    });
  }

  setupGlassTracking(profileBlock);
  setupGlassTracking(mediaPlayerEl);

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverables = document.querySelectorAll('a, button, input, .profile-picture, .visitor-counter, #start-screen, .liquid-interactive');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  const startMsg = 'click to enter <3';
  let sIdx = 0, sCursor = true, sContent = '';

  function typeStart() {
    if (sIdx < startMsg.length) sContent = startMsg.slice(0, ++sIdx);
    if (startText) startText.textContent = sContent + (sCursor ? '|' : ' ');
    if (sIdx < startMsg.length) setTimeout(typeStart, 75);
  }

  setInterval(() => {
    sCursor = !sCursor;
    if (startText) startText.textContent = sContent + (sCursor ? '|' : ' ');
  }, 450);

  typeStart();

  function onEnter() {
    hasEntered = true;
    if (startScreen) {
      if (window.gsap) {
        gsap.to(startScreen, {
          opacity: 0,
          scale: 1.12,
          filter: 'blur(16px)',
          duration: 0.75,
          ease: 'power3.inOut',
          onComplete: () => {
            if (startScreen) startScreen.classList.add('hidden');
          }
        });
      } else {
        startScreen.style.opacity = '0';
        setTimeout(() => { if (startScreen) startScreen.classList.add('hidden'); }, 600);
      }
    }

    if (profileWrapper) {
      profileWrapper.classList.remove('hidden');
      profileWrapper.style.opacity = '1';

      if (window.gsap) {
        gsap.fromTo(profileBlock,
          { opacity: 0, y: -40, scale: 0.94, filter: 'blur(12px)' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' }
        );

        if (mediaPlayerEl) {
          gsap.fromTo(mediaPlayerEl,
            { opacity: 0, y: 40, scale: 0.94, filter: 'blur(12px)' },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, delay: 0.2, ease: 'power4.out' }
          );
        }
      }
    }

    // Progressive text loading on enter:
    const profileNameEl = document.getElementById('profile-name');
    const profileBioTextEl = document.getElementById('profile-bio-text');
    if (profileNameEl) {
      streamText(profileNameEl, 'Alowyy1', 45, () => {
        if (profileBioTextEl) {
          streamText(profileBioTextEl, 'Мои работы / My works', 30);
        }
      });
    }

    const track = TRACKS[currentTrackIdx];
    setTrackMedia(track, true);
  }

  if (startScreen) {
    startScreen.addEventListener('click', onEnter);
    startScreen.addEventListener('touchstart', (e) => { e.preventDefault(); onEnter(); });
  }

  const collapseBioBtn = document.getElementById('collapse-bio-btn');
  const expandBioBtn = document.getElementById('expand-bio-btn');

  if (collapseBioBtn && profileBlock && expandBioBtn) {
    collapseBioBtn.addEventListener('click', () => {
      if (window.gsap) {
        gsap.to(profileBlock, {
          opacity: 0,
          y: 60,
          scale: 0.92,
          filter: 'blur(10px)',
          duration: 0.45,
          ease: 'power3.inOut',
          onComplete: () => {
            profileBlock.style.visibility = 'hidden';
            expandBioBtn.classList.remove('hidden');
            gsap.fromTo(expandBioBtn,
              { opacity: 0, y: 20, scale: 0.7 },
              { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
            );
          }
        });
      } else {
        profileBlock.style.visibility = 'hidden';
        expandBioBtn.classList.remove('hidden');
      }
    });

    expandBioBtn.addEventListener('click', () => {
      if (window.gsap) {
        gsap.to(expandBioBtn, {
          opacity: 0,
          y: 20,
          scale: 0.7,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            expandBioBtn.classList.add('hidden');
            profileBlock.style.visibility = 'visible';
            gsap.fromTo(profileBlock,
              { opacity: 0, y: 50, scale: 0.94, filter: 'blur(10px)' },
              { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }
            );
          }
        });
      } else {
        expandBioBtn.classList.add('hidden');
        profileBlock.style.visibility = 'visible';
      }
    });
  }

  function animateNumber(el, start, end, duration = 1200) {
    if (!el) return;
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * ease);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  async function initVisitorCounter() {
    if (!visitorCount) return;

    let cachedCount = parseInt(localStorage.getItem('alowyy1_bio_views') || '2482');
    if (isNaN(cachedCount) || cachedCount < 0) cachedCount = 2482;
    visitorCount.textContent = cachedCount.toLocaleString();

    const SESSION_KEY = 'alowyy1_bio_counted_session';
    const LOCAL_KEY = 'alowyy1_bio_counted_time';
    const now = Date.now();
    const lastCounted = parseInt(localStorage.getItem(LOCAL_KEY) || '0');
    const cooldownMs = 12 * 60 * 60 * 1000;

    const hasSessionCounted = sessionStorage.getItem(SESSION_KEY);
    const isWithinCooldown = (now - lastCounted) < cooldownMs;

    try {
      if (!hasSessionCounted && !isWithinCooldown) {
        const res = await fetch('/api/bio/views/hit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(4000)
        });
        const data = await res.json();
        if (data && typeof data.views === 'number') {
          sessionStorage.setItem(SESSION_KEY, '1');
          localStorage.setItem(LOCAL_KEY, now.toString());
          localStorage.setItem('alowyy1_bio_views', data.views.toString());
          animateNumber(visitorCount, cachedCount, data.views);
          return;
        }
      } else {
        const res = await fetch('/api/bio/views', { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        if (data && typeof data.views === 'number') {
          localStorage.setItem('alowyy1_bio_views', data.views.toString());
          animateNumber(visitorCount, cachedCount, data.views);
          return;
        }
      }
    } catch (err) {
    }

    visitorCount.textContent = cachedCount.toLocaleString();
  }

  initVisitorCounter();
});

let spotifyTimer = null;

function startSpotifyTimer(start, end) {
  if (spotifyTimer) clearInterval(spotifyTimer);
  const total = end - start;

  function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function tick() {
    const elapsed = Math.max(0, Math.min(total, Date.now() - start));
    const pct = (elapsed / total) * 100;

    const elapsedEl = document.getElementById('spotify-elapsed');
    const totalEl = document.getElementById('spotify-total');
    const progressFillEl = document.getElementById('spotify-progress-fill');

    if (elapsedEl) elapsedEl.textContent = formatTime(elapsed / 1000);
    if (totalEl) totalEl.textContent = formatTime(total / 1000);
    if (progressFillEl) progressFillEl.style.width = pct + '%';

    if (elapsed >= total) clearInterval(spotifyTimer);
  }

  tick();
  spotifyTimer = setInterval(tick, 1000);
}

function getActivityImage(activity) {
  if (!activity || !activity.assets) return null;
  const assets = activity.assets;
  if (assets.large_image) {
    if (assets.large_image.startsWith('mp:external/')) {
      const parts = assets.large_image.split('/https/');
      if (parts.length > 1) return 'https://' + parts[1];
    } else if (assets.large_image.startsWith('spotify:')) {
      const trackId = assets.large_image.split(':')[1];
      return `https://i.scdn.co/image/${trackId}`;
    }
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assets.large_image}.png`;
  }
  return null;
}

async function fetchLanyard() {
  try {
    const res = await fetch('https://api.lanyard.rest/v1/users/980154022847733770', { signal: AbortSignal.timeout(5000) });
    const json = await res.json();
    if (!json.success || !json.data) return;

    const data = json.data;
    const widgetEl = document.getElementById('lanyard-widget');
    const linkEl = document.getElementById('lanyard-link');
    if (!linkEl) return;

    const avatarUrl = data.discord_user.avatar 
      ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=64` 
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    const displayName = data.discord_user.global_name || data.discord_user.display_name || data.discord_user.username || 'Alowyy1';
    const playing = data.activities.find(a => a.type === 0);
    const listening = data.activities.find(a => a.type === 2) || data.listening_to_spotify;
    const custom = data.activities.find(a => a.type === 4);
    const customStatus = (custom && custom.state) ? custom.state : '';

    let nameText = displayName;
    if (customStatus) nameText += ` — ${customStatus}`;

    let innerHtml = `
      <div id="lanyard-avatar-wrap">
          <img id="lanyard-avatar" src="${avatarUrl}" alt="Avatar" width="36" height="36" decoding="async">
          <div id="lanyard-status-dot" class="status-${data.discord_status}"></div>
      </div>
      <div id="lanyard-info">
          <div id="lanyard-name">${nameText}</div>
    `;

    if (data.discord_status === 'offline') {
      if (spotifyTimer) { clearInterval(spotifyTimer); spotifyTimer = null; }
      innerHtml += `<div id="lanyard-activity">Offline</div>`;
    } else if (listening && data.spotify) {
      const spotify = data.spotify;
      const albumArtUrl = spotify.album_art_url || 'assets/x_x.jpg';
      const songTitle = spotify.song || 'Unknown Track';
      const artistName = spotify.artist || 'Unknown Artist';

      innerHtml += `
        <div class="lanyard-activity-card">
            <img class="lanyard-activity-img" src="${albumArtUrl}" alt="Album Art" width="40" height="40" decoding="async">
            <div class="lanyard-activity-details">
                <div class="lanyard-activity-header">Listening to Spotify</div>
                <div class="lanyard-activity-title">${songTitle}</div>
                <div class="lanyard-activity-subtitle">${artistName}</div>
                <div class="lanyard-activity-timeline">
                    <span id="spotify-elapsed" class="lanyard-time">0:00</span>
                    <div class="lanyard-progress-bar">
                        <div id="spotify-progress-fill"></div>
                    </div>
                    <span id="spotify-total" class="lanyard-time">0:00</span>
                </div>
            </div>
        </div>
      `;

      if (spotify.timestamps) {
        startSpotifyTimer(spotify.timestamps.start, spotify.timestamps.end);
      }
    } else if (playing) {
      if (spotifyTimer) { clearInterval(spotifyTimer); spotifyTimer = null; }
      const activityImg = getActivityImage(playing);
      const imgHtml = activityImg ? `<img class="lanyard-activity-img" src="${activityImg}" alt="Game" width="40" height="40" decoding="async">` : '';
      const headerText = (playing.name === 'Code' || playing.name === 'Visual Studio Code') ? '💻 Coding' : '🎮 Playing';

      innerHtml += `
        <div class="lanyard-activity-card">
            ${imgHtml}
            <div class="lanyard-activity-details">
                <div class="lanyard-activity-header">${headerText}</div>
                <div class="lanyard-activity-title">${playing.name}</div>
                <div class="lanyard-activity-subtitle">${playing.details || playing.state || ''}</div>
            </div>
        </div>
      `;
    } else {
      if (spotifyTimer) { clearInterval(spotifyTimer); spotifyTimer = null; }
      const statuses = { online: 'Online', idle: 'Away', dnd: 'Do Not Disturb' };
      innerHtml += `<div id="lanyard-activity">${statuses[data.discord_status] || 'Online'}</div>`;
    }

    innerHtml += `
      </div>
      <div id="lanyard-open">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
      </div>
    `;

    linkEl.innerHTML = innerHtml;
    if (widgetEl) widgetEl.style.display = 'block';
  } catch (e) {
  }
}

fetchLanyard();
setInterval(fetchLanyard, 10000);

(function animateTitle() {
  const titleText = "Alowyy1's Bio <3";
  let index = 0;
  let direction = 1;

  function step() {
    if (direction === 1) {
      document.title = titleText.slice(0, index + 1) + " |";
      index++;
      if (index === titleText.length) {
        direction = -1;
        setTimeout(step, 1600);
        return;
      }
    } else {
      document.title = titleText.slice(0, index) + " |";
      index--;
      if (index === 0) {
        direction = 1;
        setTimeout(step, 800);
        return;
      }
    }
    setTimeout(step, direction === 1 ? 220 : 130);
  }
  step();
})();
