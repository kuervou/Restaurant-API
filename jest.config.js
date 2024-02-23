module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    coverageDirectory: './coverage',
    collectCoverage: true,
}
