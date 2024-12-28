import { Menu } from "../menu";

// 1: grupo, 2: basic, 3: collapsable, 4: divider
export class MenuImp implements Menu {
    id: number = 0;
    type: 1 | 2 | 3 | 4 | number = 2;
    nameGrupo?: string | null = null;
    descGrupo?: string | null = null;
    name: string  = '';
    //hasBadge?: boolean;
    titleBadge?: string | null = null;
    classBadge?: string | null = null;
    link?: string | null = null;
    //hasIcon?: boolean;
    nameIcon: string = '';
    active?: boolean = false;
    disabled?: boolean = false;
    tooltip?: string | null = null;
    //collapsable?: boolean;
    submenu?: Menu[] | null = null;
    externalLink?: boolean = false;
    target?: | '_blank' | '_self' | string;
    expanded: boolean = false;

    constructor() {}

    /*hasIcon(): boolean {
        return this.nameIcon ? true : false;
    }

    hasBadge(): boolean {
        return this.titleBadge ? true : false;
    }

    collapsable(): boolean {
        return this.submenu!=null && this.submenu?.length>0 ? true : false;
    }*/
}
