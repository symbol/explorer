module.exports = {
    root: true,

    env: {
        node: true
    },

    extends: [
        'plugin:vue/recommended',
        'prettier/vue',
        'plugin:prettier/recommended',
    ],

    plugins: ['vue'],

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/require-default-prop': 'off',
        'vue/no-v-html': 'off'
    },

    globals: {
        'globalConfig': true
    },

    parserOptions: {
        parser: 'babel-eslint'
    }
}
