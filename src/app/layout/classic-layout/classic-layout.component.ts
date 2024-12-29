import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Menu } from '../../models/menu';
import { Constante } from '../../utility/constante';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioAS } from '../../models/usuarioas';
import { AppService } from '../../services/core/app.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-classic-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, MatButtonModule, MatIconModule, HttpClientModule,
        //user
        MatMenuModule, MatDividerModule,
        MatCardModule, MatFormFieldModule,
        MatFormFieldModule, MatInputModule, MatSelectModule,
        FooterComponent,
        MatTooltipModule
    ],
    templateUrl: './classic-layout.component.html',
    styleUrl: './classic-layout.component.scss'
})
export class ClassicLayoutComponent {
    _const = Constante;
    showNavigation: boolean = true;

    @Input() menu: Menu[] = [];
    @Input() user: UsuarioAS | null = null;
    @Input() nombrePerfil: string | null = null;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private appService: AppService,
    ) {}

    onToggleNavigation(name: string) {
        this.showNavigation = this.showNavigation ? false : true;
    }

    onSignOut() {
        this.appService.goSignOut();
    }

    onIrAndesSuite() {
        this.appService.goAndesSuite();
    }

    onCambiarPerfil() {
        this.router.navigate([Constante.URL_PERFIL_CAMBIAR]);
    }

    onActiveMenu(item: Menu) {
        this.desactiveAllMenu(this.menu);

        item.active = item.active ? false : true;
        ////console.log('active menu', item.name);
    }

    onExpandedMenu(item: Menu) {
        item.expanded = item.expanded ? false : true;
        ////console.log('expanded menu', item.name);
    }

    onBusquedaAvanzada() {
        this.router.navigate([Constante.URL_BUSQUEDA_AVANZADA]);
    }

    desactiveAllMenu(items: Menu[]) {

        items.forEach((x) => {
            x.active = false;

            if (x.submenu) {
                this.desactiveAllMenu(x.submenu);
            }
        });
    }

}
