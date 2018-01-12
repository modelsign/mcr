(
    function (module, exports, __webpack_require__) {
      
      (
          void 0
      )(['./Element/LineElement'], function (exports_1, context_1) {
        'use strict';
        
        var __moduleName = context_1 && context_1.id;
        var LineElement_1, testElements;
        return {
          setters: [
            function (LineElement_1_1) {
              LineElement_1 = LineElement_1_1;
            }
          ],
          execute: function () {
            // let mcr = {
            //     LineElement: LineElement
            // };
            /** **************
             *   测试一组构造
             *****************/
            testElements = {
              line: new LineElement_1.LineElement()
            };
            console.log(testElements);
            exports_1('default', {});
          }
        };
      });
    }
);
