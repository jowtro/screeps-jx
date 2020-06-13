var jxCommon = require("jxCommon")
var _ = require('lodash')


//TODO -WIP-
const roleEqualizer = {
    run: creep => {
        if (creep.carry.energy == creep.carryCapacity) {
            jxCommon.findGoStructuresToDeposit(creep)
        } else if (creep.carry.energy == 0) {
            jxCommon.getEnergyFromContainers(creep)
        }
        if (!Memory.GameDepositEnergyToMyStorage) {
            creep.say('end', false)
        }
    }
}

module.exports = roleEqualizer