/* use strict */

import {Sandbox} from "../sandbox/Sandbox";
import {Vue} from "vue/types/vue";
import em from '../bus';
import Option from "./Option";
import Controller from "./Controller";
import Graph from "./Graph";
import Event from "./Event";
import State from "./State";
import Local from "./Local";

const Fingerprint = require('fingerprintjs');
const fingerprint = new Fingerprint().get();

class InstClass {
    app: Vue;
    sandbox: Sandbox;
    option: Option;
    controller: Controller;
    graph: Graph = new Graph();
    event: Event;
    state: State;
    wild: any;
    local: Local;
    modules: any;
    version: string;
}

let inst: InstClass = new InstClass();

inst.version = require('../../../package.json').version;
inst.sandbox = new Sandbox();
inst.option = new Option();
inst.controller = new Controller();
inst.graph = new Graph();
inst.event = new Event();
inst.state = {
    global: {
        online: 0
    },
    current: {
        fingerprint: fingerprint,
        isProcessing: false,
        status: '全局状态提示',
        camera: {
            position: {x: 0, y: 0, z: 0},
            direction: {x: 0, y: 0, z: 0}
        },
        /**
         * orbit.   鼠标交互拖拽交互模式, 该模式下鼠标拖拽控制相机移动
         * select.  鼠标交互框选模式, 该模式下鼠标左键框选模型
         */
        interaction: 'orbit',
        selects: [],
        hits: []
    },
    menu: {
        base: [
            {
                title: `拖拽模式`,
                icon: 'msign-orbit',
                isToggle: false,
                isActive: false,
                modes: ['orbit', 'select'],
                current: 0,
                callbackClick: function () {
                    this.current = (
                        this.current + 1
                    ) % this.modes.length;
                    let mode = this.modes[this.current];
                    this.icon = `msign-${mode}`;

                    switch (mode) {
                        case 'orbit':
                            this.title = `拖拽模式`;
                            break;
                        case 'select':
                            this.title = `框选模式`;
                            break;
                    }
                    em.emit('request/tool', {action: 'inter', arg: {mode}});
                    em.emit('event/log/trace', {step: `切换交互模式[${mode}]`});
                },
                callbackOn: null,
                callbackOff: null
            },
            {
                title: '全屏',
                icon: 'msign-zoomout',
                isToggle: true,
                isActive: false,
                callbackClick: null,
                callbackOn: function () {
                    this.isActive = true;
                    this.icon = 'msign-zoomin';
                    em.emit(
                        'request/container',
                        {
                            action: 'zoomout',
                            arg: {isFullScreen: true}
                        }
                    );
                    em.emit('event/log/trace', {step: `请求全屏`});
                },
                callbackOff: function () {
                    this.isActive = false;
                    this.icon = 'msign-zoomout';
                    em.emit(
                        'request/container',
                        {
                            action: 'zoomin',
                            arg: {isFullScreen: false}
                        }
                    );
                    em.emit('event/log/trace', {step: `请求取消全屏`});
                }
            },
            {
                title: `相机归位`,
                icon: 'msign-home',
                isToggle: false,
                isActive: false,
                callbackClick: function () {
                    em.emit(
                        'request/camera',
                        {action: 'reset', arg: {}}
                    );
                    em.emit('event/log/trace', {step: `请求相机归位`});
                },
                callbackOn: null,
                callbackOff: null
            },
            {
                title: `截图`,
                icon: 'msign-camera',
                isToggle: false,
                isActive: false,
                callbackClick: function () {
                    em.emit(
                        'request/tool',
                        {action: 'prtscn', arg: {}}
                    );
                    em.emit('event/log/trace', {step: `请求截屏`});
                },
                callbackOn: null,
                callbackOff: null
            }
        ],
        primary: [
            {
                title: '默认按钮',
                icon: 'msign-copyright'
            }
        ],
        advance: []
    },
    customize: {
        right: null
    },
    setting: {
        isDebug: false
    },
    ui: {}
};
inst.wild = {sync: null};
inst.modules = {};

export default inst;
