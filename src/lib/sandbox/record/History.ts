import State from "./State";
import {List, Record} from "immutable";
import Action from "../actions/action";

const emptyAction = Symbol('empty-action');
export const undo = Symbol('undo');
export type undo = typeof undo
export const redo = Symbol('redo');
export type redo = typeof redo

const AppHistoryRecord = Record({
    // 当前应用状态
    state: new State(),
    // action 列表
    list: List<Action>(),
    // index 表示最后一个applied-action在list中的下标。-1 表示没有任何applied-action
    index: -1,
});


export default class History extends AppHistoryRecord {
    pop() { // 移除最后一项操作记录
        return this
            .update('list', list => list.splice(this['index'], 1))
            .update('index', x => x - 1)
    }

    getLastAction() {
        return this['index'] === -1 ? emptyAction : this['list'].get(this['index'])
    }

    getNextAction() {
        return this['list'].get(this['index'] + 1, emptyAction)
    }

    apply(action: Action | Symbol) {
        if (action === emptyAction) return this;
        return this.merge({
            list: this['list'].setSize(this['index'] + 1).push(action),
            index: this['index'] + 1,
            state: (<Action>action).next(this['state']),
        })
    }

    redo() {
        const action = this.getNextAction();
        if (action === emptyAction) return this;
        return this.merge({
            list: this['list'],
            index: this['index'] + 1,
            state: action.next(this['state']),
        })
    }

    undo() {
        const action = this.getLastAction();
        if (action === emptyAction) return this;
        return this.merge({
            list: this['list'],
            index: this['index'] - 1,
            state: action.prev(this['state']),
        })
    }
}
