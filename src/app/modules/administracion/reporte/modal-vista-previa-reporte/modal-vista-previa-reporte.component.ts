import { Component, DestroyRef, InjectionToken, ViewChild, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Pagination } from '../../../../models/core/pagination';
import { ResponseComponent } from '../../../../models/core/response-component';
import { AppService } from '../../../../services/core/app.service';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Constante } from '../../../../utility/constante';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../../../services/reporte.service';


@Component({
  selector: 'app-modal-vista-previa-reporte',
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
    FormsModule
  ],
  templateUrl: './modal-vista-previa-reporte.component.html',
  styleUrl: './modal-vista-previa-reporte.component.scss'
})
export class ModalVistaPreviaReporteComponent {
  _const = Constante;

  displayedColumns: string[] = ['nNumero', 'cNombre', 'cNormativa', 'cModo', 'cFechaRegistro', 'cPerfil', 'cAgencia', 'cArea'];
  listData: any = [];
  pagination: Pagination = new Pagination();

  @ViewChild(MatTable) table!: MatTable<[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pubCitacion: boolean = false;

  idPunto: number = 0
  idCitacion: number = 0
  info: any;
  nombre: any;
  puntoAgenda: any;

  dialogResult: ResponseComponent<any> = {
    status: this._const.DIALOG_STATUS_CANCEL,
    data: null
  };

  constructor(
    public dialogRef: MatDialogRef<ModalVistaPreviaReporteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private destroyRef: DestroyRef,
    private reporteService: ReporteService,


  ) {
    this.pagination.nTotal = 0;
    this.pagination.pageIndex = -1;
    this.pagination.pageSize = -1;

    this.data = data.data;

    console.log('this.puntoAgenda')
    console.log(this.data)
    this.info = {
      cPerfil: this.data.cCargo,
      cAgencia: this.data.cOficina,
      cArea: this.data.cGerencia,
      cFechaInicio: this.data.cFechaInicio,
      cFechaFin: this.data.cFechaFin,
    };

    console.log(this.info)

    this.listarRegistros(this.info);
    //this.obtenerDatosCompartido();
  }

  ngAfterViewInit() { }

  //#region Methods

  obtenerDatosCompartido() {
    this.appService.getValueSharedData()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((citacion: any) => {

        // if (citacion == null) {
        //     this.onSalirForm();
        //     return
        // }
        this.idCitacion = citacion.idCitacion
        this.idPunto = citacion.idPunto
        this.nombre = citacion.nombre

        console.log(this.idCitacion + 'dsdfsdf' + this.idPunto)
        this.info = {
          idCitacion: this.idCitacion,
          idPunto: this.idPunto
        }
        this.listarRegistros(this.info);
      });
  }

  listarRegistros(_info: any): void {
    this.appService.activateLoading();
    this.reporteService.logAccesoNormtivas(this.pagination, _info)
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

  filtrarbusqueda(event: KeyboardEvent) { }
  //#endregion

  //#region Event
  /*onEditarRegistro(item: any) {
      this.appService.setValueSharedData(item);
      this.router.navigate([this._const.URL_ADM_CITACION_ACT]);
  }*/


  onOk() {
    this.dialogResult.status = this._const.DIALOG_STATUS_OK;
    this.dialogRef.close(this.dialogResult);
  }


  ngOnDestroy() {
    this.dialogRef.close(this.dialogResult);
  }

  //#endregion
}

