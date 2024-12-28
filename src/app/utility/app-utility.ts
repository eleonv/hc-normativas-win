import { Injectable } from "@angular/core";
import { MenuImp } from "../models/core/menu.imp";
import { Constante } from "./constante";

@Injectable({
    providedIn: 'root'
})
export class AppUtility {

    static formatKbAndMB(size: number) {
        let _size = size / 1024;
        if (_size < 1024) {
            return _size.toFixed(2) + " KB";
        } else {
            return (_size / 1024).toFixed(2) + " MB";
        }

    }


    static construirMenu(items: any) {
        const _menuHome = new MenuImp();
        _menuHome.id = 1;
        _menuHome.type = Constante.TIPO_MENU_BASIC;
        _menuHome.name = "Inicio";
        _menuHome.link = "/inicio";
        //_menuHome.active = true;
        _menuHome.nameIcon = 'heroicons_outline:home';
        //_menuHome.nameIcon = 'heroicons_outline:clipboard-document-check';

        const _groupDashboard = new MenuImp();
        _groupDashboard.id = Math.floor(Math.random() * (100)) + 1;
        _groupDashboard.type = Constante.TIPO_MENU_GRUPO;
        //_groupDashboard.nameGrupo = 'Dashboard';
        _groupDashboard.descGrupo = 'Unique dashboard designs';

        if (Object.keys(items).length > 0) {
            _groupDashboard.submenu = this.submenus(items, 0);
            _groupDashboard.submenu.unshift(_menuHome);
        } else {
            _groupDashboard.submenu = [];
            _groupDashboard.submenu.push(_menuHome);
        }

        console.log("groupDashboard", _groupDashboard);
        return [_groupDashboard];
    }

    static submenus(items: any, idMenuPadre: number) {
        const _filteredData = items.filter((x: any) => x.idMenuPadre == idMenuPadre);

        let menuMain = new MenuImp();
        menuMain.submenu = [];

        let _total = _filteredData.length;
        for (let i = 0; i < _total; i++) {
            const element = _filteredData[i];

            let menu = new MenuImp();
            menu.id = element.idMenu;
            menu.type = element.idTipoMenu;
            menu.name = element.cMenu;
            menu.link = element.cUrl;
            menu.nameIcon = element.cIcon;
            menu.submenu = null;
            menu.titleBadge = "";

            if (menu.type == Constante.TIPO_MENU_COLLAPSABLE) {
                menu.submenu = this.submenus(items, menu.id);
            }

            menuMain.submenu.push(menu);
        }

        return menuMain.submenu;
    }

    static addTrailingSlash(url: string) {
        if (url.endsWith('/')) {
            return url;
        }

        return url + '/';
    }
}
