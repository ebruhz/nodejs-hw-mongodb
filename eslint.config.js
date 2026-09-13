import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/**'],
    },
    {
        languageOptions: {
            globals: globals.node,
        },
    },
    js.configs.recommended,
];