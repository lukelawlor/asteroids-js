import { GAME } from '/src/enums/game.enum.js';

export function setupCanva(document) {
    var cv = document.getElementById("can");
    cv.width = GAME.WIDTH;
    cv.height = GAME.HEIGHT;

    var c = cv.getContext("2d", { alpha: false });
    c.imageSmoothingEnabled = false;
    c.fillStyle = "#ffffff";

    return { cv, c };
}