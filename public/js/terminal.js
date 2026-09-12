/**
 * INTERACTIVE MECHANICAL TERMINAL SIMULATOR
 * Emulates an authentic computational physics CLI console
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('termInput');
    const output = document.getElementById('termOutput');
    const form = document.getElementById('termForm');

    if (!input || !output || !form) return;

    const COMMANDS = {
      help: () => `
ARCHIVAL CONSOLE V1.0.4 [DOC-ID: JN-MASSEY-PHYS]
Available Commands:
  help      - Print this instruction docket
  bio       - Display doctoral credentials & affiliation
  research  - Summary of condensed matter theoretical domains
  code      - High-performance Julia ecosystem (Rimu.jl, KrylovKit)
  slurm     - Query simulated cluster batch array queue
  pubs      - Bibliographic dossier of recent publications
  contact   - Massey email, PGP fingerprint, GitHub
  theme     - Toggle between [Archival Paper] and [Terminal Phosphor]
  clear     - Flush console output buffer
  uname     - Display hardware and kernel architecture
      `.trim(),

      bio: () => `
JYOTIRAJ (RAJ) NATH
Doctoral Researcher, Theoretical & Computational Physics
Massey University (Auckland, New Zealand)
Research Group: Prof. Joachim Brand
Alumnus: Inria Paris-Saclay (2025), SVNIT Surat (MSc Physics)
Focus: Quantum many-body dynamics, BEC bright solitons, FCIQMC.
      `.trim(),

      research: () => `
CURRENT THEORETICAL COORDINATES:
1. Bose-Einstein Condensates: Bright soliton collisions in attractive 1D waveguides.
2. Stochastic Quantum Dynamics: Full Configuration Interaction Quantum Monte Carlo (FCIQMC).
3. 1D Extended Fermi-Hubbard: Biorthogonal spectral flows and Floquet quench physics.
4. Matrix Product States: DMRG ground-state and real-time entanglement growth.
      `.trim(),

      code: () => `
COMPUTATIONAL REPOSITORIES & JULIA ECOSYSTEM:
- Rimu.jl & RimuRealTime.jl: Real-time FCIQMC dynamics, LeapfrogComplex evolver, InternalCoherence.
- FermiHubbard1D.jl: Exact diagonalization and Krylov projection for strongly correlated fermions.
- SingleQubitSynthesis: Fault-tolerant Clifford+T gate decomposition (Inria Saclay).
Stack: Julia (DataFrames, Plots, JLD2, KrylovKit), PyTorch, PennyLane, Qiskit.
      `.trim(),

      slurm: () => `
[JOBID]   [PARTITION] [NAME]        [USER]     [ST] [TIME]      [NODES] [NODELIST]
892104    gpu-a100    fciqmc_rt     jnath      R    14:22:10    4       node[04-07]
892105    parallel    gpe_soliton   jnath      R    08:45:12    2       node[12-13]
892106    batch       fermi_ed      jnath      PD   00:00:00    1       (Priority)
STATUS: Cluster load 84.2% // All nodes nominal.
      `.trim(),

      pubs: () => `
RECENT PAPERS & PREPRINTS:
[1] "Real-Time Dynamics in Configuration Interaction Quantum Monte Carlo"
    Joachim Brand, Jyotiraj Nath, Matija Čufar, C. J. Bradly (Preprint 2026)
[2] "Collisional Phase Shifts and Quantum Fluctuations of Bright Solitons in Attractive BEC Waveguides"
    Jyotiraj Nath, Ray Yang, Elke Pahl, Joachim Brand (In Review 2026)
[3] "Algorithmic Synthesis of Fault-Tolerant Clifford+T Decompositions for Single-Qubit Unitaries"
    Inria Paris-Saclay Internship Monograph (2025)
      `.trim(),

      contact: () => `
ACADEMIC CONTACT DOSSIER:
- Institutional: j.nath@massey.ac.nz
- Lab: brand-lab.massey.ac.nz
- GitHub: https://github.com/jyotiraj-code
- ORCID: 0009-0005-4705-7798
- Location: Massey University, Albany Campus, Auckland, New Zealand
- PGP Fingerprint: 4B8F 921A 7C30 E15F 8892  B0D4 319C F082 E8A1 99D1
      `.trim(),

      theme: () => {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.click();
        return 'Toggled color scheme mode.';
      },

      clear: () => {
        output.innerHTML = '';
        return null;
      },

      uname: () => `Darwin auckland-node 26.6.2 Darwin Kernel Version 26.6.2; root:xnu-10063.141.2/RELEASE_ARM64_T8112 arm64 (Apple M2)`,

      ls: () => `dossier/  research/  code/  learnings/  essays/  archive/  colophon/  rimu_sim.jl  slurm_submit.sh`
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) return;

      const cmd = raw.toLowerCase().split(' ')[0];

      // Append user command line
      const line = document.createElement('div');
      line.className = 'flex items-center gap-2 text-paper-margin dark:text-terminal-muted mt-2';
      line.innerHTML = `<span class="text-paper-red dark:text-terminal-amber">jnath@massey:~$</span> <span>${escapeHtml(raw)}</span>`;
      output.appendChild(line);

      // Execute command
      if (COMMANDS[cmd]) {
        const result = COMMANDS[cmd]();
        if (result !== null) {
          const resp = document.createElement('div');
          resp.className = 'whitespace-pre-wrap font-mono text-xs text-paper-carbon dark:text-terminal-fg my-1 pl-4 border-l-2 border-paper-red dark:border-terminal-amber';
          resp.textContent = result;
          output.appendChild(resp);
        }
      } else {
        const err = document.createElement('div');
        err.className = 'font-mono text-xs text-paper-red dark:text-terminal-crimson my-1';
        err.textContent = `zsh: command not found: ${cmd}. Type 'help' for catalog.`;
        output.appendChild(err);
      }

      input.value = '';
      output.scrollTop = output.scrollHeight;
    });

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m]));
    }
  });
})();

