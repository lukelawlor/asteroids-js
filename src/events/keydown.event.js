export function keyDown(e, kl, kr, kd, ku, k1, k2) {
    switch (e.key) {
        case 'ArrowLeft': { kl = 1; e.preventDefault(); break; }
        case 'ArrowRight': { kr = 1; e.preventDefault(); break; }
        case 'ArrowDown': { kd = 1; e.preventDefault(); break; }
        case 'ArrowUp': { ku = 1; e.preventDefault(); break; }
        case 'z': { k1 = 1; break; }
        case 'Enter': { k2 = 1; break; }
    }
}