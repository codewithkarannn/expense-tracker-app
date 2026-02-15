import {Component, inject} from '@angular/core';
import {DialogService} from '../../services/dialog/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {

  dialogService  =  inject(DialogService);


   onCancel() {
    this.dialogService.cancel();
  }

   onConfirm() {
    this.dialogService.confirm();
  }
}
