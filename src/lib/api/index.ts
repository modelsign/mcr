import Vue from 'vue';
import * as VueFilterMoment from 'vue-moment';
import global from '../core/Global';

Vue.use(VueFilterMoment);

const ComAppinst = require('../view/com/ComAppinst.vue').default;

export default class {
    static async create(domElement) {
        new Vue({
            el: domElement,
            render: h => h(ComAppinst)
        });

        return global;
    }
}
