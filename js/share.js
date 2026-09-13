/**
 * Shareable result card for Industrial Barbell Calculator (PoliShare).
 */
'use strict';

(function () {
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function text(id) {
    var el = document.getElementById(id);
    return el ? el.textContent.trim() : '';
  }

  function selText(id) {
    var el = document.getElementById(id);
    return el && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : '';
  }

  PoliShare.init({
    tool: 'industrial-barbell-calculator',
    mount: '#results',

    getState: function () {
      var dist = val('hole-distance');
      if (!dist) return null;
      return {
        'ball-size': val('ball-size'),
        'healing-stage': val('healing-stage'),
        'hole-distance': dist,
      };
    },

    applyState: function (s) {
      var ids = ['ball-size', 'healing-stage', 'hole-distance'];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && s[id] !== undefined) el.value = s[id];
      });
      var btn = document.getElementById('calc-btn');
      if (btn) btn.click();
    },

    getCard: function () {
      var results = document.getElementById('results');
      if (!results || !results.textContent.trim()) return null;
      var dist = val('hole-distance');
      var lines = results.textContent.trim().split('\n').filter(function (l) { return l.trim(); });
      var h = lines[0] || '';
      return {
        t: 'Industrial barbell for ' + dist + 'mm spacing: ' + h,
        d: [
          ['Hole distance', dist + ' mm'],
          ['Ball size', selText('ball-size') || val('ball-size')],
          ['Healing stage', selText('healing-stage') || val('healing-stage')],
          ['Recommendation', h],
        ].concat(lines.slice(1, 4).map(function (l, i) { return ['Detail ' + (i + 1), l.trim()]; })),
      };
    },
  });
})();
