/**
 *
 */
import {ToolController} from "../controller/ToolController";
import em from '../bus'

export class _ToolListener {
    toolController: ToolController;

    constructor(toolController: ToolController) {
        em.emit('event/log/trace', {step: '初始化_ToolLitener'});
        this.toolController = toolController;
    }
}
