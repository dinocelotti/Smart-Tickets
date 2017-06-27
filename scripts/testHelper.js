const execSync = require('child_process').execSync

function init() {
	execSync(`bash ${__dirname}/shellScripts/beginTest.sh`, { cwd: `${__dirname}/shellScripts/` })
}
function end() {
	execSync(`bash ${__dirname}/shellScripts/stopTest.sh`, { cwd: `${__dirname}/shellScripts/` })
}

module.exports = { init, end }
