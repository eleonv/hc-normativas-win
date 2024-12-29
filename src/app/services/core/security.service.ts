import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUtility } from '../../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_IDENTITY);
    url2: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);


    constructor(private http: HttpClient) { }

    getTokenApp(data: any): Observable<any> {
        return this.http.get<any>(this.url + "obtener-token?idAgencia=" + data.idAgencia + "&idPerfil=" + data.idPerfil);
    }

    getPerfiles(): Observable<any> {
        return this.http.get<any>(this.url + 'consultar-perfiles?idSistema=' + environment.ID_SISTEMA);
    }

    getMenus(): Observable<any> {
        return this.http.get<any>(this.url + 'consultar-menus?idSistema=' + environment.ID_SISTEMA);
    }

    getInfoUser(): Observable<any> {
        return this.http.get<any>(this.url + 'consultar-usuario?idSistema=' + environment.ID_SISTEMA);
    }

    actualizarPerfil(): Observable<any> {
        return this.http.post<any>(this.url2 + "actualizar-registrar-perfil", null);
    }


    login(usuario: any): Observable<any> {
        //return this.http.post<any>(this.apiUrl + "", usuario);
        return this.http.post<any>(this.url2 + 'autenticacion', usuario);
    }

    getCaptcha(): Observable<any> {
        return this.http.get<any>(this.url2 + 'captcha/generar-captcha');
    }

    getPerfilesAS(): Observable<any> {
        return this.http.get<any>(this.url2 + 'perfil/consultar-perfiles');
    }

    getAgencias(): Observable<any> {
        return this.http.get<any>(this.url2 + 'agencia/consultar-agencias');
    }

    getTokenFinal(idAgencia: number, idPerfil: number): Observable<any> {
        let params = new HttpParams();
        if (idAgencia) params = params.set('idAgencia', idAgencia);
        if (idPerfil) params = params.set('idPerfil', idPerfil);
        return this.http.get<any>(this.url2 + 'token/obtener-token', { params });
    }
}
