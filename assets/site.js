// 6개 언어 전환. 글은 assets/i18n.js의 사전에서 [data-i18n] 자리에 넣고, 화면 사진은 언어별 폴더에서 고른다.
// 고른 언어는 이 브라우저에만 기억하고, 처음엔 브라우저 언어를 따른다. 사전에 없는 말은 영어로 보인다
(function () {
  var LANGS = ['en', 'ko', 'ja', 'de', 'es', 'zh-Hant'];
  var root = document.documentElement;
  function detect() {
    var saved = null;
    try { saved = localStorage.getItem('chorus.lang'); } catch (e) {}
    if (saved && LANGS.indexOf(saved) >= 0) return saved;
    var list = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase();
      if (l.indexOf('zh') === 0) { if (/tw|hk|mo|hant/.test(l)) return 'zh-Hant'; continue; }
      var base = l.split('-')[0];
      if (LANGS.indexOf(base) >= 0) return base;
    }
    return 'en';
  }
  var lang = detect();
  function apply(next) {
    lang = next;
    root.setAttribute('lang', next);
    root.setAttribute('data-lang', next);
    var dict = window.CHORUS_I18N || {};
    var cur = dict[next] || {}, en = dict.en || {};
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      var v = cur[k] != null ? cur[k] : en[k];
      if (v != null) nodes[i].innerHTML = v;
    }
    var alts = document.querySelectorAll('[data-i18n-alt]');
    for (var j = 0; j < alts.length; j++) {
      var a = alts[j].getAttribute('data-i18n-alt');
      var t = cur[a] != null ? cur[a] : en[a];
      if (t != null) alts[j].setAttribute('alt', t);
    }
    var shots = document.querySelectorAll('[data-shot]');
    for (var s = 0; s < shots.length; s++) shots[s].setAttribute('src', shots[s].getAttribute('data-base') + 'assets/shots/' + next + '/' + shots[s].getAttribute('data-shot') + '.jpg');
    if (cur._title) document.title = cur._title;
    var sel = document.getElementById('lang');
    if (sel) sel.value = next;
  }
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'lang') {
      apply(e.target.value);
      try { localStorage.setItem('chorus.lang', lang); } catch (err) {}
    }
  });
  document.addEventListener('DOMContentLoaded', function () { apply(lang); });
})();
