let jxUtils = require("jxUtils")
const optionsVisual = { reusePath: 50, visualizePathStyle: { stroke: '#74FE63' } }

function findGoStructuresToDeposit(creep) {
    let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => {
            return (s.structureType === STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] < s.store.getCapacity()
        }
    })
    let extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (s) => {
            return (s.structureType === STRUCTURE_SPAWN ||
                s.structureType === STRUCTURE_EXTENSION ||
                s.structureType === STRUCTURE_TOWER) && s.energy < s.energyCapacity
        }
    })

    if (extension != null || container != null) {
        if (creep.transfer(container != null ? container : extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.say('⚡', false)
            creep.moveTo(container != null ? container : extension)
        }
    }
}

function pickupEnergy(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var energy = creep.room.find(FIND_DROPPED_RESOURCES)

        if (undefined != energy) {
            if (energy.length > 0) {
                creep.moveTo(energy[0], optionsVisual)
                creep.say('Found ⚡', false)
                creep.pickup(energy[0])
            }
        }
    }
}

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //Work Conditions-----------------------------#
        if (creep.memory.FlagIr === undefined) {
            creep.memory.FlagIr = 'Flag1'
        }
        //IF hasn't energy it will be mining...
        if (!creep.memory.harvesting && creep.carry.energy === 0) {
            creep.memory.harvesting = true
        }
        //If the creep is full..
        if (creep.memory.harvesting && (creep.carry.energy == creep.carryCapacity)) {
            creep.memory.harvesting = false
        }
        //END-----Work conditions---------------------#

        //IF it's collecting
        if (creep.memory.harvesting) {
            try {
                //If creep can't find its resource
                if (undefined === Game.flags[creep.memory.FlagIr].room && creep.moveTo(Game.flags[creep.memory.FlagIr]) == OK) {
                    creep.moveTo(Game.flags[creep.memory.FlagIr])
                    creep.memory.currentSource = undefined
                } else {
                    if (creep.memory.currentSource === undefined && Game.flags[creep.memory.FlagIr].room != undefined) {
                        jxUtils.findPlaceToHarvest(creep)
                    } else {
                        pickupEnergy(creep)
                        jxUtils.gotoHarvester(creep)
                    }
                }
            } catch (error) {
                creep.say('PlaceFlag1', false)
            }

        }
        else {
            //If it's not harvesting anymore it will find a place to drop its resources
            findGoStructuresToDeposit(creep)
        }
    }
}

module.exports = roleHarvester
