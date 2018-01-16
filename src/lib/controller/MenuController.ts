import {Vue} from "vue/types/vue";

class MenuItem {
    isToggle: boolean;

    title: string;
    icon: string;

    onClick: Function
}

export class MenuController {

    _menuInst: any;

    isAutohide: boolean;
    isVisiable: boolean;

    menus: MenuItem[];

    constructor(menuInst) {

    }
}
