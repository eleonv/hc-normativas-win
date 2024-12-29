import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthPerfilComponent } from './modules/authentication/auth-perfil/auth-perfil.component';
import { AuthenticationComponent } from './modules/authentication/authentication.component';
import { ViewpdfComponent } from './shared/components/viewpdf/viewpdf.component';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
    //{ path: 'login', loadComponent: () => import('../app/modules/login/login.component').then(m => m.LoginComponent) },
    { path: 'login', component: LoginComponent},
    { path: 'auth-identity/:token', component: AuthenticationComponent},
    { path: 'perfil/seleccionar-perfil', component: AuthPerfilComponent, data: { isChangePerfil: false }},
    { path: 'perfil/cambiar-perfil', component: AuthPerfilComponent, data: { isChangePerfil: true }, canActivate: [authGuard]},
    {
        path: '',
        loadChildren: () => import('../app/modules/dashboard/dashboard.module')
            .then(m => m.DashboardModule),
        canActivate: [authGuard]
    },
    { path: 'verPdf/ver', component: ViewpdfComponent, canActivate: [authGuard]},

    //{ path: '**', component: NotFoundComponent }
];
