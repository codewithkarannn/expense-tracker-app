import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {BudgetService} from '../../services/budget/budget-service';
import {AuthService} from '../../services/auth/auth-service';
import {BudgetDetailsDto} from '../../models/budget-master';
import {ToastService} from '../../services/toast/toast-service';
import {CommonServices} from '../../services/common-services/common-services';
import {FormsModule} from '@angular/forms';
import {AddBudgetForm} from '../add-budget-form/add-budget-form';
import {DialogService} from '../../services/dialog/dialog';

@Component({
  selector: 'app-budget-list',
  imports: [
    FormsModule,
    AddBudgetForm
  ],
  templateUrl: './budget-list.html',
  styleUrl: './budget-list.css',
})
export class BudgetList  implements  OnInit{

  budgetService  =  inject(BudgetService);
  toastService = inject(ToastService);
  dialogService = inject(DialogService);
  authService  = inject(AuthService);
  commonService  =  inject(CommonServices);
  budgetList  =  signal<BudgetDetailsDto[]>([]);
  showAddForm  =  signal<boolean>(false);
  searchTerm = signal('');
  filterStatus = signal<'all' | 'warning' | 'over'>('all');
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');


  constructor() {
    effect(() => {
      this.budgetService.refreshTrigger$();
      const userId = this.authService.getUserId();
      if (userId) {
        this.getAllBudgetList();
      }

    });
  }

  ngOnInit () {
      this.getAllBudgetList();

  }


  getAllBudgetList(){
    const userId = this.authService.getUserId();
    if(userId){
      this.budgetService.getAllBudget(userId).subscribe( res => {
        if(res.success){
          this.budgetList.set(res.data);
        }
        else {
          this.toastService.show(res.message , "error");
        }
      })
    }

  }


  filteredBudgets = computed(() => {
    let budgets = [...this.budgetList()];

    const search = this.searchTerm().toLowerCase();
    const filter = this.filterStatus();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    // Search
    if (search) {
      budgets = budgets.filter(b =>
        b.categoryName.toLowerCase().includes(search)
      );
    }

    // Filter
    if (filter === 'warning') {
      budgets = budgets.filter(b => {
        const percentage = (b.usedAmount / b.amount) * 100;
        return percentage > 70 && percentage <= 100;
      });
    } else if (filter === 'over') {
      budgets = budgets.filter(b => b.usedAmount > b.amount);
    }

    // Sort
    if (column) {
      budgets.sort((a, b) => {
        let aVal: number | string;
        let bVal: number | string;

        switch (column) {
          case 'categoryName':
            aVal = a.categoryName.toLowerCase();
            bVal = b.categoryName.toLowerCase();
            break;
          case 'amount':
            aVal = a.amount;
            bVal = b.amount;
            break;
          case 'usedAmount':
            aVal = a.usedAmount;
            bVal = b.usedAmount;
            break;
          case 'remaining':
            aVal = a.amount - a.usedAmount;
            bVal = b.amount - b.usedAmount;
            break;
          case 'percentage':
            aVal = (a.usedAmount / a.amount) * 100;
            bVal = (b.usedAmount / b.amount) * 100;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return budgets;
  });

  sortBy(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }
  setFilter(status: 'all' | 'warning' | 'over') {
    this.filterStatus.set(status);
  }




  getTotalBudget(): number {
    return this.filteredBudgets().reduce((sum, budget) => sum + budget.amount, 0);
  }

  getTotalUsed(): number {
    return this.filteredBudgets().reduce((sum, budget) => sum + budget.usedAmount, 0);
  }

  async deleteItem(budgetMasterId :  string){
    const confirmed = await this.dialogService.open({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?  This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonClass: 'btn-error',
      cancelButtonClass: 'btn-ghost'
    });

    if (confirmed) {
      this.budgetService.deleteBuget(budgetMasterId).subscribe(res => {
        if(res.success){
          this.toastService.show(res.message, "success");
          this.budgetService.triggerRefresh();
        }
      });
    } else {
      console.log('User cancelled');
    }
  }
}
