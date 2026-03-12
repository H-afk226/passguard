// ============================================
// CHARACTER SETS
// These are the 4 types of characters we use
// ============================================

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  nums:  '0123456789',
  syms:  '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

// ============================================
// HELPER — Pick one random character safely
// Uses crypto instead of Math.random()
// ============================================

function randomFrom(str) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return str[arr[0] % str.length];
}

// ============================================
// HELPER — Shuffle a string randomly
// Fisher-Yates shuffle algorithm
// ============================================

function shuffleString(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

// ============================================
// MAIN FUNCTION — Generate a strong password
// length  = how many characters (default 20)
// options = which character types to include
// ============================================

function generatePassword(length = 20, options = {}) {

  // Use defaults if nothing passed in
  const {
    upper = true,
    lower = true,
    nums  = true,
    syms  = true
  } = options;

  // Step 1 — Build the character pool
  let pool      = '';
  let guaranteed = '';

  // Add each type to pool if selected
  // Also guarantee at least ONE of each type
  if (upper) {
    pool      += CHARSETS.upper;
    guaranteed += randomFrom(CHARSETS.upper);
  }
  if (lower) {
    pool      += CHARSETS.lower;
    guaranteed += randomFrom(CHARSETS.lower);
  }
  if (nums) {
    pool      += CHARSETS.nums;
    guaranteed += randomFrom(CHARSETS.nums);
  }
  if (syms) {
    pool      += CHARSETS.syms;
    guaranteed += randomFrom(CHARSETS.syms);
  }

  // Fallback — if nothing selected use letters + numbers
  if (!pool) {
    pool = CHARSETS.lower + CHARSETS.nums;
    guaranteed = randomFrom(CHARSETS.lower) + randomFrom(CHARSETS.nums);
  }

  // Step 2 — Fill the rest of the password
  // Using crypto.getRandomValues() for security
  let password = guaranteed;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = guaranteed.length; i < length; i++) {
    password += pool[randomValues[i] % pool.length];
  }

  // Step 3 — Shuffle so guaranteed chars
  // are not always at the start
  password = shuffleString(password);

  return password;
}
