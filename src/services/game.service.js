import { SPAWN } from '/src/enums/spawn.enum.js';

export function initGameVariables() {
    var spawning = false;
    var spawnTimeReset = SPAWN.TIME_START;
    var spawnTime = spawnTimeReset;
    var score = 0;
    var highScore = 0;
    var bxt1 = 0;
    var byt1 = 0;
    var bxt2 = 0;
    var byt2 = 0;

    return { spawning, spawnTimeReset, spawnTime, score, highScore, bxt1, byt1, bxt2, byt2 };
}