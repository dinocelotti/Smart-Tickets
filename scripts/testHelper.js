/* eslint-env node */
const util = require('util')
const { spawn } = require('child_process')
const Tail = require('tail').Tail

const setTimeoutPromise = time =>
	new Promise(res => setTimeout(() => res(), time))

const findLastLine = util.promisify(cb => {
	let count = 0
	const tail = new Tail(`${__dirname}/../output/truffleMigrateOutput.txt`)
	tail.on('line', data => {
		if (data.search('Saving artifacts...') !== -1) {
			count++
			//console.log(count)
			//let the artifacts finish saving, should probably check if the file is closed instead
			//await setTimeoutPromise(250)
			if (count == 2) {
				tail.unwatch()
				return cb(null, data)
			}
		}
	})
	tail.on('error', error => {
		console.log(error)
		cb(error)
	})
})

async function init() {
	let child = spawn(`bash ${__dirname}/shellScripts/beginTest.sh`, {
		shell: true,
		cwd: `${__dirname}/..`,
		detached: true,
		stdio: 'ignore'
	})
	child.unref()
	await findLastLine()
	return setTimeoutPromise(100)
}
async function end() {
	let child = spawn(`bash ${__dirname}/shellScripts/stopTest.sh`, {
		shell: true,
		cwd: `${__dirname}/..`,
		detached: true,
		stdio: 'ignore'
	})
	child.unref()
}
module.exports = { init, end }
