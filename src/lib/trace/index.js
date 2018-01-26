// import './google.js'
// import './baidu.js'

setTimeout(() => {
  import(/* webpackChunkName: "trace" */'./google.js');
  import(/* webpackChunkName: "trace" */'./baidu.js');
  import(/* webpackChunkName: "trace" */'./cnzz.ts');
  import(/* webpackChunkName: "trace" */'./wilddog.ts');
  import(/* webpackChunkName: "trace" */'./io.ts');
}, 10000);
