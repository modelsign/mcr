abstract class Log {
    module: string = 'unknown module';
    action: string = 'unknown action';
}

export class LogRuntime extends Log {

    ctx: any;

    constructor(module, action, ctx) {
        super();
        this.module = module;
        this.action = action;
        this.ctx = ctx;
    }
}

