// ============================================
// CRITERIA LIST
// These are the 8 checks shown on screen
// ============================================

const CRITERIA_LIST = [
  {
    id:    'len8',
    label: '8+ characters',
    check: p => p.length >= 8
  },
  {
    id:    'len12',
    label: '12+ characters',
    check: p => p.length >= 12
  },
  {
    id:    'upper',
    label: 'Uppercase letter (A-Z)',
    check: p => /[A-Z]/.test(p)
  },
  {
    id:    'lower',
    label: 'Lowercase letter (a-z)',
    check: p => /[a-z]/.test(p)
  },
  {
    id:    'number',
    label: 'Contains a number',
    check: p => /[0-9]/.test(p)
  },
  {
    id:    'symbol',
    label: 'Special character (!@#)',
    check: p => /[^a-zA-Z0-9]/.test(p)
  },
  {
    id:    'noCommon',
    label: 'Not a common password',
    check: p => !COMMON_PASSWORDS.has(p.toLowerCase())
  },
  {
    id:    'noRepeat',
    label: 'No repeated runs (aaaa)',
    check: p => !(/(.)\1{3,}/.test(p))
  },
];

// ============================================
// UPDATE FUNCTIONS
// Each function updates one part of the screen
// ============================================

// Updates the strength bar at the top
function updateStrengthBar(score, color) {
  const fill = document.getElementById('meterFill');
  if (!fill) return;
  fill.style.width      = score + '%';
  fill.style.background = color;
}

// Updates the score number and strength name
function updateScoreDisplay(score, color, strength) {
  const num  = document.getElementById('scoreNumber');
  const name = document.getElementById('strengthName');
  if (num)  { num.textContent  = score;    num.style.color  = color; }
  if (name) { name.textContent = strength; name.style.color = color; }
}

// Updates the score ring circle
function updateScoreRing(score, color) {
  const ring = document.getElementById('scoreRing');
  if (!ring) return;
  const circumference = 220;
  const offset = circumference - (score / 100) * circumference;
  ring.style.strokeDashoffset = offset;
  ring.style.stroke           = color;
}

// Updates all 8 criteria checkboxes
function updateCriteria(password) {
  CRITERIA_LIST.forEach(criterion => {
    const el = document.getElementById('crit-' + criterion.id);
    if (!el) return;
    const passed = criterion.check(password);
    el.className = 'criterion ' + (passed ? 'pass' : 'fail');
    el.querySelector('.crit-icon').textContent = passed ? '✓' : '✗';
  });
}

// Updates the warnings / detections area
function updateWarnings(isCommon, patterns) {
  const area = document.getElementById('warningsArea');
  if (!area) return;

  if (!isCommon && patterns.length === 0) {
    area.innerHTML = '<span class="ok-pill">✓ No suspicious patterns detected</span>';
    return;
  }

  let html = '';
  if (isCommon) {
    html += '<span class="warning-pill breach-pill">⚠ Found in known breach databases</span>';
  }
  patterns.forEach(p => {
    const cls = p.type === 'breach'
      ? 'warning-pill breach-pill'
      : 'warning-pill';
    html += `<span class="${cls}">! ${p.message}</span>`;
  });
  area.innerHTML = html;
}

// Updates the stats panel (length, unique, charset, entropy)
function updateStats(result) {
  const ids = {
    statLen:     result.length,
    statUniq:    result.uniqueChars,
    statCharset: result.charsetSize,
    statEntropy: result.entropy,
  };
  Object.entries(ids).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Entropy progress bar (128 bits = 100%)
  const pct  = Math.min(100, (result.entropy / 128) * 100);
  const fill = document.getElementById('entropyFill');
  const lbl  = document.getElementById('entropyLabel');
  if (fill) fill.style.width    = pct + '%';
  if (lbl)  lbl.textContent     = result.entropy + ' bits';
}

// Updates the crack time estimates
function updateCrackTime(crackTime) {
  const online  = document.getElementById('crackOnline');
  const slow    = document.getElementById('crackOfflineSlow');
  const fast    = document.getElementById('crackOfflineFast');
  if (online) online.textContent = crackTime.online;
  if (slow)   slow.textContent   = crackTime.offlineSlow;
  if (fast)   fast.textContent   = crackTime.offlineFast;
}

// Updates the tip description
function updateTip(tip) {
  const el = document.getElementById('scoreDesc');
  if (el) el.textContent = tip;
}

// ============================================
// MASTER UPDATE FUNCTION
// Calls all update functions at once
// ============================================

function refreshUI(password) {
  const result = analyzePassword(password);

  if (!result) {
    resetUI();
    return;
  }

  updateStrengthBar(result.score, result.color);
  updateScoreDisplay(result.score, result.color, result.strength);
  updateScoreRing(result.score, result.color);
  updateCriteria(password);
  updateWarnings(result.isCommon, result.patterns);
  updateStats(result);
  updateCrackTime(result.crackTime);
  updateTip(result.tip);
}

// ============================================
// RESET FUNCTION
// Clears everything when input is empty
// ============================================

function resetUI() {
  // Reset strength bar
  const fill = document.getElementById('meterFill');
  if (fill) fill.style.width = '0%';

  // Reset strength name
  const name = document.getElementById('strengthName');
  if (name) { name.textContent = '—'; name.style.color = '#5a5a7a'; }

  // Reset score number
  const num = document.getElementById('scoreNumber');
  if (num) { num.textContent = '0'; num.style.color = '#5a5a7a'; }

  // Reset score ring
  const ring = document.getElementById('scoreRing');
  if (ring) { ring.style.strokeDashoffset = 220; ring.style.stroke = '#1e1e2e'; }

  // Reset description
  const desc = document.getElementById('scoreDesc');
  if (desc) desc.textContent = 'Enter a password above to begin analysis.';

  // Reset warnings
  const warn = document.getElementById('warningsArea');
  if (warn) warn.innerHTML = '<span style="color:#5a5a7a">—</span>';

  // Reset stats
  ['statLen','statUniq','statCharset','statEntropy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0';
  });

  // Reset entropy bar
  const entFill = document.getElementById('entropyFill');
  const entLbl  = document.getElementById('entropyLabel');
  if (entFill) entFill.style.width  = '0%';
  if (entLbl)  entLbl.textContent   = '0 bits';

  // Reset crack times
  ['crackOnline','crackOfflineSlow','crackOfflineFast'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });

  // Reset all criteria to fail
  CRITERIA_LIST.forEach(criterion => {
    const el = document.getElementById('crit-' + criterion.id);
    if (!el) return;
    el.className = 'criterion fail';
    el.querySelector('.crit-icon').textContent = '✗';
  });
}

// ============================================
// TOAST NOTIFICATION
// Small popup that says "Copied!"
// ============================================

function showToast(message) {
  const toast = document.getElementById('copyToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================
// EVENT LISTENERS
// These run when the page fully loads
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // 1 — Real time analysis as user types
  const input = document.getElementById('passwordInput');
  if (input) {
    input.addEventListener('input', e => {
      refreshUI(e.target.value);
    });
  }

  // 2 — Show / hide password toggle
  const toggleBtn = document.getElementById('toggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.textContent = '🙈';
      } else {
        input.type = 'password';
        toggleBtn.textContent = '👁';
      }
    });
  }

  // 3 — Length slider for generator
  const slider = document.getElementById('lengthSlider');
  const lenVal = document.getElementById('lenVal');
  if (slider && lenVal) {
    slider.addEventListener('input', e => {
      lenVal.textContent = e.target.value;
    });
  }

  // 4 — Generator option toggles
  document.querySelectorAll('.gen-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // 5 — Generate button
  const genBtn = document.getElementById('genBtn');
  if (genBtn) {
    genBtn.addEventListener('click', () => {
      const options = {
        upper: document.querySelector('[data-type="upper"]').classList.contains('active'),
        lower: document.querySelector('[data-type="lower"]').classList.contains('active'),
        nums:  document.querySelector('[data-type="nums"]').classList.contains('active'),
        syms:  document.querySelector('[data-type="syms"]').classList.contains('active'),
      };
      const length = +document.getElementById('lengthSlider').value;
      const pwd    = generatePassword(length, options);
      document.getElementById('generatedPass').textContent = pwd;
    });
  }

  // 6 — Copy generated password
  const copyBtn = document.getElementById('copyGenBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const pwd = document.getElementById('generatedPass').textContent;
      if (pwd && pwd !== 'Click Generate →') {
        navigator.clipboard.writeText(pwd).then(() => {
          showToast('✓ Copied to clipboard!');
        });
      }
    });
  }

  // 7 — Use generated password in checker
  const useBtn = document.getElementById('useGenBtn');
  if (useBtn) {
    useBtn.addEventListener('click', () => {
      const pwd = document.getElementById('generatedPass').textContent;
      if (pwd && pwd !== 'Click Generate →') {
        input.value = pwd;
        input.type  = 'text';
        refreshUI(pwd);
        input.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});