require('dotenv').config();

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');

const EslintWebpackPlugin = require('eslint-webpack-plugin');

const IMAGE_URL = process.env.IMAGE_URL;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const target = IS_DEVELOPMENT ? ['web'] : ['web', 'es5'];

const IS_WEBP = process.env.IS_WEBP === 'true';
const IS_JQUERY = process.env.IS_JQUERY === 'true';

const dirSrc = path.join(__dirname, 'src');
const dirJs = path.join(__dirname, 'src/js');
const dirShared = path.join(__dirname, 'src/shared');
const dirStyles = path.join(__dirname, 'src/styles');
const dirViews = path.join(__dirname, 'src/views');
const dirImages = path.join(__dirname, 'src/images');
const dirPublic = path.join(__dirname, 'public');
const dirPublicAssets = path.join(__dirname, 'public/assets');
const dirPublicAssetsImages = path.join(__dirname, 'public/assets/images');
const dirPublicAssetsCSS = path.join(__dirname, 'public/assets/css');
const dirNode = path.join(__dirname, 'node_modules');

const getFileName = (path) => path.replace(/\.[^/.]+$/, '');

console.log('** mode **', process.env.NODE_ENV);
console.log('IMAGE_URL :>> ', IMAGE_URL);
console.log('IS_WEBP :>> ', IS_WEBP);
console.log('IS_JQUERY :>> ', IS_JQUERY);

const jq = IS_JQUERY
  ? [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
      }),
    ]
  : [];

const templates = [];
glob
  .sync('**/*.pug', {
    ignore: '**/_*.pug',
    cwd: dirViews,
  })
  .map(function (file) {
    templates.push(
      new HtmlWebpackPlugin({
        template: path.resolve(dirViews, file),
        filename: getFileName(file) + '.html',
        data: {
          IMAGE_URL,
          IS_WEBP,
        },
        minify: true,
        alwaysWriteToDisk: true,
        inject: false,
      })
    );
  });

const scssFiles = [];
glob
  .sync('**/*.scss', {
    ignore: '**/_*.scss',
    cwd: dirStyles,
  })
  .map((file) => {
    scssFiles.push(path.join(dirStyles, file));
  });

const webpSetting = IS_WEBP
  ? [
      new ImageminWebpWebpackPlugin({
        config: [
          {
            test: /\.(jpe?g|png)/,
            options: {
              quality: 95,
            },
          },
        ],
        overrideExtension: false,
        detailedLogs: false,
        silent: false,
        strict: true,
      }),
    ]
  : [];

const chacheSetting = false;
// if (IS_DEVELOPMENT) {
//   chacheSetting = {
//     type: 'filesystem',
//     buildDependencies: {
//       config: [__filename],
//     },
//   };
// } else {
//   chacheSetting = false;
// }

module.exports = {
  mode: process.env.NODE_ENV,

  entry: [path.join(dirJs, 'index.js'), ...scssFiles],

  target,

  cache: chacheSetting,

  performance: {
    hints: false,
    // maxEntrypointSize: 512000,
    // maxAssetSize: 512000,
  },

  devtool: IS_DEVELOPMENT ? 'source-map' : false,

  devServer: {
    open: true,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    static: {
      watch: true,
      directory: path.resolve(__dirname, 'public'),
    },
    devMiddleware: {
      writeToDisk: false,
    },
  },

  watchOptions: {
    ignored: /node_modules/,
  },

  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: 'auto',
    clean: !IS_DEVELOPMENT,
  },

  resolve: {
    modules: [dirJs, dirViews, dirShared, dirStyles, dirNode],
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: dirShared, to: dirPublic, noErrorOnMissing: true },
        { from: dirImages, to: dirPublicAssetsImages, noErrorOnMissing: true },
        // for WordPressTheme
        // { from: dirPublicAssets, to: path.resolve(__dirname, '../assets') },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: 'assets/css/[id].css',
    }),

    new HtmlWebpackPugPlugin({
      adjustIndent: true,
    }),

    new HtmlWebpackHarddiskPlugin(),

    new EslintWebpackPlugin({
      fix: false,
      failOnError: false,
      exclude: 'node_modules',
    }),

    ...webpSetting,

    ...templates,

    ...jq,
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'js-loader-pool',
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2015',
              sourcemap: IS_DEVELOPMENT,
            },
          },
        ],
      },

      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'src/views'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'pug-loader-pool',
            },
          },
          {
            loader: 'pug3-loader',
            options: {
              self: true,
              pretty: true,
            },
          },
        ],
      },

      {
        test: [/\.css$/, /\.scss$/, /\.sass$/],
        include: path.resolve(__dirname, 'src/styles'),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   publicPath: '',
            // },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: IS_DEVELOPMENT,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-normalize-charset', {}],
                  ['autoprefixer', { grid: true }],
                  ['postcss-sort-media-queries', {}],
                  ['css-declaration-sorter', { order: 'smacss' }],
                  // [
                  //   '@fullhuman/postcss-purgecss',
                  //   {
                  //     content: [`./src/**/*.pug`, `./src/**/*.js`],
                  //     deep: { standard: [/^swiper/] },
                  //   },
                  // ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: `$IMAGE_URL:"${IMAGE_URL}";`,
              implementation: require('sass'),
              sassOptions: {
                charset: true,
                outputStyle: 'compressed',
              },
              sourceMap: IS_DEVELOPMENT,
            },
          },
          {
            loader: 'import-glob-loader',
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg||webp)$/,
        include: path.resolve(__dirname, 'src/images'),
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'img-loader-pool',
            },
          },
        ],
      },

      {
        test: /\.(ttf|eot|woff|woff2)$/,
        include: path.resolve(__dirname, 'src/shared/assets/fonts'),
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext]',
        },
      },

      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        include: path.resolve(__dirname, 'src/shared/images/'),
        type: 'asset/source',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },

  optimization: {
    minimize: !IS_DEVELOPMENT,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              [
                'gifsicle',
                {
                  interlaced: false,
                  optimizationLevel: 1,
                  colors: 256,
                },
              ],
              [
                'mozjpeg',
                {
                  quality: 95,
                },
              ],
              ['pngquant', { quality: [0.9, 0.95] }],
            ],
          },
        },
      }),
      // new TerserPlugin({
      //   extractComments: false,
      // }),
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
      new HtmlMinimizerPlugin({
        minimizerOptions: {
          caseSensitive: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          conservativeCollapse: false,
          noNewlinesBeforeTagClose: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          sortAttributes: true,
        },
      }),
    ],
  },
};
