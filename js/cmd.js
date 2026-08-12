/* ============================================================
   CMD Mudanzas — interacción
   Sin dependencias. Todo degrada a HTML funcional sin JS.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '5491127142006';

  /* ============================================================
     MEDICIÓN DE CONVERSIONES — Google Ads (AW-11228584141)

     Todas las conversiones de este sitio son clics salientes o el envío
     del cotizador. No hay página de gracias, así que la detección
     automática de Google no serviría: los eventos se disparan acá.

     Cada acción se cuenta UNA vez por sesión. Si alguien vuelve a tocar
     WhatsApp diez minutos después sigue siendo el mismo lead, y contarlo
     de nuevo infla las conversiones y hace que la puja optimice mal.
     ============================================================ */
  var CONV = {
    cotizador: 'AW-11228584141/laW7CJ7p1uAcEM2xmuop',
    whatsapp:  'AW-11228584141/iEFNCLjj1-AcEM2xmuop',
    llamada:   ''   // pendiente: falta crear la acción CMD – Llamada en Google Ads
  };

  var yaContado = {};

  function convertir(clave) {
    var destino = CONV[clave];
    if (!destino) return;                 // label sin cargar: no dispara nada
    if (yaContado[clave]) return;         // una por sesión
    yaContado[clave] = true;
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', {
      send_to: destino,
      value: 1.0,
      currency: 'ARS',
      // beacon sobrevive a que el usuario abandone la pestaña
      transport_type: 'beacon'
    });
  }

  /* Delegación: cubre también los enlaces que se generan después,
     y los de las 114 subpáginas sin tener que engancharlos uno por uno. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp.com') > -1) {
      convertir('whatsapp');
    } else if (href.indexOf('tel:') === 0) {
      convertir('llamada');
    }
  }, true);

  /* ---------- SVG decorativos: fuera del árbol de accesibilidad ----------
     Los que sí comunican algo llevan role="img" + aria-label en el markup. */
  document.querySelectorAll('svg:not([role]):not([aria-label])').forEach(function (s) {
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
  });

  /* ---------- Año en el footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header sticky ---------- */
  var hdr = document.getElementById('hdr');
  var onScroll = function () {
    if (hdr) hdr.classList.toggle('is-stuck', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var drawerClose = document.getElementById('drawerClose');

  function setDrawer(open) {
    if (!drawer || !burger) return;
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = drawer.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    } else {
      burger.focus({ preventScroll: true });
    }
  }

  if (burger) burger.addEventListener('click', function () {
    setDrawer(!drawer.classList.contains('is-open'));
  });
  if (drawerClose) drawerClose.addEventListener('click', function () { setDrawer(false); });
  if (drawer) drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setDrawer(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (drawer && drawer.classList.contains('is-open')) setDrawer(false);
      if (fab && fab.classList.contains('is-open')) closeFab();
    }
  });

  /* ---------- Reveal al scroll ---------- */
  var revealables = document.querySelectorAll('.rv, .sec-head, .map-wrap, .share-stage, .proc, .svc, .faq');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Longitud real de trazos SVG (para el dibujado) ---------- */
  document.querySelectorAll('.ico-draw, .mp-country, .mp-route, .sh-meter, .proc__prog, .mark svg path')
    .forEach(function (node) {
      var targets = node.tagName.toLowerCase() === 'svg'
        ? node.querySelectorAll('path,circle,rect,line,polyline')
        : [node];
      Array.prototype.forEach.call(targets, function (el) {
        if (typeof el.getTotalLength !== 'function') return;
        try {
          var len = Math.ceil(el.getTotalLength());
          if (!len) return;
          el.style.setProperty('--len', len);
          el.style.strokeDasharray = len;
          if (!el.classList.contains('sc-route') && !el.classList.contains('lf-guide')) {
            el.style.strokeDashoffset = len;
          }
        } catch (err) { /* getTotalLength no soportado en este nodo */ }
      });
    });

  /* ---------- Contadores animados ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var sep = el.dataset.sep === '1';
    var dur = 1400;
    var t0 = performance.now();

    function fmt(n) {
      var v = Math.round(n);
      return (sep ? v.toLocaleString('es-AR') : String(v)) + suffix;
    }
    function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ioC = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        animateCount(en.target);
        ioC.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { ioC.observe(el); });
  }

  /* ---------- Marquee: duplicar el contenido para loop continuo ---------- */
  var mq = document.getElementById('marquee');
  if (mq && !reduceMotion) mq.innerHTML += mq.innerHTML;

  /* ---------- Índice de localidades ----------
     Los enlaces se generan en build (build/generar.py) y viajan en el HTML,
     no acá, para que los rastreadores los vean sin ejecutar JavaScript. */

  /* ---------- Toasts ---------- */
  var toastsEl = document.getElementById('toasts');
  function toast(msg, type) {
    if (!toastsEl) return;
    var t = document.createElement('div');
    t.className = 'toast' + (type === 'error' ? ' toast--err' : '');
    t.innerHTML = (type === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>')
      + '<span></span>';
    t.querySelector('span').textContent = msg;
    toastsEl.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-out');
      setTimeout(function () { t.remove(); }, 320);
    }, 4600);
  }

  /* ---------- Formulario del cotizador ---------- */
  var form = document.getElementById('cotizador');

  function fieldOf(input) { return input.closest('.field'); }

  function showError(input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.add('has-err');
    input.setAttribute('aria-invalid', 'true');
    var slot = f.querySelector('.err span:last-child');
    if (slot) slot.textContent = msg;
  }
  function clearError(input) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.remove('has-err');
    input.removeAttribute('aria-invalid');
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v); }
  function validPhone(v) { return (v.replace(/\D/g, '').length >= 8); }

  if (form) {
    // Limpia el error apenas el usuario corrige
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { clearError(el); });
      el.addEventListener('change', function () { clearError(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      var firstBad = null;

      ['f-nombre', 'f-tel', 'f-origen', 'f-destino', 'f-tipo'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (!el.value.trim()) {
          showError(el, 'Completá este campo para poder cotizar.');
          ok = false;
          firstBad = firstBad || el;
        } else {
          clearError(el);
        }
      });

      var tel = document.getElementById('f-tel');
      if (tel && tel.value.trim() && !validPhone(tel.value)) {
        showError(tel, 'Ingresá un teléfono válido, con característica.');
        ok = false; firstBad = firstBad || tel;
      }

      var mail = document.getElementById('f-email');
      if (mail && mail.value.trim() && !validEmail(mail.value)) {
        showError(mail, 'Revisá el email: parece incompleto.');
        ok = false; firstBad = firstBad || mail;
      }

      if (!ok) {
        toast('Faltan datos para poder cotizar.', 'error');
        if (firstBad) firstBad.focus({ preventScroll: false });
        return;
      }

      var btn = document.getElementById('submitBtn');
      var txt = document.getElementById('submitTxt');
      var original = txt ? txt.textContent : '';
      if (btn) { btn.classList.add('is-loading'); btn.disabled = true; }
      if (txt) txt.textContent = 'Preparando tu consulta…';

      var extras = Array.prototype.map.call(
        form.querySelectorAll('input[name="extra"]:checked'),
        function (c) { return c.value; }
      );

      var val = function (id) {
        var el = document.getElementById(id);
        return el && el.value.trim() ? el.value.trim() : '';
      };

      var lines = [
        '*Nueva consulta de mudanza — cmdmudanzas.com*',
        '',
        '*Nombre:* ' + val('f-nombre'),
        '*Teléfono:* ' + val('f-tel')
      ];
      if (val('f-email'))  lines.push('*Email:* ' + val('f-email'));
      lines.push('*Origen:* ' + val('f-origen'));
      lines.push('*Destino:* ' + val('f-destino'));
      lines.push('*Tipo:* ' + val('f-tipo'));
      if (val('f-fecha'))  lines.push('*Fecha estimada:* ' + val('f-fecha'));
      if (extras.length)   lines.push('*Adicionales:* ' + extras.join(', '));
      if (val('f-detalle')) lines.push('', '*Detalles:* ' + val('f-detalle'));

      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));

      // El formulario validado es la conversión de mayor intención del sitio.
      // Se cuenta acá y no en el clic del botón, para no contar intentos fallidos.
      convertir('cotizador');

      setTimeout(function () {
        window.open(url, '_blank', 'noopener');
        toast('Listo. Te abrimos WhatsApp con la consulta cargada.');
        form.reset();
        if (btn) { btn.classList.remove('is-loading'); btn.disabled = false; }
        if (txt) txt.textContent = original;
      }, 700);
    });
  }

  /* ---------- Banner WhatsApp inferior ---------- */
  var waBar = document.getElementById('waBar');
  var waClose = document.getElementById('waBarClose');
  var fab = document.getElementById('fab');
  var DISMISS_KEY = 'cmd.waBar.dismissed';
  var flashTimer = null;

  function raiseFab(on) { if (fab) fab.classList.toggle('is-raised', on); }

  function showWaBar() {
    if (!waBar) return;
    waBar.classList.add('is-show');
    raiseFab(true);
    if (reduceMotion) return;
    flashTimer = setInterval(function () {
      if (!waBar.classList.contains('is-show')) return;
      waBar.classList.add('is-flash');
      setTimeout(function () { waBar.classList.remove('is-flash'); }, 3800);
    }, 22000);
  }

  var dismissed = false;
  try { dismissed = sessionStorage.getItem(DISMISS_KEY) === '1'; } catch (err) { /* sin storage */ }

  if (waBar && !dismissed) setTimeout(showWaBar, 8000);

  if (waClose) waClose.addEventListener('click', function () {
    waBar.classList.remove('is-show');
    raiseFab(false);
    if (flashTimer) clearInterval(flashTimer);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (err) { /* sin storage */ }
  });

  /* ---------- FAB abanico ---------- */
  var fabMain = document.getElementById('fabMain');
  var fabOpts = fab ? fab.querySelectorAll('.fab__opt') : [];
  var autoCloseTimer = null;
  var isOpen = false;

  function setOptsFocusable(on) {
    Array.prototype.forEach.call(fabOpts, function (a) {
      a.setAttribute('tabindex', on ? '0' : '-1');
    });
  }

  function openFab() {
    if (!fab) return;
    isOpen = true;
    fab.classList.add('is-open');
    if (fabMain) {
      fabMain.setAttribute('aria-expanded', 'true');
      fabMain.setAttribute('aria-label', 'Cerrar opciones de contacto');
    }
    setOptsFocusable(true);
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeFab, 6000);
  }

  function closeFab() {
    if (!fab) return;
    isOpen = false;
    fab.classList.remove('is-open');
    if (fabMain) {
      fabMain.setAttribute('aria-expanded', 'false');
      fabMain.setAttribute('aria-label', 'Abrir opciones de contacto');
    }
    setOptsFocusable(false);
    clearTimeout(autoCloseTimer);
  }

  if (fabMain) fabMain.addEventListener('click', function () {
    isOpen ? closeFab() : openFab();
  });

  document.addEventListener('click', function (e) {
    if (isOpen && fab && !fab.contains(e.target)) closeFab();
  });

  Array.prototype.forEach.call(fabOpts, function (a) {
    a.addEventListener('click', closeFab);
  });

  // Una sola apertura automática, para mostrar que existe. Sin loop molesto.
  if (fab && !reduceMotion) {
    setTimeout(function () {
      if (isOpen) return;
      openFab();
      setTimeout(closeFab, 2600);
    }, 2400);
  }

  /* ---------- Scroll suave con offset del header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Nav: sección activa ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    var ioN = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (l) {
          if (l.getAttribute('href') === '#' + id) l.setAttribute('aria-current', 'page');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { ioN.observe(s); });
  }

})();
