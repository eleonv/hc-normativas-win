import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/core/pagination';
import { AppUtility } from '../utility/app-utility';
import { AuthUtility } from '../utility/auth-utility';

@Injectable({
    providedIn: 'root'
})
export class UserNormativaService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);

    constructor(private http: HttpClient) { }

    //#region normativa administrador
    /*listNormativasAdmin(pagination: Pagination): Observable<any> {
        return this.http.get<any>(this.url + "api/normativa/lista-normativas?nPageIndex=" + pagination.pageIndex + " &nPageSize=" +  + pagination.pageSize);
    }*/
    //#endregion

    //#region favorito
    saveFavorito(normativa: any): Observable<any> {
        return this.http.post<any>(this.url + "registrar-favorito", normativa);
    }

    deleteFavorito(normativa: any): Observable<any> {
        return this.http.delete<any>(this.url + "eliminar-favorito?idFavorito=" + normativa.idFavorito);
    }

    listNormativasFavoritos(pagination: Pagination): Observable<any> {
        return this.http.get<any>(this.url + "lista-favoritos?nPageIndex=" + pagination.pageIndex + " &nPageSize=" + + pagination.pageSize);
    }
    //#endregion

    //#region sugerencias
    saveSugerencia(sugerencia: any): Observable<any> {
        return this.http.post<any>(this.url + "registrar-sugerencia", sugerencia);
    }
    //#endregion

    //#region Normativas
    listNormativasUser(pagination: Pagination, filtro: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('nPageIndex', pagination.pageIndex);
        params = params.set('nPageSize', pagination.pageSize);

        params = params.set('nTipoNormativa', filtro.nTipoNormativa);
        params = params.set('idTipo', filtro.idTipo);
        params = params.set('idGerencia', filtro.idGerencia);
        params = params.set('nUltimoFecha', filtro.nUltimoFecha);
        params = params.set('cClave', filtro.cClave);

        if (filtro.cNombre && Object.keys(filtro.cNombre).length > 0)
            params = params.set('cNombre', filtro.cNombre);

        if (AuthUtility.getPerfil().nCodigo == 10)
            params = params.set('nMant', 1);

        return this.http.get<any>(this.url + "lista-normativas", { params });
    }
    //#endregion

    //#region Normativas como archivo
    getMetaDataArchivo(normativa: any, modoArchivo: number): Observable<any> {
        return this.http.get<any>(this.url + "descargar-data?idArchivo=" + normativa.idArchivo + "&idNormativa=" + normativa.idNormativa + "&nTipo=" + modoArchivo);
    }

    getBytesArchivo(url: string): Observable<any> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map((data: any) => {
                if (data.size > 0) return new Blob([data], {});
                else return null;
            })
        );

    }

    obtenerPermisos(idNormativa: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('idNormativa', idNormativa);

        return this.http.get<any>(this.url + "obtener-permiso", { params });
    }
    //#endregion
}
