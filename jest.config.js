module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: ['<rootDir>/app/javascript/**/?(*.)test.{js,jsx}'],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/app/javascript/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: ['<rootDir>/app/javascript/test/', '<rootDir>/app/javascript/application.js'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/app/javascript/test/jest.setup.js'],
}
