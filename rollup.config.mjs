import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      }
    ],
    external: [
      'react',
      'react-dom',
      '@emotion/react',
      '@emotion/styled',
      'chart.js',
      'react-chartjs-2'
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: true,
        mainFields: ['module', 'main'],
        dedupe: ['react', 'react-dom']
      }),
      commonjs({
        include: /node_modules/,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        transformMixedEsModules: true,
        requireReturnsDefault: 'auto'
      }),
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
        useTsconfigDeclarationDir: true,
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
        tsconfigOverride: {
          compilerOptions: {
            jsx: 'react',
            module: 'esnext'
          }
        }
      })
    ]
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  }
]; 