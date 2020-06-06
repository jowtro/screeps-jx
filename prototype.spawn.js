module.exports = function () {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function (energy, roleName) {
            const specificJobs = ['warrior', 'scout']
            var body = []
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200)
            if (roleName === 'scout' && energy >= 800) {
                body = [CLAIM, CARRY, CARRY, MOVE, WORK] //800 energy
            } else if (roleName === 'warrior' && energy >= 460) {
                body = [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK]
            } else if (!(roleName in specificJobs)) {
                if (energy > 300) {
                    body = [MOVE,WORK,WORK,CARRY]
                }else{
                    body = [MOVE,WORK,CARRY]
                }

            }
            const suffix = Math.floor(Math.random() * 100) + 1
            const creepNameX = `${roleName}${suffix}`
            // create creep with the created body and the given role
            return this.createCreep(body, creepNameX, { role: roleName, working: false })
        }
}
