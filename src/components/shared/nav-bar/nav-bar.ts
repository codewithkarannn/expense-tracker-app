import {Component, inject, signal} from '@angular/core';
import {ThemeController} from '../theme-controller/theme-controller';
import {AddNewTransaction} from '../../add-new-transaction/add-new-transaction';
import {AuthService} from '../../../services/auth/auth-service';
import {ROUTES_CONSTANTS} from '../../../env/env';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [
    ThemeController,
    AddNewTransaction,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

  showAddForm  =  signal<boolean>(false);
  authService = inject(AuthService) ;
  router = inject(Router);
  logout()  {

    this.authService.logout();
    this.router.navigate([this.ROUTES_CONSTANTS.AUTH]);
  }

  protected navigateToBudgetList() {
    this.router.navigate([this.ROUTES_CONSTANTS.BUDGET_LIST]);

  }

  protected navigateToDash() {
    this.router.navigate([this.ROUTES_CONSTANTS.DASHBOARD]);

  }

  protected navigateAllTransactions() {
    this.router.navigate([this.ROUTES_CONSTANTS.ALL_TRANSACTIONS]);

  }

  protected readonly ROUTES_CONSTANTS = ROUTES_CONSTANTS;
}
