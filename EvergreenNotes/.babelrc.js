module.exports = (api) => {
   // This caches the Babel config by environment.
   api.cache.using(() => process.env.NODE_ENV);
   return {
      presets: [
         // "@babel/preset-env",
         // "@babel/preset-react"
         'react-app',
         [
            '@babel/preset-env',
            {
               targets: {
                  browsers: 'last 8 Chrome versions',
               },
            }, // or whatever your project requires
         ],
      ],
      plugins: [
         // "@babel/plugin-proposal-class-properties",
         !api.env('production') && 'react-refresh/babel',
      ].filter(Boolean),
   };
};
