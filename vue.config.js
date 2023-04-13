const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //estas las copié de yogi, no recuerdo pa que sirven
  //publicPath: process.env.NODE_ENV === 'production' ? "/indumark/" : "/",
  publicPath: process.env.NODE_ENV === 'production' ? "/Secure/Induweb3.0/Secure/Importaciones/" : "/",
  outputDir: "dist",
  devServer: {
   // disableHostCheck: true
}
})
