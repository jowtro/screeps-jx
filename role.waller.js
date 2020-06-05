//if creep has nothing to do run as a builder
var roleBuilder = require('role.builder')
var percent = 0.001 // ex: 0.5 = 50%
const optionsVisual = { reusePath: 50, visualizePathStyle: { stroke: '#74FE63' } }
//Keep the maintenance of the base structure
function maintainStructures(creep) {
    var structure = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
            return s.hits < (s.hitsMax * percent) && s.structureType != STRUCTURE_RAMPART
        }
    })
    if (structure.length > 0) {
        //Give priority to the ramparts
        if (structure[0] !== undefined) {
            if (creep.repair(structure[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure[0],optionsVisual)
            }
        }
    }
    //Otherwise start to maintain the walls
    else {
        var structure = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.hits < (s.hitsMax * percent) && s.structureType != STRUCTURE_WALL
            }
        })
        if (structure[0] !== undefined) {
            console.log(structure)
            if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure,optionsVisual)
            }
        } else {
            console.log(creep.name + " waller doesn't find anything to fix.")
            roleBuilder.run(creep)
        }
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
        }
        else {
            creep.suicide()
        }
    }
}
