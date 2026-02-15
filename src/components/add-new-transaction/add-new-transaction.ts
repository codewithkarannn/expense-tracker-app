import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {TransactionCategory, TransactionPaymentMode, TransactionType} from '../../models/transaction';
import {AuthService} from '../../services/auth/auth-service';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {ToastService} from '../../services/toast/toast-service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TransactionStateService} from '../../services/transactions/transaction-state-service';

@Component({
  selector: 'app-add-new-transaction',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-new-transaction.html',
  styleUrl: './add-new-transaction.css',
})
export class AddNewTransaction  implements OnInit {
  showAddForm =  input<boolean>();
  isFixedTransaction  =  input<boolean>(false);
  hideAddForm = output<void>();
  transactionTypes  =  signal<TransactionType[]>([]);
  transactionCategories  =  signal<TransactionCategory[]>([]);
  transactionPaymentModes  =  signal<TransactionPaymentMode[]>([]);
  authService =  inject(AuthService);
  transactionService =  inject(TransactionsService);
  transactionStateService =  inject(TransactionStateService);
  toastService   =  inject(ToastService);
  protected  addTransactionForm!:  FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {

    this.intializeAddTransactionForm();

  }

  intializeAddTransactionForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.getTransactionTypes();

    this.getTransactionPaymentModes();

    this.addTransactionForm = this.fb.group({
      userId: [this.authService.getUserId(), Validators.required],
      transactionTypeMasterId: [null, Validators.required],
      transactionCategoryMasterId: [null, Validators.required],
      transactionPaymentModeId: [null, Validators.required],
      transactionDescription: ['', Validators.required],
      transactionAmount: [null, [Validators.required, Validators.min(0.01)]],
      transactionDate: [today, Validators.required],
      transactionIsFixed : [this.isFixedTransaction(), Validators.required],
        transactionNote: [null]
    });
  }

  getTransactionTypes(){
    const userId = this.authService.getUserId();
    console.log(userId)
    if(userId){
      this.transactionService.getTransactionTypes(userId).subscribe(
        transactionTypes => {
          if(transactionTypes.success){
            this.transactionTypes.set(transactionTypes.data);
          }
          else
          {
            this.toastService.show(transactionTypes.message , 'error');
          }
        }
      );
    }
    else
    {
      console.error('Error getting transaction types');
    }

  }

  getOrdinal(n: number): string {
    if (n > 3 && n < 21) return n + 'th';

    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }
  getSelectedDay(): string {
    const selectedDate = this.addTransactionForm.controls['transactionDate'].value;

    if (!selectedDate) {
      return '';
    }

    const date = new Date(selectedDate);
    const day = date.getDate(); // 1–31

    return this.getOrdinal(day);
  }

  getTransactionCategories(){
    const transactionTypeMasterId = this.addTransactionForm.get('transactionTypeMasterId')?.value;
    const userId = this.authService.getUserId();
    console.log(userId)
    if(userId && transactionTypeMasterId){
      this.transactionService.getTransactionCategories(userId , transactionTypeMasterId).subscribe(
        res => {
          if(res.success){
            this.transactionCategories.set(res.data);
          }
          else
          {
            this.toastService.show(res.message , 'error');
          }
        }
      );
    }
    else
    {
      console.error('Error getting transaction types');
    }

  }


  getTransactionPaymentModes(){
    const userId = this.authService.getUserId();
    console.log(userId)
    if(userId){
      this.transactionService.getTransactionPaymentModes(userId).subscribe(
        res => {
          if(res.success){
            this.transactionPaymentModes.set(res.data);
          }
          else
          {
            this.toastService.show(res.message , 'error');
          }
        }
      );
    }
    else
    {
      console.error('Error getting transaction types');
    }

  }

  // Emit close request to parent
  close() {
    const isFixed = this.isFixedTransaction();

    if(isFixed){
      this.addTransactionForm.reset({
        transactionIsFixed: isFixed,
        userId: this.authService.getUserId(),
        transactionDate: new Date().toISOString().split('T')[0]
      });
    }


    this.hideAddForm.emit();
  }



  onSubmit()
  {
    if(this.addTransactionForm.invalid){
      this.addTransactionForm.markAllAsTouched();
    }
    else
    {
      const payload  = this.addTransactionForm.value;

      this.transactionService.addTransaction(payload).subscribe(

          res => {
            if(res.success){
              this.toastService.show(res.message, 'success');

              this.transactionStateService.triggerRefresh(true);
              this.intializeAddTransactionForm();
              this.close();
            }
            else
            {
              this.toastService.show(res.message, 'error');
             this.intializeAddTransactionForm();
            }
          }

      )
    }

  }

}
