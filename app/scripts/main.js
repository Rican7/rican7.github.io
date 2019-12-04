(() => {
    console.log('Trevor says hi 👋');

    const heroCardContainerElement = document.querySelector('.hero-card-container');

    heroCardContainerElement.querySelectorAll('img').forEach(element => {
        // Eagerly decode the images in the card container, to increase the
        // performance of the first animation
        if (typeof element.decode === 'function') {
            element.decode().then(() => {
                // Eagerly calculate the element's bounds, before the animation
                // has to calculate them "just-in-time"
                element.getBoundingClientRect();
            });
        }
    })

    // Add a click-listener for handling the card flipping
    heroCardContainerElement.addEventListener('click', () => {
        let flipping = heroCardContainerElement.classList.toggle('is-flipped');

        heroCardContainerElement.classList.toggle('is-unflipped', !flipping);
    });
})()
