import { Component, DestroyRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../../services/core/app.service';
import { Constante } from '../../../../utility/constante';
import { MatMenuModule } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { NormativaService } from '../../../../services/normativa.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResponseComponent } from '../../../../models/core/response-component';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Pagination } from '../../../../models/core/pagination';
import { UserNormativaService } from '../../../../services/user-normativa.service';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TipoNormativaService } from '../../../../services/tipo-normativa.service';

@Component({
    selector: 'app-adm-normativa-list',
    standalone: true,
    imports: [
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatPaginatorModule,
        MatTableModule,
        MatButtonModule,
        RouterModule,
        MatMenuModule,
        MatDialogModule,
        MatSortModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatSelectModule
    ],
    templateUrl: './adm-normativa-list.component.html',
    styleUrl: './adm-normativa-list.component.scss'
})
export class AdmNormativaListComponent {
    _const = Constante;

    displayedColumns: string[] = ['idNormativa', 'cArea', 'cTipo', 'cNombre', 'cVersion', 'cFechaVigencia', 'nPosicion', 'acciones'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    form = this.fb.group({
        cNombre: new FormControl(''),
        idTipo: new FormControl('')
    });

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    filterSearch: any = {};
    filterSearchDefault: any = {};
    tiposNormRaw: any[] = [];
    tipoNormativa: any;
    constructor(
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
        private appService: AppService,
        private normativaService: NormativaService,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private tipoNormativaService: TipoNormativaService,
    ) {
        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.filterSearchDefault = {
            cNombre: "",
            idTipo: 0
        };

        this.listarTiposNormativa();
        
        this.filterSearch = structuredClone(this.filterSearchDefault);

        this.listarRegistros();
    }

    ngAfterViewInit() { }

    //#region Methods
    listarRegistros(): void {
        console.log('llego a listar')
        this.appService.activateLoading();
        this.normativaService.listNormativas(this.pagination, this.filterSearch)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    console.log("Response", response);

                    if (response.success == Constante.STATUS_OK) {

                        if (Object.keys(response.data).length > 0) {
                            this.listData = new MatTableDataSource<any>(response.data.lstNormativas)
                            this.listData.sort = this.sort;

                            this.pagination.nTotal = response.data.objPaginacion.nTotal;
                            this.pagination.pageIndex = response.data.objPaginacion.pageIndex;
                        } else {
                            this.listData = [];
                            this.pagination.nTotal = 0;
                            this.pagination.pageIndex = 0;
                        }
                    } else {
                        this.listData = [];
                        this.pagination.nTotal = 0;
                        this.pagination.pageIndex = 0;

                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }

    listarTiposNormativa() {
        let pagination = {
            nTotal: -1,
            pageIndex: -1,
            pageSize: -1,
        }

        let _nTipoPadre = this.tipoNormativa;

        this.appService.activateLoading();
        this.tipoNormativaService.listTipoNormativa(pagination, _nTipoPadre)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == Constante.STATUS_OK) {
                        this.tiposNormRaw = response.data.lstTNormativas;

                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }


    filtrarbusqueda(event: KeyboardEvent) { }
    //#endregion

    //#region Event
    onEditarRegistro(item: any) {
        this.appService.setValueSharedData(item);
        this.router.navigate([this._const.URL_ADM_NORMATIVA_ACT]);
    }

    onEliminarRegistro(item: any) {

        this.dialog.open(ConfirmationDialogComponent, { data: { message: "¿Estás seguro de continuar?" } })
            .afterClosed().subscribe((response: ResponseComponent<any>) => {
                if (response.status == this._const.DIALOG_STATUS_OK) {


                    this.appService.activateLoading();
                    this.normativaService.deleteNormativa(item)
                        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (response: any) => {
                                this.appService.disableLoading();
                                console.log("Response", response);

                                this.listarRegistros();
                            },

                        });
                }
            });
    }

    onNuevoRegistro() {
        this.router.navigate([this._const.URL_ADM_NORMATIVA_REG]);
    }

    onListarPorBusqueda() {
        console.log('cusacndo')
        let _cNombre: any = this.form.get('cNombre')?.value;
        let _idTipo: any = this.form.get('idTipo')?.value;

        _cNombre = (_cNombre) ? _cNombre : "";
        _cNombre = _cNombre.trim();
        _idTipo = (_idTipo) ? _idTipo : 0;

        // if (_cNombre.length == 0) {
        //     //this.toastr.warning("Por favor, ingresa al menos un criterio para realizar la búsqueda", this._const.MESSAGE_TITLE_WARNING);
        //     return;
        // }

        this.filterSearch = {
            cNombre: _cNombre,
            idTipo: _idTipo
        };

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.TOTAL_REGISTROS;

        this.listarRegistros();
    }

    onLimpiarBusqueda() {
        this.form.reset();

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.filterSearch = structuredClone(this.filterSearchDefault);
        this.listarRegistros();
    }

    onPaginatorEvent(event: any) {
        //console.log(event);
        this.pagination.pageSize = event.pageSize;
        this.pagination.pageIndex = event.pageIndex;
        this.listarRegistros();
    }
    //#endregion
}
