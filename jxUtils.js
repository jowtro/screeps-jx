/*
 * Jonnas Schlottfeldt 21/08/2016
 * */
var jxUtils = {
    //IF CREEPS are standing still.
    creepDoingNothing: creep => {
        if (undefined === creep.memory.currentPosList) {
            creep.memory.currentPosList = []
        } else {
            creep.memory.currentPosList.push([creep.pos.x, creep.pos.y])
        }
        if (creep.memory.currentPosList.length >= 5) {
            let lastPos = undefined
            let flagAllEq = true
            for (let i = 0; i < creep.memory.currentPosList.length; i++) {
                if (lastPos == undefined) {
                    lastPos = creep.memory.currentPosList[i]
                }
                //If the same vector is equal to all positions in array.
                if (lastPos[0] === creep.memory.currentPosList[i][0] && lastPos[1] === creep.memory.currentPosList[i][1]) {
                    lastPos = creep.memory.currentPosList[i]
                    //console.log(`${creep.name} ${creep.memory.currentPosList}`)
                } else {
                    flagAllEq = false
                    creep.memory.currentPosList = []
                    break
                }
            }
            //⚠️ if it is stopped! 
            if (flagAllEq) {
                creep.memory.currentPosList = []
                //creep.say('⚠️ moving', false)
                creep.moveTo(Game.flags.Flag1);
            }
        }

    },
    findPlaceToHarvest: creep => {
        if (undefined == creep.memory.currentSource) {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE)
            var source = sources[Math.floor(Math.random() * sources.length) + 0]
            creep.memory.currentSource = source.id
        }

    },

    findEnergyDropped: function (creep) {
        var energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
        if (energy.length > 0) {
            creep.memory.gettingDroppedEnergy = true
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }
        } else { creep.memory.gettingDroppedEnergy = false }
    },
    decrementSourceCounter: function (currentSource) {
        var indexFound
        for (let i in Memory.sources['sources']) {
            if (Memory.sources['sources'][i].id === currentSource) {
                indexFound = i
            }
        }
        if (undefined !== indexFound) {
            var cnt = parseInt(Memory.sources['sources'][indexFound].creepsAt)
            Memory.sources['sources'][indexFound].creepsAt = --cnt
        }
    },
    gotoHarvester: function (creep) {
        if (creep.memory.currentSource == undefined) {
            jxUtils.findPlaceToHarvest(creep)
        }
        if (creep.harvest(Game.getObjectById(creep.memory.currentSource)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.currentSource), { visualizePathStyle: { stroke: '#CCC' } })
        }
    },
    getEnergy: creep => {
        const extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => {
                return (s.structureType === STRUCTURE_EXTENSION) && s.energy > 0
            }
        })
        //Container isn't considered your structure that's why we don't use FIND_MY_STRUCTURE!
        const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType === STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0
            }
        })
        //console.log(`Extension: ${extension} Container: ${container}`)
        if (extension != null || container != null) {
            if (creep.withdraw(container != null ? container : extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('⚡', false)
                creep.moveTo(container != null ? container : extension)
            }
        }

    },
    equalizeEnergyBetweenStorages: creep => {
        if (creep.carry.energy == creep.carryCapacity) {
            var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN) &&
                        s.energy < s.energyCapacity * 0.1
                }
            })
            if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage)
            }
        } else {
            jxUtils.findContainerToGet(creep)
        }
    }
}

module.exports = jxUtils