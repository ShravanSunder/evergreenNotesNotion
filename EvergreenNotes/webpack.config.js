// @ts-nocheck
var webpack = require('webpack'),
   path = require('path'),
   fileSystem = require('fs-extra'),
   env = require('./utils/env'),
   {
      CleanWebpackPlugin
   } = require('clean-webpack-plugin'),
   CopyWebpackPlugin = require('copy-webpack-plugin'),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   WriteFilePlugin = require('write-file-webpack-plugin');
const ReactDevToolsIFramePlugin = require('react-dev-tools-iframe-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// load the secrets
var alias = {
   //'react-dom': '@hot-loader/react-dom',
   aSidebar: path.resolve(__dirname, 'src/pages/sidebar/'),
   aNotion: path.resolve(__dirname, 'src/notion/'),
   aCommon: path.resolve(__dirname, 'src/pages/common'),
   aUtilities: path.resolve(__dirname, 'src/utilities/'),
   aAssets: path.resolve(__dirname, 'src/assets/'),
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

const isDevelopment = process.env.NODE_ENV !== 'production';
console.log('isDevelopment: ' + isDevelopment);

var options = {
   mode: isDevelopment ? 'development' : 'production',
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
   output: {
      path: isDevelopment ? path.resolve(__dirname, 'build') : path.resolve(__dirname, 'release'),
      filename: '[name].bundle.js',
   },
   module: {
      rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            exclude: /node_modules/,
         },
         {
            test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
            use: [{
               loader: 'file-loader?name=[name].[ext]',
            }],
            exclude: /node_modules/,
         },
         {
            test: /\.html$/,
            use: [{
               loader: 'html-loader',
            }],
            exclude: /node_modules/,
         },
         {
            test: /\.(js|jsx)$/,
            use: [{
               loader: 'babel-loader',
            }, 'cache-loader'],
            include: [path.resolve(__dirname, 'src')],
            exclude: [/node_modules\/(webpack|html-webpack-plugin)\//],
         },
         {
            test: /\.(ts|tsx)$/,
            include: [path.resolve(__dirname, 'src')],
            exclude: /node_modules/,
            use: [{
               loader: 'ts-loader',
               options: {
                  transpileOnly: true,
                  // happyPackMode: true,
                  configFile: path.resolve(__dirname, 'tsconfig.json'),
               },
            }, 'cache-loader'],
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
      //new ReactDevToolsIFramePlugin(),
      new webpack.ProgressPlugin(),
      // clean the build folder
      new CleanWebpackPlugin({
         verbose: true,
         cleanStaleWebpackAssets: false,
      }),
      // expose and write the allowed env vars on the compiled bundle
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new ForkTsCheckerWebpackPlugin({
         logger: {
            devServer: false
         }
      }),
      new CopyWebpackPlugin(
         [{
            from: 'src/manifest.json',
            to: isDevelopment ? path.join(__dirname, 'build') : path.join(__dirname, 'release'),
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
         }, ], {
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

if (isDevelopment) {
   options.plugins.push(new ReactRefreshWebpackPlugin());
}

if (env.NODE_ENV === 'development') {
   options.devtool = 'eval-cheap-module-source-map';
}

module.exports = options;