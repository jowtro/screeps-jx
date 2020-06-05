var jxCommon = require("jxCommon")
var _ = require('lodash')


//TODO -WIP-
const roleEqualizer = {
    run: creep => {
        jxCommon.equalizeEnergyBetweenStorages(creep)
    }
}

module.exports = roleEqualizer