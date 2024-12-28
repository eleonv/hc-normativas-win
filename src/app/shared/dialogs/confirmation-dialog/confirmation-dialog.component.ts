import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Constante } from '../../../utility/constante';
import { ResponseComponent } from '../../../models/core/response-component';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatDividerModule, MatSlideToggleModule, MatButtonModule, FormsModule, ReactiveFormsModule, JsonPipe],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
    _const = Constante;
    showTitle: boolean = false;
    title: string = "";
    message: string = "";
    detail: string = "";
    showDetail: boolean = false;

    dialogResult: ResponseComponent<any> = {
        status: this._const.DIALOG_STATUS_CANCEL,
        data: null
    };

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.showTitle = data.showTitle ? data.showTitle : false;
        this.title = data.title;
        this.message = data.message;
        this.showDetail = data.detail ? true : false;
        this.detail = data.detail;
    }

    onOk() {
        this.dialogResult.status = this._const.DIALOG_STATUS_OK;
        this.dialogRef.close(this.dialogResult);
    }

    ngOnDestroy() {
        this.dialogRef.close(this.dialogResult);
    }

}
