import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

try {
await esbuild.build({
  entryPoints: process.argv.slice(2),
  outdir: 'docs',
  format: 'esm',
  bundle: true,
  // target: ['chrome58','firefox57','safari11','edge16'],
  logLevel: 'info',
  minify: true,
  sourcemap: false,
  // external: ["react", "react-dom"],
  plugins: [mdx({
    jsxRuntime: 'classic',
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  })],
});
} catch (error) {
  // the errors are already nicely formatted, we don't need traceback
}
