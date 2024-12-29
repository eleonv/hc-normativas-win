import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Pagination } from '../../../models/core/pagination';
import { AppService } from '../../../services/core/app.service';
import { Constante } from '../../../utility/constante';
import { ReporteService } from '../../../services/reporte.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateUtility } from '../../../utility/date-utility';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
@Component({
    selector: 'app-reporte-list',
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
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        MatCardModule
    ],
    templateUrl: './reporte-list.component.html',
    styleUrl: './reporte-list.component.scss'
})
export class ReporteListComponent {
    _const = Constante;
    tipoNormativa: number = -1;

    dataListReportes: any[] = []
    lData: boolean = false
    reporteSelected: any = {
        categorias: '',
        oficinas: '',
        gerencias: '',
        cargos: '',
        fechaIni: '',
        fechaFin: ''
    }

    displayedColumns: string[] = ['nNumero', 'cNombre', 'cNormativa', 'cModo', 'cFechaRegistro', 'cPerfil', 'cAgencia', 'cArea'];
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
    _fechaInicioCtr: any;
    _fechaFinCtr: any;

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
        this.listarRegistrosReportes();
    }

    ngAfterViewInit() { }

    //#region Methods
    listarRegistrosReportes(): void {
        this.pagination.nTotal = 0;
        this.pagination.pageIndex = -1;
        this.pagination.pageSize = -1;
        this.appService.activateLoading();
        this.reporteService.listReporte(this.pagination, {})
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    //console.log("response", response);

                    if (response.success == Constante.STATUS_OK) {
                        if (Object.keys(response.data).length > 0) {
                            this.dataListReportes = response.data;

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

    obtenerInfoReporte(reporte: any) {
        this.lData = false
        this.reporteService.getReporte(reporte)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    //console.log("reporte rcovery", response);

                    if (response.success == Constante.STATUS_OK) {
                        this.lData = true
                        let data = response.data
                        let _categorias = data.objReporte.cCategoria === "%"
                            ? 'TODOS LOS CAMPOS'
                            : data.lstTipo.map((x: any) => x.cTipo).join(', ');

                        let _oficinas = data.objReporte.cOficina === "%"
                            ? 'TODOS LOS CAMPOS'
                            : data.lstOficina.map((x: any) => x.cOficina).join(', ');

                        let _gerencias = data.objReporte.cGerencia === "%"
                            ? 'TODOS LOS CAMPOS'
                            : data.lstGerencia.map((x: any) => x.cGerencia).join(', ');

                        let _cargos = data.objReporte.cCargo === "%"
                            ? 'TODOS LOS CAMPOS'
                            : data.lstCargos.map((x: any) => x.cCargo).join(', ');

                        this._fechaInicioCtr = DateUtility.stringToDate(data.objReporte.cFechaInicio, 'YYYY-MM-DD');
                        this._fechaFinCtr = DateUtility.stringToDate(data.objReporte.cFechaFin, 'YYYY-MM-DD');

                        this.reporteSelected = {
                            categorias: _categorias,
                            oficinas: _oficinas,
                            gerencias: _gerencias,
                            cargos: _cargos,
                            fechaIni: data.objReporte.cFechaInicio,
                            fechaFin: data.objReporte.cFechaFin
                        }
                        this.form.controls.cFechaInicio.setValue(this._fechaInicioCtr);
                        this.form.controls.cFechaFin.setValue(this._fechaFinCtr);

                        //PARA FORMULARIO DE BUSQUEDA

                        this.filterSearch = {
                            cPerfil: data.objReporte.cCargo,
                            cAgencia: data.objReporte.cOficina,
                            cArea: data.objReporte.cGerencia
                        };

                    } else {
                        this.appService.disableLoading();
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });
    }
    listarRegistros(): void {
        this.appService.activateLoading();
        this.reporteService.logAccesoNormtivas(this.pagination, this.filterSearch)
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
                            this.toastr.warning(response.message, this._const.MESSAGE_TITLE_INFO);
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

    onLimpiarBusqueda() {
        this.form.reset();

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.filterSearch.cFechaInicio = this.reporteSelected.fechaIni
        this.filterSearch.cFechaFin = this.reporteSelected.fechaFin

        this.form.get('cFechaInicio')?.setValue(this._fechaInicioCtr);
        this.form.get('cFechaFin')?.setValue(this._fechaFinCtr);
        this.listarRegistros()
    }

    onListarPorBusqueda() {
        const _dFechaInicio: any = this.form.get('cFechaInicio')?.value;
        const _dFechaFin: any = this.form.get('cFechaFin')?.value;

        const _cFechaInicio = DateUtility.dateToString(_dFechaInicio, 'YYYY-MM-DD');
        const _cFechaFin = DateUtility.dateToString(_dFechaFin, 'YYYY-MM-DD');

        this.filterSearch = {
            ... this.filterSearch,
            cFechaInicio: _cFechaInicio,
            cFechaFin: _cFechaFin,
        };
        //console.log('reporte serar', this.reporteSelected)
        //console.log('reporte serar', this.filterSearch)

        this.listarRegistros();
    }
    //#endregion
}
