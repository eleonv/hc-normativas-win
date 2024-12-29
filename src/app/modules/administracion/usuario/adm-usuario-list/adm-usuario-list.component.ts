import { Component, DestroyRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Pagination } from '../../../../models/core/pagination';
import { Constante } from '../../../../utility/constante';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AppService } from '../../../../services/core/app.service';
import { ReporteService } from '../../../../services/reporte.service';
import { DateUtility } from '../../../../utility/date-utility';

@Component({
    selector: 'app-adm-usuario-list',
    standalone: true,
    imports: [
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatButtonModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatDatepickerModule
    ],
    templateUrl: './adm-usuario-list.component.html',
    styleUrl: './adm-usuario-list.component.scss'
})
export class AdmUsuarioListComponent {
    _const = Constante;
    tipoNormativa: number = -1;

    displayedColumns: string[] = ['cDNI', 'cNombreCompleto', 'cPerfil', 'cFechaRegistro', 'cArea', 'cAgencia', 'nCantidadIngresos'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    areasRaw: any[] = [];
    tiposNormRaw: any[] = [];

    form = this.fb.group({
        cFechaInicio: new FormControl(new Date()),
        cFechaFin: new FormControl(new Date()),
    });

    filterSearch: any = {};
    filterSearchDefault: any = {};

    fechaDesde: Date | null = null;
    fechaHasta: Date | null = new Date();
    fechaHoy: Date = new Date();

    constructor(
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
        private appService: AppService,
        private reporteService: ReporteService,
        private toastr: ToastrService,
    ) {
        const dCurrentDate = new Date();
        const ageOneYear = new Date(dCurrentDate.getFullYear() - 1, dCurrentDate.getMonth(), dCurrentDate.getDate());
        this.fechaDesde = ageOneYear;

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        let cCurrentDate = DateUtility.dateToString(dCurrentDate, 'YYYY-MM-DD');
        this.filterSearchDefault = {
            dCurrentDate: dCurrentDate,
            cFechaInicio: cCurrentDate,
            cFechaFin: cCurrentDate
        };

        this.filterSearch = structuredClone(this.filterSearchDefault);
        //this.listarRegistros();
    }

    get minDate() {
        return this.form.get('cFechaInicio')?.value;
    }

    get maxDate() {
        const startDate = this.form.get('cFechaInicio')?.value;
        return startDate && startDate && new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()) < this.fechaHoy ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()) : this.fechaHoy;
    }


    //#region Methods
    listarRegistros(): void {
        this.appService.activateLoading();
        this.reporteService.controlAccesos(this.pagination, this.filterSearch)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

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
                            this.toastr.info(response.message, this._const.MESSAGE_TITLE_WARNING);

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

    onLimpiarBusqueda() {
        this.form.reset();

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.filterSearch = structuredClone(this.filterSearchDefault);

        this.form.get('cFechaInicio')?.setValue(this.filterSearch.dCurrentDate);
        this.form.get('cFechaFin')?.setValue(this.filterSearch.dCurrentDate);

        this.listarRegistros();
    }

    validarDiferencia() {
        const fechaDesde = this.form.get('cFechaInicio')!!.value;
        const fechaHasta = this.form.get('cFechaFin')!!.value;

        const diferenciaDias = (new Date(fechaHasta!!).getTime() - new Date(fechaDesde!!).getTime()) / (1000 * 3600 * 24);

        //console.log(diferenciaDias)
        return diferenciaDias <= 366 ? true : false;
    }
    onChangeDesde() {
        const startDate = this.form.get('cFechaInicio')?.value;
        let newDate = startDate && new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()) < this.fechaHoy ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()) : this.fechaHoy;
        this.form.get('cFechaFin')?.setValue(newDate);
    }
    onListarPorBusqueda() {
        const _dFechaInicio: any = this.form.get('cFechaInicio')?.value;
        const _dFechaFin: any = this.form.get('cFechaFin')?.value;
        // if (!this.validarDiferencia())
        //     return

        //console.log('paso validacion')
        const _cFechaInicio = DateUtility.dateToString(_dFechaInicio, 'YYYY-MM-DD');
        const _cFechaFin = DateUtility.dateToString(_dFechaFin, 'YYYY-MM-DD');

        this.filterSearch = {
            cFechaInicio: _cFechaInicio,
            cFechaFin: _cFechaFin,
        };

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.listarRegistros();
    }
    //#endregion
}
