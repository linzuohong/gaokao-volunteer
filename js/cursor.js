/**
 * Custom cursor — responsive spring follow, space-themed
 */
(function() {
  'use strict';

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const outer = document.createElement('div');
  outer.className = 'cursor-outer';
  const inner = document.createElement('div');
  inner.className = 'cursor-inner';
  document.body.appendChild(outer);
  document.body.appendChild(inner);

  let cx = 0, cy = 0, ox = 0, oy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    cx = tx; cy = ty;
    inner.style.left = cx + 'px';
    inner.style.top = cy + 'px';
  });

  document.addEventListener('mousedown', () => outer.classList.add('cursor-outer--click'));
  document.addEventListener('mouseup', () => outer.classList.remove('cursor-outer--click'));

  const hoverSel = 'a,button,input,select,.card,.uni-card,.chip,.accordion__trigger,.btn,.checklist__item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) outer.classList.add('cursor-outer--hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) outer.classList.remove('cursor-outer--hover');
  });

  function animate() {
    const ease = 0.28;
    ox += (tx - ox) * ease;
    oy += (ty - oy) * ease;
    outer.style.left = ox + 'px';
    outer.style.top = oy + 'px';
    requestAnimationFrame(animate);
  }
  ox = window.innerWidth / 2;
  oy = window.innerHeight / 2;
  outer.style.left = ox + 'px';
  outer.style.top = oy + 'px';
  animate();

  document.addEventListener('mouseleave', () => { outer.style.opacity = '0'; inner.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { outer.style.opacity = '1'; inner.style.opacity = '1'; });
})();
