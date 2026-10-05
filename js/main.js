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

    /* ----- Títulos com revelação palavra a palavra ([data-reveal] > [data-reveal-words]) ----- */
    document.querySelectorAll('[data-reveal-words]').forEach((title) => {
      let i = 0;
      const wrapWords = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              const w = document.createElement('span');
              w.className = 'rw';
              const inner = document.createElement('span');
              inner.className = 'rw__in';
              inner.style.setProperty('--i', i++);
              inner.textContent = part;
              w.appendChild(inner);
              frag.appendChild(w);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1 && child.tagName !== 'BR') {
            wrapWords(child);
          }
        });
      };
      wrapWords(title);
      const holder = title.closest('[data-reveal]') || title;
      holder.style.setProperty('--sub-delay', (0.3 + i * 0.055) + 's');
    });
    const reveals = document.querySelectorAll('[data-reveal]');
    if (reveals.length) {
      if ('IntersectionObserver' in window) {
        const rio = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              rio.unobserve(entry.target);
            }
          });
        }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });   // dispara ao entrar na tela (funciona até em blocos altos)
        reveals.forEach((el) => rio.observe(el));
      } else {
        reveals.forEach((el) => el.classList.add('is-revealed'));
      }
    }

    /* ----- Etapas que acendem uma de cada vez ([data-steps-cycle]) ----- */
    document.querySelectorAll('[data-steps-cycle]').forEach((list) => {
      const sel = list.dataset.stepsCycle;   // opcional: seletor dos itens (ex.: ".track-step")
      const steps = sel ? [...list.querySelectorAll(sel)] : [...list.children];
      if (steps.length < 2 || !('IntersectionObserver' in window)) return;
      let idx = -1;
      let timer = null;
      const next = () => {
        steps.forEach((s) => s.classList.remove('is-current'));
        idx = (idx + 1) % steps.length;
        steps[idx].classList.add('is-current');
      };
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !timer) {
            setTimeout(next, 1100);
            timer = setInterval(next, 2800);
          } else if (!entry.isIntersecting && timer) {
            clearInterval(timer);
            timer = null;
          }
        });
      }, { threshold: 0.3 }).observe(list);
    });

    /* ----- Holofote que segue o mouse nos cards ([data-spotlight]) ----- */
    document.querySelectorAll('[data-spotlight]').forEach((grid) => {
      grid.addEventListener('pointermove', (e) => {
        const card = [...grid.children].find((c) => c.contains(e.target));
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* ----- Abas do "Nosso CRM" ([data-crm-tabs]) -----
       A tela só troca quando alguém clica na aba (sem troca automática). */
    document.querySelectorAll('[data-crm-tabs]').forEach((root) => {
      const tabs = [...root.querySelectorAll('[data-crm-tab]')];
      const panels = [...root.querySelectorAll('[data-crm-panel]')];
      if (!tabs.length) return;
      const show = (i) => {
        tabs.forEach((t, k) => {
          const on = k === i;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
        // celular: as abas viram uma faixa com rolagem lateral — mantém a clicada à vista
        const nav = tabs[i].parentElement;
        if (nav.scrollWidth > nav.clientWidth) {
          nav.scrollTo({ left: tabs[i].offsetLeft - nav.offsetLeft - 16, behavior: 'smooth' });
        }
      };
      tabs.forEach((t, k) => t.addEventListener('click', () => show(k)));
      show(0);
    });

    /* ----- Portal 1Nort: telas passando sozinhas (4s cada); bolinhas trocam na hora ----- */
    document.querySelectorAll('[data-portal-show]').forEach((show) => {
      const slides = [...show.querySelectorAll('.portal-slide')];
      const dots = [...show.querySelectorAll('.portal-show__dots button')];
      let idx = 0;
      let timer = null;
      const go = (i) => {
        idx = (i + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
        dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
      };
      const start = () => { if (!timer) timer = setInterval(() => go(idx + 1), 4000); };
      const stop = () => { clearInterval(timer); timer = null; };
      dots.forEach((d, k) => d.addEventListener('click', () => { go(k); stop(); start(); }));
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.2 }).observe(show);
      } else { start(); }
    });

    /* ----- Números da calculadora "pulam" quando o valor muda ----- */
    document.querySelectorAll('[data-calc-out]').forEach((el) => {
      new MutationObserver(() => {
        el.classList.remove('is-bump');
        void el.offsetWidth;                   // reinicia a animação
        el.classList.add('is-bump');
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });

    /* ----- Contador dos números (ex.: stats do Instagram) ----- */
    const counters = document.querySelectorAll('[data-count-to]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
      const runCount = (el) => {
        const to = parseInt(el.dataset.countTo, 10);
        const prefix = el.dataset.countPrefix || '';
        const suffix = el.dataset.countSuffix || '';
        const dur = 1800;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(to * eased).toLocaleString('pt-BR') + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach((el) => {
        el.textContent = (el.dataset.countPrefix || '') + '0' + (el.dataset.countSuffix || '');
        cio.observe(el);
      });
    }


    /* ----- Seletor de área de atuação ([data-area-set]) -----
       Troca público, quiz, conversa da IA e notificações.
       ?area=bancario na URL já abre na área (script no <head>). */
    (function () {
      const root = document.documentElement;
      const btns = [...document.querySelectorAll('[data-area-set]')];
      const sync = (area) => {
        btns.forEach((b) => {
          const on = b.getAttribute('data-area-set') === area;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      };
      const setArea = (area) => {
        if (root.getAttribute('data-area') === area) return;
        root.setAttribute('data-area', area);
        sync(area);
        try {
          const u = new URL(window.location.href);
          u.searchParams.set('area', area);
          history.replaceState(null, '', u);
        } catch (e) {}
        document.dispatchEvent(new CustomEvent('area:change', { detail: area }));
        if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      btns.forEach((b) => b.addEventListener('click', () => setArea(b.getAttribute('data-area-set'))));

      // Abas do portal: trocam a tela e acompanham o carrossel automático
      document.querySelectorAll('.portal-wrap').forEach((wrap) => {
        const tabs = [...wrap.querySelectorAll('[data-portal-go]')];
        const dots = [...wrap.querySelectorAll('.portal-show__dots button')];
        const slides = [...wrap.querySelectorAll('.portal-slide')];
        const sync = () => {
          const i = slides.findIndex((sl) => sl.classList.contains('is-active'));
          tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        };
        tabs.forEach((t) => t.addEventListener('click', () => { const d = dots[+t.getAttribute('data-portal-go')]; if (d) d.click(); sync(); }));
        slides.forEach((sl) => new MutationObserver(sync).observe(sl, { attributes: true, attributeFilter: ['class'] }));
      });

      // "veja os planos" na proposta abre direto a aba Valores do CRM
      document.querySelectorAll('[data-crm-open]').forEach((a) => {
        a.addEventListener('click', () => {
          const tab = document.querySelector('[data-crm-tab="' + a.getAttribute('data-crm-open') + '"]');
          if (tab) tab.click();
        });
      });
      sync(root.getAttribute('data-area') || 'reclamante');
    })();

    /* ----- Calculadora de investimento (Métricas) -----
       Mantidos CPL e taxas, dobrar o investimento dobra o volume (CAC constante). */
    (function () {
      const sec  = document.getElementById('metricas');
      const root = sec && sec.querySelector('[data-calc]');
      if (!sec || !root) return;

      const DIAS_MES = 30;
      const CPL_MIN  = 12;    // R$/contato no melhor caso
      const CPL_MAX  = 15;    // R$/contato no pior caso
      const CAC      = 171;   // custo por contrato fechado
      const TX = { resp: 0.8, oport: 0.5, agend: 0.3, realiz: 0.21, contMin: 0.05, contMax: 0.10 };  // 100 → 80 → 50 → 30 → 21 → 5 a 10

      const INVEST = { min: 30,  max: 300,   step: 10,  valor: 40 };
      const TICKET = { min: 500, max: 20000, step: 500, valor: 1500 };

      const br  = (n) => n.toLocaleString('pt-BR');
      const mil = (n) => 'R$ ' + (n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
      const alvoDe = (nome) => (nome === 'invest' ? INVEST : TICKET);
      const outs = {};
      sec.querySelectorAll('[data-calc-out]').forEach((el) => { outs[el.getAttribute('data-calc-out')] = el; });

      const render = () => {
        const mensal   = INVEST.valor * DIAS_MES;
        const leadsMin = Math.round(mensal / CPL_MAX);
        const leadsMax = Math.round(mensal / CPL_MIN);
        const faixa = (t) => br(Math.round(leadsMin * t)) + ' a ' + br(Math.round(leadsMax * t));
        const cMin = Math.max(1, Math.round(leadsMin * TX.contMin));
        const cMax = Math.max(cMin, Math.round(leadsMax * TX.contMax));
        const set = (k, txt) => { if (outs[k] && outs[k].textContent !== txt) outs[k].textContent = txt; };

        set('invest', br(INVEST.valor));
        set('mensal', 'R$ ' + br(mensal));
        set('ticket', (TICKET.valor / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }));
        set('leads', br(leadsMin) + ' a ' + br(leadsMax));
        set('resp',  faixa(TX.resp));
        set('oport', faixa(TX.oport));
        set('agend', faixa(TX.agend));
        set('realiz', faixa(TX.realiz));
        set('vendas', cMin === cMax ? br(cMin) : br(cMin) + ' a ' + br(cMax));
        set('cac', br(Math.round(mensal / cMax)) + ' a ' + br(Math.round(mensal / cMin)));
        set('fat', mil(cMin * TICKET.valor) + ' a ' + mil(cMax * TICKET.valor));

        root.querySelectorAll('[data-calc-step]').forEach((b) => {
          const alvo = alvoDe(b.getAttribute('data-calc-step'));
          const prox = alvo.valor + Number(b.getAttribute('data-calc-dir')) * alvo.step;
          b.disabled = prox < alvo.min || prox > alvo.max;
        });
        const lim = root.querySelector('[data-calc-limit="invest"]');
        if (lim) lim.textContent = INVEST.valor <= INVEST.min ? 'mínimo R$ 30/dia'
                               : INVEST.valor >= INVEST.max ? 'máximo R$ 300/dia' : '';
      };

      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-calc-step]');
        if (!btn || btn.disabled) return;
        const alvo = alvoDe(btn.getAttribute('data-calc-step'));
        const prox = alvo.valor + Number(btn.getAttribute('data-calc-dir')) * alvo.step;
        if (prox < alvo.min || prox > alvo.max) return;
        alvo.valor = prox;
        render();
      });
      render();
    })();

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
      const isShowcase = chat.classList.contains('ia-conversation__messages');
      if (!msgs.length) return;

      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const scrollShowcaseTo = (element) => {
        if (!isShowcase || !element) return;
        requestAnimationFrame(() => {
          const elementBottom = element.offsetTop + element.offsetHeight;
          const nextScrollTop = Math.max(0, elementBottom - chat.clientHeight + 18);
          chat.scrollTo({ top: nextScrollTop, behavior: 'smooth' });
        });
      };
      const reset = () => {
        msgs.forEach((m) => {
          m.classList.remove('is-shown');
          if (isShowcase) m.hidden = true;
        });
        if (typing) {
          typing.classList.remove('is-shown');
          if (isShowcase) typing.hidden = true;
        }
        if (isShowcase) chat.scrollTo({ top: 0, behavior: 'auto' });
      };

      let running = false;
      let gen = 0;                 // cada execução tem um id; troca de área invalida a anterior
      const play = async () => {
        if (running) return;
        running = true;
        const my = ++gen;
        const wait = (ms) => new Promise((r) => setTimeout(r, ms)).then(() => { if (my !== gen) throw 0; });
        try {
        // eslint-disable-next-line no-constant-condition
        while (running) {
          reset();
          await wait(isShowcase ? 700 : 400);
          for (let i = 0; i < msgs.length; i++) {
            const msg = msgs[i];
            const isIn = msg.classList.contains('phone-msg--in');
            if (isIn && typing && isShowcase) {
              typing.hidden = false;
              typing.classList.add('is-shown');
              scrollShowcaseTo(typing);
              const typingDelay = Math.min(1700, Math.max(900, 550 + msg.textContent.trim().length * 6));
              await wait(typingDelay);
              typing.classList.remove('is-shown');
              typing.hidden = true;
              await wait(140);
            } else if (isIn && typing) {
              typing.classList.add('is-shown');
              await wait(500);
              typing.classList.remove('is-shown');
              await wait(60);
            }
            if (isShowcase) {
              msg.hidden = false;
              void msg.offsetHeight;
            }
            msg.classList.add('is-shown');
            scrollShowcaseTo(msg);
            const readingDelay = isShowcase
              ? Math.min(2600, Math.max(900, 700 + msg.textContent.trim().length * 11))
              : (isIn ? 700 : 500);
            await wait(readingDelay);
          }
          if (isShowcase) {
            running = false;
            return;
          }
          await wait(2000);
        }
        } catch (e) { /* execução cancelada */ }
      };
      const stop = () => { running = false; gen++; };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              play();
            } else {
              stop();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(chat);
      // conversa da área que ficou visível recomeça do zero
      document.addEventListener('area:change', () => {
        stop();
        reset();
        if (chat.offsetParent !== null) {
          const r = chat.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) play();
        }
      });
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

      const selectTab = (target) => {
        tabs.forEach((t) => t.classList.toggle('is-active', t.getAttribute('data-tab') === target));
        panels.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-panel') === target));
      };
      const open = () => {
        const area = document.documentElement.getAttribute('data-area') || 'reclamante';
        selectTab(['previdenciario', 'bancario', 'consumidor'].includes(area) ? 'vids' : 'imgs');
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
        tab.addEventListener('click', () => selectTab(tab.getAttribute('data-tab')));
      });

      // Troca de tabs já configurada acima — click em vídeo é tratado globalmente abaixo
    })();

    /* ----- Autoplay dos vídeos SÓ quando o card entra na viewport (play-on-viewport) ----- */
    (function () {
      const lazyVideos = document.querySelectorAll('video[data-src]:not([data-manual-play])');
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
        // fallback: só carrega os primeiros, deixa o resto pro clique
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
      }, { rootMargin: '0px', threshold: 0.35 });
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
