import {Component, signal} from '@angular/core';
import {AddNewTransaction} from '../add-new-transaction/add-new-transaction';

@Component({
  selector: 'app-fixed-transactions',
  imports: [
    AddNewTransaction
  ],
  templateUrl: './fixed-transactions.html',
  styleUrl: './fixed-transactions.css',
})
export class FixedTransactions {
  showAddForm  =  signal<boolean>(false);


}
