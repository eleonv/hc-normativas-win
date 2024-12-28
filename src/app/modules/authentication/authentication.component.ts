import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Constante } from '../../utility/constante';
import { AppService } from '../../services/core/app.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {

    constructor(
        private appService: AppService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) {
        this.activeRoute.params
            .pipe(take(1))
            .subscribe((routeParams: any) => {
                //console.log("routeParams", routeParams);

                this.appService.setValueSharedData(routeParams.token);
                this.router.navigate([Constante.URL_PERFIL_SELECCIONAR]);
            });
    }
}
