import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Pagination } from '../../../models/core/pagination';
import { AppService } from '../../../services/core/app.service';
import { PerfilService } from '../../../services/perfil.service';
import { UserNormativaService } from '../../../services/user-normativa.service';
import { Constante } from '../../../utility/constante';
import { ResponseComponent } from '../../../models/core/response-component';
import { SugerenciaDialogComponent } from '../../../shared/dialogs/sugerencia-dialog/sugerencia-dialog.component';
import { ServService } from '../../../services/serv.service';
import { AuthUtility } from '../../../utility/auth-utility';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-busqueda',
    standalone: true,
    imports: [
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        RouterModule,
        MatMenuModule,
        MatDialogModule,
        MatSelectModule,
        MatExpansionModule,
        ReactiveFormsModule
    ],
    templateUrl: './busqueda.component.html',
    styleUrl: './busqueda.component.scss'
})
export class BusquedaComponent {
    _const = Constante;
    tipoNormativa: number = -1;
    perfil: any = {};

    displayedColumns: string[] = ['nPosicion', 'cNombre', 'cVersion', 'cFechaVigencia', 'acciones'];
    listData: any = [];
    listDataNormativas: any = [];
    listDataGuias: any = [];
    listDataProyectos: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    areasRaw: any[] = [];
    tiposNormRaw: any[] = [];

    form = this.fb.group({
        cNombre: new FormControl(''),
        idTipo: new FormControl(''),
        idGerencia: new FormControl(''),
        nUltimoFecha: new FormControl(''),
        cClave: new FormControl('')
    });

    filterSearch: any = {};
    filterSearchDefault: any = {};
    totalResultados: number = -1;

    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
        private appService: AppService,
        private userNormativaService: UserNormativaService,
        private perfilService: PerfilService,
        //private tipoNormativaService: TipoNormativaService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private servService: ServService,
    ) {
        this.perfil = AuthUtility.getPerfil();
        let _tipoNorm = this.activatedRoute.snapshot.data['tipoNormativa'];
        this.tipoNormativa = _tipoNorm;

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.TOTAL_REGISTROS;

        this.filterSearchDefault = {
            nTipoNormativa: 0,
            idTipo: 0,
            idGerencia: 0,
            nUltimoFecha: 0,
            cClave: "",
            cNombre: ""
        };

        this.filterSearch = structuredClone(this.filterSearchDefault);

        //this.listarTiposNormativa();
        this.listarAreas();
        //this.listarRegistros();
    }

    //#region Methods
    /*listarTiposNormativa() {
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

    }*/

    listarAreas() {
        this.appService.activateLoading();
        this.perfilService.listAreas()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == Constante.STATUS_OK) {
                        this.areasRaw = response.data;
                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });
    }

    listarRegistros(): void {
        this.appService.activateLoading();
        this.userNormativaService.listNormativasUser(this.pagination, this.filterSearch)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == Constante.STATUS_OK) {
                        if (Object.keys(response.data).length > 0) {
                            //this.listData = new MatTableDataSource<any>(response.data.lstNormativas)
                            //this.listData.sort = this.sort;
                            this.listData = response.data.lstNormativas;

                            const _listDataNormativas = this.listData.filter((item: any) => item.nTipoNormativa == this._const.TIPO_NOR_NORMATIVA);
                            const _listDataGuias = this.listData.filter((item: any) => item.nTipoNormativa == this._const.TIPO_NOR_GUIA);
                            const _listDataProyectos = this.listData.filter((item: any) => item.nTipoNormativa == this._const.TIPO_NOR_PROYECTO);

                            this.listDataNormativas = (Object.keys(_listDataNormativas).length > 0) ? _listDataNormativas : [];
                            this.listDataGuias = (Object.keys(_listDataGuias).length > 0) ? _listDataGuias : [];
                            this.listDataProyectos = (Object.keys(_listDataProyectos).length > 0) ? _listDataProyectos : [];

                            this.pagination.nTotal = response.data.objPaginacion.nTotal;
                            this.pagination.pageIndex = response.data.objPaginacion.pageIndex;
                            this.totalResultados = this.pagination.nTotal;
                        } else {
                            this.listData = [];
                            this.listDataNormativas = [];
                            this.listDataGuias = [];
                            this.listDataProyectos = [];

                            this.pagination.nTotal = 0;
                            this.pagination.pageIndex = 0;
                            this.totalResultados = 0;

                            //console.log("totalResultados", this.totalResultados);
                            ////console.log("totalResultados", totalResultados);

                        }

                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }
    //#endregion

    //#region Events
    onDescargar(element: any) {
        let _normativaData = {
            idArchivo: element.idArchivo,
            idNormativa: element.idNormativa
        };

        let _modoArchivo = 2;

        this.servService.onDescargar(_normativaData, _modoArchivo);
    }

    onRegistrarSugerencia(normativa: any) {
        this.dialog.open(SugerenciaDialogComponent, { width: '850px', data: { normativa: normativa } })
            .afterClosed().subscribe((response: ResponseComponent<any>) => {
                //if (response.status == this._const.DIALOG_STATUS_OK) {}
            });
    }

    onVerDocumento(normativa: any) {

        let _rutaOrigen = "/" + this._const.URL_BUSQUEDA_AVANZADA;

        let _data = {
            rutaOrigen: _rutaOrigen,
            normativa: normativa
        }

        this.appService.setValueSharedData(_data);
        this.router.navigate([this._const.URL_PDF_VIEW]);
    }

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
        this.pagination.pageSize = this._const.TOTAL_REGISTROS;
        this.totalResultados = 0;

        this.filterSearch = structuredClone(this.filterSearchDefault);

        this.listData = [];
        this.listDataNormativas = [];
        this.listDataGuias = [];
        this.listDataProyectos = [];
        //this.listarRegistros();
    }

    onListarPorBusqueda() {
        //let _idTipo: any = this.form.get('idTipo')?.value;
        let _idGerencia: any = this.form.get('idGerencia')?.value;
        let _nUltimoFecha: any = this.form.get('nUltimoFecha')?.value;
        let _cClave: any = this.form.get('cClave')?.value;
        let _cNombre: any = this.form.get('cNombre')?.value;

        //_idTipo = (_idTipo) ? _idTipo : 0;
        _idGerencia = (_idGerencia) ? _idGerencia : 0;
        _nUltimoFecha = (_nUltimoFecha) ? _nUltimoFecha : 0;
        _cClave = (_cClave) ? _cClave : "";
        _cNombre = (_cNombre) ? _cNombre : "";

        _cClave = _cClave.trim();
        _cNombre = _cNombre.trim();

        /*//console.log("_idGerencia", _idGerencia != 0);
        //console.log("_nUltimoFecha", _nUltimoFecha != 0);
        //console.log("_cClave", _cClave.length > 0);
        //console.log("_cNormativa", _cNormativa.length > 0);*/

        if (_idGerencia == 0 && _nUltimoFecha == 0 && _cClave.length == 0 && _cNombre.length == 0) {
            this.toastr.warning("Por favor, ingresa al menos un criterio para realizar la búsqueda", this._const.MESSAGE_TITLE_WARNING);
            return;
        }


        this.filterSearch = {
            nTipoNormativa: 0,
            idTipo: 0,
            idGerencia: _idGerencia,
            nUltimoFecha: _nUltimoFecha,
            cClave: _cClave,
            cNombre: _cNombre
        };

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.TOTAL_REGISTROS;

        this.listarRegistros();
    }

    onFavorito(normativa: any) {

        if (!normativa.lFavorito) {
            this.saveFavorito(normativa);
        } else {
            this.dialog.open(ConfirmationDialogComponent, { data: { message: "¿Estás seguro de eliminar de tus favoritos?" } })
                .afterClosed().subscribe((response: ResponseComponent<any>) => {
                    if (response.status == this._const.DIALOG_STATUS_OK) {
                        this.deleteFavorito(normativa);
                    }
                });
        }
    }

    preventDefault(event: Event) {
        event.preventDefault();
    }

    saveFavorito(normativa: any) {
        this.appService.activateLoading();
        this.userNormativaService.saveFavorito(normativa)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == this._const.STATUS_OK) {
                        this.toastr.success(response.message, this._const.MESSAGE_TITLE_SUCCESS);
                        this.listarRegistros();
                    } else {
                        console.error(this._const.MESSAGE_ERROR_SERVER, response.errors);
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                }/*,
                error: (err: any) => {
                    this.appService.disableLoading();
                    console.error(this._const.MESSAGE_ERROR_SERVER, err);
                    this.toastr.error(this._const.MESSAGE_ERROR_SERVER, this._const.MESSAGE_TITLE_ERROR);
                }*/
            });
    }

    deleteFavorito(normativa: any) {
        this.appService.activateLoading();
        this.userNormativaService.deleteFavorito(normativa)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == this._const.STATUS_OK) {
                        this.toastr.success(response.message, this._const.MESSAGE_TITLE_SUCCESS);
                        this.listarRegistros();
                    } else {
                        console.error(this._const.MESSAGE_ERROR_SERVER, response.errors);
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                }
            });
    }
    //#endregion
}
