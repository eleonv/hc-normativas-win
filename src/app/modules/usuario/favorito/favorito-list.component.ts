import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AppService } from '../../../services/core/app.service';
import { Constante } from '../../../utility/constante';
import { UserNormativaService } from '../../../services/user-normativa.service';
import { ResponseComponent } from '../../../models/core/response-component';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SugerenciaDialogComponent } from '../../../shared/dialogs/sugerencia-dialog/sugerencia-dialog.component';
import { Pagination } from '../../../models/core/pagination';

@Component({
    selector: 'app-favorito-list',
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
        MatDialogModule
    ],
    templateUrl: './favorito-list.component.html',
    styleUrl: './favorito-list.component.scss'
})
export class FavoritoListComponent {
    _const = Constante;

    displayedColumns: string[] = ['favorito', 'idNormativa', 'cNombreTipo', 'cNombre', 'cVersion', 'cFechaVigencia', 'acciones'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private destroyRef: DestroyRef,
        private appService: AppService,
        private userNormativaService: UserNormativaService,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService,
    ) {
        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.listarRegistros();
    }

    ngAfterViewInit() { }

    //#region Methods
    listarRegistros(): void {
        this.appService.activateLoading();
        this.userNormativaService.listNormativasFavoritos(this.pagination)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == Constante.STATUS_OK) {
                        if (Object.keys(response.data).length > 0) {
                            this.listData = response.data.lstNormativas;
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
    onFavorito(normativa: any) {
        console.log("item favorito", normativa);

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
        let _data = {
            rutaOrigen: this._const.URL_USER_FAVORITOS,
            normativa: normativa
        }

        this.appService.setValueSharedData(_data);
        this.router.navigate([this._const.URL_PDF_VIEW]);
    }

    onPaginatorEvent(event: any) {
        console.log(event);
        this.pagination.pageSize = event.pageSize;
        this.pagination.pageIndex = event.pageIndex;
        this.listarRegistros();
    }
    //#endregion
}
