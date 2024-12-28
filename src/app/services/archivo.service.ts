import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppUtility } from '../utility/app-utility';

@Injectable({
    providedIn: 'root'
})
export class ArchivoService {

    url: string = AppUtility.addTrailingSlash(environment.API_URL_BASE);

    constructor(private http: HttpClient) { }

    //archivos
    uploadArchivo(nCodigoArchivo: number, archivo: File): Observable<any> {
        const formData = new FormData();
        formData.append('nCodigoArchivo', nCodigoArchivo + "");
        formData.append('Archivo', archivo, archivo.name);

        return this.http.post<any>(this.url + "registrar-archivo", formData);
    }
}
