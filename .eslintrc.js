module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'curly': ['error', 'all'],
        'no-useless-escape': 'off',
        'no-var': 'error',
        'indent': ['error', 4, {
            'SwitchCase': 1
        }],
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'no-empty': ['error', {
            'allowEmptyCatch': true
        }],
        'padded-blocks': ['error', 'never'],
        'brace-style': ['error', '1tbs']
    },
    globals: {
        'PEERS_API': true,
        'ENDPOINTS': true
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
