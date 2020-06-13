let jxCommon = require("jxCommon")

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
            jxCommon.pickupEnergyFromGround(creep)
        }
        //If the creep is full..
        if (creep.memory.harvesting && (creep.carry.energy == creep.carryCapacity)) {
            creep.memory.harvesting = false
        }
        //has energy to get
        if(creep.memory.pickingEnergy && (creep.carry.energy < creep.carryCapacity)){
            jxCommon.pickupEnergyFromGround(creep)
        }else{
            creep.memory.pickingEnergy = false
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
                console.log(error)
                creep.say('PlaceFlag1', false)
            }

        }
        else if(!creep.memory.pickingEnergy) {
            //If it's not harvesting anymore it will find a place to drop its resources
            jxCommon.findGoStructuresToDeposit(creep)
        }
    }
}

module.exports = roleHarvester
