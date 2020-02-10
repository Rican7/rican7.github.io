(() => {
  'use strict';

  console.log('Trevor says hi 👋');

  const heroCardContainerElement = document.querySelector(
    '.hero-card-container'
  );
  const heroImages = heroCardContainerElement.querySelectorAll('img');
  const contentExpandButton = document.querySelector('#content-expand');
  const secondaryContentElement = document.querySelector('.secondary-content');

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

  // Add a click-listener for handling the card flipping
  heroCardContainerElement.addEventListener('click', () => {
    let flipping = heroCardContainerElement.classList.toggle('is-flipped');

    if (flipping) {
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
