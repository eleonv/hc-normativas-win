import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
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
import { TipoNormativaService } from '../../../../services/tipo-normativa.service';
import { Constante } from '../../../../utility/constante';

@Component({
    selector: 'app-adm-tiponormativa-reg',
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
    ],
    templateUrl: './adm-tiponormativa-reg.component.html',
    styleUrl: './adm-tiponormativa-reg.component.scss'
})
export class AdmTiponormativaRegComponent {
    _const = Constante;
    accionForm: string = this._const.ACCION_FORM_NEW;

    form = this.fb.group({
        cNombre: ['', Validators.required],
        nTipoPadre: ['', Validators.required],
    });

    tipoNormativaData: any = {};

    constructor(
        private fb: FormBuilder,
        private tipoNormativaService: TipoNormativaService,
        private appService: AppService,
        private destroyRef: DestroyRef,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        let _accionForm = this.activatedRoute.snapshot.data['accionForm'];

        this.accionForm = this._const.ACCION_FORM_NEW;
        if (_accionForm) {
            this.accionForm = _accionForm;
        }

        if (this.accionForm == this._const.ACCION_FORM_EDIT) {
            this.obtenerDatosCompartido();
        }
    }

    ngAfterViewInit() { }


    //#region Metodos
    nuevoRegistro(tipoNormativa: any) {
        //console.log("tipoNormativa: ", tipoNormativa);

        this.appService.activateLoading();
        this.tipoNormativaService.saveTipoNormativa(tipoNormativa)
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

    actualizarRegistro(tipoNormativa: any) {
        //console.log("normativa: ", normativa);

        this.appService.activateLoading();
        this.tipoNormativaService.updateTipoNormativa(tipoNormativa)
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
            .subscribe((tipoNormativa: any) => {

                if (tipoNormativa == null) {
                    this.onSalirForm();
                    return
                }

                console.log("tipoNormativa: ", tipoNormativa);
                this.tipoNormativaData.idTipo = tipoNormativa.id;
                this.tipoNormativaData.cNombre = tipoNormativa.cNombre;
                this.tipoNormativaData.nTipoPadre = tipoNormativa.cTipo;

                this.form.controls.cNombre.setValue(this.tipoNormativaData.cNombre);
                this.form.controls.nTipoPadre.setValue(this.tipoNormativaData.nTipoPadre);
            });
    }

    disableForm() {
        this.form.controls.cNombre.disable();
        this.form.controls.nTipoPadre.disable();
    }
    //#endregion

    //#region Eventos
    onGuardarRegistro() {
        let _nombre = this.form.get('cNombre')?.value;
        let _tipoPadre = this.form.get('nTipoPadre')?.value;

        let _tipoNormativa = {
            idTipo: null,
            cNombre: _nombre,
            nTipoPadre: _tipoPadre,
        };

        if (this.accionForm == this._const.ACCION_FORM_NEW) {
            this.nuevoRegistro(_tipoNormativa);
        } else if (this.accionForm == this._const.ACCION_FORM_EDIT) {
            _tipoNormativa.idTipo = this.tipoNormativaData.idTipo;
            this.actualizarRegistro(_tipoNormativa);
        }
    }

    onSalirForm() {
        this.router.navigate([this._const.URL_ADM_TIPO_NORMATIVA_LIST]);
    }
    //#endregion

}
