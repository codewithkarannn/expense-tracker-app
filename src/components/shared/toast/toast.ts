import {Component, inject, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {ToastService} from '../../../services/toast/toast-service';

@Component({
  selector: 'app-toast',
  imports: [
    NgClass
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast  implements OnInit {

  toastService =  inject(ToastService);
  message = '';
  type: 'info' | 'success' | 'error' | 'warning' = 'info';
  visible = signal(false);


  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.message = toast.message;
      this.type = toast.type;
      this.visible.set(true);

      setTimeout(() => {
        this.visible.set(false);
      }, 3000);
    })
  }

}
