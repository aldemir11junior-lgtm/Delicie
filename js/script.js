(() => {
  'use strict';

  /* =====================================================
     CONFIGURAÇÃO — troque pelo WhatsApp real da Deliciê
     Formato: 55 + DDD + número (somente dígitos)
     ===================================================== */
  const WHATSAPP_NUMBER = '5567991747474';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const waLink = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  /* ---------- Links de WhatsApp (data-wa) ---------- */
  $$('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Ano no rodapé ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Header: sombra ao rolar ---------- */
  const header = $('#header');
  const root = document.documentElement;
  let ticking = false;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
    // progresso da "folha" subindo sobre a primeira tela (0 → 1)
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const p = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.85), 0), 1);
        root.style.setProperty('--p', p.toFixed(3));
        ticking = false;
      });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Menu mobile ---------- */
  const burger = $('#burger');
  const menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.innerHTML = `<svg class="ic"><use href="#${open ? 'i-close' : 'i-menu'}"/></svg>`;
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- "Início" e logo: voltar ao topo ----------
     A primeira tela é sticky (fica presa no topo para a folha subir por cima),
     então o navegador acha que ela já está visível e não rola. Rolamos manualmente. */
  $$('a[href="#inicio"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
  }));

  /* ---------- Menu: destaca a seção visível ---------- */
  const navLinks = $$('.menu a[href^="#"]');
  const ativar = id => navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && window.scrollY > window.innerHeight * 0.4) ativar(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => {
    const id = a.getAttribute('href');
    const sec = id !== '#inicio' && $(id);   // a primeira tela é sticky: tratada pela rolagem abaixo
    if (sec) spy.observe(sec);
  });
  // "Para festas e eventos" faz parte do cardápio: destaca "Cardápio" no menu
  const caixas = $('#caixas');
  if (caixas) {
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) ativar('cardapio'); });
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(caixas);
  }
  window.addEventListener('scroll', () => {
    if (window.scrollY <= window.innerHeight * 0.4) ativar('inicio');
  }, { passive: true });

  /* ---------- Primeira tela: pontinhos de luz subindo ---------- */
  const sparkles = $('.sparkles');
  if (sparkles) {
    const n = window.innerWidth < 620 ? 18 : 34;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--s', (2 + Math.random() * 3).toFixed(1) + 'px');
      p.style.animationDuration = 10 + Math.random() * 12 + 's';
      p.style.animationDelay = -Math.random() * 20 + 's';
      sparkles.appendChild(p);
    }
  }

  /* ---------- Partículas flutuantes (corações e flores) ---------- */
  $$('.floaties').forEach(box => {
    const icons = ['❤', '✿', '❀', '♥'];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.className = 'floaty';
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 100 + '%';
      s.style.fontSize = 14 + Math.random() * 26 + 'px';
      s.style.animationDuration = 9 + Math.random() * 10 + 's';
      s.style.animationDelay = -Math.random() * 14 + 's';
      box.appendChild(s);
    }
  });

  /* ---------- NATAL: contagem regressiva ---------- */
  const cd = $('#countdown');
  if (cd) {
    const now0 = new Date();
    // depois do dia 25, conta para o Natal do ano seguinte
    let year = now0.getFullYear();
    if (now0 >= new Date(year, 11, 26)) year++;
    const xmas = new Date(year, 11, 25, 0, 0, 0);
    const els = { d: $('#cd-d'), h: $('#cd-h'), m: $('#cd-m'), s: $('#cd-s') };
    const pad = v => String(v).padStart(2, '0');
    const set = (el, v) => { if (el.textContent !== v) el.textContent = v; };
    const update = () => {
      const diff = xmas - new Date();
      if (diff <= 0) {
        $('.cd-title', cd).textContent = 'Feliz Natal!';
        $('.cd-grid', cd).style.display = 'none';
        clearInterval(timer);
        return;
      }
      set(els.d, pad(Math.floor(diff / 864e5)));
      set(els.h, pad(Math.floor(diff / 36e5) % 24));
      set(els.m, pad(Math.floor(diff / 6e4) % 60));
      set(els.s, pad(Math.floor(diff / 1e3) % 60));
    };
    const timer = setInterval(update, 1000);
    update();
  }

  /* ---------- Revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Contadores ---------- */
  const counters = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = +el.dataset.to;
      const dur = 1400;
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach(el => counters.observe(el));

  /* ---------- Filtro do cardápio ---------- */
  const tabs = $$('.tab');
  const cards = $$('.card');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    let i = 0;
    cards.forEach(c => {
      const show = f === 'todos' || c.dataset.cat.split(' ').includes(f);
      c.classList.toggle('hide', !show);
      if (show) {
        c.style.animation = 'none';
        void c.offsetWidth; // reinicia a animação
        c.style.animation = `cardIn .5s ${i++ * 0.06}s both`;
      }
    });
  }));

  /* ---------- Galeria horizontal: rola para baixo, as fotos andam para o lado ----------
     Adaptado de "Galeria horizontal" (Não Codei). O palco fica preso (sticky) enquanto a
     fita percorre toda a largura; a altura da seção = distância horizontal a percorrer. */
  const hgal = $('#hgal');
  const track = $('#hgalTrack');
  const bar = $('#hgalBar');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hgal && track && !reduce) {
    let curso = 0;
    const medir = () => {
      curso = Math.max(0, track.scrollWidth - window.innerWidth);
      hgal.style.height = (curso + window.innerHeight) + 'px';
      mover();
    };
    const mover = () => {
      const total = hgal.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-hgal.getBoundingClientRect().top / total, 0), 1) : 0;
      track.style.transform = `translate3d(${-p * curso}px,0,0)`;
      if (bar) bar.parentElement.style.setProperty('--gp', p.toFixed(3));
    };
    let pend = false;
    window.addEventListener('scroll', () => {
      if (pend) return;
      pend = true;
      requestAnimationFrame(() => { mover(); pend = false; });
    }, { passive: true });
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
    medir();
  }

  /* ---------- Horários de funcionamento (aberto agora / fechado) ----------
     Horários informados pela Deliciê: Seg–Sex 07h–19h | Sáb 08h–16h.
     Formato: dia da semana (0 = domingo ... 6 = sábado) → ['abre', 'fecha'] ou null se fechado. */
  const HORARIOS = {
    0: null,              // Domingo
    1: ['07:00', '19:00'],// Segunda
    2: ['07:00', '19:00'],// Terça
    3: ['07:00', '19:00'],// Quarta
    4: ['07:00', '19:00'],// Quinta
    5: ['07:00', '19:00'],// Sexta
    6: ['08:00', '16:00'] // Sábado
  };
  const vDias = $('#vDias');
  if (vDias) {
    const nomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const letras = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const ordem = [1, 2, 3, 4, 5, 6, 0];          // começa na segunda
    const ESC_INI = 6 * 60, ESC_FIM = 22 * 60;    // escala da barra: 06:00 → 22:00
    const min = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
    const pct = m => Math.min(Math.max((m - ESC_INI) / (ESC_FIM - ESC_INI) * 100, 0), 100) + '%';
    const status = $('#vStatus'), statusTxt = $('#vStatusTxt');
    const vDia = $('#vDia'), vHr = $('#vHr'), barra = $('#vBarra');
    let sel = new Date().getDay();

    ordem.forEach(d => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = letras[d];
      b.dataset.d = d;
      b.setAttribute('aria-label', nomes[d]);
      b.addEventListener('click', () => { sel = d; render(); });
      vDias.appendChild(b);
    });

    const proxAbertura = (agoraD, agoraM) => {
      for (let i = 0; i < 8; i++) {
        const d = (agoraD + i) % 7, h = HORARIOS[d];
        if (h && (i > 0 || agoraM < min(h[0]))) {
          const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : nomes[d].toLowerCase();
          return `abre ${quando} às ${h[0]}`;
        }
      }
      return '';
    };

    const render = () => {
      const now = new Date(), hoje = now.getDay(), agoraM = now.getHours() * 60 + now.getMinutes();
      // status ao vivo
      const hh = HORARIOS[hoje];
      const aberto = hh && agoraM >= min(hh[0]) && agoraM < min(hh[1]);
      status.classList.toggle('aberto', !!aberto);
      status.classList.toggle('fechado', !aberto);
      statusTxt.textContent = aberto ? `Aberto agora · fecha às ${hh[1]}` : `Fechado · ${proxAbertura(hoje, agoraM)}`;
      // dia selecionado
      $$('button', vDias).forEach(b => {
        const d = +b.dataset.d;
        b.classList.toggle('sel', d === sel);
        b.classList.toggle('hoje', d === hoje);
        b.setAttribute('aria-pressed', d === sel);
      });
      const h = HORARIOS[sel];
      vDia.textContent = (sel === hoje ? 'Hoje · ' : '') + nomes[sel];
      vHr.textContent = h ? `${h[0]} às ${h[1]}` : 'Fechado';
      barra.style.setProperty('--a', h ? pct(min(h[0])) : '0%');
      barra.style.setProperty('--f', h ? pct(min(h[1])) : '0%');
      barra.style.setProperty('--n', pct(agoraM));
      barra.classList.toggle('mostra-agora', sel === hoje);
    };
    render();
    setInterval(render, 60000);
  }

  /* ---------- Lightbox da galeria ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
  $$('.g-item').forEach(b => b.addEventListener('click', () => {
    lbImg.src = b.dataset.src;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }));
  lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); setMenu(false); } });

  /* ---------- FAQ: abre um por vez ---------- */
  const items = $$('.acc details');
  items.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));
})();
