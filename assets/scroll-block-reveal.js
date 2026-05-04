(function () {
  if (window.__scrollBlockRevealBound) return;
  window.__scrollBlockRevealBound = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function getRevealTargets(root) {
    if (root.dataset.scrollRevealUses === 'resource-list-items') {
      return Array.from(root.querySelectorAll('.resource-list__item')).filter((n) => n instanceof HTMLElement);
    }
    return Array.from(root.children).filter((n) => n instanceof HTMLElement);
  }

  function initRoot(root) {
    if (!(root instanceof HTMLElement) || root.dataset.blockRevealLoaded === 'true') return;

    const blocks = getRevealTargets(root);
    if (!blocks.length) return;

    root.dataset.blockRevealLoaded = 'true';

    if (reducedMotion.matches) {
      blocks.forEach((el) => el.classList.add('scroll-block-reveal--visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue;
          entry.target.classList.add('scroll-block-reveal--visible');
          io.unobserve(entry.target);
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    for (const el of blocks) {
      io.observe(el);
    }
  }

  function initAll(container) {
    const scope = container instanceof HTMLElement ? container : document;
    scope.querySelectorAll('[data-scroll-block-reveal]').forEach(initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (event) => {
    if (event.target instanceof HTMLElement) initAll(event.target);
  });
})();
