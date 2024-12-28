import { Component, HostListener } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { AppService } from './services/core/app.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatProgressBarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    loading: boolean = false;
    title = 'hc-normativas-frontend';

    constructor(private appService: AppService,) {
        this.appService.getValueLoading().subscribe(x => {
            Promise.resolve().then(() => this.loading = x)
        });
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault(); // Prevenir atajo de teclado para imprimir
            event.stopPropagation();
        }

        if (event.key === 'F12') {
            event.preventDefault(); // Prevenir atajo de teclado para imprimir
            event.stopPropagation();
        }
    }

    @HostListener('document:contextmenu', ['$event'])
    handleMouseRightClick(event: MouseEvent) {
        event.preventDefault();
    }
}
