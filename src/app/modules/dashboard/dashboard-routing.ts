import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from '../../core/guards/auth.guard';

import { Constante } from '../../utility/constante';
import { AdmNormativaListComponent } from '../administracion/normativa/adm-normativa-list/adm-normativa-list.component';
import { AdmNormativaRegComponent } from '../administracion/normativa/adm-normativa-reg/adm-normativa-reg.component';
import { AdmTiponormativaRegComponent } from '../administracion/tipo-normativa/adm-tiponormativa-reg/adm-tiponormativa-reg.component';
import { AdmTiponormativaListComponent } from '../administracion/tipo-normativa/adm-tiponormativa-list/adm-tiponormativa-list.component';
import { AdmPerfilListComponent } from '../administracion/perfil/adm-perfil-list/adm-perfil-list.component';
import { AdmPerfilRegComponent } from '../administracion/perfil/adm-perfil-reg/adm-perfil-reg.component';
import { FavoritoListComponent } from '../usuario/favorito/favorito-list.component';
import { ProcesoComponent } from '../usuario/proceso/proceso.component';
import { NormativaListComponent } from '../usuario/normativa/normativa-list.component';
import { ViewpdfComponent } from '../../shared/components/viewpdf/viewpdf.component';
import { ReporteListComponent } from '../usuario/reporte/reporte-list.component';
import { BusquedaComponent } from '../usuario/busqueda/busqueda.component';
import { AdmReporteListComponent } from '../administracion/reporte/adm-reporte-list/adm-reporte-list.component';
import { AdmUsuarioListComponent } from '../administracion/usuario/adm-usuario-list/adm-usuario-list.component';
import { AdmReporteRegComponent } from '../administracion/reporte/adm-reporte-reg/adm-reporte-reg.component';

export const routesDashboard: Routes = [
  {
      path: '', component: DashboardComponent,
      children: [
          //#region Usuario
          { path: 'inicio', component: HomeComponent, canActivate: [authGuard] },
          { path: 'favoritos', component: FavoritoListComponent, canActivate: [authGuard]},
          { path: 'procesos', component: ProcesoComponent, canActivate: [authGuard]},
          { path: 'normativas', component: NormativaListComponent, data: { tipoNormativa: Constante.TIPO_NOR_NORMATIVA }, canActivate: [authGuard]},
          { path: 'guias', component: NormativaListComponent, data: { tipoNormativa: Constante.TIPO_NOR_GUIA }, canActivate: [authGuard]},
          { path: 'proyectos', component: NormativaListComponent, data: { tipoNormativa: Constante.TIPO_NOR_PROYECTO }, canActivate: [authGuard]},
          { path: 'pdfvisor', component: ViewpdfComponent, canActivate: [authGuard]},
          { path: 'reportes', component: ReporteListComponent, canActivate: [authGuard]},
          { path: 'busqueda-avanzada', component: BusquedaComponent, canActivate: [authGuard]},
          //#endregion

          //#region Administracion
          { path: 'adm/tipo-normativas/editar', component: AdmTiponormativaRegComponent, data: { accionForm: Constante.ACCION_FORM_EDIT }, canActivate: [authGuard]},
          { path: 'adm/tipo-normativas/registrar', component: AdmTiponormativaRegComponent, data: { accionForm: Constante.ACCION_FORM_NEW }, canActivate: [authGuard]},
          { path: 'adm/tipo-normativas/listar', component: AdmTiponormativaListComponent, canActivate: [authGuard]},

          { path: 'adm/normativas/editar', component: AdmNormativaRegComponent, data: { accionForm: Constante.ACCION_FORM_EDIT }, canActivate: [authGuard]},
          { path: 'adm/normativas/registrar', component: AdmNormativaRegComponent, data: { accionForm: Constante.ACCION_FORM_NEW }, canActivate: [authGuard]},
          { path: 'adm/normativas/listar', component: AdmNormativaListComponent, canActivate: [authGuard]},

          { path: 'adm/perfiles/editar', component: AdmPerfilRegComponent, data: { accionForm: Constante.ACCION_FORM_EDIT }, canActivate: [authGuard]},
          { path: 'adm/perfiles/registrar', component: AdmPerfilRegComponent, data: { accionForm: Constante.ACCION_FORM_NEW }, canActivate: [authGuard]},
          { path: 'adm/perfiles/listar', component: AdmPerfilListComponent, canActivate: [authGuard]},

          { path: 'adm/reporte/editar', component: AdmReporteRegComponent, data: { accionForm: Constante.ACCION_FORM_EDIT }, canActivate: [authGuard]},
          { path: 'adm/reporte/registrar', component: AdmReporteRegComponent, data: { accionForm: Constante.ACCION_FORM_NEW }, canActivate: [authGuard]},
          { path: 'adm/reporte/listar', component: AdmReporteListComponent, canActivate: [authGuard]},
          { path: 'adm/usuario/listar', component: AdmUsuarioListComponent, canActivate: [authGuard]},
          //#endregion

          { path: '', redirectTo: '/inicio', pathMatch: 'full' },
      ]
  },
];
