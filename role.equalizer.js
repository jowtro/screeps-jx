var jxUtils = require("jxUtils")
var _ = require('lodash')


//TODO -WIP-
const roleEqualizer = {
    run: creep => {
        if(creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = false
        }
        if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.hauling = true
        }
        if(creep.memory.hauling) {
            jxUtils.equalizeEnergyBetweenStorages(creep)
        }else{
            creep.suicide()
        }
    }
}

module.exports = roleEqualizer