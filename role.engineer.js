var roleAlt = require('role.builder')
var jxCommon = require("jxCommon")
var _ = require('lodash')
var flagToConstruct

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        //creep.say('eng...')
        if(undefined == Memory.flagToConstruct){
            flagToConstruct = Memory.flagToConstruct
        }else{
            flagToConstruct = 'Flag1'
        }
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false
        }  
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
                 // find closest structure with less than max hits
                // Exclude walls because they have way too many max hits and would keep
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < (s.hitsMax*0.8) &&
                     s.structureType != STRUCTURE_WALL
                })

                // if we find one
                if (structure != undefined) {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure)
                    }
                }
                // if we can't fine one
                else {
                    creep.memory.FlagIr = flagToConstruct
                    // look for construction sites
                    roleAlt.run(creep)
                }
        }
        // if creep is supposed to harvest energy from source
        else {
            jxCommon.getEnergy(creep)
         }
    }
}