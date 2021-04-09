module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^common/(.*)$': '<rootDir>/common/$1',
    '^domains/(.*)$': '<rootDir>/domains/$1',
    '^constants/(.*)$': '<rootDir>/constants/$1',
    '^model/(.*)$': '<rootDir>/model/$1',
    '^repository/(.*)$': '<rootDir>/repository/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
  },
};
