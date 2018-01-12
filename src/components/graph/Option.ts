/**
 *
 */
enum MCRModeEnum {
    FULLSPEED = 0,
    LOWSPEED = 2,
    SMART = -1,
}

class MCROption {
    mode: MCRModeEnum;

    constructor() {
        this.mode = MCRModeEnum.LOWSPEED
    }
}

export default new MCROption()
