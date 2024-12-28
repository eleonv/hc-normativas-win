import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUtility } from '../../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_IDENTITY);

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
        return this.http.get<any>(this.url + 'consultar-usuario');
    }
}
