module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
    },
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaVersion': 2018,
    },
    'rules': {
        "indent": 'off',
        "no-tabs": 0,
        "max-len": ["error", { "code": 120 }],
        "linebreak-style": 0
    },
};
