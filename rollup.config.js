import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

const { packageDirPath, tsconfigPath } = process.env

const isDev = process.env.isDev === 'true'

export default defineConfig({
  input: packageDirPath + '/src/index.ts',
  output: [
    {
      file: packageDirPath + '/dist/index.esm.js',
      format: 'es',
    },
  ],
  plugins: [typescript({ tsconfig: tsconfigPath }), !isDev && terser()],
})
