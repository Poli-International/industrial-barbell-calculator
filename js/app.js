'use strict';

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Standard industrial barbell lengths (mm) in production
const ALL_LENGTHS = [30, 32, 34, 35, 36, 38, 40, 42, 44, 46, 48, 50, 54, 58, 60, 65, 70];

// Ball diameter → protrusion per end (approx half of ball diameter sits outside hole)
const BALL_PROTRUSION = {
  '3mm':  3,
  '4mm':  4,
  '5mm':  5,
};

const holeDist  = document.getElementById('hole-distance');
const ballSize  = document.getElementById('ball-size');
const stageEl   = document.getElementById('healing-stage');
const calcBtn   = document.getElementById('calc-btn');
const resultDiv = document.getElementById('results');

calcBtn.addEventListener('click', calculate);

function calculate() {
  const dist  = parseFloat(holeDist.value);
  const ball  = ballSize.value;
  const stage = stageEl.value;

  if (isNaN(dist) || dist < 20 || dist > 80) {
    resultDiv.innerHTML = `<div class="err-card">Enter a valid hole-to-hole distance between 20 and 80 mm.</div>`;
    return;
  }

  const protrusion   = BALL_PROTRUSION[ball] || 4;
  const clearance    = stage === 'fresh' ? 4 : 2;
  const minRequired  = dist + protrusion + clearance;

  const bestFit = ALL_LENGTHS.find(l => l >= minRequired) || ALL_LENGTHS[ALL_LENGTHS.length - 1];
  const nextUp  = ALL_LENGTHS.find(l => l > bestFit) || null;

  resultDiv.innerHTML = buildResult(dist, ball, protrusion, stage, clearance, minRequired, bestFit, nextUp);
}

function buildResult(dist, ball, protrusion, stage, clearance, minRequired, bestFit, nextUp) {
  const stageLabel = stage === 'fresh' ? 'fresh / unhealed' : 'fully healed';
  const nextUpHtml = nextUp
    ? `<div class="size-option size-option--alt"><div class="size-val">${nextUp} mm</div><div class="size-lbl">Next size up — extra breathing room</div></div>`
    : '';

  return `
    <div class="result-card">
      <div class="result-header">
        <span class="result-icon">📏</span>
        <div>
          <div class="result-title">${bestFit} mm barbell</div>
          <div class="result-sub">Industrial — ${escHtml(stageLabel)} tissue · ${escHtml(ball)} balls</div>
        </div>
      </div>

      <div class="calc-breakdown">
        <div class="calc-row">
          <span class="calc-lbl">Hole-to-hole distance</span>
          <span class="calc-val">${dist} mm</span>
        </div>
        <div class="calc-row">
          <span class="calc-lbl">Ball protrusion (${escHtml(ball)} × 2 ends)</span>
          <span class="calc-val">+ ${protrusion} mm</span>
        </div>
        <div class="calc-row">
          <span class="calc-lbl">Healing clearance (${escHtml(stageLabel)})</span>
          <span class="calc-val">+ ${clearance} mm</span>
        </div>
        <div class="calc-row calc-row--total">
          <span class="calc-lbl">Minimum barbell length needed</span>
          <span class="calc-val">${minRequired.toFixed(1)} mm</span>
        </div>
      </div>

      <div class="size-options">
        <div class="size-option size-option--primary">
          <div class="size-val">${bestFit} mm</div>
          <div class="size-lbl">Recommended standard size</div>
        </div>
        ${nextUpHtml}
      </div>

      <div class="result-gauge-note">
        <strong>Gauge:</strong> Industrial piercings are typically done at <strong>14g (1.6 mm)</strong>.
        Some piercers use 16g for finer anatomy, but 14g is the standard for long-term wear stability
        through the two cartilage punctures.
      </div>

      <div class="result-advice">
        For ${escHtml(stage === 'fresh' ? 'fresh industrials' : 'healed industrials')},
        ${stage === 'fresh'
          ? 'the extra clearance accommodates swelling across both holes. Industrials are high-trauma piercings — expect 6–12 months of healing. Do not change jewellery until fully healed and confirmed by your piercer.'
          : 'a more precise fit reduces the lever effect that causes irritation bumps. Only downsize once healing is complete.'}
        Always use implant-grade material — <a href="https://poliinternational.com/bioflex/" target="_blank" rel="noopener noreferrer">BioFlex® polymer</a>
        or ASTM F136 titanium for initial piercings.
      </div>
    </div>`;
}
