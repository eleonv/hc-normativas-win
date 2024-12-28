import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/core/pagination';
import { AppUtility } from '../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class NormativaService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);

    constructor(private http: HttpClient) { }

    //normativa
    saveNormativa(normativa: any): Observable<any> {
        return this.http.post<any>(this.url + "registrar-normativa", normativa);
    }

    updateNormativa(normativa: any): Observable<any> {
        return this.http.put<any>(this.url + "actualizar-normativa", normativa);
    }

    deleteNormativa(normativa: any): Observable<any> {
        return this.http.delete<any>(this.url + "eliminar-normativa?idNormativa=" + normativa.idNormativa);
    }

    getNormativa(normativa: any): Observable<any> {
        return this.http.get<any>(this.url + "obtener-normativa?idNormativa=" + normativa.idNormativa);
    }

    listNormativas(pagination: Pagination, filtro: any): Observable<any> {
        let params = new HttpParams();

        params = params.set('nPageIndex', pagination.pageIndex);
        params = params.set('nPageSize', pagination.pageSize);
        params = params.set('nMant', "1");

        params = params.set('idTipo', filtro.idTipo);

        if (filtro.cNombre && Object.keys(filtro.cNombre).length > 0)
            params = params.set('cNombre', filtro.cNombre);

        return this.http.get<any>(this.url + "lista-normativas", { params });
    }

    logIngresoApp(): Observable<any> {
        return this.http.post<any>(this.url + "registrar-ingreso", {});
    }
}
