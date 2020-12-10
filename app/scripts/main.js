(() => {
  'use strict';

  console.log('Trevor says hi 👋');

  const heroCardContainerElement = document.querySelector(
    '.hero-card-container'
  );
  const heroImages = heroCardContainerElement.querySelectorAll('img');
  const contentExpandButton = document.querySelector('#content-expand');
  const secondaryContentElement = document.querySelector('.secondary-content');

  const classAnimating = 'animating';

  // Generic event listener functions for toggling animation states
  const fnAnimatingOn = event => {
    event.currentTarget.classList.add(classAnimating);
  };
  const fnAnimatingOff = event => {
    event.currentTarget.classList.remove(classAnimating);
  };

  Array.prototype.forEach.call(heroImages, element => {
    // Eagerly decode the images in the card container, to increase the
    // performance of the first animation
    if (typeof element.decode === 'function') {
      element.decode().then(() => {
        // Eagerly calculate the element's bounds, before the animation
        // has to calculate them "just-in-time"
        element.getBoundingClientRect();
      });
    }
  });

  // Add animation listeners for toggling animation states
  heroCardContainerElement.addEventListener('animationstart', fnAnimatingOn);
  heroCardContainerElement.addEventListener('animationend', fnAnimatingOff);

  // Add a click-listener for handling the card flipping
  heroCardContainerElement.addEventListener('click', () => {
    // If the element is currently animating...
    if (heroCardContainerElement.classList.contains(classAnimating)) {
      // Do nothing and return early, to not interrupt the animation
      return;
    }

    let isFlipped = heroCardContainerElement.classList.toggle('is-flipped');

    if (isFlipped) {
      heroCardContainerElement.classList.remove('is-unflipped');
    } else {
      heroCardContainerElement.classList.add('is-unflipped');
    }
  });

  // Add a click-listener for handling the content expansion
  contentExpandButton.addEventListener('click', () => {
    contentExpandButton.classList.toggle('opened');
    secondaryContentElement.classList.toggle('closed');
  });
})();
