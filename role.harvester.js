let jxCommon = require("jxCommon")
const optionsVisual = { reusePath: 50, visualizePathStyle: { stroke: '#74FE63' } }

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
                        jxCommon.findPlaceToHarvest(creep)
                    } else {
                        jxCommon.goToHarvest(creep)
                    }
                }
            } catch (error) {
                creep.say('PlaceFlag1', false)
            }

        }
        else {
            //If it's not harvesting anymore it will find a place to drop its resources
            jxCommon.equalizeEnergyBetweenStorages(creep)
        }
    }
}

module.exports = roleHarvester
