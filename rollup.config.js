import { createCompatibilityConfig } from '@open-wc/building-rollup';
import path from 'path';

const config = createCompatibilityConfig({
  input: path.join('demo', 'index.html'),
  indexHTMLPlugin: {
    minify: {
      minifyJS: true,
      removeComments: true,
    },
  },
});

config[0].context = 'window';
config[1].context = 'window';

// console.log(config);

export default config;
