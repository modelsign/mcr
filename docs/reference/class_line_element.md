LineElement
---

```ts
import {Element} from "../core/Element";
import {Vector3} from "../core/Vector3";

export class LineElement extends Element {

    title: string;
    vertices: Vector3[];

    createDefaultConstructOption() {

    }

    constructor() {
        super();
    }
}
```


对象标题
---
- title:string

顶点序列
---
- vertices:[Vector3](/reference/class_vector3)[]

