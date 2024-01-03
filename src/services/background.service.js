import { GAME } from '/src/enums/game.enum.js';

export function drawBg(c, sBg1, sBg2, bxt1, byt1, bxt2, byt2) {
    // Vars
    var bw1 = sBg1.width;
    var bh1 = sBg1.height;
    var bw2 = sBg1.width;
    var bh2 = sBg1.height;

    // Increase ticks
    if ((bxt1 += 0.3) > bw1)
        bxt1 = 0;
    if ((byt1 += 0.1) > bh1)
        byt1 = 0;

    if ((bxt2 += 0.2) > bw2)
        bxt2 = 0;
    if ((byt2 += 0.05) > bh2)
        byt2 = 0;

    // Draw
    for (var x = -bw2 + bxt2; x < GAME.WIDTH + bw2; x += bw2) {
        for (var y = -bh2 + byt2; y < GAME.HEIGHT + bh2; y += bh2) {
            c.drawImage(sBg2, x, y);
        }
    }

    for (var x = -bw1 + bxt1; x < GAME.WIDTH + bw1; x += bw1) {
        for (var y = -bh1 + byt1; y < GAME.HEIGHT + bh1; y += bh1) {
            c.drawImage(sBg1, x, y);
        }
    }

}