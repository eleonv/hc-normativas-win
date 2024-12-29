import { Component, DestroyRef, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../services/core/app.service';
import { Constante } from '../../../../utility/constante';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ArchivoComponent } from '../../../../shared/components/archivo/archivo.component';
import { DateUtility } from '../../../../utility/date-utility';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { NormativaService } from '../../../../services/normativa.service';
import { Archivo } from '../../../../models/archivo';
import { MultipleselectComponent } from '../../../../shared/components/multipleselect/multipleselect.component';
import { TipoNormativaService } from '../../../../services/tipo-normativa.service';
import { ChipItem } from '../../../../models/core/chips';
import { PerfilService } from '../../../../services/perfil.service';
import { NgClass } from '@angular/common';
import { ArchivoService } from '../../../../services/archivo.service';
import { ResponseServer } from '../../../../models/core/response-server';

@Component({
    selector: 'app-adm-normativa-reg',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatCardModule,
        MatDividerModule,

        ArchivoComponent,
        MultipleselectComponent,
        NgClass
    ],
    templateUrl: './adm-normativa-reg.component.html',
    styleUrl: './adm-normativa-reg.component.scss'
})
export class AdmNormativaRegComponent {
    _const = Constante;
    accionForm: string = this._const.ACCION_FORM_NEW;

    form = this.fb.group({
        //idPerfil: ['', Validators.required],
        cNombre: ['', Validators.required],
        cVersion: ['', Validators.required],
        cFechaVigenciaCtr: new FormControl<Date>(null as any, Validators.required),
        cPalabrasClave: [''],
        cEmail: ['', Validators.required],
        cObjetivo: [''],
    });

    idArchivo: number;
    normativaData: any = {};
    archivo: Archivo | null = null;
    invalidForm: boolean = true;
    disabledForm: boolean = false;

    readonly configTNormativaMSelect = { label: 'Tipos normativas', button: 'Agregar' };
    tiposNormSeledted = signal<any[]>([]);
    tiposNormRaw: ChipItem[] = [];

    readonly configAreasMSelect = { label: 'Gerencias', button: 'Agregar' };
    areasSeledted = signal<any[]>([]);
    areasRaw: ChipItem[] = [];

    readonly configPerfilesMSelect = { label: 'Perfiles', button: 'Agregar' };
    perfilesSeledted = signal<any[]>([]);
    perfilesRaw: ChipItem[] = [];

    idTiposNormativa: number[] = [];
    idPerfiles: number[] = [];
    idAreas: number[] = [];

    nCodigoArchivo = 1;

    constructor(
        private fb: FormBuilder,
        private normativaService: NormativaService,
        private tipoNormativaService: TipoNormativaService,
        private prerfilService: PerfilService,
        private appService: AppService,
        private destroyRef: DestroyRef,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private archivoService: ArchivoService
    ) {
        this.idArchivo = -1;
        let _accionForm = this.activatedRoute.snapshot.data['accionForm'];

        this.accionForm = this._const.ACCION_FORM_NEW;
        if (_accionForm) {
            this.accionForm = _accionForm;

            this.disabledForm = (this.accionForm == this._const.ACCION_FORM_VIEW);
        }

        this.validarForm();
        this.listarTiposNormativa();
        this.listarAreas();
        this.listarPerfilesNormativas();

        if (this.accionForm == this._const.ACCION_FORM_EDIT) {
            this.obtenerDatosCompartido();
        } else {
            this.normativaData.idNormativa = null;
            this.archivo = null;
        }
    }

    //#region Metodos
    listarTiposNormativa() {
        let pagination = {
            nTotal: -1,
            pageIndex: -1,
            pageSize: -1,
        }

        this.appService.activateLoading();
        this.tipoNormativaService.listTipoNormativa(pagination)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    ////console.log("Response", response);

                    if (response.success == Constante.STATUS_OK) {
                        let listado = response.data.lstTNormativas;

                        this.tiposNormRaw = listado.map((item: any) => {
                            return { id: item.id, name: item.cNombre, check: false };
                        });

                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }

    listarAreas() {
        this.appService.activateLoading();
        this.prerfilService.listAreas()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    //console.log("Areas", response);

                    if (response.success == Constante.STATUS_OK) {
                        let listado = response.data;

                        this.areasRaw = listado.map((item: any) => {
                            return { id: item.idGerencia, name: item.cGerencia, check: false };
                        });

                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });
    }

    listarPerfilesNormativas() {
        let pagination = {
            nTotal: -1,
            pageIndex: -1,
            pageSize: -1,
        }
        this.appService.activateLoading();
        this.prerfilService.listPerfiles(pagination)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == Constante.STATUS_OK) {
                        let listado = response.data.lstPerfiles;

                        this.perfilesRaw = listado.map((item: any) => {
                            return { id: item.idPerfil, name: item.cNombre, check: false };
                        });

                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });
    }

    nuevoRegistro(normativa: any) {
        ////console.log("normativa: ", normativa);

        this.appService.activateLoading();
        this.normativaService.saveNormativa(normativa)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == this._const.STATUS_OK) {
                        this.toastr.success(response.message, this._const.MESSAGE_TITLE_SUCCESS);
                        this.disableForm();
                        this.accionForm = this._const.ACCION_FORM_VIEW;

                    } else {
                        console.error(this._const.MESSAGE_ERROR_SERVER, response.errors);
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
                error: (err: any) => {
                    this.appService.disableLoading();
                    console.error(this._const.MESSAGE_ERROR_SERVER, err);
                    this.toastr.error(this._const.MESSAGE_ERROR_SERVER, this._const.MESSAGE_TITLE_ERROR);
                }
            });
    }

    actualizarRegistro(normativa: any) {
        ////console.log("normativa: ", normativa);

        this.appService.activateLoading();
        this.normativaService.updateNormativa(normativa)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == this._const.STATUS_OK) {
                        this.toastr.success(response.message, this._const.MESSAGE_TITLE_SUCCESS);
                        this.disableForm();
                        this.accionForm = this._const.ACCION_FORM_VIEW;

                    } else {
                        console.error(this._const.MESSAGE_ERROR_SERVER, response.errors);
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
                error: (err: any) => {
                    this.appService.disableLoading();
                    console.error(this._const.MESSAGE_ERROR_SERVER, err);
                    this.toastr.error(this._const.MESSAGE_ERROR_SERVER, this._const.MESSAGE_TITLE_ERROR);
                }
            });
    }

    disableForm() {
        this.disabledForm = true;
        this.form.controls.cNombre.disable();
        this.form.controls.cVersion.disable();
        this.form.controls.cFechaVigenciaCtr.disable();
        this.form.controls.cPalabrasClave.disable();
        this.form.controls.cEmail.disable();
        this.form.controls.cObjetivo.disable();
    }

    validarForm() {
        ////console.log("this.invalidForm", this.invalidForm);
        //console.log(this.idArchivo)

        if (this.idTiposNormativa.length <= 0) { this.invalidForm = true; return; }
        //if(this.idPerfiles.length <= 0) { this.invalidForm = true;  return; }
        if (this.idAreas.length <= 0) { this.invalidForm = true; return; }
        if (this.idArchivo == -1) { this.invalidForm = true; return; }
        if (this.idArchivo == null) { this.invalidForm = true; return; }

        this.invalidForm = false;
        ////console.log("actualizad this.isValidForm", this.invalidForm);

    }
    //#endregion

    //#region
    onSelectedTNormativa($event: any) {
        ////console.log("onSelectedTNormativa", $event);
        let _response = $event;

        if (_response.status == Constante.STATUS_OK) {
            let _listado = _response.data;

            this.idTiposNormativa = _listado.map((item: any) => item.id);
            ////console.log("this.idTiposNormativa", this.idTiposNormativa);
        }

        this.validarForm();
    }

    onSelectedAreas($event: any) {
        let _response = $event;

        if (_response.status == Constante.STATUS_OK) {
            let _listado = _response.data;

            this.idAreas = _listado.map((item: any) => item.id);
        }

        this.validarForm();
    }

    onSelectedPerfiles($event: any) {
        let _response = $event;

        if (_response.status == Constante.STATUS_OK) {
            let _listado = _response.data;

            this.idPerfiles = _listado.map((item: any) => item.id);
        }

        this.validarForm();
    }

    onArchivoSubido($event: any) {
        if ($event.status == this._const.STATUS_OK) {
            this.archivo = $event.data
            //console.log("hay archivo")
            //console.log(this.archivo)
            //console.log($event.data)
            //console.log("----------------------------")
            //console.log($event.data.file)
            this.idArchivo = 0
        } else {
            //console.log("no  hay archivo")
            this.idArchivo = -1;
        }
        //console.log("no pasa a validar")

        this.validarForm();
        // if ($event.status == this._const.STATUS_OK) {
        //     this.idArchivo = $event.data.idArchivo;
        // } else {
        //     this.idArchivo = 0;
        // }

        // this.validarForm();
    }
    uploadArchivo(archivo: Archivo) {
        this.archivoService.uploadArchivo(this.nCodigoArchivo, archivo.file)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: ResponseServer<any>) => {
                    if (response.success == Constante.STATUS_OK) {
                        //console.log('se guardo pdf')
                        this.idArchivo = response.data
                        this.onGuardarCitacion()
                    }
                },
                error: (err: any) => {
                    console.error(this._const.MESSAGE_ERROR_SERVER, err);
                    this.toastr.error(this._const.MESSAGE_ERROR_SERVER, this._const.MESSAGE_TITLE_ERROR);
                }
            });
    }

    onGuardarCitacion() {
        if (this.idArchivo == 0 && this.archivo) {
            this.uploadArchivo(this.archivo)
            return
        }

        let _nombre = this.form.get('cNombre')?.value;
        let _version = this.form.get('cVersion')?.value;
        let _fechaVigenciaCtr = this.form.get('cFechaVigenciaCtr')?.value;
        let _palabrasClave = this.form.get('cPalabrasClave')?.value;
        let _email = this.form.get('cEmail')?.value;
        let _objetivo = this.form.get('cObjetivo')?.value;

        //console.log(typeof _fechaVigenciaCtr);
        let _fechaVigencia = DateUtility.dateToString(_fechaVigenciaCtr!, 'YYYY-MM-DD');

        ////console.log("_fechaVigencia", _fechaVigencia);

        let _normativa = {
            idNormativa: this.normativaData.idNormativa,
            //lstProceso: [2],
            //lstGerencia: [4],
            //lstPerfil: [1],
            lstProceso: this.idTiposNormativa,
            lstGerencia: this.idAreas,
            lstPerfil: this.idPerfiles,
            cNombre: _nombre,
            cVersion: _version,
            cFechaVigencia: _fechaVigencia,
            dFechaAprobacion: _fechaVigencia,
            cPalabrasClave: _palabrasClave,
            cEmail: _email,
            cObjetivo: _objetivo,
            idArchivo: this.idArchivo,
        };
        if (this.accionForm == this._const.ACCION_FORM_NEW) {
            this.nuevoRegistro(_normativa);
        } else if (this.accionForm == this._const.ACCION_FORM_EDIT) {
            _normativa.idNormativa = this.normativaData.idNormativa;
            this.actualizarRegistro(_normativa);
        }
    }

    obtenerDatosCompartido() {
        this.appService.getValueSharedData()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((normativa: any) => {

                if (normativa == null) {
                    this.router.navigate([this._const.URL_ADM_NORMATIVA_LIST]);
                    return
                }

                ////console.log("normativa edit", normativa);


                this.normativaService.getNormativa(normativa)
                    .pipe(take(1), takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: any) => {
                            this.appService.disableLoading();
                            //console.log("normativa rcovery", response);

                            if (response.success == Constante.STATUS_OK) {
                                this.normativaData = response.data;

                                let _fechaVigenciaCtr: Date = DateUtility.stringToDate(normativa.cFechaVigencia, 'YYYY-MM-DD');

                                this.form.controls.cNombre.setValue(this.normativaData.cNombre);
                                this.form.controls.cVersion.setValue(this.normativaData.cVersion);
                                this.form.controls.cFechaVigenciaCtr.setValue(_fechaVigenciaCtr);
                                this.form.controls.cPalabrasClave.setValue(this.normativaData.cPalabrasClave);
                                this.form.controls.cEmail.setValue(this.normativaData.cEmail);
                                this.form.controls.cObjetivo.setValue(this.normativaData.cObjetivo);

                                this.archivo = new Archivo();
                                this.archivo.name = response.data.cNombreArchivo;

                                // Recuperar tipos de normativa
                                this.normativaData.lstProcesos.forEach((x: any) => {
                                    this.tiposNormSeledted.update(item => [...item, { id: x.idProceso, name: x.cNombre, check: true }]);
                                });

                                // Recuperar Areas (Gerencias)
                                this.normativaData.lstGerencias.forEach((x: any) => {
                                    this.areasSeledted.update(item => [...item, { id: x.idGerencia, name: x.cNombre, check: true }]);
                                });

                                // Recuperar perfiles
                                this.normativaData.lstPerfiles.forEach((x: any) => {
                                    this.perfilesSeledted.update(item => [...item, { id: x.idPerfil, name: x.cNombre, check: true }]);
                                });

                                // Recuperar IDs
                                this.idTiposNormativa = this.normativaData.lstProcesos.map((item: any) => item.idProceso);
                                this.idAreas = this.normativaData.lstGerencias.map((item: any) => item.idGerencia);
                                this.idPerfiles = this.normativaData.lstPerfiles.map((item: any) => item.idPerfil);

                                ////console.log("this.idTiposNormativa", this.idTiposNormativa);
                                ////console.log("this.idAreas", this.idAreas);
                                ////console.log("this.idPerfiles", this.idPerfiles);
                                //console.log("this.archivo", this.archivo);


                                this.idArchivo = this.normativaData.idArchivo;
                                //console.log('id Edit', this.idArchivo)
                                this.invalidForm = false;

                            } else {
                                this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                            }
                        },
                    });
            });
    }

    onSalirForm() {
        this.router.navigate([this._const.URL_ADM_NORMATIVA_LIST]);
    }
    //endregion

}
