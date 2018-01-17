import em from '../bus'
import {Component} from "vue";
import {CustomizeContrller} from "../controller/CustomizeContrller";

export class _CustomizeListener {

    _customizeContrller: CustomizeContrller = new CustomizeContrller();

    constructor(camera: THREE.PerspectiveCamera) {

        let _customizeContrller = this._customizeContrller;
        em.on(
            'request/customize',
            async (option: {
                action: string,
                arg: { context: Component }
            } = {action: '', arg: {context: null}}) => {
                switch (option.action) {
                    case 'right':
                    case 'center':
                        let region = option.action.toLowerCase(),
                            view = arg.context;
                        await _customizeContrller.switchCustomizeRegion(region, view);
                        break;
                    default:
                        em.emit('event/log/trace', {step: '仅支持"right","center".'});
                        break;
                }
            })
    }
}
