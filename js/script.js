document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.players-section');
  if (!section) return;

  const cards = section.querySelectorAll('.player-card');
  const description = section.querySelector('.players-description');
  let firstFlipScrollY = null;
  let descriptionShown = false;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));

      // The description is unlocked only after a card has been flipped.
      // Record the scroll position at that moment, not on page load.
      if (flipped && firstFlipScrollY === null) {
        firstFlipScrollY = window.scrollY;
      }
    });
  });

  function onScroll() {
    if (!description || descriptionShown || firstFlipScrollY === null) return;

    // Require an actual downward scroll after the first card flip.
    // Do not rely on the description's viewport position: it can already
    // be in view on large screens, making the interaction unreliable.
    if (window.scrollY >= firstFlipScrollY + 12) {
      descriptionShown = true;
      description.classList.add('is-visible');
      description.setAttribute('aria-hidden', 'false');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});
