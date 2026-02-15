import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {AuthService} from '../../services/auth/auth-service';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {TransactionSummary} from '../../models/transaction';
import {FormsModule} from '@angular/forms';
import {TransactionList} from '../transaction-list/transaction-list';
import {BudgetOverview} from '../budget-overview/budget-overview';
import {ExpensePieChart} from '../expense-pie-chart/expense-pie-chart';
import {MonthlyExpenseBarChart} from '../monthly-expense-bar-chart/monthly-expense-bar-chart';
import {formatCurrency} from '@angular/common';
import {CommonServices} from '../../services/common-services/common-services';
import {TransactionStateService} from '../../services/transactions/transaction-state-service';
import {FixedTransactions} from '../fixed-transactions/fixed-transactions';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    TransactionList,
    BudgetOverview,
    ExpensePieChart,
    MonthlyExpenseBarChart,
    FixedTransactions
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard  implements OnInit  {

  authService =  inject(AuthService);
  transactionService =  inject(TransactionsService);
  transactionStateService =  inject(TransactionStateService);
  commonService =  inject(CommonServices);
  numberOfMonths =  signal<number| null>(1)  ;
  transactionSummary =  signal<TransactionSummary | null>(null);

  constructor() {
    effect(() => {
    this.transactionStateService.refreshTrigger$();
    const userId =  this.authService.getUserId();
    if(userId != null)
    {
    this.getTransactionSummary(userId , this.numberOfMonths());

    }

    });
  }


  ngOnInit(): void {


  }



  getTransactionSummary(userId : string , numberOfMonth :  number | null ){
    this.transactionService.getTransactionSummary(userId , numberOfMonth).subscribe( res =>
      {
        if(res.success){
           this.transactionSummary.set(res.data);
        }

      }
    );
  }


  onMonthChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    const monthValue = value === "null" ? null : Number(value);

    this.numberOfMonths.set(monthValue);

    this.getTransactionSummary(
      this.authService.userId(),
      this.numberOfMonths()
    );
  }


  protected readonly formatCurrency = formatCurrency;
}
