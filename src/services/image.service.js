export function initImages() {
    var sSpaceship = new Image(); sSpaceship.src = "/images/ship.png";
    var sBullet = new Image(); sBullet.src = "/images/bullet.png";
    var sAsteroid = new Image(); sAsteroid.src = "/images/asteroid.png";
    var sAlert1 = new Image(); sAlert1.src = "/images/alert1.png";
    var sAlert2 = new Image(); sAlert2.src = "/images/alert2.png";
    var sBg1 = new Image(); sBg1.src = "/images/bg1.png";
    var sBg2 = new Image(); sBg2.src = "/images/bg2.png";

    var imagesLoaded = 0;
    var imagesNeeded = 7;
    var imagesToLoad = [sSpaceship, sBullet, sAsteroid, sAlert1, sAlert2, sBg1, sBg2];

    return { sSpaceship, sBullet, sAsteroid, sAlert1, sAlert2, sBg1, sBg2, imagesLoaded, imagesNeeded, imagesToLoad };
}