// * PLUGIN
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const { htmlWebpackPluginTemplateCustomizer } = require('template-ejs-loader');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// * ENVIRONMENT
const config = require('./.config');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const target = IS_DEVELOPMENT ? ['web'] : ['web', 'es5'];
const IMAGE_URL = config.IMAGE_URL;
const IS_WEBP = config.IS_WEBP;
const BREAK_POINT = config.BREAK_POINT;

// * DIR
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

// * CONSOLE
console.log('** mode **', process.env.NODE_ENV);
console.log('IMAGE_URL :>> ', IMAGE_URL);
console.log('IS_WEBP :>> ', IS_WEBP);
console.log('BREAK_POINT :>> ', BREAK_POINT);
console.log('target :>> ', target);

const entries = WebpackWatchedGlobEntries.getEntries(
  [path.resolve(__dirname, `src/views/**/*.html`)],
  {
    ignore: path.resolve(__dirname, `src/views/**/_*.html`),
  }
)();

const htmlGlobPlugins = (entries) => {
  return Object.keys(entries).map(
    (key) =>
      new HtmlWebpackPlugin({
        filename: `${key}.html`,
        template: htmlWebpackPluginTemplateCustomizer({
          htmlLoaderOption: {
            sources: false,
            minimize: false,
          },
          templatePath: `src/views/${key}.html`,
          templateEjsLoaderOption: {
            data: {
              BREAK_POINT,
              IMAGE_URL,
              IS_WEBP,
              DIR_IMAGES: dirImages,
            },
          },
        }),
        inject: true,
        minify: false,
      })
  );
};

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

module.exports = {
  mode: process.env.NODE_ENV,

  entry: [path.join(dirJs, 'main.ts'), ...scssFiles],

  target,

  performance: {
    hints: false,
    // maxEntrypointSize: 512000,
    // maxAssetSize: 512000,
  },

  externals: {
    sharp: 'commonjs sharp',
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
    watchFiles: ['src/**/*.html', 'src/**/*.ejs'],
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
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),

    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
      BREAK_POINT,
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

    new HtmlWebpackHarddiskPlugin(),

    new EslintWebpackPlugin({
      fix: false,
      failOnError: false,
      exclude: 'node_modules',
    }),

    ...webpSetting,

    ...htmlGlobPlugins(entries),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src/js'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'ts-loader-pool',
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: 'es2015',
              minify: !IS_DEVELOPMENT,
              sourcemap: IS_DEVELOPMENT,
            },
          },
        ],
      },

      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'tsx-loader-pool',
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              minify: !IS_DEVELOPMENT,
              target: 'es2015',
            },
          },
        ],
      },

      {
        test: [/\.html$/, /\.ejs$/],
        include: path.resolve(__dirname, 'src/views'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              name: 'ejs-loader-pool',
            },
          },
          {
            loader: 'html-loader',
          },
          {
            loader: 'template-ejs-loader',
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
                  [
                    '@fullhuman/postcss-purgecss',
                    {
                      content: [
                        './src/**/*.html',
                        './src/**/*.ejs',
                        './src/**/*.js',
                        './src/**/*.ts',
                      ],
                      safelist: { standard: [/^swiper/] },
                      skippedContentGlobs: ['node_modules/**'],
                    },
                  ],
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
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              mozjpeg: {
                quality: 95,
              },
              webp: {
                quality: 95,
              },
              png: {
                quality: 95,
              },
            },
          },
        },
      }),
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
