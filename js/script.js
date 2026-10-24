/* Максим и Мария — таймер обратного отсчёта + появление секций */

(function () {
  'use strict';

  /* ---------- Обратный отсчёт до 10 июля 2027, 00:00 (Алтай, UTC+7) ---------- */

  var TARGET = new Date('2027-07-10T00:00:00+07:00').getTime();

  var els = {
    d: document.getElementById('t-days'),
    h: document.getElementById('t-hours'),
    m: document.getElementById('t-mins'),
    s: document.getElementById('t-secs'),
    dl: document.getElementById('l-days'),
    hl: document.getElementById('l-hours'),
    ml: document.getElementById('l-mins'),
    sl: document.getElementById('l-secs')
  };

  /* Русская плюрализация: plural(5, ['день','дня','дней']) -> 'дней' */
  function plural(n, forms) {
    var a = Math.abs(n) % 100;
    var b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function render() {
    var diff = TARGET - Date.now();

    if (diff <= 0) {
      els.d.textContent = '0';
      els.h.textContent = '00';
      els.m.textContent = '00';
      els.s.textContent = '00';
      els.dl.textContent = 'дней';
      els.hl.textContent = 'часов';
      els.ml.textContent = 'минут';
      els.sl.textContent = 'секунд';
      if (timerId) { clearInterval(timerId); timerId = null; }
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor(diff / 3600000) % 24;
    var mins = Math.floor(diff / 60000) % 60;
    var secs = Math.floor(diff / 1000) % 60;

    els.d.textContent = String(days);
    els.h.textContent = pad(hours);
    els.m.textContent = pad(mins);
    els.s.textContent = pad(secs);

    els.dl.textContent = plural(days, ['день', 'дня', 'дней']);
    els.hl.textContent = plural(hours, ['час', 'часа', 'часов']);
    els.ml.textContent = plural(mins, ['минута', 'минуты', 'минут']);
    els.sl.textContent = plural(secs, ['секунда', 'секунды', 'секунд']);
  }

  render();
  var timerId = setInterval(render, 1000);

  /* ---------- Появление секций при скролле ---------- */

  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
