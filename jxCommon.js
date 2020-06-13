/*
 * Jonnas Schlottfeldt 01/06/2020
 * */
const myStructuresToDeposit = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]
const myContainersAndWeapons = [STRUCTURE_CONTAINER, STRUCTURE_TOWER]
var jxCommon = {
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
    goToHarvest: function (creep) {
        if (creep.memory.currentSource == undefined) {
            jxCommon.findPlaceToHarvest(creep)
        }
        if (creep.harvest(Game.getObjectById(creep.memory.currentSource)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.currentSource), { visualizePathStyle: { stroke: '#CCC' } })
        }
    },
    getEnergyFromContainers: creep => {
        const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType === STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0
            }
        })
        //console.log(`Extension: ${extension} Container: ${container}`)
        if (container != null) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('cont⚡', false)
                creep.moveTo(container)
            }
        }
    },
    getEnergy: creep => {
        if (creep.room.storage != undefined && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
            if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('get 🔋', false)
                creep.moveTo(creep.room.storage)
            }
        } else {
            //GET ENERGY FROM SPAWN EXTENSIONS OR CONTAINERS
            let extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return myStructuresToDeposit.includes(s.structureType) && s.store[RESOURCE_ENERGY] > 0
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
        }


    },
    pickupEnergyFromGround(creep) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (target) {
            creep.memory.harvesting = false
            creep.memory.pickingEnergy = true
            if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.say('pick ⚡', false)
                creep.moveTo(target, { visualizePathStyle: { stroke: '#CCC' } })
            }
        } else {
            creep.memory.harvesting = true
            creep.memory.pickingEnergy = false
        }
    },
    findGoStructuresToDeposit(creep) {
        let container = null
        let extension = null

        if (Memory.GameDepositEnergyToMyContainers) {
            container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return myContainersAndWeapons.includes(s.structureType) && s.store[RESOURCE_ENERGY] < s.store.getCapacity()
                }
            })
        }

        if (Memory.GameDepositEnergyToMySpawn) {
            extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType === STRUCTURE_SPAWN ||
                        s.structureType === STRUCTURE_EXTENSION ||
                        s.structureType === STRUCTURE_TOWER) && s.energy < s.energyCapacity
                }
            })
        }

        if (extension != null || container != null && !Memory.GameDepositEnergyToMyStorage) {
            if (creep.transfer(container != null ? container : extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('dep 🔋', false)
                creep.moveTo(container != null ? container : extension)
            }
        } else if (creep.room.storage != undefined) {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('sto 🔋', false)
                creep.moveTo(creep.room.storage)
            }
        }
    },
    findGoSpawnToDeposit(creep) {
        let extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => {
                return myStructuresToDeposit.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        })
        //To accelerate the process of storage energy until 600 deposit in container
        //You must have containers near the energy sources 
        //if (extension != null && Memory.energyInStock <= 2000) {
        if (extension != null) {
            if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('🔋 spawn', false)
                creep.moveTo(extension, { visualizePathStyle: { stroke: '#74FE63' } })
            }
        } else {
            //if all the "My_Structures are full find neutral structures to deposit energy."
            this.findGoStructuresToDeposit(creep)
        }
    },
    equalizeEnergyBetweenStorages: creep => {
        let hasEnergyToWithdraw = true
        // fill the deposit till is full after that start to fill the my_structure deposits
        if (creep.carry.energy < creep.carryCapacity) {
            //Container isn't considered your structure that's why we don't use FIND_MY_STRUCTURE!
            jxCommon.getEnergy(creep)
        } else {
            hasEnergyToWithdraw = false
        }

        if (!hasEnergyToWithdraw) {
            jxCommon.findGoSpawnToDeposit(creep)

        }
    }
}

module.exports = jxCommon