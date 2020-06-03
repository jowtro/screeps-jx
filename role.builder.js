var jxUtils = require("jxUtils")
var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//If no energy set building to false
		if (creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false
			creep.say('🔄 harvest')
			jxUtils.getEnergy(creep)
		}
		//If has energy start to build
		if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true
			creep.say('🚧 build')
		}
		//If Building
		if (creep.memory.building) {
			if (Game.flags[creep.memory.FlagIr].room != creep.room) {
				//console.log(`movendo para contruir`)
				creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.FlagIr)))
			} else if (Game.flags[creep.memory.FlagIr].room == creep.room) {
				//console.log(`construindo`)
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
				if (targets.length > 0 && creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#CCC' } })
				}
			}
		}
		else {
			jxUtils.getEnergy(creep)
		 }
	}
}

module.exports = roleBuilder