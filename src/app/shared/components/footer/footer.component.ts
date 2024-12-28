import { Component } from '@angular/core';
import { AppService } from '../../../services/core/app.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    currentYear: string = new Date().getFullYear().toString();
    version: string = '1.1.10';

    constructor(
        private appService: AppService,
    ) {
        this.version = this.appService.getVersion();
    }
}
