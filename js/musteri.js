// Müşteri girişi / paneli. Veri: Deniz Kromaj iş takip platformu (/api/musteri/*).
(function () {
  'use strict';
  var LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var API = LOCAL ? 'http://localhost:3000/api/musteri' : 'https://deniz-kromaj-is-takip.vercel.app/api/musteri';
  var KEY = 'dk_portal';
  var REFRESH_MS = 60000;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // --- menü ---
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () { nav.classList.toggle('open'); burger.classList.toggle('x'); });
  $('#yr').textContent = new Date().getFullYear();

  // --- oturum (sekme kapanınca biter) ---
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setSession(s) {
    try { s ? sessionStorage.setItem(KEY, JSON.stringify(s)) : sessionStorage.removeItem(KEY); } catch (e) { /* yoksay */ }
  }

  function AuthLost() {}

  function request(path, opts) {
    return fetch(API + '/' + path, opts).then(function (r) {
      return r.status === 204 ? { status: 204, body: null } : r.json().then(function (b) { return { status: r.status, body: b }; }, function () { return { status: r.status, body: {} }; });
    });
  }

  function refresh() {
    var s = getSession();
    if (!s || !s.refreshToken) return Promise.reject(new AuthLost());
    return request('yenile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: s.refreshToken }) })
      .then(function (r) {
        if (r.status !== 200) throw new AuthLost();
        setSession(r.body);
        return r.body;
      });
  }

  // Bearer ile istek; 401'de bir kez yenile, yine olmazsa AuthLost
  function authed(path, opts, retried) {
    var s = getSession();
    if (!s) return Promise.reject(new AuthLost());
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers, { Authorization: 'Bearer ' + s.accessToken });
    return request(path, opts).then(function (r) {
      if (r.status !== 401) return r;
      if (retried) throw new AuthLost();
      return refresh().then(function () { return authed(path, opts, true); });
    });
  }

  // --- biçim ---
  var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  function fmtDay(ymd) {
    if (!ymd) return '';
    var p = ymd.split('-');
    return Number(p[2]) + ' ' + MONTHS[Number(p[1]) - 1] + ' ' + p[0];
  }
  function fmtShort(ymd) {
    if (!ymd) return '';
    var p = ymd.split('-');
    return Number(p[2]) + ' ' + MONTHS[Number(p[1]) - 1].slice(0, 3);
  }
  function fmtQty(kg, pcs) {
    var parts = [];
    if (kg != null) parts.push(Number(kg).toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' kg');
    if (pcs != null) parts.push(Number(pcs).toLocaleString('tr-TR') + ' adet');
    return parts.join(' · ');
  }

  // --- ekranlar ---
  function showLogin(msg) {
    stopTimer();
    setSession(null);
    $('#cp-portal').hidden = true;
    $('#cp-login').hidden = false;
    var err = $('#cp-error');
    err.hidden = !msg;
    err.textContent = msg || '';
  }

  function showPortal() {
    $('#cp-login').hidden = true;
    $('#cp-portal').hidden = false;
  }

  // Açık istasyon (foto şeridi) yenilemelerde korunur
  var openStation = {};

  function renderOrders(data) {
    var s = getSession();
    $('#cp-welcome').textContent = 'Hoş geldiniz, ' + (data.customerName || (s && s.customerName) || '');
    var box = $('#cp-orders');
    box.replaceChildren();
    $('#cp-status').textContent = '';
    if (!data.orders.length) {
      box.appendChild(el('div', 'cp-empty', 'Şu an aktif bir işiniz bulunmuyor.'));
      return;
    }
    data.orders.forEach(function (o) { box.appendChild(card(o)); });
  }

  function card(o) {
    var c = el('article', 'cp-card');
    var top = el('div', 'cp-card-top');
    var left = el('div');
    left.appendChild(el('span', 'cp-no', o.orderNo));
    left.appendChild(el('h2', null, o.productName));
    var q = fmtQty(o.quantityKg, o.quantityPcs);
    if (q) left.appendChild(el('span', 'cp-qty', q));
    var eta = el('div', 'cp-eta' + (o.delivered ? ' done' : ''));
    if (o.delivered) {
      eta.appendChild(el('small', null, 'Teslim edildi'));
      eta.appendChild(el('strong', null, o.deliveredAt ? fmtDay(o.deliveredAt) + ' ✓' : '✓'));
    } else {
      eta.appendChild(el('small', null, 'Tahmini teslim'));
      eta.appendChild(el('strong', null, o.eta ? fmtDay(o.eta) : 'Hesaplanıyor'));
    }
    top.appendChild(left);
    top.appendChild(eta);
    c.appendChild(top);

    var flow = el('ol', 'cp-flow');
    flow.setAttribute('aria-label', 'İstasyon akışı');
    var photos = el('div', 'cp-photos');
    photos.hidden = true;

    function openPhotos(i) {
      var st = o.stations[i];
      openStation[o.orderNo] = i;
      [].forEach.call(flow.children, function (li, j) { li.classList.toggle('open', j === i); });
      photos.replaceChildren();
      photos.appendChild(el('p', null, st.name + ' · ' + st.photos.length + ' fotoğraf'));
      var strip = el('div', 'cp-strip');
      st.photos.forEach(function (p, k) {
        var b = el('button');
        b.type = 'button';
        b.setAttribute('aria-label', st.name + ' fotoğraf ' + (k + 1));
        var img = el('img');
        img.src = p.url;
        img.alt = '';
        img.loading = 'lazy';
        b.appendChild(img);
        b.addEventListener('click', function () { lightbox(p.url, st.name); });
        strip.appendChild(b);
      });
      photos.appendChild(strip);
      photos.hidden = false;
    }

    o.stations.forEach(function (st, i) {
      var li = el('li', st.state);
      var b = el('button');
      b.type = 'button';
      var label = st.name + ': ' + (st.state === 'tamam' ? 'tamamlandı' : st.state === 'simdi' ? 'şu an bu aşamada' : 'bekliyor');
      if (st.photos.length) {
        b.className = 'has-photos';
        label += ', ' + st.photos.length + ' fotoğraf';
        b.addEventListener('click', function () {
          if (openStation[o.orderNo] === i) {
            delete openStation[o.orderNo];
            photos.hidden = true;
            li.classList.remove('open');
          } else openPhotos(i);
        });
      } else {
        b.tabIndex = -1;
      }
      b.setAttribute('aria-label', label);
      b.appendChild(el('i', 'dot ' + st.state));
      b.appendChild(el('span', 'name', st.name));
      if (st.date) b.appendChild(el('span', 'date', fmtShort(st.date)));
      if (st.photos.length) b.appendChild(el('span', 'cam', '📷 ' + st.photos.length));
      li.appendChild(b);
      flow.appendChild(li);
    });
    c.appendChild(flow);
    c.appendChild(photos);

    var keep = openStation[o.orderNo];
    if (keep != null && o.stations[keep] && o.stations[keep].photos.length) openPhotos(keep);
    else delete openStation[o.orderNo];

    // Şu anki aşamayı görünür yap (uzun rotalarda yatay kaydırma)
    requestAnimationFrame(function () {
      var cur = flow.querySelector('li.simdi');
      if (cur) flow.scrollLeft = cur.offsetLeft - flow.clientWidth / 2 + cur.clientWidth / 2;
    });
    return c;
  }

  // --- lightbox ---
  var lb = $('#cp-lightbox'), lbImg = $('#cp-lightbox img');
  function lightbox(url, alt) {
    lbImg.src = url;
    lbImg.alt = alt;
    lb.hidden = false;
    $('.cp-lb-close').focus();
  }
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); }
  lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  // --- yükleme ---
  var timer = null;
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  function load(silent) {
    if (!silent) $('#cp-status').textContent = 'Yükleniyor…';
    return authed('isler')
      .then(function (r) {
        if (r.status !== 200) throw new Error('http ' + r.status);
        showPortal();
        renderOrders(r.body);
      })
      .catch(function (e) {
        if (e instanceof AuthLost) return showLogin('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
        if (!silent) $('#cp-status').textContent = 'Bağlantı kurulamadı. Lütfen tekrar deneyin.';
      });
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(function () { if (!document.hidden) load(true); }, REFRESH_MS);
  }

  // --- giriş ---
  $('#cp-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, btn = f.querySelector('button');
    var username = f.username.value.trim().toLowerCase(), password = f.password.value;
    var err = $('#cp-error');
    if (!username || !password) { err.textContent = 'Kullanıcı adı ve şifre girin.'; err.hidden = false; return; }
    btn.disabled = true;
    btn.textContent = 'Giriş yapılıyor…';
    err.hidden = true;
    request('giris', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password }) })
      .then(function (r) {
        if (r.status !== 200) {
          err.textContent = (r.body && r.body.error) || 'Giriş yapılamadı.';
          err.hidden = false;
          return;
        }
        setSession(r.body);
        f.reset();
        showPortal();
        return load().then(startTimer);
      })
      .catch(function () {
        err.textContent = 'Bağlantı kurulamadı. Lütfen tekrar deneyin.';
        err.hidden = false;
      })
      .then(function () { btn.disabled = false; btn.textContent = 'Giriş yap'; });
  });

  $('#cp-logout').addEventListener('click', function () {
    var s = getSession();
    if (s) request('cikis', { method: 'POST', headers: { Authorization: 'Bearer ' + s.accessToken } }).catch(function () {});
    openStation = {};
    showLogin();
  });

  // --- başlangıç ---
  if (getSession()) { showPortal(); load().then(function () { if (getSession()) startTimer(); }); }
  else showLogin();
})();
