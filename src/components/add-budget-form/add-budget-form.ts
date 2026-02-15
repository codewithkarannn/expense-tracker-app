import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {TransactionCategory} from '../../models/transaction';
import {ToastService} from '../../services/toast/toast-service';
import {sign} from 'chart.js/helpers';
import {CreateBudgetMasterDto} from '../../models/budget-master';
import {BudgetService} from '../../services/budget/budget-service';

@Component({
  selector: 'app-add-budget-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-budget-form.html',
  styleUrl: './add-budget-form.css',
})
export class AddBudgetForm implements OnInit {
  showAddForm =  input<boolean>();
  hideAddForm = output<void>();
  authService = inject(AuthService);
  transactionService = inject(TransactionsService);
  budgetService = inject(BudgetService);
  transactionCategories = signal<TransactionCategory[]>([]);
  toastService = inject(ToastService);
  protected  addBudgetForm!:  FormGroup;
  private fb = inject(FormBuilder);
  newBudgetModel =  signal<CreateBudgetMasterDto>({} as CreateBudgetMasterDto);


  ngOnInit() {
    this.intializeAddBudgetForm();
  }

  intializeAddBudgetForm(): void {
    this.getTransactionCategories();
    this.addBudgetForm = this.fb.group({
      userId: [this.authService.getUserId(), Validators.required],
      categoryId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });
  }


  getTransactionCategories(){
    const transactionTypeMasterId = 2;
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


  protected close() {
    this.addBudgetForm.reset();
    this.hideAddForm.emit();
  }

  onSubmit()
  {
    if(this.addBudgetForm.invalid)
    {
      this.addBudgetForm.markAllAsTouched();
    }
    else
    {
      const payload  = this.addBudgetForm.value;

      this.budgetService.addBudget(payload).subscribe(
       res => {
          if(res.success){
            this.toastService.show(res.message, 'success');
            this.budgetService.triggerRefresh(true);
            this.addBudgetForm.reset();
            this.close();
          }
          else
          {
            this.toastService.show(res.message, 'error');

          }
        }
      )
    }

  }
}
