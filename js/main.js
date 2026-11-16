(function () {
  const WA = '905332964610';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // header
  const header = $('.header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile menu
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => { nav.classList.toggle('open'); burger.classList.toggle('x'); });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.classList.remove('x'); }));

  // active nav link
  const links = $$('#nav a:not(.btn)');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => so.observe(s));

  // reveal
  const ro = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; ro.observe(el); });

  // filters
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.toggle('on', x === c));
    const f = c.dataset.f;
    $$('.card').forEach(card => card.classList.toggle('hide', f !== 'all' && !card.dataset.m.split(' ').includes(f)));
  }));

  // card CTA -> preselect coating in form
  $$('.card-cta').forEach(a => a.addEventListener('click', () => {
    const sel = $('#f-kap'), want = a.dataset.wa.toLocaleLowerCase('tr');
    const opt = [...sel.options].find(o => o.text.toLocaleLowerCase('tr').includes(want.split(' ')[0]));
    if (opt) sel.value = opt.text;
    setTimeout(() => $('#f-msg').focus({ preventScroll: true }), 700);
  }));

  // layer model
  const setLayer = i => {
    $$('#stack .plate').forEach(p => p.classList.toggle('on', p.dataset.i == i));
    $$('#lsteps .lstep').forEach(p => p.classList.toggle('on', p.dataset.i == i));
  };
  $$('#stack .plate, #lsteps .lstep').forEach(el => {
    el.addEventListener('mouseenter', () => setLayer(el.dataset.i));
    el.addEventListener('click', () => setLayer(el.dataset.i));
  });

  // quote form -> WhatsApp
  $('#quote').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, v = n => f.elements[n].value.trim();
    let ok = true;
    const mark = (name, bad) => { f.elements[name].closest('.field').classList.toggle('bad', bad); if (bad) ok = false; };
    mark('ad', !v('ad'));
    mark('tel', !v('tel') && !v('mail'));
    mark('mesaj', v('mesaj').length < 5);
    if (!ok) return;
    const lines = [
      'Merhaba, teklif almak istiyorum.',
      '', 'Ad soyad: ' + v('ad'),
      v('firma') ? 'Firma: ' + v('firma') : null,
      v('tel') ? 'Telefon: ' + v('tel') : null,
      v('mail') ? 'E-posta: ' + v('mail') : null,
      'Kaplama: ' + v('kaplama'),
      '', 'Parça / malzeme / adet:', v('mesaj')
    ].filter(x => x !== null);
    open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
  $$('#quote input, #quote textarea').forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('bad')));

  $('#yr').textContent = new Date().getFullYear();
})();
