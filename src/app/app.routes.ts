import {Routes} from '@angular/router';
import {authGuard} from '../guard/auth.guard';
import {ROUTES_CONSTANTS} from '../env/env';
import {guestGuard} from '../guard/guest-guard';
import {MainLayout} from '../layouts/main-layout/main-layout';
import {AuthLayout} from '../layouts/auth-layout/auth-layout';


export const routes: Routes = [

  // =========================
  // AUTH LAYOUT (public pages)
  // =========================
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirectTo: ROUTES_CONSTANTS.AUTH,
        pathMatch: 'full'
      },
      {
        path: ROUTES_CONSTANTS.AUTH,
        canActivate: [guestGuard], // only non-logged users
        loadComponent: () =>
          import('../components/auth/auth')
            .then(m => m.Auth)
      },
      {
        path: ROUTES_CONSTANTS.SERVER_DOWN,
        loadComponent: () =>
          import('../components/server-down/server-down')
            .then(m => m.ServerDown)
      }
    ]
  },


  // =========================
  // MAIN LAYOUT (protected)
  // =========================
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard], // protect ALL children
    children: [
      {
        path: ROUTES_CONSTANTS.DASHBOARD,
        loadComponent: () =>
          import('../components/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: ROUTES_CONSTANTS.BUDGET_LIST,

        loadComponent: () =>
          import('../components/budget-list/budget-list').then(m => m.BudgetList)

      },
      {
        path: ROUTES_CONSTANTS.ALL_TRANSACTIONS,

        loadComponent: () =>
          import('../components/all-transactions/all-transactions').then(m => m.AllTransactions)

      }
    ]
  },


  // =========================
  // GLOBAL 404 (last always)
  // =========================
  {
    path: '**',
    loadComponent: () =>
      import('../components/not-found/not-found')
        .then(m => m.NotFound)
  }
];
