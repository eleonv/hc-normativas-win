import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Pagination } from '../../../../models/core/pagination';
import { AppService } from '../../../../services/core/app.service';
import { ReporteService } from '../../../../services/reporte.service';
import { Constante } from '../../../../utility/constante';
import { DateUtility } from '../../../../utility/date-utility';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResponseComponent } from '../../../../models/core/response-component';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-adm-reporte-list',
    standalone: true,
    imports: [
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatButtonModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatTooltipModule
    ],
    templateUrl: './adm-reporte-list.component.html',
    styleUrl: './adm-reporte-list.component.scss'
})
export class AdmReporteListComponent {
    _const = Constante;
    //tipoNormativa: number = -1;

    displayedColumns: string[] = ['nNumero', 'cNombre', 'cDescripcion', 'cFechaInicio', 'acciones'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    /*areasRaw: any[] = [];
    tiposNormRaw: any[] = [];

    form = this.fb.group({
        cFechaInicio: new FormControl(new Date()),
        cFechaFin: new FormControl(new Date()),
    });

    filterSearch: any = {};
    filterSearchDefault: any = {};

    fechaDesde: Date | null = null;
    fechaHasta: Date | null = new Date();*/

    constructor(
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
        private appService: AppService,
        private reporteService: ReporteService,
        private toastr: ToastrService,
        private router: Router,
        public dialog: MatDialog,
    ) {
        /*const dCurrentDate = new Date();
        const ageOneYear = new Date(dCurrentDate.getFullYear() - 1, dCurrentDate.getMonth(), dCurrentDate.getDate());
        this.fechaDesde = ageOneYear;*/

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        /*let cCurrentDate = DateUtility.dateToString(dCurrentDate, 'YYYY-MM-DD');
        this.filterSearchDefault = {
            dCurrentDate: dCurrentDate,
            cFechaInicio: cCurrentDate,
            cFechaFin: cCurrentDate
        };

        this.filterSearch = structuredClone(this.filterSearchDefault);*/
        this.listarRegistros();
    }

    ngAfterViewInit() { }

    //#region Methods
    listarRegistros(): void {
        this.appService.activateLoading();
        this.reporteService.listReporte(this.pagination, {})
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    ////console.log("response", response);

                    if (response.success == Constante.STATUS_OK) {
                        if (Object.keys(response.data).length > 0) {
                            this.listData = response.data;
                            //this.pagination.nTotal = response.data.objPaginacion.nTotal;
                            //this.pagination.pageIndex = response.data.objPaginacion.pageIndex;
                            this.pagination.nTotal = 0;
                            this.pagination.pageIndex = 0;
                        } else {
                            this.listData = [];
                            this.pagination.nTotal = 0;
                            this.pagination.pageIndex = 0;
                        }

                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }
    //#endregion

    //#region Event
    onPaginatorEvent(event: any) {
        //console.log(event);
        this.pagination.pageSize = event.pageSize;
        this.pagination.pageIndex = event.pageIndex;
        this.listarRegistros();
    }

    onNuevoRegistro() {
        this.router.navigate([this._const.URL_ADM_REPORTE_REG]);
    }

    onEditarRegistro(item: any) {
        this.appService.setValueSharedData(item);
        this.router.navigate([this._const.URL_ADM_REPORTE_ACT]);
    }

    onEliminarRegistro(item: any) {
        this.dialog.open(ConfirmationDialogComponent, { data: { message: "¿Estás seguro de continuar?" } })
            .afterClosed().subscribe((response: ResponseComponent<any>) => {
                if (response.status == this._const.DIALOG_STATUS_OK) {

                    this.appService.activateLoading();
                    this.reporteService.deleteReporte(item)
                        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (response: any) => {
                                this.appService.disableLoading();
                                ////console.log("Response", response);

                                this.listarRegistros();
                            },

                        });
                }
            });
    }
    //#endregion
}
