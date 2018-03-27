import State from "../record/State";

export default abstract class Action {
    abstract next(state: State): State

    abstract prev(state: State): State

    prepare(appHistory: History): History {
        return appHistory
    }

    getMessage() {
        return this.constructor.name
    }
}
