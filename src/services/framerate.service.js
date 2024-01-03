export function initFramerateParams() {
    var frameLast = Date.now();
    var frameNow = frameLast;
    var fps = 0;

    return { frameLast, frameNow, fps };
}

export function updateFramerate(frameNow, fps, frameLast) {
    frameNow = Date.now();
    fps = Math.round(1000 / (frameNow - frameLast));
    frameLast = frameNow;
}