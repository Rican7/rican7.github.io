(function() {
    console.log('Trevor says hi 👋');

    const heroCardContainerElement = document.querySelector('.hero-card-container');

    heroCardContainerElement.addEventListener('click', function () {
        let flipping = heroCardContainerElement.classList.toggle('is-flipped');

        heroCardContainerElement.classList.toggle('is-unflipped', !flipping);
    });
})()
