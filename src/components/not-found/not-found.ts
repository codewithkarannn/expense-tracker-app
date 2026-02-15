import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ROUTES_CONSTANTS} from '../../env/env';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

   router = inject(Router);
  protected navigateToDashboard() {
      this.router.navigate([ROUTES_CONSTANTS.DASHBOARD]);
  }
}
