/**
 * LIVELY CONNECTED GRAPH SITEMAP & ORBITAL TOPOLOGY HUD
 * Generates an interactive, physics-driven topological map of the archive
 * Jyotiraj (Raj) Nath - Archival Documentation System
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the container widget if not present
    let container = document.getElementById('sitemapGraphWidget');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sitemapGraphWidget';
      container.className = 'no-print';
      container.innerHTML = `
        <div id="sitemapGraphCard" class="ledger-box" style="position: fixed; bottom: 20px; right: 20px; z-index: 100; width: 270px; background: var(--bg-card); box-shadow: 4px 4px 0 var(--border-strong); border: 1px solid var(--border-strong); font-family: var(--font-mono); transition: transform 0.2s ease;">
          <div style="padding: 6px 10px; background: var(--bg-subtle); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: bold; letter-spacing: 0.06em;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="display: inline-block; width: 6px; height: 6px; background: var(--accent-red); border-radius: 50%;"></span>
              <span style="color: var(--fg-primary);">TOPOLOGY: SITEMAP</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <button id="sitemapGraphToggle" style="background: transparent; border: 1px solid var(--border-color); color: var(--fg-primary); padding: 0 4px; font-size: 9px; cursor: pointer;" title="Minimize/Expand">[−]</button>
            </div>
          </div>
          <div id="sitemapGraphBody" style="position: relative; padding: 4px; background: var(--bg-card);">
            <canvas id="sitemapCanvas" width="262" height="230" style="display: block; width: 262px; height: 230px; cursor: default;"></canvas>
            <div id="sitemapNodeTooltip" style="position: absolute; bottom: 8px; left: 8px; right: 8px; font-size: 9px; padding: 3px 6px; background: var(--bg-subtle); border: 1px dashed var(--border-color); color: var(--fg-muted); text-align: center; pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              CLICK BUBBLE TO RETRIEVE SECTION
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    }

    const card = document.getElementById('sitemapGraphCard');
    const body = document.getElementById('sitemapGraphBody');
    const toggleBtn = document.getElementById('sitemapGraphToggle');
    const canvas = document.getElementById('sitemapCanvas');
    const tooltip = document.getElementById('sitemapNodeTooltip');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Toggle minimize
    let isMinimized = false;
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isMinimized = !isMinimized;
      if (isMinimized) {
        body.style.display = 'none';
        toggleBtn.textContent = '[+]';
        card.style.width = '160px';
      } else {
        body.style.display = 'block';
        toggleBtn.textContent = '[−]';
        card.style.width = '270px';
      }
    });

    // Detect current route
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

    // Node definitions
    const NODES = [
      { id: '01', name: 'DOSSIER', label: '01/DOSSIER', url: '/', path: '/', desc: 'Coordinates & Academic Dossier', isCenter: true },
      { id: '02', name: 'RESEARCH', label: '02/RESEARCH', url: '/research/', path: '/research', desc: 'BECs, Solitons & FCIQMC' },
      { id: '03', name: 'CODE', label: '03/CODE', url: '/code/', path: '/code', desc: 'Julia Ecosystem & Slurm' },
      { id: '04', name: 'LEDGER', label: '04/LEDGER', url: '/learnings/', path: '/learnings', desc: 'Mathematical Changelog' },
      { id: '05', name: 'ESSAYS', label: '05/ESSAYS', url: '/essays/', path: '/essays', desc: 'Unfiltered Editorial Essays' },
      { id: '06', name: 'ARCHIVE', label: '06/ARCHIVE', url: '/archive/', path: '/archive', desc: 'Poetry, Acoustics & Terrain' },
      { id: '07', name: 'COLOPHON', label: '07/COLOPHON', url: '/colophon/', path: '/colophon', desc: 'M2 Air & System Manifesto' }
    ];

    // Edges between nodes
    const EDGES = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], // Star connections from Dossier
      [1, 2], // Research <-> Code
      [2, 3], // Code <-> Ledger
      [1, 4], // Research <-> Essays
      [5, 0], // Archive <-> Dossier
      [6, 2], // Colophon <-> Code
    ];

    // Walker particles traveling on edges (simulating quantum state transfer)
    const PARTICLES = [
      { edgeIdx: 0, progress: 0.1, speed: 0.008 },
      { edgeIdx: 1, progress: 0.4, speed: 0.006 },
      { edgeIdx: 6, progress: 0.7, speed: 0.007 },
      { edgeIdx: 8, progress: 0.2, speed: 0.009 },
      { edgeIdx: 9, progress: 0.5, speed: 0.005 }
    ];

    // Initialize node positions
    const centerX = canvas.width / 2;
    const centerY = (canvas.height - 20) / 2;
    const radius = 78;

    NODES.forEach((node, i) => {
      node.isActive = (node.path === '/' && (currentPath === '/' || currentPath === '')) ||
                      (node.path !== '/' && currentPath.startsWith(node.path));
      if (node.isCenter) {
        node.baseX = centerX;
        node.baseY = centerY;
      } else {
        const angle = ((i - 1) / (NODES.length - 1)) * Math.PI * 2 - Math.PI / 2;
        node.baseX = centerX + Math.cos(angle) * radius;
        node.baseY = centerY + Math.sin(angle) * (radius * 0.85);
      }
      node.x = node.baseX;
      node.y = node.baseY;
      node.targetRadius = node.isCenter ? 17 : 13;
      node.currRadius = node.targetRadius;
      node.hovered = false;
      node.phase = Math.random() * Math.PI * 2;
    });

    let hoveredNode = null;
    let mouseX = -1;
    let mouseY = -1;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      let found = null;
      for (const node of NODES) {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        if (dist <= node.currRadius + 6) {
          found = node;
          break;
        }
      }

      if (found !== hoveredNode) {
        hoveredNode = found;
        if (hoveredNode) {
          canvas.style.cursor = 'pointer';
          tooltip.innerHTML = `<strong style="color: var(--accent-red);">${hoveredNode.label}:</strong> ${hoveredNode.desc} ↵`;
        } else {
          canvas.style.cursor = 'default';
          tooltip.textContent = 'CLICK BUBBLE TO RETRIEVE SECTION';
        }
      }
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredNode = null;
      mouseX = -1;
      mouseY = -1;
      canvas.style.cursor = 'default';
      tooltip.textContent = 'CLICK BUBBLE TO RETRIEVE SECTION';
    });

    canvas.addEventListener('click', () => {
      if (hoveredNode) {
        // Ripple & navigate
        window.location.href = hoveredNode.url;
      }
    });

    // Animation Loop
    let time = 0;
    function animate() {
      if (!isMinimized) {
        time += 0.025;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isPhosphor = document.documentElement.getAttribute('data-theme') === 'phosphor';
        const edgeColor = isPhosphor ? 'rgba(40, 40, 44, 0.9)' : 'rgba(209, 203, 191, 0.9)';
        const activeEdgeColor = isPhosphor ? '#059669' : '#942A27';
        const nodeFill = isPhosphor ? '#141416' : '#FAF8F5';
        const nodeStroke = isPhosphor ? '#52525B' : '#1A1A1C';
        const textFill = isPhosphor ? '#E2E0D8' : '#1A1A1C';
        const activeColor = isPhosphor ? '#D97706' : '#942A27';

        // Update physics positions
        NODES.forEach((node, i) => {
          if (!node.isCenter) {
            node.x = node.baseX + Math.sin(time * 0.8 + node.phase) * 3.5;
            node.y = node.baseY + Math.cos(time * 0.6 + node.phase) * 3.0;
          } else {
            node.x = node.baseX + Math.sin(time * 0.4) * 1.5;
            node.y = node.baseY + Math.cos(time * 0.5) * 1.5;
          }

          if (node === hoveredNode) {
            node.currRadius += (node.targetRadius * 1.35 - node.currRadius) * 0.2;
          } else {
            node.currRadius += (node.targetRadius - node.currRadius) * 0.2;
          }
        });

        // Draw Edges
        EDGES.forEach(([i, j]) => {
          const n1 = NODES[i];
          const n2 = NODES[j];
          const isHighlighted = (hoveredNode === n1 || hoveredNode === n2);

          ctx.beginPath();
          ctx.setLineDash(isHighlighted ? [] : [2, 2]);
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = isHighlighted ? activeEdgeColor : edgeColor;
          ctx.lineWidth = isHighlighted ? 1.5 : 1;
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Draw traveling quantum particles
        PARTICLES.forEach(p => {
          p.progress = (p.progress + p.speed) % 1.0;
          const [i, j] = EDGES[p.edgeIdx];
          const n1 = NODES[i];
          const n2 = NODES[j];
          const px = n1.x + (n2.x - n1.x) * p.progress;
          const py = n1.y + (n2.y - n1.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = activeColor;
          ctx.fill();
        });

        // Draw Nodes
        NODES.forEach((node) => {
          // If active page, draw pulsing orbital ring
          if (node.isActive) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.currRadius + 4 + Math.sin(time * 2) * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = activeColor;
            ctx.setLineDash([2, 2]);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Node body
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.currRadius, 0, Math.PI * 2);
          ctx.fillStyle = node === hoveredNode 
            ? (isPhosphor ? '#1F1F23' : '#EDE8DE')
            : (node.isActive ? (isPhosphor ? '#18181A' : '#EDE8DE') : nodeFill);
          ctx.fill();

          ctx.strokeStyle = node.isActive || node === hoveredNode ? activeColor : nodeStroke;
          ctx.lineWidth = node.isActive || node === hoveredNode ? 2 : 1;
          ctx.stroke();

          // Monospace Node Label inside or adjacent
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.isActive || node === hoveredNode ? activeColor : textFill;
          ctx.fillText(node.id, node.x, node.y);

          // External label
          ctx.font = '7px monospace';
          ctx.fillStyle = node.isActive ? activeColor : (isPhosphor ? '#71717A' : '#78716C');
          const labelOffsetY = node.isCenter ? -node.currRadius - 6 : (node.y > centerY ? node.currRadius + 8 : -node.currRadius - 6);
          ctx.fillText(node.name, node.x, node.y + labelOffsetY);
        });

        // Coordinates stamp in corner
        ctx.font = '7px monospace';
        ctx.fillStyle = isPhosphor ? '#52525B' : '#A8A29E';
        ctx.textAlign = 'left';
        ctx.fillText(`ψ(t) [NODES:7 EDGES:11]`, 6, 14);
        ctx.textAlign = 'right';
        ctx.fillText(`STATION: NZST`, canvas.width - 6, 14);
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
})();
