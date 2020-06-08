module.exports = function () {
    // create a new function for StructureSpawn
    //FIXME NEEDS A REFACTORING!!!!
    StructureSpawn.prototype.createCustomCreep =
        function (energy, roleName) {
            const specificJobs = ['warrior', 'scout']
            const essentialJobs = ['upgrader', 'waller', 'harvester', 'builder']
            var body = []

            if (energy >= 1200) {
                Memory.createSuperCreepHarvester = true
                Memory.createSuperCreepUpgrader = true
                Memory.createSuperCreepWaller = true
                Memory.createSuperCreepBuilder = true
            } else {
                Memory.createSuperCreepHarvester = false
                Memory.createSuperCreepUpgrader = false
                Memory.createSuperCreepWaller = false
                Memory.createSuperCreepBuilder = false
            }

            if (roleName === 'scout' && energy >= 800) {
                body = [CLAIM, CARRY, CARRY, MOVE, WORK] //800 energy
            } else if (roleName === 'warrior' && energy >= 460) {
                body = [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK]
            } else if (!(roleName in specificJobs)) {
                //TODO ADD CONST ROLE NAME 
                //SUPER CREEP PRIORITY
                if (energy > 1200 && (roleName in essentialJobs) && Memory.createSuperCreepHarvester) {
                    body = [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY]
                } else if (energy > 1200 && (roleName in essentialJobs) && Memory.createSuperCreepUpgrader) {
                    body = [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY]
                } else if (energy > 1200 && (roleName in essentialJobs) && Memory.createSuperCreepWaller) {
                    body = [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY]
                } else if (energy > 1200 && (roleName in essentialJobs) && Memory.createSuperCreepBuilder) {
                    body = [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY]
                }

                else if (energy > 300) {
                    body = [MOVE, WORK, WORK, CARRY]
                } else {
                    body = [MOVE, WORK, CARRY]
                }

            }
            const suffix = Math.floor(Math.random() * 100) + 1
            const creepNameX = `${roleName}${suffix}`
            // create creep with the created body and the given role
            return this.createCreep(body, creepNameX, { role: roleName, working: false })
        }
}
