import { Component, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Constante } from '../../utility/constante';
import { AppService } from '../../services/core/app.service';
import { AuthUtility } from '../../utility/auth-utility';
import { SecurityService } from '../../services/core/security.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-authentication',
    standalone: true,
    imports: [],
    templateUrl: './authentication.component.html',
    styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

    mensajeApp: string = '...Cargando la aplicación'
    constructor(
        private appService: AppService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private securityService: SecurityService,
        private destroyRef: DestroyRef
    ) {
        this.activeRoute.params
            .pipe(take(1))
            .subscribe((routeParams: any) => {
                ////console.log("routeParams", routeParams);

                AuthUtility.setTokenIdentity(routeParams.token);
                AuthUtility.initSessionData(routeParams.token);
                this.registrarPerfil(routeParams.token);

            });
    }

    registrarPerfil(token: string) {
        this.appService.activateLoading();
        this.securityService.actualizarPerfil()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.appService.disableLoading();

                    if (response.success == Constante.STATUS_OK) {
                        this.appService.setValueSharedData(token);
                        this.router.navigate([Constante.URL_PERFIL_SELECCIONAR]);
                    } else {
                        this.mensajeApp = response.errors[0].message + ' Seras redirigido a Andes Suite, gracias.'
                        setTimeout(() => { this.appService.goAndesSuite(); }, 5000)
                    }
                },
                error: (err: any) => {
                    this.appService.disableLoading();
                    this.mensajeApp = 'Hubo un problema en la petición ' + 'Seras redirigido a Andes Suite, gracias.'
                    setTimeout(() => { this.appService.goAndesSuite(); }, 5000)
                }
            });
    }
}
