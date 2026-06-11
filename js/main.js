/* ============================================================
   1NORT — PROPOSTA ADVOGA · main.js
   GSAP + ScrollTrigger (scroll nativo)
============================================================ */

(() => {
  'use strict';

  /* ----- GSAP setup ----- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ----- Navbar scroll state ----- */
  const navbar = document.querySelector('.navbar');
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Animações de entrada (.anim-fade-up) — IntersectionObserver único ----- */
  document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('.anim-fade-up');
    if (els.length) {
      els.forEach((el) => {
        const delay = parseFloat(el.dataset.delay || 0);
        if (delay) el.style.transitionDelay = delay + 's';
      });
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -10% 0px' });
        els.forEach((el) => io.observe(el));
      } else {
        els.forEach((el) => el.classList.add('is-visible'));
      }
    }

    if (typeof gsap === 'undefined') return;

    /* ----- Stagger das rows do comparativo ----- */
    const compareCols = document.querySelectorAll('.cmp-col');
    compareCols.forEach((col) => {
      const rows = col.querySelectorAll('.cmp-row');
      if (!rows.length) return;

      ScrollTrigger.create({
        trigger: col,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          rows.forEach((row, i) => {
            setTimeout(() => row.classList.add('is-visible'), 120 + i * 90);
          });
        },
      });
    });

    /* ----- Hover spotlight nos cards comparativos ----- */
    compareCols.forEach((col) => {
      col.addEventListener('mousemove', (e) => {
        const rect = col.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        col.style.setProperty('--spot-x', `${x}%`);
        col.style.setProperty('--spot-y', `${y}%`);
      });
      col.addEventListener('mouseleave', () => {
        col.style.removeProperty('--spot-x');
        col.style.removeProperty('--spot-y');
      });
    });

    /* ----- Tabs (S3 Diferencial) ----- */
    document.querySelectorAll('[data-tabs]').forEach((tabsEl) => {
      const tabs = tabsEl.querySelectorAll('.diff-tab');
      const panels = tabsEl.querySelectorAll('.diff-panel');
      const indicator = tabsEl.querySelector('.diff-tabs__indicator');
      const total = tabs.length;

      const activate = (idx) => {
        tabs.forEach((t, i) => {
          t.classList.toggle('is-active', i === idx);
          t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
        panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
        if (indicator) {
          indicator.style.transform = `translateX(${idx * 100}%)`;
        }
      };

      tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => activate(idx));
      });

      // Auto-rotate (a cada 6s, parado no hover)
      let rotateTimer = null;
      let rotateIdx = 0;
      const startRotate = () => {
        rotateTimer = setInterval(() => {
          rotateIdx = (rotateIdx + 1) % total;
          activate(rotateIdx);
        }, 6000);
      };
      const stopRotate = () => clearInterval(rotateTimer);

      // Sincroniza rotateIdx quando user clica
      tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => { rotateIdx = idx; });
      });

      tabsEl.addEventListener('mouseenter', stopRotate);
      tabsEl.addEventListener('mouseleave', startRotate);

      ScrollTrigger.create({
        trigger: tabsEl,
        start: 'top 75%',
        once: true,
        onEnter: startRotate,
      });
    });

    /* ----- Mapa interativo (S4) ----- */
    const CLIENTS = {
      'solar-norte':     { name: 'Solar Norte',      city: 'Manaus, AM',         photo: 'https://i.pravatar.cc/120?img=52', logo: 'assets/images/site-1nort/Cliente05.webp',           fat: 'R$ 78k',  vendas: '6 vendas',  conv: '58%' },
      'raio-equatorial': { name: 'Raio Equatorial',  city: 'Belém, PA',          photo: 'https://i.pravatar.cc/120?img=63', logo: 'assets/images/site-1nort/Cliente06.webp',           fat: 'R$ 65k',  vendas: '5 vendas',  conv: '54%' },
      'lumen-solar':     { name: 'Lumen Solar',      city: 'Salvador, BA',       photo: 'https://i.pravatar.cc/120?img=23', logo: 'assets/images/site-1nort/Cliente08.webp',           fat: 'R$ 124k', vendas: '9 vendas',  conv: '63%' },
      'solis-energy':    { name: 'Solis Energy',     city: 'Recife, PE',         photo: 'https://i.pravatar.cc/120?img=68', logo: 'assets/images/site-1nort/Cliente09.webp',           fat: 'R$ 98k',  vendas: '8 vendas',  conv: '61%' },
      'gt-energia':      { name: 'GT Energia Solar', city: 'Goiânia, GO',        photo: 'https://i.pravatar.cc/120?img=47', logo: 'assets/images/site-1nort/GT-Energia-Solar.webp',    fat: 'R$ 89k',  vendas: '7 vendas',  conv: '70%' },
      'plantae':         { name: 'Plantae Soluções', city: 'Belo Horizonte, MG', photo: 'https://i.pravatar.cc/120?img=20', logo: 'assets/images/site-1nort/Plantae-solucoes.webp',    fat: 'R$ 76k',  vendas: '6 vendas',  conv: '64%' },
      'tiete-solar':     { name: 'Tietê Solar',      city: 'Tietê, SP',          photo: 'https://i.pravatar.cc/120?img=49', logo: 'assets/images/site-1nort/Tiete-Solar.webp',         fat: 'R$ 112k', vendas: '6 vendas',  conv: '65%' },
      'volt-solar':      { name: 'Volt Solar',       city: 'Curitiba, PR',       photo: 'https://i.pravatar.cc/120?img=33', logo: 'assets/images/site-1nort/Cliente07.webp',           fat: 'R$ 156k', vendas: '9 vendas',  conv: '58%' },
      'energia-sul':     { name: 'Energia Sul',      city: 'Florianópolis, SC',  photo: 'https://i.pravatar.cc/120?img=14', logo: 'assets/images/site-1nort/Cliente13.webp',           fat: 'R$ 134k', vendas: '8 vendas',  conv: '60%' },
      'eco-solar':       { name: 'EcoSolar',         city: 'Cuiabá, MT',         photo: 'https://i.pravatar.cc/120?img=44', logo: 'assets/images/site-1nort/Cliente11.webp',           fat: 'R$ 142k', vendas: '10 vendas', conv: '67%' },
    };

    const map = document.querySelector('.map');
    if (map) {
      const tooltip = map.querySelector('[data-tooltip]');
      const ttAvatar = map.querySelector('[data-tt-avatar]');
      const ttLogo = map.querySelector('[data-tt-logo]');
      const ttName = map.querySelector('[data-tt-name]');
      const ttCity = map.querySelector('[data-tt-city]');
      const ttFat = map.querySelector('[data-tt-fat]');
      const ttVendas = map.querySelector('[data-tt-vendas]');
      const ttConv = map.querySelector('[data-tt-conv]');
      const pins = map.querySelectorAll('.map__pin');

      // Posiciona a tooltip relativa ao pin (acima por padrão; abaixo se topo do mapa)
      const positionTooltip = (pin) => {
        if (!tooltip) return;
        const mapRect = map.getBoundingClientRect();
        const pinRect = pin.getBoundingClientRect();

        const pinCx = pinRect.left + pinRect.width / 2 - mapRect.left;
        const pinCy = pinRect.top + pinRect.height / 2 - mapRect.top;

        const ttW = tooltip.offsetWidth || 240;
        const ttH = tooltip.offsetHeight || 140;
        const gap = 18;

        // Vertical: tenta acima; se não couber, vai pra baixo
        let top = pinCy - ttH - gap;
        let isBelow = false;
        if (top < 8) {
          top = pinCy + gap;
          isBelow = true;
        }

        // Horizontal: centralizado, com clamp pras bordas
        let left = pinCx - ttW / 2;
        const minLeft = 8;
        const maxLeft = mapRect.width - ttW - 8;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.toggle('is-below', isBelow);

        // Realinha a setinha (pseudo-element) com o pin
        const arrowX = pinCx - left;
        tooltip.style.setProperty('--tt-arrow-x', arrowX + 'px');
      };

      const showClient = (key, pin) => {
        const c = CLIENTS[key];
        if (!c) return;
        if (ttAvatar) { ttAvatar.src = c.photo; ttAvatar.alt = c.name; }
        if (ttLogo) { ttLogo.src = c.logo; ttLogo.alt = c.name; }
        ttName.textContent = c.name;
        ttCity.textContent = c.city;
        ttFat.textContent = c.fat;
        ttVendas.textContent = c.vendas;
        ttConv.textContent = c.conv;
        if (pin) positionTooltip(pin);
        tooltip.classList.add('is-visible');
      };

      const activatePin = (pin) => {
        pins.forEach(p => p.classList.remove('is-active'));
        pin.classList.add('is-active');
        showClient(pin.dataset.client, pin);
      };

      pins.forEach((pin) => {
        pin.addEventListener('mouseenter', () => activatePin(pin));
        pin.addEventListener('focus', () => activatePin(pin));
        pin.addEventListener('click', () => activatePin(pin));
      });

      // Reposiciona tooltip quando a janela é redimensionada (preserva pin ativo)
      window.addEventListener('resize', () => {
        const active = map.querySelector('.map__pin.is-active');
        if (active && tooltip.classList.contains('is-visible')) {
          positionTooltip(active);
        }
      });

      // Mostra o featured como default
      const featured = map.querySelector('.map__pin--featured');
      if (featured) {
        // pequeno delay pra garantir que layout/img carregaram
        requestAnimationFrame(() => activatePin(featured));
      }

      // Auto-rotaciona pins quando entra na viewport (a cada 3.5s), pausa no hover
      let rotateMapTimer = null;
      let mapIdx = 0;
      const pinArr = Array.from(pins);
      const startMapRotate = () => {
        rotateMapTimer = setInterval(() => {
          mapIdx = (mapIdx + 1) % pinArr.length;
          activatePin(pinArr[mapIdx]);
        }, 3500);
      };
      const stopMapRotate = () => clearInterval(rotateMapTimer);

      map.addEventListener('mouseenter', stopMapRotate);
      map.addEventListener('mouseleave', startMapRotate);

      ScrollTrigger.create({
        trigger: map,
        start: 'top 75%',
        once: true,
        onEnter: startMapRotate,
      });
    }

    /* ----- Carrossel de cases (S4) ----- */
    document.querySelectorAll('[data-cases]').forEach((track) => {
      const grid = track.querySelector('[data-cases-grid]');
      const cards = grid ? grid.querySelectorAll('.case-card') : [];
      const prev = track.querySelector('[data-prev]');
      const next = track.querySelector('[data-next]');
      const dotsEl = track.parentElement.querySelector('[data-dots]');
      if (!cards.length) return;

      // Determina cards visíveis baseado no breakpoint
      const getPerPage = () => {
        const w = window.innerWidth;
        if (w < 600) return 1;
        if (w < 1000) return 2;
        return 4;
      };
      let perPage = getPerPage();
      let totalPages = Math.ceil(cards.length / perPage);
      let page = 0;

      const renderDots = () => {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
          const b = document.createElement('button');
          b.setAttribute('aria-label', `Página ${i + 1}`);
          if (i === page) b.classList.add('is-active');
          b.addEventListener('click', () => goTo(i));
          dotsEl.appendChild(b);
        }
      };

      const update = () => {
        cards.forEach((card, i) => {
          const cardPage = Math.floor(i / perPage);
          card.style.display = cardPage === page ? '' : 'none';
        });
        if (dotsEl) {
          dotsEl.querySelectorAll('button').forEach((b, i) => {
            b.classList.toggle('is-active', i === page);
          });
        }
      };

      const goTo = (idx) => {
        page = ((idx % totalPages) + totalPages) % totalPages;
        update();
      };

      prev && prev.addEventListener('click', () => goTo(page - 1));
      next && next.addEventListener('click', () => goTo(page + 1));

      window.addEventListener('resize', () => {
        const newPerPage = getPerPage();
        if (newPerPage !== perPage) {
          perPage = newPerPage;
          totalPages = Math.ceil(cards.length / perPage);
          page = 0;
          renderDots();
          update();
        }
      });

      renderDots();
      update();
    });

    /* ----- Lightbox: zoom em screenshots reais ----- */
    const lightbox = document.querySelector('[data-lightbox]');
    if (lightbox) {
      const lbImg = lightbox.querySelector('[data-lightbox-img]');
      const lbCaption = lightbox.querySelector('[data-lightbox-caption]');
      const lbClose = lightbox.querySelector('[data-lightbox-close]');
      const lbPrev = lightbox.querySelector('[data-lightbox-prev]');
      const lbNext = lightbox.querySelector('[data-lightbox-next]');

      // Estado da galeria atual
      let gallery = [];   // [{ src, caption }]
      let galleryIdx = 0;

      const render = () => {
        const item = gallery[galleryIdx];
        if (!item) return;
        lbImg.src = item.src;
        lbImg.alt = item.caption || '';
        if (lbCaption) lbCaption.textContent = item.caption || '';
        const showNav = gallery.length > 1;
        if (lbPrev) lbPrev.hidden = !showNav;
        if (lbNext) lbNext.hidden = !showNav;
      };

      const open = (items, startIdx) => {
        gallery = Array.isArray(items) ? items : [items];
        galleryIdx = Math.max(0, Math.min(gallery.length - 1, startIdx || 0));
        render();
        lightbox.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined' && lenis) lenis.stop();
      };

      const close = () => {
        lightbox.classList.remove('is-visible');
        document.body.style.overflow = '';
        if (typeof lenis !== 'undefined' && lenis) lenis.start();
      };

      const next = () => {
        if (gallery.length < 2) return;
        galleryIdx = (galleryIdx + 1) % gallery.length;
        render();
      };
      const prev = () => {
        if (gallery.length < 2) return;
        galleryIdx = (galleryIdx - 1 + gallery.length) % gallery.length;
        render();
      };

      // Helper: monta a galeria a partir do parent do elemento clicado
      const buildGalleryFrom = (clicked) => {
        // Procura ancestral que define a galeria (carrossel ou wrapper de zoom)
        const groupRoot = clicked.closest('[data-track], .creatives-modal__grid, .funnel-step__creatives-real');
        const items = [];
        let startIdx = 0;
        if (groupRoot) {
          const slides = Array.from(groupRoot.querySelectorAll('[data-zoom]'));
          slides.forEach((slide, i) => {
            const img = slide.querySelector('img');
            const cap = slide.querySelector('figcaption');
            if (!img) return;
            if (slide === clicked) startIdx = items.length;
            items.push({ src: img.src, caption: cap ? cap.textContent.trim() : (img.alt || '') });
          });
        }
        // fallback — só a imagem clicada
        if (!items.length) {
          const img = clicked.querySelector('img');
          const cap = clicked.querySelector('figcaption');
          if (img) items.push({ src: img.src, caption: cap ? cap.textContent.trim() : (img.alt || '') });
        }
        return { items, startIdx };
      };

      // Cada .real-shot vira clicável (galeria solo)
      document.querySelectorAll('.real-shot').forEach((shot) => {
        const img = shot.querySelector('img');
        const tag = shot.querySelector('.real-shot__tag');
        if (!img) return;
        shot.addEventListener('click', (e) => {
          if (tag && tag.contains(e.target)) return;
          const caption = tag ? tag.textContent.trim() : (img.alt || '');
          open([{ src: img.src, caption }], 0);
        });
      });

      // Slides com [data-zoom] — agrupados por carrossel
      document.querySelectorAll('[data-zoom]').forEach((slide) => {
        slide.addEventListener('click', () => {
          const { items, startIdx } = buildGalleryFrom(slide);
          if (items.length) open(items, startIdx);
        });
      });

      // Botões que abrem 1 imagem direto no lightbox (ex: "Ver conversa real")
      document.querySelectorAll('[data-conversa-img]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const src = btn.getAttribute('data-conversa-img');
          const caption = btn.getAttribute('data-conversa-caption') || '';
          if (src) open([{ src, caption }], 0);
        });
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lbImg.parentElement) close();
      });

      if (lbClose) lbClose.addEventListener('click', close);
      if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
      if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-visible')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
      });
    }

    /* ----- Chat IA animado (Seção 8) — mensagens aparecendo em loop ----- */
    document.querySelectorAll('[data-chat]').forEach((chat) => {
      const msgs = Array.from(chat.querySelectorAll('.phone-msg'));
      const typing = chat.querySelector('[data-typing]');
      if (!msgs.length) return;

      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const reset = () => {
        msgs.forEach((m) => m.classList.remove('is-shown'));
        if (typing) typing.classList.remove('is-shown');
      };

      let running = false;
      const play = async () => {
        if (running) return;
        running = true;
        // eslint-disable-next-line no-constant-condition
        while (running) {
          reset();
          await wait(400);
          for (let i = 0; i < msgs.length; i++) {
            const msg = msgs[i];
            const isIn = msg.classList.contains('phone-msg--in');
            if (isIn && typing) {
              typing.classList.add('is-shown');
              await wait(500);
              typing.classList.remove('is-shown');
              await wait(60);
            }
            msg.classList.add('is-shown');
            await wait(isIn ? 700 : 500);
          }
          await wait(2000);
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              play();
            } else {
              running = false;
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(chat);
    });

    /* ----- Carrossel de prints do sistema 1Nort (Seção 8) ----- */
    document.querySelectorAll('[data-system-carousel]').forEach((wrap) => {
      const track = wrap.querySelector('[data-track]');
      const slides = track.querySelectorAll('.ia-system__slide');
      const prev = wrap.querySelector('[data-prev]');
      const next = wrap.querySelector('[data-next]');
      const dotsWrap = wrap.parentElement.querySelector('[data-dots]');
      if (!slides.length) return;

      let idx = 0;
      const total = slides.length;

      const goTo = (i) => {
        idx = Math.max(0, Math.min(total - 1, i));
        track.style.transform = `translateX(-${idx * 100}%)`;
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx === total - 1;
        dotsWrap?.querySelectorAll('.ia-system__dot').forEach((d, i2) =>
          d.classList.toggle('is-active', i2 === idx)
        );
      };

      prev?.addEventListener('click', () => goTo(idx - 1));
      next?.addEventListener('click', () => goTo(idx + 1));

      // Dots
      if (dotsWrap) {
        slides.forEach((_, i) => {
          const b = document.createElement('button');
          b.className = 'ia-system__dot';
          if (i === 0) b.classList.add('is-active');
          b.setAttribute('aria-label', `Ir para slide ${i + 1}`);
          b.addEventListener('click', () => goTo(i));
          dotsWrap.appendChild(b);
        });
      }

      goTo(0);
    });

    /* ----- Click-and-drag em shelves horizontais (galeria de criativos S7) ----- */
    document.querySelectorAll('.creatives-gallery').forEach((shelf) => {
      let isDown = false;
      let startX = 0;
      let scrollStart = 0;
      let moved = 0;

      shelf.addEventListener('mousedown', (e) => {
        isDown = true;
        moved = 0;
        startX = e.pageX - shelf.offsetLeft;
        scrollStart = shelf.scrollLeft;
        shelf.classList.add('is-dragging');
      });
      shelf.addEventListener('mouseleave', () => {
        if (isDown) {
          isDown = false;
          shelf.classList.remove('is-dragging');
        }
      });
      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          shelf.classList.remove('is-dragging');
        }
      });
      shelf.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - shelf.offsetLeft;
        const walk = (x - startX) * 1.4;
        moved = Math.abs(walk);
        shelf.scrollLeft = scrollStart - walk;
      });
      // Bloqueia clique acidental ao final do drag
      shelf.addEventListener('click', (e) => {
        if (moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });

    /* ----- Modal Galeria de Criativos (Imagens + Vídeos · S6 Card 1) ----- */
    (function () {
      const modal = document.querySelector('[data-creatives-modal]');
      if (!modal) return;
      const openers = document.querySelectorAll('[data-open-creatives]');
      const closers = modal.querySelectorAll('[data-creatives-close]');
      const tabs = modal.querySelectorAll('.creatives-modal__tab');
      const panels = modal.querySelectorAll('.creatives-modal__panel');

      const open = () => {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      };
      const close = () => {
        modal.hidden = true;
        document.body.style.overflow = '';
      };

      openers.forEach((b) => b.addEventListener('click', open));
      closers.forEach((c) => c.addEventListener('click', close));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) close();
      });

      // Troca de tabs
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-tab');
          tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
          panels.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-panel') === target));
        });
      });

      // Troca de tabs já configurada acima — click em vídeo é tratado globalmente abaixo
    })();

    /* ----- Lazy load de <video data-src=""> via IntersectionObserver ----- */
    (function () {
      const lazyVideos = document.querySelectorAll('video[data-src]');
      if (!lazyVideos.length) return;
      const load = (vid) => {
        if (vid.dataset.loaded) return;
        vid.src = vid.getAttribute('data-src');
        vid.dataset.loaded = '1';
        vid.load();
      };
      const tryPlay = (vid) => {
        const p = vid.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      };
      if (!('IntersectionObserver' in window)) {
        lazyVideos.forEach((v) => { load(v); tryPlay(v); });
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (entry.isIntersecting) {
            load(vid);
            tryPlay(vid);
          } else if (vid.dataset.loaded) {
            vid.pause();
          }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      lazyVideos.forEach((v) => io.observe(v));
    })();

    /* ----- Handler GLOBAL: video-modal (open + close + ESC) ----- */
    (function () {
      const ytModal = document.querySelector('[data-video-modal]');
      const ytPlayer = ytModal?.querySelector('[data-video-player]');
      if (!ytModal || !ytPlayer) return;
      const openYT = (id) => {
        ytPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        ytModal.hidden = false;
        document.body.style.overflow = 'hidden';
      };
      const openVid = (src) => {
        ytPlayer.innerHTML = `<video src="${src}" controls autoplay playsinline style="width:100%;height:100%;object-fit:contain;background:#000;"></video>`;
        ytModal.hidden = false;
        document.body.style.overflow = 'hidden';
      };
      const closeVid = () => {
        ytModal.hidden = true;
        ytPlayer.innerHTML = '';
        document.body.style.overflow = '';
      };
      document.querySelectorAll('[data-cm-yt]').forEach((el) => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-cm-yt');
          if (id) openYT(id);
        });
      });
      document.querySelectorAll('[data-cm-video]').forEach((el) => {
        el.addEventListener('click', () => {
          const src = el.getAttribute('data-cm-video');
          if (src) openVid(src);
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const src = el.getAttribute('data-cm-video');
            if (src) openVid(src);
          }
        });
      });
      ytModal.querySelectorAll('[data-video-close]').forEach((el) => {
        el.addEventListener('click', closeVid);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !ytModal.hidden) closeVid();
      });
    })();

    /* ----- Funil de métricas (S12) — anima as barras e cards quando entra no viewport ----- */
    document.querySelectorAll('[data-funnel]').forEach((funnel) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              funnel.classList.add('is-visible');
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(funnel);
    });

    /* ----- Funnel sticky stacking — encolher/desbotar card anterior conforme o próximo cobre (S6) ----- */
    (function () {
      const cards = document.querySelectorAll('.funnel-card');
      if (!cards.length) return;
      const stickyTop = 80;

      const update = () => {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) {
            card.style.transform = '';
            card.style.opacity = '';
            return;
          }
          const next = cards[i + 1];
          const cardRect = card.getBoundingClientRect();
          const nextRect = next.getBoundingClientRect();
          // Quanto o próximo card já invadiu o espaço sticky deste
          const cardHeight = cardRect.height;
          const distance = nextRect.top - stickyTop; // positivo: ainda não chegou; 0: encostou; negativo: já passou
          // Progresso de cobertura: 0 (longe) → 1 (totalmente coberto)
          const progress = Math.max(0, Math.min(1, 1 - (distance / cardHeight)));
          if (progress > 0) {
            const scale = 1 - progress * 0.06;
            const opacity = 1 - progress * 0.5;
            card.style.transform = `scale(${scale})`;
            card.style.opacity = String(opacity);
          } else {
            card.style.transform = '';
            card.style.opacity = '';
          }
        });
      };

      let raf = null;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          update();
          raf = null;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    })();

    /* ----- Carrossel de vídeos depoimento + lightbox YouTube (S4) ----- */
    document.querySelectorAll('[data-videos]').forEach((wrap) => {
      const grid = wrap.querySelector('[data-videos-grid]');
      const track = wrap.querySelector('[data-videos-track]');
      const prev = wrap.querySelector('[data-prev]');
      const next = wrap.querySelector('[data-next]');
      const dotsWrap = wrap.parentElement.querySelector('[data-videos-dots]');
      const cards = track.querySelectorAll('.video-card');
      const modal = document.querySelector('[data-video-modal]');
      const player = modal?.querySelector('[data-video-player]');

      // Quantos cards cabem por página (calculado via flex-basis efetivo)
      const perPage = () => {
        if (!cards.length) return 1;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const trackWidth = grid.getBoundingClientRect().width;
        return Math.max(1, Math.round(trackWidth / (cardWidth + 24)));
      };

      let pageIdx = 0;
      const totalPages = () => Math.max(1, Math.ceil(cards.length / perPage()));

      const goTo = (idx) => {
        const total = totalPages();
        pageIdx = Math.max(0, Math.min(total - 1, idx));
        const offsetCards = pageIdx * perPage();
        const cardWidth = cards[0].getBoundingClientRect().width;
        const x = offsetCards * (cardWidth + 24);
        track.style.transform = `translateX(-${x}px)`;
        updateDots();
        updateArrows();
      };

      const updateArrows = () => {
        if (prev) prev.disabled = pageIdx === 0;
        if (next) next.disabled = pageIdx >= totalPages() - 1;
      };

      prev?.addEventListener('click', () => goTo(pageIdx - 1));
      next?.addEventListener('click', () => goTo(pageIdx + 1));

      // Dots: 1 por página
      let dots = [];
      const buildDots = () => {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        const total = totalPages();
        for (let i = 0; i < total; i++) {
          const b = document.createElement('button');
          b.className = 'videos-dots__dot';
          if (i === pageIdx) b.classList.add('is-active');
          b.setAttribute('aria-label', `Página ${i + 1}`);
          b.addEventListener('click', () => goTo(i));
          dotsWrap.appendChild(b);
        }
        dots = dotsWrap.querySelectorAll('.videos-dots__dot');
      };
      const updateDots = () => {
        dots.forEach((d, i) => d.classList.toggle('is-active', i === pageIdx));
      };
      buildDots();
      updateArrows();

      // Recalcula em resize
      let resizeT;
      window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => {
          buildDots();
          goTo(0);
        }, 150);
      });

      // Abrir lightbox YouTube
      cards.forEach((card) => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-yt');
          if (!id || !modal || !player) return;
          player.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
          modal.hidden = false;
          document.body.style.overflow = 'hidden';
        });
      });

      // Fechar lightbox
      const closeModal = () => {
        if (!modal) return;
        modal.hidden = true;
        if (player) player.innerHTML = '';
        document.body.style.overflow = '';
      };
      modal?.querySelectorAll('[data-video-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
      });
    });
  });
})();
