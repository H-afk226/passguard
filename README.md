#  PassGuard — Password Strength Checker

A real-time password strength analyzer built with pure HTML, CSS and JavaScript.
No login required. No data sent to any server. 100% private and secure.

##  Live Demo
👉 **[Try PassGuard Live](https://h-afk226.github.io/passguard)**


##  Preview

PassGuard analyzes your password instantly as you type and gives you:
- A score from 0 to 100
- A strength label (COMPROMISED → EXCELLENT)
- Detailed breakdown of what makes it weak or strong

##  Features
Real-time password analysis as you type
Score from 0 to 100
6 strength levels — COMPROMISED, VERY WEAK, WEAK, FAIR, STRONG, EXCELLENT
Breach database detection — checks against 60+ common passwords
9 dangerous pattern detections (keyboard walks, repeated chars, years etc.)
Shannon entropy calculation in bits
Crack time estimation for 3 attack types
8 criteria checklist
Secure password generator using Web Crypto API
Copy to clipboard
Show/hide password toggle
Beautiful dark interface
Works as a Chrome/Edge browser extension
Mobile friendly
Zero dependencies — no libraries or frameworks

---

##  How It Works

### Password Scoring (0-100)
| Category | Max Points |
|---|---|
| Length | 35 points |
| Character diversity | 30 points |
| Unique characters | 15 points |
| Entropy bonus | 20 points |

### Pattern Detection
PassGuard detects these dangerous patterns:
- Repeated characters (aaaa, 1111)
- Capitalized word + number (Hello123)
- Ends with a year (password2024)
- Starts with "password" variant
- Sequential numbers (123, 456)
- Sequential letters (abc, xyz)
- Keyboard walks (qwerty, asdf)
- Numbers only
- Letters only

### Crack Time Estimation
| Attack Type | Speed |
|---|---|
| Online attack | 1,000 guesses/sec |
| Offline slow hash (bcrypt) | 10,000 guesses/sec |
| Offline fast hash (MD5/GPU) | 10,000,000,000 guesses/sec |

##  How to Use

### Option 1 — Use Online (Recommended)
Just visit the live link — no installation needed:
```
https://h-afk226.github.io/passguard
```

### Option 2 — Run Locally
1. Download this repository as ZIP
2. Extract the folder
3. Open `index.html` in your browser
4. That's it!

### Option 3 — Install as Browser Extension
1. Download this repository as ZIP
2. Extract the folder
3. Open Chrome or Edge
4. Go to `chrome://extensions`
5. Turn on **Developer Mode**
6. Click **Load Unpacked**
7. Select the extracted folder
8. PassGuard appears in your toolbar permanently!


##  Project Structure
```
passguard/
│
├── index.html                 ← Main page
├── manifest.json              ← Browser extension config
│
├── css/
│   └── style.css              ← All styling
│
├── js/
│   ├── analyzer.js            ← Password analysis engine
│   ├── generator.js           ← Secure password generator
│   └── ui.js                  ← UI controller
│
└── data/
    └── common-passwords.js    ← Breach database
```


##  Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and animations |
| Vanilla JavaScript | All logic |
| Web Crypto API | Secure random generation |
| Google Fonts | Typography (Syne + Space Mono) |


##  Privacy

Your password **never leaves your device**
No analytics or tracking
No cookies
No server — runs 100% in your browser
Works completely offline after first load

##  Security Tips

1. **Use a password manager** — Bitwarden, 1Password or KeePass
2. **Never reuse passwords** — every site needs its own unique password
3. **Enable 2FA** — two factor authentication adds a second layer of security
4. **Use passphrases** — random words are stronger than complex short passwords
5. **Aim for 16+ characters** — length is the biggest factor in password strength

##  Author

**H-afk226**
- GitHub: [@H-afk226](https://github.com/H-afk226)
- Project: [PassGuard](https://github.com/H-afk226/passguard)

##  Support

If you found this project useful please give it a **star ⭐** on GitHub!
It helps others find the project.

## License

This project is open source and available under the [MIT License](LICENSE).
