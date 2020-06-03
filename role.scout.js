function goToClaim(creep) {
    console.log(creep.name + ' indo clamar o controller ' + creep.room.controller)
    if (creep.room.controller) {
        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
        }
    }
}

var roleScout = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.FlagIr)))  && Game.flags[creep.memory.FlagIr].room != creep.room) {
            creep.moveTo(Game.flags[creep.memory.FlagIr])
        } else {
            if (Game.flags[creep.memory.FlagIr].room != undefined) {
                goToClaim(creep)
            }
        }
    }
}

module.exports = roleScout
