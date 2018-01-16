// import './google.js'
// import './baidu.js'

setTimeout(() => {
  // import(/* webpackChunkName: "trace" */'./google.js');
  import(/* webpackChunkName: "trace" */'./baidu.js');
}, 10000);
