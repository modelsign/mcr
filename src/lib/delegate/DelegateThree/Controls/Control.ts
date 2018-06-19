import {EventDispatcher} from "three";

export default abstract class Control extends EventDispatcher {
    update(t): Control {
        console.log('??????');
        return this;
    }
}
