import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/core/pagination';
import { AppUtility } from '../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class TipoNormativaService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);

    constructor(private http: HttpClient) { }

    saveTipoNormativa(tipoNormativa: any): Observable<any> {
        return this.http.post<any>(this.url + "registrar-tipo", tipoNormativa);
    }

    updateTipoNormativa(tipoNormativa: any): Observable<any> {
        return this.http.put<any>(this.url + "actualizar-tipo", tipoNormativa);
    }

    deleteTipoNormativa(tipoNormativa: any): Observable<any> {
        return this.http.delete<any>(this.url + "eliminar-tipo?idTipo=" + tipoNormativa.idTipo);
    }

    listTipoNormativa(pagination: Pagination, nTipoPadre: number = -1): Observable<any> {
        let params = new HttpParams();
        params = params.set('nPageIndex', pagination.pageIndex);
        params = params.set('nPageSize', pagination.pageSize);
        params = params.set('nTipoPadre', nTipoPadre);

        return this.http.get<any>(this.url + "lista-tipos", { params });
    }
}
