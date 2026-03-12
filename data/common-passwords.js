const COMMON_PASSWORDS = new Set([

  // ── Most leaked passwords worldwide ──
  'password',     'password1',    'password12',
  'password123',  'password1234', 'password12345',
  '123456',       '1234567',      '12345678',
  '123456789',    '1234567890',   '12345',
  '123123',       '654321',       '111111',
  '000000',       '1111',         '121212',

  // ── Keyboard patterns ──
  'qwerty',       'qwerty123',    'qwertyuiop',
  'asdfgh',       'asdfghjkl',    'zxcvbnm',
  '1q2w3e4r',     'qazwsx',       'qwerasdf',

  // ── Common words ──
  'monkey',       'dragon',       'master',
  'letmein',      'welcome',      'hello',
  'iloveyou',     'sunshine',     'princess',
  'shadow',       'superman',     'batman',
  'trustno1',     'access',       'admin',
  'login',        'pass',         'test',
  'user',         'guest',        'root',
  'changeme',     'default',      'blank',

  // ── Names commonly used ──
  'michael',      'jessica',      'ashley',
  'bailey',       'charlie',      'thomas',
  'andrew',       'daniel',       'george',
  'jordan',       'harley',       'ranger',

  // ── Sports / Pop culture ──
  'football',     'baseball',     'soccer',
  'hockey',       'mustang',      'dallas',
  'jordan23',     'lakers',       'chelsea',

  // ── Number only ──
  '0987654321',   '11111111',     '55555555',
  '99999999',     '10203040',     '13579',

  // ── Simple patterns ──
  'abc123',       'abc',          'abcd1234',
  'pass123',      'admin123',     'user123',
  'login123',     'root123',      'hello123',

]);