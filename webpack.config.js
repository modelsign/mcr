const webpack                  = require('webpack');
const path                     = require('path');
const HtmlWebpackPlugin        = require('html-webpack-plugin');
const CleanPlugin              = require('clean-webpack-plugin');
const CopyPlugin               = require('copy-webpack-plugin');
const BabiliPlugin             = require('babili-webpack-plugin');
const TypedocWebpackPlugin     = require('typedoc-webpack-plugin');
const AutoRequireWebpackPlugin = require('auto-require-webpack-plugin');

// 如果预先定义过环境变量，就将其赋值给`ASSET_PATH`变量，否则赋值为根目录
const ASSET_PATH = process.env.ASSET_PATH || '/';

const scope = 'mcr';

/*************************************************************
 *
 *************************************************************/
if (process.env.NODE_ENV === 'prod') {
  // __webpack_public_path__ = '/Public/mcr/';
  __webpack_public_path__ = '//mcr.tool.budblack.me/';
} else {
  __webpack_public_path__ = '/';
}

let now        = new Date(),
    outputname = `${
    (
        now.getYear() + 1900
    ) * 100000000 +
    (
        now.getMonth() + 1
    ) * 1000000 +
    now.getDate() * 10000 +
    now.getHours() * 100 +
    now.getMinutes()}`;

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  node     : {
    fs: 'empty'
  },
  entry    : ['babel-polyfill', __dirname + '/src/main.js'],
  output   : {
    filename     : `${outputname}/msign.js`,
    path         : __dirname + '/dist',
    publicPath   : __webpack_public_path__,
    chunkFilename: process.env.NODE_ENV === 'prod'
        ? `chunk/[name]/[chunkhash:8].js`
        : 'chunk/[chunkhash:8]/[name].js'
  },
  resolve  : {
    extensions: [
      '.js',
      '.ts',
      '.vue'
    ],
    alias     : {
      'vue$': 'vue/dist/vue.esm.js',
      '@'   : resolve('src')
    }
  },
  module   : {
    unknownContextCritical: false,
    rules                 : [
      {
        test: /\.vue$/,
        use : [
          {
            loader: 'vue-loader'
          },
          {
            loader : 'vue-attr-scope-loader',
            options: {
              scope: scope
            }
          }
        ]
      },
      {
        test   : /\.js$/,
        exclude: /node_modules/,
        use    : [
          {
            loader : 'babel-loader',
            options: {
              presets: [['es2015', { modules: false }]]
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use : [
          {
            loader : __dirname + '/vender/worker-loader',
            options: { name: `worker/[hash:8].js` }
          }, {
            loader : 'babel-loader',
            options: {
              presets: [['es2015', { modules: false }]]
            }
          }
        ]
      },
      {
        test  : /\.ts$/,
        loader: 'babel-loader!ts-loader'
      },
      {
        test  : /\.css$/,
        loader: `style-loader!css-loader?${JSON.stringify(
            { discardComments: { removeAll: true } })}!css-attr-scope-loader-mcr-fix?scope=${scope}`
      },
      {
        test: /\.less$/,
        use : [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          },
          {
            loader : 'css-attr-scope-loader-mcr-fix',
            options: {
              scope: scope
            }
          }, {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|woff2|svg|eot|ttf|json)\??.*$/,
        use : [
          {
            loader : 'url-loader',
            options: {
              limit: 5120,
              name : `static/[hash:8].[ext]`
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase       : './dist',
    host              : '0.0.0.0',
    port              : 3001,
    historyApiFallback: true,
    inline            : true
  },
  plugins  : [
    // new TypedocWebpackPlugin({}, './src'),
    new CopyPlugin(
        [
          {
            from: __dirname + '/src/_static/favicon.ico',
            to  : '.'
          },
          {
            from: __dirname + '/src/_static/testModels/',
            to  : 'testModels'
          }
        ]
    ),
    new webpack.DefinePlugin(
        {
          'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        }
    ),
    new webpack.ProvidePlugin(
        {
          jQuery: 'jquery',
          THREE : __dirname + '/vender/three'
        }
    ),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new AutoRequireWebpackPlugin('/src/lib/view/'),
    new CleanPlugin('dist/*'),
    new HtmlWebpackPlugin(
        {
          title   : '',
          filename: 'index.html',
          template: __dirname + '/src/_static/index.html',
          inject  : true,
          hash    : false,
          minify  : {
            removeComments    : true,
            collapseWhitespace: true
          }
        }
    )
  ].concat(
      process.env.NODE_ENV === 'prod'
          ? new BabiliPlugin({}, { comments: false })
          : []
  )
};
