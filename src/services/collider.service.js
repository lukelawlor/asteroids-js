import { getInst } from '../../asteroids';
import { INSTANCES } from '/src/enums/instances.enum.js';

// Check for a collision between two rectangles
// Pass the variables for the smaller rectangle first
export function checkRect(x1, y1, w1, h1, x2, y2, w2, h2) {
    var x12 = x1 + w1;
    var y12 = y1 + h1;
    var x22 = x2 + w2;
    var y22 = y2 + h2;

    if (x1 >= x2 && x1 <= x22) {
        //Left Side Hit
        if (y1 >= y2 && y1 <= y22) {
            //Top Side Hit
            return true;
        }
        if (y12 >= y2 && y12 <= y22) {
            // Bottom Side Hit
            return true;
        }
    }
    else if (x12 >= x2 && x12 <= x22) {
        // Right Side Hit
        if (y1 >= y2 && y1 <= y22) {
            //Top Side Hit
            return true;
        }
        if (y12 >= y2 && y12 <= y22) {
            // Bottom Side Hit
            return true;
        }
    }
    return false;
}

export function oCollideWithLarger(o, x1, y1, w1, h1, s1, s2, w2, h2) {
    var other;
    for (var i = 0; i < INSTANCES.MAX; ++i) {
        other = getInst()[i];
        if (other != null && other.o == o) {
            if (checkRect(x1, y1, w1, h1, other.x + s1, other.y + s2, w2, h2))
                return other;
        }
    }
    return null;
}

export function oCollideWithSmaller(o, x1, y1, w1, h1, s1, s2, w2, h2) {
    var other;
    for (var i = 0; i < INSTANCES.MAX; ++i) {
        other = getInst()[i];
        if (other != null && other.o == o) {
            if (checkRect(other.x + s1, other.y + s2, w2, h2, x1, y1, w1, h1))
                return other;
        }
    }
    return null;
}