module.exports = {
  devServer: {
    //port: 9876,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
  },
};


//const { defineConfig } = require('@vue/cli-service')
//module.exports = defineConfig({
//  transpileDependencies: true
//})
