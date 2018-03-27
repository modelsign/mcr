const THREE = require('../../../../vender/three');

import {Record, List, Set} from "immutable";
import {Element} from "../../core/Element";

const StateRecord = Record({
        elements: List,
        camera: THREE.PerspectiveCamera,
        selection: List
    }
);
export default class State extends StateRecord {
}
