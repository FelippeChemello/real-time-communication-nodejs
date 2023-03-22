module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './tsconfig.json',
            './backend/tsconfig.json',
            './frontend/tsconfig.json',
            './third-party/tsconfig.json',
        ],
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint'],
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    rules: {
        'no-console': 'off',
        'max-len': ['error', { code: 120 }],
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        indent: ['error', 4],
        'import/no-extraneous-dependencies': 'off',
    },
};
