import { GAME } from '/src/enums/game.enum.js';

// Draw an object normally, and as it wraps across the screen
// Precondition: object has a draw() function
export function oDrawWrap() {
    var xstop = this.x + GAME.WIDTH;
    var ystop = this.y + GAME.HEIGHT;

    for (var x = this.x - GAME.WIDTH - 1; x <= xstop; x += GAME.WIDTH) {
        for (var y = this.y - GAME.HEIGHT - 1; y <= ystop; y += GAME.HEIGHT) {
            this.draw(x, y);
        }
    }
}

export function oWorldWrap() {
    if (this.x > GAME.WIDTH)
        this.x = GAME.WIDTH - this.x;
    else if (this.x < 0)
        this.x = GAME.WIDTH + this.x;

    if (this.y > GAME.HEIGHT)
        this.y = GAME.HEIGHT - this.y;
    else if (this.y < 0)
        this.y = GAME.HEIGHT + this.y;
}