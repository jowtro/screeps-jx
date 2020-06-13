//if creep has nothing to do run as a builder
var roleBuilder = require('role.builder')
const jxCommon = require('jxCommon')
const percent = 0.0001 // ex: 0.5 = 50%
const optionsVisual = { reusePath: 50, visualizePathStyle: { stroke: '#74FE63' } }
//Keep the maintenance of the base structure
function maintainStructures(creep) {
    //Otherwise start to maintain the walls
    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && (s.hits < (s.hitsMax * percent))
    })
    if (structure != null) {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure, optionsVisual)
        }
    } else {
        console.log(creep.name + " waller doesn't find anything to fix.")
        creep.suicide()
    }

}

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            maintainStructures(creep)
        } else {
            jxCommon.getEnergy(creep)
        }
    }
}
