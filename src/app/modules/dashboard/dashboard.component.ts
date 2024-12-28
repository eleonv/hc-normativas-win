import { Component } from '@angular/core';
import { ClassicLayoutComponent } from '../../layout/classic-layout/classic-layout.component';
import { RouterOutlet } from '@angular/router';
import { MenuImp } from '../../models/core/menu.imp';
import { Menu } from '../../models/menu';
import { Constante } from '../../utility/constante';
import { Location } from '@angular/common';
import { UsuarioAS } from '../../models/usuarioas';
import { AuthUtility } from '../../utility/auth-utility';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterOutlet, ClassicLayoutComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    _const = Constante;
    showNavigation: boolean = true;
    menu: Menu[] = [];

    currentPath: string = "";

    user: UsuarioAS | null = null;
    perfil: any = {};
    nombrePerfil: string | null = null;

    constructor(
        private location: Location
    ) {
        // obtener la url actual
        this.currentPath = this.location.path();

        this.user = AuthUtility.getValueUserAS();
        this.perfil = AuthUtility.getPerfil();
        this.menu = AuthUtility.getMenu();
        this.nombrePerfil = this.perfil.cPefil;

        //console.log("menu", this.menu);
        //this.construirMenu();
        this.activarMenu(this.menu, null);
    }

    //#region Metodos
    activarMenu(item: Menu[], itemPadre: Menu | null) {

        for (let i = 0; i < item.length; i++) {
            const element = item[i];

            if (element.type == this._const.TIPO_MENU_BASIC && element.link == this.currentPath) {
                element.active = true;

                if (itemPadre) {
                    itemPadre.expanded = true;
                }
                return;
            }

            if(element.submenu) {
                this.activarMenu(element.submenu, element);
            }
        }

        return;
    }

    construirMenu() {
        //#region Usuario
        const _menuHome = new MenuImp();
        _menuHome.id = 1;
        _menuHome.type = this._const.TIPO_MENU_BASIC;
        _menuHome.name = "Inicio";
        _menuHome.link = "/inicio";
        //_menuHome.active = true;
        _menuHome.nameIcon = 'heroicons_outline:home';
        //_menuHome.nameIcon = 'heroicons_outline:clipboard-document-check';

        const _menuFavoritos = new MenuImp();
        _menuFavoritos.id = 2;
        _menuFavoritos.type = this._const.TIPO_MENU_BASIC;
        _menuFavoritos.name = "Favoritos";
        _menuFavoritos.link = "/favoritos";
        _menuFavoritos.nameIcon = 'heroicons_outline:star';
        //_menuCrearCitacion.titleBadge = '19.0.0';
        //_menuCrearCitacion.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';

        const _menuProcesos = new MenuImp();
        _menuProcesos.id = 3;
        _menuProcesos.type = this._const.TIPO_MENU_BASIC;
        _menuProcesos.name = "Procesos";
        _menuProcesos.link = "/procesos";
        _menuProcesos.nameIcon = 'mat_outline:account_tree';
        //_menuCrearCitacion.titleBadge = '19.0.0';
        //_menuCrearCitacion.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';

        const _menuNormativas = new MenuImp();
        _menuNormativas.id = 4;
        _menuNormativas.type = this._const.TIPO_MENU_BASIC;
        _menuNormativas.name = "Normativas";
        _menuNormativas.link = "/normativas";
        _menuNormativas.nameIcon = 'mat_outline:snippet_folder';
        //_menuListarCitaciones.titleBadge = '19.0.0';
        //_menuListarCitaciones.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';

        const _menuGuias = new MenuImp();
        _menuGuias.id = 5;
        _menuGuias.type = this._const.TIPO_MENU_BASIC;
        _menuGuias.name = "Guías";
        _menuGuias.link = "/guias";
        _menuGuias.nameIcon = 'mat_outline:assistant_direction';
        //_menuListarCitaciones.titleBadge = '19.0.0';
        //_menuListarCitaciones.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';

        const _menuProject = new MenuImp();
        _menuProject.id = 6;
        _menuProject.type = this._const.TIPO_MENU_BASIC;
        _menuProject.name = "Proyectos";
        _menuProject.link = "/proyectos";
        _menuProject.nameIcon = 'mat_solid:work_outline';
        //_menuListarCitaciones.titleBadge = '19.0.0';
        //_menuListarCitaciones.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';

        const _menuReport = new MenuImp();
        _menuReport.id = 7;
        _menuReport.type = this._const.TIPO_MENU_BASIC;
        _menuReport.name = "Reportes";
        _menuReport.link = "/reportes";
        _menuReport.nameIcon = 'mat_outline:query_stats';
        //_menuListarCitaciones.titleBadge = '19.0.0';
        //_menuListarCitaciones.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';
        //#endregion

        //#region Administración
        const _menuAdmTipoNormativa = new MenuImp();
        _menuAdmTipoNormativa.id = 7;
        _menuAdmTipoNormativa.type = this._const.TIPO_MENU_BASIC;
        _menuAdmTipoNormativa.name = "Tipo de normativas";
        _menuAdmTipoNormativa.link = "/adm/tipo-normativas/listar";

        const _menuAdmNormativas = new MenuImp();
        _menuAdmNormativas.id = 7;
        _menuAdmNormativas.type = this._const.TIPO_MENU_BASIC;
        _menuAdmNormativas.name = "Normativas";
        _menuAdmNormativas.link = "/adm/normativas/listar";

        // registrar publicacion
        // registrar videos
        // registrar procesos mp

        const _menuAdmPerfiles = new MenuImp();
        _menuAdmPerfiles.id = 7;
        _menuAdmPerfiles.type = this._const.TIPO_MENU_BASIC;
        _menuAdmPerfiles.name = "Perfiles";
        _menuAdmPerfiles.link = "/adm/perfiles/listar";

        // control de acceso

        const _menuAdministration = new MenuImp();
        _menuAdministration.id = 7;
        _menuAdministration.type = this._const.TIPO_MENU_COLLAPSABLE;
        _menuAdministration.name = "Administración";
        _menuAdministration.link = "/mantenimiento";
        _menuAdministration.nameIcon = 'heroicons_outline:cog-6-tooth';
        _menuAdministration.submenu = [
            _menuAdmTipoNormativa, _menuAdmNormativas, _menuAdmPerfiles
        ];
        //#endregion

        const _groupDashboard = new MenuImp();
        _groupDashboard.id = 14;
        _groupDashboard.type = this._const.TIPO_MENU_GRUPO;
        //_groupDashboard.nameGrupo = 'Dashboard';
        _groupDashboard.descGrupo = 'Unique dashboard designs';
        _groupDashboard.submenu = [
            _menuHome,
            _menuFavoritos,
            _menuProcesos,
            _menuNormativas,
            _menuGuias,
            _menuProject,
            _menuReport,
            _menuAdministration];

        this.menu = [_groupDashboard];
        //console.log("menu", this.menu);

        //this.activarOptionMenuCurrent();
    }
    //#endregion

//_menuListarCitaciones.titleBadge = '19.0.0';
        //_menuListarCitaciones.classBadge = 'px-2 bg-yellow-300 text-black rounded-full';

        // *****************************************
        /*const _menuTree = new MenuImp();
        _menuTree.id = 4;
        _menuTree.type = this._const.TIPO_MENU_BASIC;
        _menuTree.name = "Arbol";
        _menuTree.link = "/tree";
        _menuTree.nameIcon = 'heroicons_outline:megaphone';

        const _menuPuntosAgenda = new MenuImp();
        _menuPuntosAgenda.id = 5;
        _menuPuntosAgenda.type = this._const.TIPO_MENU_BASIC;
        _menuPuntosAgenda.name = "Puntos Agenda";
        _menuPuntosAgenda.link = "/puntos_agenda";
        _menuPuntosAgenda.nameIcon = 'heroicons_outline:megaphone';

        const _menuOpcionDemo1 = new MenuImp();
        _menuOpcionDemo1.id = 6;
        _menuOpcionDemo1.type = this._const.TIPO_MENU_BASIC;
        _menuOpcionDemo1.name = "Opcion demo 1";
        _menuOpcionDemo1.link = "/opcion1";
        _menuOpcionDemo1.nameIcon = 'heroicons_outline:chart-pie';

        const _menuOpcionDemo2 = new MenuImp();
        _menuOpcionDemo2.id = 7;
        _menuOpcionDemo2.type = this._const.TIPO_MENU_BASIC;
        _menuOpcionDemo2.name = "Opcion demo 2";
        _menuOpcionDemo2.link = "/opcion2";
        _menuOpcionDemo2.nameIcon = 'heroicons_outline:chart-pie';

        const _menuOpcionDemo3 = new MenuImp();
        _menuOpcionDemo3.id = 8;
        _menuOpcionDemo3.type = this._const.TIPO_MENU_BASIC;
        _menuOpcionDemo3.name = "Opcion demo 3";
        _menuOpcionDemo3.link = "/opcion3";
        _menuOpcionDemo3.nameIcon = 'heroicons_outline:chart-pie';

        const _subMenu1 = new MenuImp();
        _subMenu1.id = 9;
        _subMenu1.type = this._const.TIPO_MENU_BASIC;
        _subMenu1.name = "Field 1";

        const _subMenu2 = new MenuImp();
        _subMenu2.id = 10;
        _subMenu2.type = this._const.TIPO_MENU_BASIC;
        _subMenu2.name = "Field 2";

        const _subMenu3 = new MenuImp();
        _subMenu3.id = 11;
        _subMenu3.type = this._const.TIPO_MENU_BASIC;
        _subMenu3.name = "Field 3";

        const _menuFormA = new MenuImp();
        _menuFormA.id = 12;
        _menuFormA.type = this._const.TIPO_MENU_COLLAPSABLE;
        _menuFormA.name = "Forms Demos";
        //_menuFormA.hasIcon = true;
        _menuFormA.nameIcon = 'mat_solid:restore_from_trash';
        //_menuFormA.collapsable = true;
        _menuFormA.submenu = [_menuPuntosAgenda,
            _menuOpcionDemo1, _menuOpcionDemo2, _menuOpcionDemo3,
            _menuTree, _subMenu1, _subMenu2];

        const _menuFormB = new MenuImp();
        _menuFormB.id = 13;
        _menuFormB.type = this._const.TIPO_MENU_COLLAPSABLE;
        _menuFormB.name = "FormB";
        //_menuFormB.hasIcon = true;
        _menuFormB.nameIcon = 'heroicons_outline:bolt';
        //_menuFormB.collapsable = true;
        _menuFormB.submenu = [_subMenu3];*/
}
