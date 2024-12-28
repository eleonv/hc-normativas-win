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
import { AppService } from '../../../../services/core/app.service';
import { TipoNormativaService } from '../../../../services/tipo-normativa.service';
import { Constante } from '../../../../utility/constante';
import { ResponseComponent } from '../../../../models/core/response-component';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Pagination } from '../../../../models/core/pagination';

@Component({
    selector: 'app-adm-tiponormativa-list',
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
    templateUrl: './adm-tiponormativa-list.component.html',
    styleUrl: './adm-tiponormativa-list.component.scss'
})
export class AdmTiponormativaListComponent {
    _const = Constante;

    displayedColumns: string[] = ['id', 'cNombre', 'cDescripcionTipo', 'acciones'];
    listData: any = [];
    pagination: Pagination = new Pagination();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private destroyRef: DestroyRef,
        private appService: AppService,
        private tipoNormativaService: TipoNormativaService,
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

    listarRegistros(): void {
        this.appService.activateLoading();
        this.tipoNormativaService.listTipoNormativa(this.pagination)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();
                    console.log("Response", response);

                    if (response.success == Constante.STATUS_OK) {
                        this.listData = response.data.lstTNormativas;

                        this.pagination.nTotal = response.data.objPaginacion.nTotal;
                        this.pagination.pageIndex = response.data.objPaginacion.pageIndex;
                    } else {
                        this.toastr.warning(response.message, this._const.MESSAGE_TITLE_WARNING);
                    }
                },
            });

    }

    onEditarRegistro(item: any) {
        this.appService.setValueSharedData(item);
        this.router.navigate([this._const.URL_ADM_TIPO_NORMATIVA_ACT]);
    }

    onEliminarRegistro(item: any) {

        item.idTipo = item.id;

        this.dialog.open(ConfirmationDialogComponent, { data: { message: "¿Estás seguro de continuar?" } })
            .afterClosed().subscribe((response: ResponseComponent<any>) => {
                if (response.status == this._const.DIALOG_STATUS_OK) {

                    this.appService.activateLoading();
                    this.tipoNormativaService.deleteTipoNormativa(item)
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
        this.router.navigate([this._const.URL_ADM_TIPO_NORMATIVA_REG]);
    }

    filtrarbusqueda(event: KeyboardEvent) {
        //console.log("citaciones: ", this.citacioneslist);
    }

    onPaginatorEvent(event: any) {
        console.log(event);
        this.pagination.pageSize = event.pageSize;
        this.pagination.pageIndex = event.pageIndex;
        this.listarRegistros();
    }
}
