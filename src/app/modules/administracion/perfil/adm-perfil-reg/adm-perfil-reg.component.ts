import { Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AppService } from '../../../../services/core/app.service';
import { Constante } from '../../../../utility/constante';
import { PerfilService } from '../../../../services/perfil.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultipleselectComponent } from '../../../../shared/components/multipleselect/multipleselect.component';
import { ChipItem } from '../../../../models/core/chips';

@Component({
    selector: 'app-adm-perfil-reg',
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
        MatCheckboxModule,
        FormsModule,
        MultipleselectComponent,
    ],
    templateUrl: './adm-perfil-reg.component.html',
    styleUrl: './adm-perfil-reg.component.scss'
})
export class AdmPerfilRegComponent {
    _const = Constante;
    accionForm: string = this._const.ACCION_FORM_NEW;

    form = this.fb.group({
        cNombre: ['', Validators.required],
        lImprime: [false],
        lDescarga: [false],
    });

    perfilData: any = {};

    lImprime: any
    lDescarga: any

    listaGerencias: any[] = []
    nTipo: number = 1;

    readonly configAreasMSelect = { label: 'Gerencias', button: 'Agregar' };
    areasSeledted = signal<any[]>([]);
    areasRaw: ChipItem[] = [];

    disabledForm: boolean = false;
    lTodoGerencia: boolean = false;
    idAreas: number[] = [];
    listadoGer: any;


    constructor(
        private fb: FormBuilder,
        private perfilService: PerfilService,
        private appService: AppService,
        private destroyRef: DestroyRef,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        let _accionForm = this.activatedRoute.snapshot.data['accionForm'];
        if (_accionForm) {
            this.accionForm = _accionForm;
            this.listarGerencias()
        }

        if (this.accionForm == this._const.ACCION_FORM_EDIT) {
            this.obtenerDatosCompartido();
        }
    }

    ngAfterViewInit() { }


    //#region Metodos
    listarGerencias() {
        this.appService.activateLoading();
        this.perfilService.listAreas()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    ////console.log("Areas", response);

                    if (response.success == Constante.STATUS_OK) {
                        this.listaGerencias = response.data;
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
    nuevoRegistro(perfil: any) {
        ////console.log("tipoNormativa: ", tipoNormativa);

        this.appService.activateLoading();
        this.perfilService.savePerfil(perfil)
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

    actualizarRegistro(perfil: any) {
        ////console.log("normativa: ", normativa);

        this.appService.activateLoading();
        this.perfilService.updatePerfil(perfil)
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

    obtenerDatosCompartido() {
        this.appService.getValueSharedData()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe((perfil: any) => {

                if (perfil == null) {
                    this.onSalirForm();
                    return
                }

                this.perfilData.idPerfil = perfil.idPerfil;
                this.perfilData.cNombre = perfil.cNombre;

                this.form.controls.cNombre.setValue(this.perfilData.cNombre);
                this.form.controls.lImprime.setValue(perfil.nImprime == 1 ? true : false);
                this.lImprime = perfil.nImprime == 1 ? true : false
                this.form.controls.lDescarga.setValue(perfil.nDescarga == 1 ? true : false);
                this.lDescarga = perfil.nDescarga == 1 ? true : false
                this.nTipo = perfil.nTipo

                perfil.lstGerencias.forEach((x: any) => {
                    this.areasSeledted.update(item => [...item, { id: x.idGerencia, name: x.cGerencia, check: true }]);
                });
                this.idAreas = perfil.lstGerencias.lstGerencias.map((item: any) => item.idGerencia);

                //this.form.controls.nTipoPadre.setValue(this.perfilData.nTipoPadre);
            });
    }

    disableForm() {
        this.form.controls.cNombre.disable();
        this.form.controls.lDescarga.disable();
        this.form.controls.lImprime.disable();
        //this.form.controls.nTipoPadre.disable();
    }
    //#endregion

    //#region Eventos
    onGuardarRegistro() {
        let _nombre = this.form.get('cNombre')?.value;
        let _imprime = this.form.get('lImprime')?.value == true ? 1 : 0;
        let _descarga = this.form.get('lDescarga')?.value == true ? 1 : 0;
        let _tipoPerfil = this.nTipo;

        let _perfil = {
            idPerfil: null,
            cNombre: _nombre,
            nTipo: _tipoPerfil,
            nImprime: _imprime,
            nDescarga: _descarga,
            lstGerencia: this.idAreas
        };

        //console.log(_perfil)
        if (this.accionForm == this._const.ACCION_FORM_NEW) {
            this.nuevoRegistro(_perfil);
        } else if (this.accionForm == this._const.ACCION_FORM_EDIT) {
            _perfil.idPerfil = this.perfilData.idPerfil;
            this.actualizarRegistro(_perfil);
        }
    }
    onSelectedAreas($event: any) {
        let _response = $event;

        if (_response.status == Constante.STATUS_OK) {
            this.listadoGer = _response.data;

            this.idAreas = this.listadoGer.map((item: any) => item.id);
        }
    }

    onSalirForm() {
        this.router.navigate([this._const.URL_ADM_PERFIL_LIST]);
    }
    //#endregion

}
