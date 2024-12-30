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
    _const = Constante;

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
                console.log("routeParams abc", routeParams);

                if (routeParams.token && routeParams.token !== undefined) {
                    AuthUtility.setTokenIdentity(routeParams.token);
                    AuthUtility.initSessionData(routeParams.token);
                    this.registrarPerfil(routeParams.token);
                }
                else if (routeParams.idNormativa && routeParams.idNormativa !== undefined) {
                    let normativa = {
                        idNormativa: routeParams.idNormativa
                    };

                    console.log("si ha iniciado sesion enviarle para ver la normativa, caso contrario, enviarle a login");
                    AuthUtility.setDataNormativa(normativa);
                    this.verDocumento(normativa);
                    //router.navigate(['/login']);
                }
                /*AuthUtility.setTokenIdentity(routeParams.token);
                AuthUtility.initSessionData(routeParams.token);
                this.registrarPerfil(routeParams.token)*/
                //
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

    verDocumento(normativa: any) {

        let _rutaOrigen = Constante.URL_USER_NORMATIVAS;
        /*switch (this.tipoNormativa) {
            case this._const.TIPO_NOR_NORMATIVA: _rutaOrigen = Constante.URL_USER_NORMATIVAS; break;
            case this._const.TIPO_NOR_GUIA: _rutaOrigen = Constante.URL_USER_GUIAS; break;
            case this._const.TIPO_NOR_PROYECTO: _rutaOrigen = Constante.URL_USER_PROYECTOS; break;
            default: _rutaOrigen = Constante.URL_USER_NORMATIVAS; break;
        }*/

        let _data = {
            rutaOrigen: _rutaOrigen,
            normativa: normativa
        }

        this.appService.setValueSharedData(_data);
        this.router.navigate([this._const.URL_PDF_VIEW]);
    }
}
