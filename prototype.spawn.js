module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
             var body = []
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200)
            if(roleName === 'scout' && energy >= 800){
                body = [CLAIM,CARRY,CARRY,MOVE,WORK] //800 de energia
            }else if (roleName === 'warrior' && energy >= 460) {
                //body = [MOVE,MOVE,ATTACK,ATTACK,ATTACK] //340 de energia
                body = [TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK]
                //body =  [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK]//460 de energia
                //body = [TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK] //270 de energy
            }else if(roleName != 'warrior' && roleName != 'scout'){
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK)
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY)
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE)
                }
                if(numberOfParts < 2){
                    body = [WORK,CARRY,MOVE]
                }
            }
            const creepName = roleName
            const creepNamex = creepName + Math.floor(Math.random() * 100)+1 
            // create creep with the created body and the given role
            return this.createCreep(body, creepNamex, { role: roleName, working: false })
        }
}
