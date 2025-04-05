/** @type {import('jest').Config} */
module.exports = {
    roots: ["<rootDir>/src"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",

        "\\.module\\.(css|less|scss|sass)$": "identity-obj-proxy",

        "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    },
    testPathIgnorePatterns: ["/node_modules/", "stories.tsx"],
};
