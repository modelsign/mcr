
import {LineElement} from "./Element/LineElement";
import {FaceElement} from "./Element/FaceElement";

/** **************
 *   测试一组构造
 *****************/
let testElements = {
    line: new LineElement(),
    face: new FaceElement({})
};

console.log(testElements);
export default testElements;
