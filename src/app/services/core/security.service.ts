import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUtility } from '../../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    urlIdentity: string = AppUtility.addTrailingSlash(environment.API_URL_IDENTITY);
    urlBase: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);


    constructor(private http: HttpClient) { }

    getTokenApp(data: any): Observable<any> {
        return this.http.get<any>(this.urlIdentity + "obtener-token?idAgencia=" + data.idAgencia + "&idPerfil=" + data.idPerfil);
    }

    getPerfiles(): Observable<any> {
        return this.http.get<any>(this.urlIdentity + 'consultar-perfiles?idSistema=' + environment.ID_SISTEMA + '&cNormativa='+'SENfU2VydmljZV9Ub2tlbkFjY2Vzc0FwcGxpY2FjaW9u');
    }

    getMenus(): Observable<any> {
        return this.http.get<any>(this.urlIdentity + 'consultar-menus?idSistema=' + environment.ID_SISTEMA);
    }

    getInfoUser(): Observable<any> {
        return this.http.get<any>(this.urlIdentity + 'consultar-usuario?idSistema=' + environment.ID_SISTEMA);
    }

    actualizarPerfil(): Observable<any> {
        return this.http.post<any>(this.urlBase + "actualizar-registrar-perfil", null);
    }


    login(usuario: any): Observable<any> {
        //return this.http.post<any>(this.apiUrl + "", usuario);
        return this.http.post<any>(this.urlIdentity + 'autenticacion', usuario);
    }

    getCaptcha(): Observable<any> {
        return this.http.get<any>(this.urlIdentity + 'captcha/generar-captcha');
    }

    /*getPerfilesAS(): Observable<any> {
        return this.http.get<any>(this.urlIdentity + 'perfil/consultar-perfiles');
    }

    getAgencias(): Observable<any> {
        return this.http.get<any>(this.urlIdentity + 'agencia/consultar-agencias');
    }

    getTokenFinal(idAgencia: number, idPerfil: number): Observable<any> {
        let params = new HttpParams();
        if (idAgencia) params = params.set('idAgencia', idAgencia);
        if (idPerfil) params = params.set('idPerfil', idPerfil);
        return this.http.get<any>(this.urlIdentity + 'token/obtener-token', { params });
    }

    getModulos(): Observable<any> {
        //return this.http.post<any>(this.apiUrl + "", usuario);
        return this.http.get<any>(this.urlIdentity + 'consultar-sistema');
    }*/
}
