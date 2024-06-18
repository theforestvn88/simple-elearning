module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: ['<rootDir>/app/javascript/**/?(*.)test.{js,jsx}'],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/app/javascript/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/app/javascript/test/jest.setup.js'],
}
