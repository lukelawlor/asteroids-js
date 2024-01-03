import { INSTANCES } from '/src/enums/instances.enum.js';

export function initInstancesParams() {
    var inst = new Array(INSTANCES.MAX);
    var instNext = 0;

    return { inst, instNext }
}

export function killInst(inst, o) {
    inst[o.id] = null;
}