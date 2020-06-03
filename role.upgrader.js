var jxUtils = require("jxUtils")

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true
        }

        if(creep.memory.upgrading) {
            var x = creep.upgradeController(creep.room.controller)
            if( x == ERR_NOT_IN_RANGE && x != -1 ) {
                creep.moveTo(creep.room.controller)
            }
        }
        else {
           jxUtils.getEnergy(creep)
        }
    }
}

module.exports = roleUpgrader
