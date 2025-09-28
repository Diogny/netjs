module.exports = {
	roots: ['<rootDir>/src'],
	//extensionsToTreatAsEsm: ['.ts', '.tsx'],
	transformIgnorePatterns: [],
	testEnvironment: 'node',
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	extensionsToTreatAsEsm: [".*.ts"], // js if you aren't using TypeScript
	preset: "ts-jest/presets/default-esm", // This may be something different for js
	testMatch: [
		"**/__tests__/**/*.+(ts|tsx|js)",
		"**/?(*.)+(spec|test).+(ts|tsx|js)"
	],
	moduleFileExtensions: ['js', 'json', 'jsx', 'mjs', 'ts', 'tsx', 'node'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
	},
}
