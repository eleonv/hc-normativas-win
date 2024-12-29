import { CommonModule, JsonPipe } from '@angular/common';
import { Component, DestroyRef, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ResponseComponent } from '../../../models/core/response-component';
import { Constante } from '../../../utility/constante';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { AppService } from '../../../services/core/app.service';
import { UserNormativaService } from '../../../services/user-normativa.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sugerencia-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
    ],
    templateUrl: './sugerencia-dialog.component.html',
    styleUrl: './sugerencia-dialog.component.scss'
})
export class SugerenciaDialogComponent {
    _const = Constante;
    /*showTitle: boolean = false;
    title: string = "";
    message: string = "";
    detail: string = "";
    showDetail: boolean = false;*/

    dialogResult: ResponseComponent<any> = {
        status: this._const.DIALOG_STATUS_CANCEL,
        data: null
    };

    form = this.fb.group({
        idTipo: ['', Validators.required],
        cMensaje: ['', Validators.required],
        cCorreo: ['', Validators.required],
    });

    normativaData: any = {};

    constructor(
        public dialogRef: MatDialogRef<SugerenciaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private destroyRef: DestroyRef,
        private appService: AppService,
        private userNormativaService: UserNormativaService,
        private toastr: ToastrService,
    ) {
        this.normativaData = data.normativa;
        ////console.log("data", data);
    }

    //#region Methods
    saveSugerencia(sugerencia: any) {
        this.appService.activateLoading();
        this.userNormativaService.saveSugerencia(sugerencia)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == this._const.STATUS_OK) {
                        this.toastr.success(response.message, this._const.MESSAGE_TITLE_SUCCESS);

                        this.dialogResult.status = this._const.DIALOG_STATUS_OK;
                        this.dialogRef.close(this.dialogResult);
                    } else {
                        console.error(this._const.MESSAGE_ERROR_SERVER, response.errors);
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                }
            });
    }
    //#endregion

    //#region Events
    onEnviar() {
        this.dialog.open(ConfirmationDialogComponent, { data: { message: "¿Estás seguro de continuar?" } })
        .afterClosed().subscribe((response: ResponseComponent<any>) => {
            if (response.status == this._const.DIALOG_STATUS_OK) {

                let _idTipo = this.form.get('idTipo')?.value;
                let _mensaje = this.form.get('cMensaje')?.value;
                let _correo = this.form.get('cCorreo')?.value;

                let _sugerencia = {
                    idNormativa: this.normativaData.idNormativa,
                    idTipo: _idTipo,
                    cMensaje: _mensaje,
                    cCorreo: _correo,
                };

                //console.log("_sugerencia", _sugerencia);


                this.saveSugerencia(_sugerencia);
            }
        });
    }

    ngOnDestroy() {
        this.dialogRef.close(this.dialogResult);
    }
    //#endregion
}
