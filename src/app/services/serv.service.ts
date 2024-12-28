import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { UserNormativaService } from './user-normativa.service';
import { ToastrService } from 'ngx-toastr';
import { Constante } from '../utility/constante';
import { AppService } from './core/app.service';

@Injectable({
    providedIn: 'root'
})
export class ServService {
    _const = Constante;

    constructor(
        private destroyRef: DestroyRef,
        private appService: AppService,
        private userNormativaService: UserNormativaService,
        private toastr: ToastrService,
    ) { }

    onDescargar(_normativaData: any, _modoArchivo: any) {
        this.appService.activateLoading();
        this.userNormativaService.getMetaDataArchivo(_normativaData, _modoArchivo)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    if (response.success == Constante.STATUS_OK) {
                        let _nombreFile = response.data.cNombre;
                        let _urlArchivo = response.data.cRuta;
                        this.getBytesArchivo(_urlArchivo, _nombreFile);
                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                        this.appService.disableLoading();
                    }
                },
            });

    }

    getBytesArchivo(urlArchivo: string, nombreFile: string) {
        this.userNormativaService.getBytesArchivo(urlArchivo)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    const url = window.URL.createObjectURL(response);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = nombreFile;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.appService.disableLoading();
                },
            });
    }
}
