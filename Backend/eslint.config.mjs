
import globals from "globals";
import pluginJs from "@eslint/js";
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginJest from 'jest'


// export default [
//   {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
//   {languageOptions: { globals: {...globals.browser, ...globals.node} }},
//   pluginJs.configs.recommended,
// ];

export default [
    {
      files: ["src/*.js"]
    }, 
    { 
      languageOptions: { 
      sourceType: "commonjs",
      globals: { ...globals.browser, ...globals.node }
      }
    },
    pluginJs.configs.recommended,
    prettierRecommended,
    pluginJest.configs.recommended,
    {
      rules: {
        'no-console' : 'warn',
        'prettier/prettier':'error'
      }
    }
];

