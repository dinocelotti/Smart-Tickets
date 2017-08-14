const camelToHuman = str =>
	[...str]
		.map(
			(char, index) =>
				index === 0
					? char.toUpperCase()
					: char === char.toUpperCase() ? ` ${char}` : char
		)
		.join('')
export default camelToHuman
