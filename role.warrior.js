/*
 AUTHOR JONNAS SCHLOTTFELDT
 Description: Agora os peões irão caçar recurso até em flags setadas em outras salas
 */
var _DEBUG = true
var username = undefined
var aliados = ['Euganho']

function findAndAttack(creep) {
    var enemies = creep.room.find(FIND_HOSTILE_CREEPS) //find hostile creeps
    var enemiesStructures = creep.room.find(FIND_HOSTILE_STRUCTURES) //find hostile strucutres
    var enemiesConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES) // find construction sites
    var roomName = creep.room.name //get the room name

    if (enemies.length > 0) {
        username = enemies[0].owner.username //find player username 
        if (creep.memory.Notificado != true) {
            creep.memory.Notificado = true
            Game.notify(`Player ${username} foi encontrado na sala ${roomName}`)
            //console.log(`Player ${username} foi encontrado na sala ${roomName}`)
        }
        //console.log(`inimigos na sala: ${enemies}`)
    } else {
        creep.memory.Notificado = false
    }

    //Hunt creeps
    if (enemies.length > 0) {
        //console.log(`warrior ${creep.name} atacando este inimgo ${enemies[0]}`)
        for (let aliado of aliados) { //attack only if the name isn`t on the list
            if (aliado != username) {
                var res = creep.attack(enemies[0]) //Attack and move next to creeps
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemies[0])
                }
            }
        }

       
    }else if (enemiesStructures.length > 0) { //Hunt down enemy structures !
        //console.log(`warrior ${creep.name} atacando este inimgo ${enemiesStructures[1]}`)
        var estrutura
        try {
            estrutura = enemiesStructures[1]
        } catch (err) {
            console.log('There is none!')
        }

        if (undefined != estrutura) {
            for (const aliado in aliados) {//attack only if the name isn`t on the list
                console.log(aliado)
                if (aliado != username){
                    console.log(`Aliado = ${aliado} e Username= ${username}`)
                    var resultado = creep.attack(estrutura)
                    //console.log(resultado)
                    if (resultado == ERR_NOT_IN_RANGE) {
                        creep.moveTo(estrutura)
                    } else {
                        creep.attack(estrutura)
                    }
                }
            }

        }

    } else if (enemiesConstructionSites.length > 0) {
        //console.log(`warrior ${creep.name} atacando este inimgo ${enemiesStructures[1]}`)
        var estrutura
        try {
            //0 é sempre o spawn!!!!!!!!!!!!!!!!!!
            estrutura = enemiesConstructionSites[1]
        } catch (err) {
            console.log('não tem mais pqp nenhuma')
        }

        if (undefined != estrutura) {
            var resultado = creep.attack(estrutura)
            //console.log(resultado)
            if (resultado == ERR_NOT_IN_RANGE) {
                creep.moveTo(estrutura)
            } else {
                creep.attack(estrutura)
            }
        }
    }
    /*else{
        //Destruir controller
        if(creep.room.controller && !creep.room.controller.my) {
            var aux = creep.attackController(creep.room.controller)
            //12 não tem CLAIM BODY PART
            //console.log(aux)
            if(aux == ERR_NOT_IN_RANGE) {
                console.log('atacando controler'+creep.room.controller)
                creep.moveTo(creep.room.controller)
            }
        }
    }*/







}

//Main Function WAR!!!!
function goToWar(creep) {
    try {
        //If it's not on place will follow the flag through the map
        if (undefined === Game.flags[creep.memory.FlagIr].room) {
            creep.moveTo(Game.flags[creep.memory.FlagIr])
            //console.log('Going to attack!')

        } else {
            //If already there find the enemy
            creep.moveTo(Game.flags[creep.memory.FlagIr])
            if (Game.flags[creep.memory.FlagIr].room != undefined) {
                //console.log('Find enemies.')
                findAndAttack(creep)
            }
        }
    } catch (err) {
        var flagsArr = []
        for (var flag in Game.flags) {
            if (flag.substring(0, 3) === 'ata') {
                flagsArr.push(flag)
            }
        }
        //Faz um random entre todas as flagas atacar
        var flagParaIr = flagsArr[Math.floor(Math.random() * flagsArr.length) + 0]
        creep.memory.FlagIr = flagParaIr
    }

}
var roleWarrior = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //Flag Atacar será usada para levar o creep ao ataque.
        var _DEBUG = true
        goToWar(creep)
    }
}

module.exports = roleWarrior