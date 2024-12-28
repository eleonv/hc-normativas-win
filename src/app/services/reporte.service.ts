import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/core/pagination';
import { AppUtility } from '../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);

    constructor(private http: HttpClient) { }

    logAccesoNormtivas(pagination: Pagination, filtro: any): Observable<any> {
        let params = new HttpParams();
        //params = params.set('nPageIndex', pagination.pageIndex);
        //params = params.set('nPageSize', pagination.pageSize);

        params = params.set('cFechaInicio', filtro.cFechaInicio);
        params = params.set('cFechaFin', filtro.cFechaFin);
        params = params.set('cPerfil', filtro.cPerfil);
        params = params.set('cAgencia', filtro.cAgencia);
        params = params.set('cArea', filtro.cArea);

        return this.http.get<any>(this.url + "ingresos", { params });
    }

    controlAccesos(pagination: Pagination, filtro: any): Observable<any> {
        let params = new HttpParams();
        //params = params.set('nPageIndex', pagination.pageIndex);
        //params = params.set('nPageSize', pagination.pageSize);

        params = params.set('cFechaInicio', filtro.cFechaInicio);
        params = params.set('cFechaFin', filtro.cFechaFin);

        return this.http.get<any>(this.url + "control-accesos", { params });
    }

    saveReporte(reporte: any): Observable<any> {
        return this.http.post<any>(this.url + "registrar-reporte", reporte);
    }

    updateReporte(reporte: any): Observable<any> {
        return this.http.put<any>(this.url + "actualizar-reporte", reporte);
    }

    deleteReporte(reporte: any): Observable<any> {
        return this.http.delete<any>(this.url + "eliminar-reporte?idReporte=" + reporte.idReporte);
    }

    getReporte(reporte: any): Observable<any> {
        return this.http.get<any>(this.url + "obtener-reporte?idReporte=" + reporte.idReporte);
    }

    listReporte(pagination: Pagination, filtro: any): Observable<any> {
        let params = new HttpParams();

        //params = params.set('nPageIndex', pagination.pageIndex);
        //params = params.set('nPageSize', pagination.pageSize);

        //if (filtro.cNombre && Object.keys(filtro.cNombre).length > 0)
        //    params = params.set('cNombre', filtro.cNombre);

        return this.http.get<any>(this.url + "listar-reporte", { params });
    }
}
