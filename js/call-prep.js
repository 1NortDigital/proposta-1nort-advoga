/* 1Nort Advoga — preparação de mídia para apresentações */
(() => {
  'use strict';

  const button = document.querySelector('[data-call-prep]');
  if (!button) return;

  const label = button.querySelector('[data-call-prep-label]');
  const status = button.querySelector('[data-call-prep-status]');
  const bar = button.querySelector('[data-call-prep-bar]');
  const mediaUrls = Array.from(new Set([
    ...Array.from(document.querySelectorAll('[data-cm-video]'), (el) => el.getAttribute('data-cm-video')),
    ...Array.from(document.querySelectorAll('video[data-src]'), (el) => el.getAttribute('data-src')),
  ].filter(Boolean).map((url) => url.split('#')[0])));

  const setProgress = (done, total) => {
    const percent = total ? Math.round((done / total) * 100) : 0;
    if (bar) bar.style.width = `${percent}%`;
    if (status) status.textContent = total ? `${done} de ${total} vídeos · ${percent}%` : 'Preparando…';
  };

  const setReady = (total) => {
    button.disabled = false;
    button.classList.remove('is-error');
    button.classList.add('is-ready');
    if (label) label.textContent = 'Call pronta ✓';
    if (status) status.textContent = `${total} vídeos disponíveis localmente`;
    if (bar) bar.style.width = '100%';
  };

  const setError = () => {
    button.disabled = false;
    button.classList.remove('is-ready');
    button.classList.add('is-error');
    if (label) label.textContent = 'Tentar preparar novamente';
    if (status) status.textContent = 'Não foi possível baixar todos os vídeos';
  };

  const fallbackPrepare = async () => {
    let done = 0;
    for (const url of mediaUrls) {
      const response = await fetch(url, { cache: 'reload', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Falha ao baixar ${url}`);
      await response.blob();
      done += 1;
      setProgress(done, mediaUrls.length);
    }
    setReady(mediaUrls.length);
  };

  let registrationPromise = null;
  const registerWorker = () => {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    if (!registrationPromise) {
      registrationPromise = navigator.serviceWorker
        .register('sw.js?v=20261005d')
        .then(() => navigator.serviceWorker.ready)
        .catch(() => null);
    }
    return registrationPromise;
  };

  navigator.serviceWorker?.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'MEDIA_PREP_PROGRESS') setProgress(data.done, data.total);
    if (data.type === 'MEDIA_PREPARED') {
      if (data.failed) setError();
      else setReady(data.total);
    }
    if (data.type === 'MEDIA_STATUS' && data.total && data.cached === data.total) setReady(data.total);
  });

  button.addEventListener('click', async () => {
    if (button.classList.contains('is-ready')) return;
    button.disabled = true;
    button.classList.remove('is-error');
    if (label) label.textContent = 'Preparando apresentação…';
    setProgress(0, mediaUrls.length);

    try {
      const registration = await registerWorker();
      const worker = registration?.active || registration?.waiting || registration?.installing;
      if (!worker) {
        await fallbackPrepare();
        return;
      }
      worker.postMessage({ type: 'PREPARE_MEDIA', urls: mediaUrls });
    } catch (error) {
      setError();
    }
  });

  const checkExistingCache = async () => {
    const registration = await registerWorker();
    const worker = registration?.active || registration?.waiting || registration?.installing;
    worker?.postMessage({ type: 'CHECK_MEDIA', urls: mediaUrls });
  };

  if ('requestIdleCallback' in window) requestIdleCallback(checkExistingCache, { timeout: 2500 });
  else setTimeout(checkExistingCache, 1200);
})();
