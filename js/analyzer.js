// ============================================
// PART A: Detect what character types are used
// ============================================

function getCharsetSize(password) {
  let size = 0;

  if (/[a-z]/.test(password)) size += 26;  // a to z
  if (/[A-Z]/.test(password)) size += 26;  // A to Z
  if (/[0-9]/.test(password)) size += 10;  // 0 to 9
  if (/[^a-zA-Z0-9]/.test(password)) size += 32; // !@#$ symbols

  return size;
}

// ============================================
// PART B: Calculate entropy (randomness score)
// Higher bits = harder to crack
// ============================================

function calcEntropy(password) {
  const cs = getCharsetSize(password);

  if (!cs || !password.length) return 0;

  // Standard formula: length x log2(charsetSize)
  return Math.round(password.length * Math.log2(cs));
}

// ============================================
// PART C: Estimate how long to crack
// Tests 3 real-world attack scenarios
// ============================================

function estimateCrackTime(password) {
  const cs = getCharsetSize(password);
  const combinations = Math.pow(cs, password.length);
  const avgGuesses = combinations / 2;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds > 1e15) return 'Longer than the universe';
    if (seconds < 1)        return 'Less than 1 second';
    if (seconds < 60)       return `${Math.round(seconds)} seconds`;
    if (seconds < 3600)     return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400)    return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000)  return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    const years = seconds / 31536000;
    if (years < 1000)       return `${Math.round(years)} years`;
    if (years < 1e6)        return `${(years / 1000).toFixed(1)}K years`;
    if (years < 1e9)        return `${(years / 1e6).toFixed(1)} million years`;
    return                         `${(years / 1e9).toFixed(1)} billion years`;
  }

  return {
    online:      formatTime(avgGuesses / 1_000),
    offlineSlow: formatTime(avgGuesses / 10_000),
    offlineFast: formatTime(avgGuesses / 10_000_000_000),
  };
}

// ============================================
// PART D: Detect dangerous patterns
// These are what hackers target first
// ============================================

const DANGEROUS_PATTERNS = [
  {
    regex: /(.)\1{3,}/,
    message: 'Repeated characters (e.g. aaaa, 1111)',
    type: 'breach'
  },
  {
    regex: /^[A-Z][a-z]+\d+[^a-zA-Z0-9]?$/,
    message: 'Capitalized word + number (very predictable)',
    type: 'breach'
  },
  {
    regex: /(?:19|20)\d{2}$/,
    message: 'Ends with a year',
    type: 'warning'
  },
  {
    regex: /^(?:pass(?:word)?|pwd)/i,
    message: 'Starts with a "password" variant',
    type: 'breach'
  },
  {
    regex: /(?:012|123|234|345|456|567|678|789|890)/,
    message: 'Sequential numbers detected (123, 456...)',
    type: 'warning'
  },
  {
    regex: /(?:abc|bcd|cde|def|efg|xyz)/i,
    message: 'Sequential letters detected (abc, xyz...)',
    type: 'warning'
  },
  {
    regex: /(?:qwerty|asdfgh|zxcvbn|qweasd)/i,
    message: 'Keyboard walk pattern (qwerty, asdf...)',
    type: 'breach'
  },
  {
    regex: /^\d+$/,
    message: 'Numbers only — extremely easy to crack',
    type: 'breach'
  },
  {
    regex: /^[a-zA-Z]+$/,
    message: 'Letters only — no numbers or symbols',
    type: 'warning'
  },
];

function detectPatterns(password) {
  return DANGEROUS_PATTERNS.filter(p => p.regex.test(password));
}

// ============================================
// PART E: Calculate final score + return all
//         analysis results in one object
// ============================================

function analyzePassword(password) {
  if (!password) return null;

  const length      = password.length;
  const uniqueChars = new Set(password).size;
  const entropy     = calcEntropy(password);
  const crackTime   = estimateCrackTime(password);
  const isCommon    = COMMON_PASSWORDS.has(password.toLowerCase());
  const patterns    = detectPatterns(password);

  // ── SCORING ──────────────────────────────

  let score = 0;

  // Length (max 35 points)
  if      (length >= 20) score += 35;
  else if (length >= 16) score += 28;
  else if (length >= 12) score += 20;
  else if (length >= 8)  score += 12;
  else                   score += length * 1.5;

  // Character diversity (max 30 points)
  if (/[a-z]/.test(password))        score += 7.5;
  if (/[A-Z]/.test(password))        score += 7.5;
  if (/[0-9]/.test(password))        score += 7.5;
  if (/[^a-zA-Z0-9]/.test(password)) score += 7.5;

  // Uniqueness (max 15 points)
  score += Math.min(15, (uniqueChars / length) * 15);

  // Entropy bonus (max 20 points)
  score += Math.min(20, entropy / 7);

  // ── PENALTIES ────────────────────────────
  if (isCommon)        score  = Math.min(score, 5);
  if (patterns.length) score -= patterns.length * 6;

  // Keep score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── STRENGTH LABEL ───────────────────────
  let strength, color;
  if      (isCommon)   { strength = 'COMPROMISED'; color = '#ff3b5c'; }
  else if (score < 20) { strength = 'VERY WEAK';   color = '#ff3b5c'; }
  else if (score < 40) { strength = 'WEAK';         color = '#ff6030'; }
  else if (score < 55) { strength = 'FAIR';         color = '#ff8c00'; }
  else if (score < 70) { strength = 'GOOD';         color = '#f5c400'; }
  else if (score < 85) { strength = 'STRONG';       color = '#00e5a0'; }
  else                 { strength = 'EXCELLENT';     color = '#00cfff'; }

  // ── IMPROVEMENT TIP ──────────────────────
  let tip;
  if (isCommon)
    tip = 'This password is in breach databases. Change it immediately!';
  else if (!(/[A-Z]/.test(password)))
    tip = 'Add uppercase letters to boost your score.';
  else if (!(/[0-9]/.test(password)))
    tip = 'Add numbers to make it harder to guess.';
  else if (!(/[^a-zA-Z0-9]/.test(password)))
    tip = 'Add symbols like !@#$ for a big improvement.';
  else if (length < 12)
    tip = 'Make it longer — aim for at least 12 characters.';
  else
    tip = 'Great password! Save it in a password manager.';

  // ── RETURN EVERYTHING ────────────────────
  return {
    score,
    strength,
    color,
    tip,
    entropy,
    crackTime,
    isCommon,
    patterns,
    length,
    uniqueChars,
    charsetSize: getCharsetSize(password),
    hasUpper:    /[A-Z]/.test(password),
    hasLower:    /[a-z]/.test(password),
    hasNumber:   /[0-9]/.test(password),
    hasSymbol:   /[^a-zA-Z0-9]/.test(password),
  };
}
