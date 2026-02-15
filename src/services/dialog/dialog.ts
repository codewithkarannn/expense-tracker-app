import {Injectable, signal} from '@angular/core';

export interface DialogConfig {
title: string;
message: string;
confirmText: string;
cancelText: string;
confirmButtonClass?: string;
cancelButtonClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  isOpen =  signal<boolean>(false);
  dialogConfig = signal<DialogConfig>({} as DialogConfig);


  // Private property to store the resolve function
  private resolveFunction?: (value: boolean) => void;


  open(config: DialogConfig): Promise<boolean> {
    // Update the dialog configuration signal
    this.dialogConfig.set({
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      confirmButtonClass: config.confirmButtonClass || 'btn-primary',
      cancelButtonClass: config.cancelButtonClass || 'btn-ghost'
    });

    // Open the dialog
    this.isOpen.set(true);

    // Create and return a Promise
    return new Promise<boolean>((resolve) => {
    // Store the resolve function so we can call it later
      this.resolveFunction = resolve;
    });
  }


  confirm() : void {
    this.isOpen.set(false);
    if(this.resolveFunction) {
      this.resolveFunction(true);
      this.resolveFunction = undefined; //Clean up
    }
  }

  cancel() : void {
    this.isOpen.set(false);
    ///resolving the promise with false
    if(this.resolveFunction) {
      this.resolveFunction(false);
      this.resolveFunction = undefined; //Clean up
    }

  }
}
