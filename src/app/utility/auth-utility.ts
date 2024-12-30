import { Constante } from "./constante";
import { UsuarioAS } from "../models/usuarioas";

export class AuthUtility {

    static initSessionData(token: string) {
        sessionStorage.setItem(Constante.TOKEN_APP, token);
    }

    static closeSessionData(): void {
        sessionStorage.removeItem(Constante.TOKEN_APP);
        sessionStorage.clear();
        console.clear();
    }

    static getToken(): string | null {

        let token = sessionStorage.getItem(Constante.TOKEN_APP);
        if (token && token.length > 0) {
            return token;
        } else {
            return null;
        }
    }

    static isAuthenticated(): boolean {
        let token = AuthUtility.getToken();
        if (token && token != null) {
            return true;
        } else {
            return false;
        }
    }

    static setTokenIdentity(token: string) {
        sessionStorage.setItem(Constante.TOKEN_IDENTITY, token);
    }

    static getTokenIdentity(): string | null {

        let token = sessionStorage.getItem(Constante.TOKEN_IDENTITY);
        if (token && token.length > 0) {
            return token;
        } else {
            return null;
        }
    }

    static getValueUserAS() : UsuarioAS | null {
        let user = sessionStorage.getItem(Constante.INFO_USER);
        if (user && user.length > 0) {
            return JSON.parse(user);
        } else {
            return null;
        }
    }

    static setValueUserAS(user: UsuarioAS) {
        sessionStorage.setItem(Constante.INFO_USER, JSON.stringify(user));
    }

    static getPerfil() : any | null {
        let perfil = sessionStorage.getItem(Constante.PERFIL_USER);
        if (perfil && perfil.length > 0) {
            return JSON.parse(perfil);
        } else {
            return null;
        }
    }

    static setPerfil(perfil: any) {
        sessionStorage.setItem(Constante.PERFIL_USER, JSON.stringify(perfil));
    }

    static clearPerfil() {
        sessionStorage.removeItem(Constante.PERFIL_USER);
    }

    //#region Menu
    static setMenu(menu: any) {
        sessionStorage.setItem(Constante.MENU_APP, JSON.stringify(menu));
    }

    static getMenu() : any | null {
        let menu = sessionStorage.getItem(Constante.MENU_APP);
        if (menu && menu.length > 0) {
            return JSON.parse(menu);
        } else {
            return null;
        }
    }
    //#endregion

    //#region ver normativa
    static setDataNormativa(normativa: any) {
        sessionStorage.setItem(Constante.DATA_VIEW_NORMATIVA, JSON.stringify(normativa));
    }

    static getDataNormativa() : any | null {
        let normativa = sessionStorage.getItem(Constante.DATA_VIEW_NORMATIVA);
        if (normativa && normativa.length > 0) {
            return JSON.parse(normativa);
        } else {
            return null;
        }
    }
    //#endregion

}
