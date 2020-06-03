function defendRoom(roomName) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS)
    if(hostiles.length > 0) {
        //caso tenha um inimigo na sala ele seta o warrior pra 1
        /*if(hostiles.length >= 4 ){
            quantidadeWarriors = 3
        }*/
        var username = hostiles[0].owner.username
        Game.notify(`User ${username} spotted in room ${roomName}`)
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})
        towers.forEach(tower => tower.attack(hostiles[0]))
    }
}
function towerCode(roomName){
     var towers = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    })
    for(let tower of towers){
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && !STRUCTURE_WALL
        })

        //Torre repara estruturas danificadas
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure)
        }
        //Ataque hostile creeps
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if(target != undefined){
            tower.attack(target)
        }
    }
}
module.exports = {
    // a function to run the logic for this role
    run: function(room) {
        towerCode(room)
        defendRoom(room)
    }
}
