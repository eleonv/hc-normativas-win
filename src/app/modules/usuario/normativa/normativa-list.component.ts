import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Pagination } from '../../../models/core/pagination';
import { ResponseComponent } from '../../../models/core/response-component';
import { AppService } from '../../../services/core/app.service';
import { PerfilService } from '../../../services/perfil.service';
import { TipoNormativaService } from '../../../services/tipo-normativa.service';
import { UserNormativaService } from '../../../services/user-normativa.service';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SugerenciaDialogComponent } from '../../../shared/dialogs/sugerencia-dialog/sugerencia-dialog.component';
import { Constante } from '../../../utility/constante';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ServService } from '../../../services/serv.service';
import { AuthUtility } from '../../../utility/auth-utility';

@Component({
    selector: 'app-normativa-list',
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
    templateUrl: './normativa-list.component.html',
    styleUrl: './normativa-list.component.scss'
})
export class NormativaListComponent {
    _const = Constante;
    tipoNormativa: number = -1;
    perfil: any = {};

    displayedColumns: string[] = ['favorito', 'nPosicion', 'cNombre', 'cVersion', 'cFechaVigencia', 'acciones'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    areasRaw: any[] = [];
    tiposNormRaw: any[] = [];

    form = this.fb.group({
        idTipo: new FormControl(''),
        idGerencia: new FormControl(''),
        nUltimoFecha: new FormControl(''),
        cClave: new FormControl('')
    });

    filterSearch: any = {};
    filterSearchDefault: any = {};

    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
        private appService: AppService,
        private userNormativaService: UserNormativaService,
        private perfilService: PerfilService,
        private tipoNormativaService: TipoNormativaService,
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
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.filterSearchDefault = {
            nTipoNormativa: this.tipoNormativa,
            idTipo: 0,
            idGerencia: 0,
            nUltimoFecha: 0,
            cClave: ""
        };

        this.filterSearch = structuredClone(this.filterSearchDefault);

        this.listarTiposNormativa();
        this.listarAreas();
        this.listarRegistros();
    }

    ngAfterViewInit() { }

    //#region Methods
    listarRegistros(): void {
        this.appService.activateLoading();
        this.userNormativaService.listNormativasUser(this.pagination, this.filterSearch)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

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

    filtrarbusqueda(event: KeyboardEvent) { }

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

    //#region Event
    onDescargar(element: any) {
        let _normativaData = {
            idArchivo: element.idArchivo,
            idNormativa: element.idNormativa
        };

        let _modoArchivo = 2;

        this.servService.onDescargar(_normativaData, _modoArchivo);
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

    onRegistrarSugerencia(normativa: any) {
        this.dialog.open(SugerenciaDialogComponent, { width: '850px', data: { normativa: normativa } })
            .afterClosed().subscribe((response: ResponseComponent<any>) => {
                //if (response.status == this._const.DIALOG_STATUS_OK) {}
            });
    }

    onVerDocumento(normativa: any) {

        let _rutaOrigen = "";
        switch (this.tipoNormativa) {
            case this._const.TIPO_NOR_NORMATIVA: _rutaOrigen = Constante.URL_USER_NORMATIVAS; break;
            case this._const.TIPO_NOR_GUIA: _rutaOrigen = Constante.URL_USER_GUIAS; break;
            case this._const.TIPO_NOR_PROYECTO: _rutaOrigen = Constante.URL_USER_PROYECTOS; break;
            default: _rutaOrigen = Constante.URL_USER_NORMATIVAS; break;
        }

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
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.filterSearch = structuredClone(this.filterSearchDefault);
        this.listarRegistros();
    }

    onListarPorBusqueda() {
        let _idTipo: any = this.form.get('idTipo')?.value;
        let _idGerencia: any = this.form.get('idGerencia')?.value;
        let _nUltimoFecha: any = this.form.get('nUltimoFecha')?.value;
        let _cClave: any = this.form.get('cClave')?.value;

        _idTipo = (_idTipo) ? _idTipo : 0;
        _idGerencia = (_idGerencia) ? _idGerencia : 0;
        _nUltimoFecha = (_nUltimoFecha) ? _nUltimoFecha : 0;
        _cClave = (_cClave) ? _cClave : "";

        _cClave = _cClave.trim();

        this.filterSearch = {
            nTipoNormativa: this.tipoNormativa,
            idTipo: _idTipo,
            idGerencia: _idGerencia,
            nUltimoFecha: _nUltimoFecha,
            cClave: _cClave
        };

        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.listarRegistros();
    }

    preventDefault(event: Event) {
        event.preventDefault();
    }
    //#endregion
}
