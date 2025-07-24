const { resolve } = require("node:path");

module.exports = {
  app: 'demo',
  deploy: [{
    // server namespace
    namespace: '',
    // server deployment path
    path: '',
    // ssh login user
    user: '',
    // server host
    host: '',
    // server ssh port
    port: ''
  }],
  genApi: [{
    app: 'demoApi',
    url: 'https://pub-1252165219.cos.ap-chongqing.myqcloud.com/v2.json',
    output: resolve('apis/demoApi.js'),
    service: "import { service } from '@/services/gateway'"
  }],
  build: {
    copy: false,
    zip: true
  }
}
