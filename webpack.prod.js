const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'cheap-module-source-map',
  debug: false,

  // Aqui é espeficado que a aplicação será executada via backend
  target: 'node',

  // Aplicação sendo executado via backend, não é necessário importar no executável as dependências.
  externals: [nodeExternals()],

  // Aqui é espeficado o main da aplicação
  entry: {
    bundle: './src/index.js'
  },

  // Aqui é espeficado o output do build
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: 'taller-postgres.js'
  },

  resolve: {
    // Aqui é especificado um alias para sua aplicação ("Nesse caso é usados nos testes")
    alias: {
      'taller-postgres': path.resolve('./src/index.js')
    },

    // Aqui é especificado onde a aplicação vem resolver os imports
    modulesDirectories: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },

  module: {
    loaders: [
      // Aqui é especificado que todos os arquivos .js ou jsx e serem convertidos para javascript puro dentro do executável.
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),

    // Aqui é informado que o aplicativo vem trabalhar com essa variável global
    new webpack.DefinePlugin({
      'process.env': {
        // NODE_ENV auxilia o sistema a entender o ambiente de execução, nesse caso versão de produção.
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // Assim é minificado todas as classes para melhor performance do taller-postgres.js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
