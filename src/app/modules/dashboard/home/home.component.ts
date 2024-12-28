import { Component } from '@angular/core';
import { UsuarioAS } from '../../../models/usuarioas';
import { AppService } from '../../../services/core/app.service';
import { AuthUtility } from '../../../utility/auth-utility';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    user: UsuarioAS | null = null;

    constructor(
        private appService: AppService,
    ) {

        this.user = AuthUtility.getValueUserAS();
    }
}
