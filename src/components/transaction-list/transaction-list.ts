import {Component, effect, inject, signal} from '@angular/core';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {Transaction} from '../../models/transaction';
import {AuthService} from '../../services/auth/auth-service';
import {ToastService} from '../../services/toast/toast-service';
import {ROUTES_CONSTANTS, TRANSACTIONS_TYPES} from '../../env/env';
import {DatePipe} from '@angular/common';
import {CommonServices} from '../../services/common-services/common-services';
import {TransactionStateService} from '../../services/transactions/transaction-state-service';
import {AddNewTransaction} from '../add-new-transaction/add-new-transaction';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [
    DatePipe,
    AddNewTransaction
  ],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList   {

  protected readonly TRANSACTIONS_TYPES = TRANSACTIONS_TYPES;
  transactionService  = inject(TransactionsService);
  transactionStateService  = inject(TransactionStateService);
  toastService  = inject(ToastService);
  autService  = inject(AuthService);
  commonService =  inject(CommonServices);
  transactions  = signal<Transaction[]>([]);
  page =  signal(1) ;
  pageSize = signal(5);
  totalRecords = signal(0);
  showAddForm  =  signal<boolean>(false);
  routerLink = inject(Router);

  constructor() {
    effect(() => {
      this.transactionStateService.refreshTrigger$();
      const page = this.transactionStateService.currentPage();
      this.page.set(page);
      this.getTransactions();
    });
  }



  getTransactions(){
    this.transactionService.getTransactionsByUserId(this.autService.userId() , this.page() , this.pageSize()).subscribe(
      response => {
        if (response.success) {
          if(this.page() == 1){
            this.transactions.set(response.data.transactionList.sort((a, b) => {
                const dateDiff = +new Date(b.transactionDate) - +new Date(a.transactionDate);

                if (dateDiff !== 0) {
                  return dateDiff; // sort by transactionDate first
                }

                // If same transactionDate → sort by createdAt
                return +new Date(b.createdAt ?? '') - +new Date(a.createdAt ?? '');
              })
            );
          }
          else
          {
            this.transactions.update(oldList => {
              const merged = [...oldList, ...response.data.transactionList];

              return merged.sort((a, b) => {
                const dateDiff = +new Date(b.transactionDate) - +new Date(a.transactionDate);
                if (dateDiff !== 0) return dateDiff;

                return +new Date(b.createdAt ?? '') - +new Date(a.createdAt ?? '');
              });
            });
          }


          this.totalRecords.set(response.data.totalRecords);
          this.page.set(response.data.page);
          this.pageSize.set(response.data.pageSize);

        }
        else
        {
          this.toastService.show("Something went wrong " ,  'error');
        }
      }
    )
  }


  protected viewMoreRecords() {
    this.routerLink.navigate([ROUTES_CONSTANTS.ALL_TRANSACTIONS]);

  }


}
