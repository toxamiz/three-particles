import {Vector3} from "three"

/**
 * Random number from min to max
 *
 * @param {int} min
 * @param {int} max
 * @return {number}
 */
export function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Random unit vector
 *
 * @return {Vector3}
 */
export function randomUnitVector3() {
    return new Vector3(random(-1, 1), random(-1, 1), random(-1, 1));
}
