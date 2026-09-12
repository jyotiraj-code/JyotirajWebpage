# Jyotiraj (Raj) Nath // Archival Ledger & Portfolio System
**DOC-ID:** `JN-MASSEY-PHYS` &bull; **STATION:** Massey University (Auckland, NZ)

A tactile, analog, and mechanical editorial documentation system and academic portfolio for **Jyotiraj (Raj) Nath**—computational quantum physicist, open-source Julia developer, and doctoral researcher in the Prof. Joachim Brand Research Group.

---

## Visual & Analog Design System

* **Design Concept:** A hybrid of a mid-century academic laboratory ledger, archival dossier, and mechanical typewriter console.
* **Themes:**
  * `[Archival Paper]` (Day Mode): Unbleached paper (`#F5F2EB`), carbon ink (`#1A1A1C`), margin pencil (`#D1CBBF`), ribbon red (`#942A27`), and blueprint blue (`#1D4ED8`).
  * `[Terminal Phosphor]` (Night Mode): Matte carbon (`#0F0F10`), typed zinc (`#E2E0D8`), wireframe rules (`#28282C`), and green/amber phosphor (`#059669` / `#D97706`).
* **Persistent Readouts:** Live NZST clock (`Pacific/Auckland`), session uptime ticker, git revision stamp (`rev: ffe919f`), and system convergence badges.
* **Interactive Connected Graph Sitemap HUD:** Fixed at the bottom-right corner of every page, a physics-driven canvas topology showing all 7 archive sections as harmonic oscillator nodes, interconnected with network edges, animated quantum walker particles, live route rings, hover descriptions, and click-to-navigate functionality (with `[−]`/`[+]` minimize toggle).
* **Code-Generated Cultural & Scientific Analog Graphics:**
  * **Plate 01-A / 06-A (Assamese Jaapi & Tala Acoustic Mandala):** Generative geometric plate capturing Assamese heritage (16-rib bamboo cone, Gamusa red diamond embroidery), North Indian classical 16-beat Teental metric cycle, harmonium shruti frequencies, and Assamese inscriptions ("দাপোন // লুইতৰ পৰা ৱাকাতিলৈ").
  * **Plate 02-B (Soliton Collision Spacetime Plot):** Matter-wave bright soliton collision dynamics $(x, t)$ governed by the attractive 1D Gross-Pitaevskii equation with asymptotic collisional phase shifts $\pm \Delta x$.
  * **Plate 03-C (Non-Hermitian Lattice Skin Effect Diagram):** 1D extended correlated lattice exhibiting directional hopping asymmetry $t_R > t_L$ and exponential boundary state accumulation $|\psi(x)|^2 \sim e^{\kappa x}$.
* **Instant Command Palette:** Press `Cmd + K` or `Ctrl + K` anywhere across all routes to query the indexed catalog of papers, repositories, essays, and notes.
* **Mathematical Precision:** KaTeX engine rendering inline ($...$) and block ($$...$$) formulas.
* **Print Fidelity:** Pressing `Cmd + P` formats any page into a clean, physical laboratory ledger report with formal sign-off dockets.

---

## Catalog Directory Architecture

```
/                       [01/DOSSIER]      Academic coordinates, credentials, interactive terminal
/research/              [02/RESEARCH]     BECs, solitons, GPE, FCIQMC, Fermi-Hubbard, publications, BibTeX
/code/                  [03/COMPUTATION]  Rimu.jl, RimuRealTime.jl, LeapfrogComplex, Slurm batch arrays
/learnings/             [04/LEDGER]       Continuous mathematical changelog, certifications, reading list
/essays/                [05/ESSAYS]       Editorial monographs (NISQ critique, FCIQMC sign problem, Julia)
/archive/               [06/ARCHIVE]      Assamese poetry (Dapun), tabla talas, NZ terrain EXIF, coffee
/colophon/              [07/COLOPHON]     M2 MacBook Air, Pixel 8, Neovim Lua setup, brutalist manifesto
```

---

## Local Development & Deployment

### 1. Zero-Dependency Instant Preview (Python)
To immediately preview the pre-rendered static distribution without Node.js:
```bash
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### 2. Astro Development (Node.js)
```bash
# Install dependencies
npm install

# Start local Astro development server
npm run dev

# Build static production bundle to /dist
npm run build
```

### 3. Automated GitHub Pages Deployment
A GitHub Actions workflow is provided at `.github/workflows/deploy.yml`. When pushed to `main`, it will automatically build and publish the Astro site to GitHub Pages.
