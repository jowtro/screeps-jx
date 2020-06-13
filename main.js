require('prototype.spawn')()
const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')
const roleEngineer = require('role.engineer')
const roleWarrior = require('role.warrior')
const roleWaller = require('role.waller')
const roleTower = require('tower')
const roleScout = require('role.scout')
const roleEqualizer = require('role.equalizer')
const jx = require('jxCommon')
var _ = require('lodash')

const flagAttack = 'atacar'
const flagToConstruct = 'Flag1'
const harvestersCnt = 6 //Give priority to Harvester
const upgraderCnt = 1
const engineersCnt = 1
const warriorsCnt = 0
const scoutsCnt = 0
const wallersCnt = 0
let equalizerCnt = 0
let buildersCnt = 1
var flagClaim = 'claim'
let SECONDS = 30
const myContainers = [STRUCTURE_CONTAINER]

Memory.flagToConstruct = flagToConstruct
Memory.flagToConstructSpawn = 'spawn_create'
//Creates a super creep
Memory.createSuperCreepHarvester = false
Memory.createSuperCreepUpgrader = false
Memory.createSuperCreepWaller = false
Memory.createSuperCreepBuilder = false
Memory.GameDepositEnergyToMyContainers = true
Memory.GameDepositEnergyToMySpawn = false
//json Obj to store sources in Memory
if (Memory.sources === undefined) {
    Memory.sources = {
        sources: []
    }
}


module.exports.loop = function () {
    //kill them all
    //_.filter(Game.creeps, creeps => creeps.suicide())
    let creepCount = Object.keys(Game.creeps).length ? Object.keys(Game.creeps).length : 0
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory:', name)
        }
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
    var engineers = _.filter(Game.creeps, (creep) => creep.memory.role == 'engineer')
    var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior')
    var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout')
    var wallers = _.filter(Game.creeps, (creep) => creep.memory.role == 'waller')
    var equalizers = _.filter(Game.creeps, (creep) => creep.memory.role == 'equalizer')

    //Population Control ------------------------------------------------------
    for (let spawnX in Game.spawns) {
        //Get the amount of constructions sites and then set the builder value
        var targetsConstructions = Game.spawns[spawnX].room.find(FIND_CONSTRUCTION_SITES)
        buildersCnt = targetsConstructions.length > 0 ? 1 : 0
        Memory.energyInStock = Game.spawns[spawnX].room.energyAvailable
        if (Memory.energyInStock > 100) {
            // if not enough harvesters
            if (harvesters.length < harvestersCnt) {
                // try to spawn one
                var newCreep = Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'harvester')
                // if spawning failed and we have no harvesters left
                if (newCreep == ERR_NOT_ENOUGH_ENERGY && harvestersCnt == 0) {
                    // spawn one with what is available
                    Game.spawns[spawnX].createCustomCreep(Game.spawns[spawnX].room.energyAvailable, 'harvester')
                }
                break //produce  till the maximum value is reached.
            } if (upgraders.length < upgraderCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'upgrader')
                break//produce  till the maximum value is reached.
            } if (engineers.length < engineersCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'engineer')
                break//produce  till the maximum value is reached.
            } if (builders.length < buildersCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'builder')
            } if (scouts.length < scoutsCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'scout')
            } if (warriors.length < warriorsCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'warrior')
            } if (wallers.length < wallersCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'waller')
            } if (equalizers.length < equalizerCnt) {
                Game.spawns[spawnX].createCustomCreep(Memory.energyInStock, 'equalizer')
            }
        }

    }
    //----------------------------------------------------------------------------------

    let timeNow = Game.time
    //Show room status for each secsv ar
    if (undefined === Memory.tFuture) {
        Memory.tFuture = timeNow + SECONDS
    } else if (timeNow > Memory.tFuture) {
        console.log('#--------STATUS----------#')
        console.log(`hav: ${harvesters.length}/${harvestersCnt}`)
        console.log(`bld: ${builders.length}/${buildersCnt}`)
        console.log(`upg: ${upgraders.length}/${upgraderCnt}`)
        console.log(`eng: ${engineers.length}/${engineersCnt}`)
        console.log(`war: ${warriors.length}/${warriorsCnt}`)
        console.log(`equ: ${equalizers.length}/${equalizerCnt}`)
        console.log('total:' + creepCount)
        console.log('total energies:' + Memory.energyInStock)
        console.log(`Total Containers Full: ${Memory.fullContainers}`)
        console.log('#------------------------#')
        Memory.tFuture = timeNow + SECONDS
    }


    //In case of spawning show text
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
        Game.spawns['Spawn1'].room.visual.text(
            spawningCreep.memory.role, Game.spawns['Spawn1'].pos.x + 1, Game.spawns['Spawn1'].pos.y, { align: 'left', opacity: 0.8 }
        )
    }

    //Iterate over all creeps and execute its roles
    //---------------RUN CREEPS ---------------------
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        jx.creepDoingNothing(creep)

        // Run creeps 
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep)
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep)
        }
        if (creep.memory.role === 'builder') {
            if (undefined === creep.memory.FlagIr) {
                creep.memory.FlagIr = Memory.flagToConstruct
            }
            roleBuilder.run(creep)
        }
        if (creep.memory.role === 'engineer') {
            roleEngineer.run(creep)
        }
        if (creep.memory.role === 'waller') {
            roleWaller.run(creep)
        }
        if (creep.memory.role === 'warrior') {
            if (undefined == creep.memory.FlagIr) {
                creep.memory.FlagIr = flagAttack
            }
            roleWarrior.run(creep)
        }
        if (creep.memory.role === 'scout') {
            if (undefined == creep.memory.FlagIr) {
                creep.memory.FlagIr = flagClaim
            }
            roleScout.run(creep)
        }
        if (creep.memory.role === 'equalizer') {
            roleEqualizer.run(creep)
        }
    }
    //Tower AI
    //For each room
    for (let s in Game.spawns) {
        const containers = Game.spawns[s].room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return myContainers.includes(s.structureType)
            }
        })
        const fullContainers = containers.filter(s => {
            return myContainers.includes(s.structureType) && s.store[RESOURCE_ENERGY] === s.store.getCapacity()
        })
        const emptyContainers = containers.filter(s => {
            return myContainers.includes(s.structureType) && s.store[RESOURCE_ENERGY] === 0
        })

        const areContainersFull = fullContainers.length == containers.length
        const areContainersEmpty = emptyContainers.length == containers.length
        //console.log('areContainersEmpty ' + areContainersEmpty, 'areContainersFull ' + areContainersFull)
        if (areContainersFull) {
            Memory.GameDepositEnergyToMyContainers = false
            Memory.GameDepositEnergyToMySpawn = true
            Memory.GameDepositEnergyToMyStorage = true
            equalizerCnt = 2 // if container is full it needs to be empty
        } else if (areContainersEmpty) {
            Memory.GameDepositEnergyToMyContainers = true
            Memory.GameDepositEnergyToMySpawn = true
            Memory.GameDepositEnergyToMyStorage = false
            equalizerCnt = 0
        } else {
            Memory.GameDepositEnergyToMyContainers = true
            Memory.GameDepositEnergyToMySpawn = true
            Memory.GameDepositEnergyToMyStorage = false
        }



        if (Memory.energyInStock > 1100) {
            Memory.GameDepositEnergyToMyContainers = true
            Memory.GameDepositEnergyToMySpawn = false
        }


        let room = Game.spawns[s].room.name
        //STRATEGY
        roleTower.run(room)
        Memory.fullContainers = fullContainers.length
    }
}