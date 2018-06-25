module.exports = {
    'extends': 'airbnb-base',
    'env': {
        'browser': true,
        'node': true,
    },
    'rules': {
        'no-underscore-dangle': 0,
        'no-console': 0,
        'linebreak-style': ["error", "windows"],
        // allow function hoisting
        "no-use-before-define": ["error", { "functions": false }],
    },
};