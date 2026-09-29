/* ==========================================================================
   Tecla Tum Foundation — interactions
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('siteNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

      revealables.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- 4. Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600;
      var start = null;

      if (reduceMotion) {
        el.textContent = target.toLocaleString('en-KE') + suffix;
        return;
      }

      var step = function (ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString('en-KE') + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('en-KE') + suffix;
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- 5. Contact form ---------- */
  var form = document.getElementById('inquiryForm');
  if (form) {
    var success = document.getElementById('formSuccess');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      /* Replace this block with a real endpoint (Formspree / Netlify / API) */
      window.setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
        form.reset();
        if (success) {
          success.classList.add('is-visible');
          success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
      }, 900);
    });
  }

  /* ---------- 6. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
})();

(function(){
  var carousel = document.getElementById('leadCarousel');
  if(!carousel) return;

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.lead-slide'));
  var dotsWrap = document.getElementById('leadDots');
  var current = 0;
  var timer = null;
  var DELAY = 4500;

  slides.forEach(function(_, i){
    var b = document.createElement('button');
    b.className = 'lead-dot';
    b.type = 'button';
    b.setAttribute('aria-label', 'Show leadership slide ' + (i + 1));
    b.addEventListener('click', function(){ go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function render(){
    slides.forEach(function(s, i){
      s.classList.remove('is-center','is-left','is-right','is-hidden');
      var diff = (i - current + slides.length) % slides.length;
      if (diff === 0) s.classList.add('is-center');
      else if (diff === 1) s.classList.add('is-right');
      else if (diff === slides.length - 1) s.classList.add('is-left');
      else s.classList.add('is-hidden');
    });
    dots.forEach(function(d, i){
      d.classList.toggle('is-active', i === current);
    });
  }

  function go(i){ current = (i + slides.length) % slides.length; render(); }
  function next(){ go(current + 1); }
  function start(){ timer = setInterval(next, DELAY); }
  function restart(){ clearInterval(timer); start(); }

  carousel.addEventListener('mouseenter', function(){ clearInterval(timer); });
  carousel.addEventListener('mouseleave', start);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  render();
  if (!reduce) start();
})();