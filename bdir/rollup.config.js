import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
const path = require('path');

const PATH_SRC = path.resolve(__dirname, "src").replace(/\\/gi, "/");
const PATH_NODE_MODULES = path
  .resolve(__dirname, "node_modules")
  .replace(/\\/gi, "/");

export default {
    input: 'src/index.js',
    plugins: [
        resolve({
            browser: true
        }),
        commonjs(),
        vue({
            css: true,
            data: {
                scss: () => `@import "@/styles/variables.scss";`, 
                sass: () => `@import "@/styles/variables.scss"`,
            },
            style: {
                preprocessOptions: {
                  scss: {
                    importer: [
                      function (url, prev) {
                        return {
                          file: url
                            .replace(/^~/, `${PATH_NODE_MODULES}/`)
                            .replace(/^@/, PATH_SRC),
                        };
                      },
                    ],
                  },
                },
              },
        }),
        babel({
            babelrc: true,
            runtimeHelpers: true,
            externalHelpers: false,
            exclude: 'node_modules/**',
        }),
        json(),
        image(),
        (process.env.BUILD_MODE === 'minify' && terser())
    ],
    output: {
        file: process.env.BUILD_MODE === 'minify' ? 'dist/js/symbol-node-rewards-client.min.js' : 'dist/js/symbol-node-rewards-client.js',
        format: 'umd',
        name: 'NodeRewardsWidget',
    }
};
