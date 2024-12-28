import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Constante } from '../../../utility/constante';
import { ResponseComponent } from '../../../models/core/response-component';
import { AppUtility } from '../../../utility/app-utility';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { ResponseServer } from '../../../models/core/response-server';
import { ArchivoService } from '../../../services/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { Archivo } from '../../../models/archivo';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-archivo',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatProgressBarModule,
        NgClass
    ],
    templateUrl: './archivo.component.html',
    styleUrl: './archivo.component.scss'
})
export class ArchivoComponent {
    _const = Constante;

    @Output() result = new EventEmitter<ResponseComponent<any>>();
    @Input() archivo: Archivo | null = null;
    @Input() accionForm: string = "";
    @Input() disabled: boolean = false;

    isUploadFileLocal = false;
    progressBarFile = false;
    nCodigoArchivo = 1;

    constructor(
        private archivoService: ArchivoService,
        private destroyRef: DestroyRef,
        private toastr: ToastrService,
    ) {
    }

    //#region Methods
    ngAfterViewInit() {}

    validarPDF(_file: any) {
        //console.log("validarPDF: ", _file);
        let fileName = _file.name;
        let size = _file.size;

        if (fileName.indexOf('.pdf') == -1) {
            this.toastr.warning("Formato de archivo incorrecto. Seleccione un archivo PDF.", 'Advertencia');
            return false;
        }

        if (size / 1024 / 1024 > 9) {
            this.toastr.warning("El tamaño del archivo excede los 10MB permitidos", 'Advertencia');
            return false;
        }

        return true;
    }
    //#endregion

    //#region Events
    onFileSelected($event: any) {
        let _file = $event.target.files[0];

        if (!this.validarPDF(_file)) { return; }

        this.archivo = new Archivo();
        this.archivo.name = _file.name;
        this.archivo.size = _file.size;
        this.archivo.sizeDesc = AppUtility.formatKbAndMB(_file.size);
        this.archivo.file = _file;

        this.isUploadFileLocal = true;
    }

    onUploadFile() {
        if (!this.archivo) { return; }

        this.progressBarFile = true;
        //this.appService.activateLoading();
        this.progressBarFile = false;
        if (this.archivo) {
            this.isUploadFileLocal = false;
            //this.archivo.idArchivo = response.data;

            let resultCpm: ResponseComponent<any> = {
                status: this._const.STATUS_OK,
                data: this.archivo
            };

            this.result.emit(resultCpm);
        }
        // this.archivoService.uploadArchivo(this.nCodigoArchivo, this.archivo.file)
        //     .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        //     .subscribe({
        //         next: (response: ResponseServer<any>) => {
        //             this.progressBarFile = false;
        //             //console.log("onUploadFile: ", response);

        //             if (response.success == Constante.STATUS_OK) {

        //                 if (this.archivo) {
        //                     this.isUploadFileLocal = false;
        //                     this.archivo.idArchivo = response.data;

        //                     let resultCpm: ResponseComponent<any> = {
        //                         status: this._const.STATUS_OK,
        //                         data: this.archivo
        //                     };

        //                     this.result.emit(resultCpm);
        //                 }
        //             }
        //         },
        //         error: (err: any) => {
        //             this.progressBarFile = false;
        //             console.error(this._const.MESSAGE_ERROR_SERVER, err);
        //             this.toastr.error(this._const.MESSAGE_ERROR_SERVER, this._const.MESSAGE_TITLE_ERROR);
        //         }
        //     });
    }

    onEliminarArchivoUpload() {
        this.archivo = null;
        this.isUploadFileLocal = false;
        this.accionForm = this._const.ACCION_FORM_NEW;

        let resultCpm: ResponseComponent<any> = {
            status: this._const.STATUS_ERROR,
            data: null
        };

        this.result.emit(resultCpm);
    }

}
