// @ts-nocheck
var webpack = require('webpack'),
   path = require('path'),
   fileSystem = require('fs-extra'),
   env = require('./utils/env'),
   { CleanWebpackPlugin } = require('clean-webpack-plugin'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   WriteFilePlugin = require('write-file-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// load the secrets
var alias = {
   'react-dom': '@hot-loader/react-dom',
   aSidebar: path.resolve(__dirname, 'src/pages/sidebar/'),
   aNotion: path.resolve(__dirname, 'src/notion/'),
   aCommon: path.resolve(__dirname, 'src/pages/common'),
};

var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
   'jpg',
   'jpeg',
   'png',
   'gif',
   'eot',
   'otf',
   'svg',
   'ttf',
   'woff',
   'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
   alias['secrets'] = secretsPath;
}

var options = {
   mode: process.env.NODE_ENV || 'development',
   entry: {
      options: path.join(__dirname, 'src', 'pages', 'Options', 'index.tsx'),
      background: path.join(
         __dirname,
         'src',
         'pages',
         'Background',
         'background.ts'
      ),
      contentScript: path.join(
         __dirname,
         'src',
         'pages',
         'Content',
         'content.ts'
      ),
      sidebar: path.join(__dirname, 'src', 'pages', 'Sidebar', 'App.tsx'),
   },
   chromeExtensionBoilerplate: {
      notHotReload: ['contentScript'],
   },
   output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].bundle.js',
   },
   module: {
      rules: [
         {
            test: /latin-[0-9]*\.css$/,
            use: [
               {
                  loader: 'css-loader',
                  options: {
                     modules: true,
                  },
               },
            ],
         },
         {
            test: /roboto-latin-[0-9]*-[a-z]*\.woff(2)?$/,
            use: [
               {
                  loader: 'url-loader',
                  options: {
                     limit: 10000,
                     name: './font/[hash].[ext]',
                     mimetype: 'application/font-woff',
                  },
               },
            ],
         },
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            exclude: /node_modules/,
         },
         {
            test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
            loader: 'file-loader?name=[name].[ext]',
            exclude: /node_modules/,
         },
         {
            test: /\.html$/,
            loader: 'html-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: [/node_modules\/(webpack|html-webpack-plugin)\//],
         },
         {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: 'ts-loader',
                  options: {
                     // transpileOnly: true,
                     // happyPackMode: true,
                     configFile: path.resolve(__dirname, 'tsconfig.json'),
                  },
               },
            ],
         },
      ],
   },
   resolve: {
      alias: alias,
      extensions: fileExtensions
         .map((extension) => '.' + extension)
         .concat(['.jsx', '.js', '.css', '.ts', '.tsx']),
   },
   plugins: [
      // new HardSourceWebpackPlugin(),
      new webpack.ProgressPlugin(),
      // clean the build folder
      new CleanWebpackPlugin({
         verbose: true,
         cleanStaleWebpackAssets: false,
      }),
      // expose and write the allowed env vars on the compiled bundle
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      // new ForkTsCheckerWebpackPlugin({
      //    eslint: {
      //       files: './src/**/*.{ts,tsx,js,jsx}', // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
      //    },
      //    issue: {
      //       scope: 'webpack'
      //    },
      //    async: true,
      //    typescript: false,
      //    logger: {
      //       issues: 'silent',
      //       infrastructure: 'webpack-infrastructure'

      //    }
      // }),
      new CopyWebpackPlugin(
         [
            {
               from: 'src/manifest.json',
               to: path.join(__dirname, 'build'),
               force: true,
               transform: function (content, path) {
                  // generates the manifest file using the package.json informations
                  return Buffer.from(
                     JSON.stringify({
                        description: process.env.npm_package_description,
                        version: process.env.npm_package_version,
                        ...JSON.parse(content.toString()),
                     })
                  );
               },
            },
         ],
         {
            logLevel: 'info',
            copyUnmodified: true,
         }
      ),
      new HtmlWebpackPlugin({
         template: path.join(
            __dirname,
            'src',
            'pages',
            'Options',
            'options.html'
         ),
         filename: 'options.html',
         chunks: ['options'],
      }),
      new HtmlWebpackPlugin({
         template: path.join(
            __dirname,
            'src',
            'pages',
            'Sidebar',
            'sidebar.html'
         ),
         filename: 'sidebar.html',
         chunks: ['sidebar'],
      }),
      new HtmlWebpackPlugin({
         template: path.join(
            __dirname,
            'src',
            'pages',
            'Background',
            'background.html'
         ),
         filename: 'background.html',
         chunks: ['background'],
      }),
      new WriteFilePlugin(),
   ],
};

if (env.NODE_ENV === 'development') {
   options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
