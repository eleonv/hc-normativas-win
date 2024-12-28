import { ApplicationConfig, ENVIRONMENT_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideToastr } from 'ngx-toastr';
import { appInterceptor } from './core/interceptors/app.interceptor';
import { MY_DATE_FORMATS } from './core/providers/date-adapter';
import { PaginatorAdapter } from './core/providers/paginator-adapter';
import { IconsService } from './icons.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideToastr({
            maxOpened: 1,
            timeOut: 10000,
            extendedTimeOut: 10000,
            progressBar: true,
            closeButton: true,
            disableTimeOut: false,
            tapToDismiss: false,
            preventDuplicates: false
        }),
        provideNativeDateAdapter(),
        provideHttpClient(withInterceptors([appInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(IconsService),
            multi: true,
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        { provide: MatPaginatorIntl, useValue: new PaginatorAdapter().getPaginatorIntl() }
    ]

};
