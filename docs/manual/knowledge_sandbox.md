>沙盒模型是对三维场景中多种常见对象的抽象映射. 注意是映射而非引用.

```typescript
import {LineElement} from "./LineElement";
import {FaceElement} from "./FaceElement";
import {ModelElement} from "./ModelElement";

export class Sandbox {
    lines: LineElement[] = [];
    faces: FaceElement[] = [];
    models: ModelElement[] = [];

    isGroundVisible: boolean = true;
    isHelperVisible: boolean = true;

    constructor() {
    }
}

export default new Sandbox();

```
