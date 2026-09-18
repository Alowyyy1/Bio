# Alowyy1 — Personal Bio Page

[![Website](https://img.shields.io/badge/Website-alowyy1.com-4A90E2?style=flat-square)](https://alowyy1.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Security Status](https://img.shields.io/badge/Security-Clean%20%2F%20Safe-brightgreen?style=flat-square)](#-security--antivirus-audit-notes)

Open-source repository containing the complete, transparent client-side code for my personal bio and portfolio website hosted at [alowyy1.com](https://alowyy1.com).

---

## 📌 Overview

This project is a personal interactive landing page designed to showcase social profiles, music preferences, and ongoing projects. It is built as a lightweight, purely client-side static web application with fluid glassmorphism animations.

### ✨ Features
- **Profile & Social Links**: Quick verified links to Steam, Telegram, GitHub, YouTube, and portfolio.
- **Media Player**: Integrated HTML5 audio/video player for personal tracks.
- **Discord Presence**: Real-time status, activity, and Spotify listening status via [Lanyard API](https://api.lanyard.rest).
- **Interactive UI**: Fluid glassmorphism cards, cursor tracking, and smooth animations powered by GSAP.
- **Visitor Counter**: Minimalist display for unique profile views.

### 🛠️ Built With
- **HTML5 & CSS3** (Responsive design, custom styling, CSS variables)
- **Vanilla JavaScript** (Modern ES6+, clean readable source, no bundler/packers)
- **GSAP 3.12.2** (GreenSock Animation Platform)

---

## 🛡️ Security & Antivirus Audit Notes

> **Notice for Security Teams, Malware Analysts, and Antivirus Vendors:**  
> This section provides technical verification details for false positive review tickets and URL safety audits.

- **100% Non-Malicious**: The site contains no malware, exploits, cryptocurrency miners, spyware, or keyloggers.
- **Zero Obfuscation**: All JavaScript in [`script.js`](script.js) is clear, unminified, human-readable, and well-structured. No eval(), WebAssembly payloads, or packed code.
- **No Phishing or Harvesting**: The site contains no login forms, password inputs, credential stealers, or fake authentication prompts.
- **Privacy Respecting**: No third-party trackers, ad networks, or persistent tracking cookies are utilized.
- **Network Requests**:
  - `https://fonts.googleapis.com` / `https://fonts.gstatic.com` — Standard Google web fonts.
  - `https://api.lanyard.rest/v1/users/980154022847733770` — Read-only public Discord presence API.
  - `/api/bio/views` & `/api/bio/views/hit` — Self-hosted internal visitor count API.

*Any security flags or warnings triggered against this domain are automated heuristic false positives resulting from domain age or IP reputation.*

---

## 📂 Project Structure

```text
.
├── assets/
│   ├── cursors/          # Custom cursor UI assets
│   ├── icons/            # Social media vector/PNG icons
│   ├── music/            # Audio files and album covers
│   ├── avatar.webp       # Profile image
│   ├── bg.webp           # Background poster
│   ├── favicon.svg       # Favicon
│   └── gsap.min.js       # Official GSAP animation library
├── index.html            # Main semantic HTML structure
├── style.css             # Glassmorphic UI styles
├── script.js             # Interactive client-side logic
├── preview.png           # Interface screenshot
├── LICENSE               # MIT License
└── README.md             # Project documentation & security notice
```

---

## 📬 Contact & Verification

If you require domain ownership confirmation or have security inquiries:
- **Telegram**: [@Alowyy1](https://t.me/Alowyy1)
- **Discord**: `alowyy1` (ID: `980154022847733770`)
- **GitHub**: [@Alowyyy1](https://github.com/Alowyyy1)
- **Portfolio**: [work.alowyy1.com](https://work.alowyy1.com/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
