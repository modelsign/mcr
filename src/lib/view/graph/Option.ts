/**
 *
 */
enum MCRModeEnum {
    FULLSPEED = 0,
    LOWSPEED = 2,
    SMART = -1,
}

class MCROption {
    mode: MCRModeEnum = MCRModeEnum.LOWSPEED;
    afk: boolean = false;
}

export default new MCROption()
