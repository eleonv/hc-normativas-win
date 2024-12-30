import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthUtility } from '../../utility/auth-utility';
import { Constante } from '../../utility/constante';
import { SecurityService } from '../../services/core/security.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        MatListModule,
        MatTabsModule,
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatTooltipModule,
        //RecaptchaModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    /*constructor(private router: Router) { }

    */

    loginForm: FormGroup;
    hide = true;
    srcCaptcha = '';
    btnDisabled: Boolean = false;
    shift: number = 3;
    captchaCode: string = '';
    error: boolean = false;
    errorTexto: string = '';
    //recaptcha
    recaptchaResponse: string = '';
    recaptchaValid: boolean = false;

    lCaptcha: boolean = false;




    lapps: boolean = true
    constructor(private fb: FormBuilder, private auth: SecurityService, private destroyRef: DestroyRef, private router: Router) {
        //this.getCaptcha()

        this.loginForm = this.fb.group({
            cUserName: ['', Validators.required],
            cPassword: ['', Validators.required]
        });
    }

    /*login() {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiIxMjIiLCJOb21icmUiOiJBTUJJQ0hPIEhVQU1BTiBDQVJIVUFZQSBZRVNTSUNBIFRBTklBIiwiRm90byI6IiIsImV4cCI6MTczNTQ2NDI3NX0.3jW540AUzY2VwPKY11cpARueu5_ttQFZvLJ9u5ECRYg';

        this.router.navigate(['/auth-identity', token]);
    }*/

    changeStyle() {
        if (window.innerWidth > 768) {
            this.lapps = !this.lapps;
        }
        const element = document.getElementById('apps');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    resolved(captchaResponse: any) {
        if (captchaResponse != null) {
            this.btnDisabled = false
            this.lCaptcha = true
        } else {
            this.btnDisabled = true
            this.lCaptcha = false
        }

    }
    errored() {
        this.btnDisabled = true
        this.lCaptcha = false
    }

    getCaptcha() {
        this.auth.getCaptcha()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    if (response.success == Constante.STATUS_OK) {
                        this.captchaCode = response.data.cCode;
                        this.srcCaptcha = `data:image/png;base64,${response.data.aCaptcha}`
                        this.btnDisabled = false
                    } else {
                        console.error('Error de captcha', response);
                    }
                },
                error: (err: any) => {
                    //this.getCaptcha()
                    console.error('Error de captcha:', err);
                }
            });
    }

    encriptador(bufferData: string[]): string {
        for (let i = 0; i < bufferData.length; i++) {
            let letter = bufferData[i];
            letter = String.fromCharCode(letter.charCodeAt(0) + this.shift);
            bufferData[i] = letter;
        }
        return bufferData.join('');
    }

    encriptardata(data: any) {
        let cUserName = data.cUserName;
        let userNameBuffer = cUserName.split('');
        cUserName = this.encriptador(userNameBuffer)

        let cPassword = data.cPassword;
        let passBuffer = cPassword.split('');
        cPassword = this.encriptador(passBuffer)

        let user: any = {
            cUserName: cUserName,
            cPassword: cPassword
        }

        this.postLogin(user);

        //this.router.navigate(['/']);
        /*if (this.lCaptcha)
            this.postLogin(user)
        else {
            this.error = true
            this.errorTexto = "Recuerde resolver el captcha"
        }*/
    }


    //postLogin(user: User) {
    postLogin(user: any) {
        this.btnDisabled = true
        this.auth.login(user)
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    if (response.success == Constante.STATUS_OK) {
                        if (Object.keys(response.data).length != 0) {

                            let tokenIdentity = response.data.cToken;
                            AuthUtility.setTokenIdentity(tokenIdentity);
                            AuthUtility.initSessionData(tokenIdentity);

                            //setear token

                            //AuthUtility.logSessionData(response.data.cToken);
                            //AuthUtility.logUserName(response.data.objUsuario.cNombreCompleto);
                            //AuthUtility.logUserId(response.data.objUsuario.idUsuario)
                            //this.router.navigate([Constante.URL_DASHBOARD]);

                            let token = AuthUtility.getToken();
                            this.router.navigate(['/auth-identity', token]);

                            //this.getModulos();
                        } else {
                            this.btnDisabled = false
                            this.error = true
                            this.errorTexto = response.message
                        }

                    } else {
                        console.error('Error', response);
                        this.btnDisabled = false
                        this.error = true
                        this.errorTexto = response.errors[0].message
                    }
                },
                error: (err: any) => {
                    console.error('Error', err);
                    this.btnDisabled = false
                    this.error = true
                    this.errorTexto = "Algo salio mal, vuelva a intentarlo"
                }
            });
    }

    convertToUpperCase(event: any) {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const value = event.target.value.toUpperCase();
        this.loginForm.get('cCode')?.setValue(value, { emitEvent: false });
        event.target.setSelectionRange(start, end);
    }
    redirectTo(url: string) {
        // window.location.href = url;
        window.open(url, '_blank');
    }
    reloadCaptcha() {
        this.getCaptcha()
    }
    onSubmit() {
        if (this.loginForm.valid) {
            this.encriptardata(this.loginForm.value);
        } else {
            this.error = true
            this.errorTexto = "Es necesario que se llenen todos los campos del formulario."
        }
    }

    /*getModulos() {
        this.auth.getModulos()
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    if (response.success == Constante.STATUS_OK) {
                        console.log('Modulos:', response.data);
                        //this.listaModulos = response.data
                        //this.modulosFiltrados = [...this.listaModulos!!]

                        let token = AuthUtility.getToken();
                        this.router.navigate(['/auth-identity', token]);

                        //this.router.navigate([Constante.URL_DASHBOARD]);

                    } else {
                        console.error('Error de inicio de sesión:', response);
                    }
                },
                error: (err: any) => {
                    console.error('Error de inicio de sesión:', err);
                }
            });
    }*/

}
