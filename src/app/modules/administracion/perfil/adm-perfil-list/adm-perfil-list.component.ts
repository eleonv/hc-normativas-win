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
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { ResponseComponent } from '../../../../models/core/response-component';
import { AppService } from '../../../../services/core/app.service';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Constante } from '../../../../utility/constante';
import { PerfilService } from '../../../../services/perfil.service';
import { Pagination } from '../../../../models/core/pagination';

@Component({
    selector: 'app-adm-perfil-list',
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
    templateUrl: './adm-perfil-list.component.html',
    styleUrl: './adm-perfil-list.component.scss'
})
export class AdmPerfilListComponent {
    _const = Constante;

    //displayedColumns: string[] = ['idPerfil', 'cNombre', 'cGerencia', 'cCargos', 'acciones'];
    displayedColumns: string[] = ['idPerfil', 'cNombre', 'acciones'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private destroyRef: DestroyRef,
        private appService: AppService,
        private perfilService: PerfilService,
        private router: Router,
        public dialog: MatDialog,
        private toastr: ToastrService,
    ) {
        this.pagination.nTotal = 0;
        this.pagination.pageIndex = 0;
        this.pagination.pageSize = this._const.PAGINATION_SIZE;

        this.listarRegistros();
    }

    ngAfterViewInit() {}

    //#region Métodos
    listarRegistros(): void {
        this.appService.activateLoading();
        this.perfilService.listPerfiles(this.pagination)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    //console.log("Response", response);

                    if (response.success == Constante.STATUS_OK) {
                        this.listData = response.data.lstPerfiles;

                        this.pagination.nTotal = response.data.objPaginacion.nTotal;
                        //this.pagination.nTotal = 8;
                        this.pagination.pageIndex = response.data.objPaginacion.pageIndex;
                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }

    filtrarbusqueda(event: KeyboardEvent) {
        ////console.log("citaciones: ", this.citacioneslist);
    }
    //#endregion

    //#region Eventos
    onEditarRegistro(item: any) {
        this.appService.setValueSharedData(item);
        this.router.navigate([this._const.URL_ADM_PERFIL_ACT]);
    }

    onEliminarRegistro(item: any) {
        this.dialog.open(ConfirmationDialogComponent, { data: { message: "¿Estás seguro de continuar?" } })
            .afterClosed().subscribe((response: ResponseComponent<any>) => {
                if (response.status == this._const.DIALOG_STATUS_OK) {

                    this.appService.activateLoading();
                    this.perfilService.deletePerfil(item)
                        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (response: any) => {
                                this.appService.disableLoading();
                                //console.log("Response", response);

                                this.listarRegistros();
                            },

                        });
                }
            });
    }

    onNuevoRegistro() {
        this.router.navigate([this._const.URL_ADM_PERFIL_REG]);
    }

    onPaginatorEvent(event: any) {
        //console.log(event);
        this.pagination.pageSize = event.pageSize;
        this.pagination.pageIndex = event.pageIndex;
        this.listarRegistros();
    }
    //#endregion
}
