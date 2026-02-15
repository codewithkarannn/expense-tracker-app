import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {AddBudgetForm} from '../add-budget-form/add-budget-form';
import {BudgetDetailsDto} from '../../models/budget-master';
import {BudgetService} from '../../services/budget/budget-service';
import {AuthService} from '../../services/auth/auth-service';
import {CommonServices} from '../../services/common-services/common-services';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-budget-overview',
  imports: [
    AddBudgetForm,
    NgClass
  ],
  templateUrl: './budget-overview.html',
  styleUrl: './budget-overview.css',
})
export class BudgetOverview implements OnInit {
  showAddForm  =  signal<boolean>(false);
  authService  =  inject(AuthService);
  budgetList =  signal<BudgetDetailsDto[]>([]);
  budgetService =  inject(BudgetService);
  commonService  =  inject(CommonServices);
  constructor() {
    effect(() => {
      this.budgetService.refreshTrigger$();
      const userId = this.authService.getUserId();
      if (userId) {
        this.getAllBudgets(userId);
      }

    });
  }


  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.getAllBudgets(userId);

    }
  }
  getAllBudgets (userId :  string) {
    this.budgetService.getAllBudget(userId).subscribe( response =>
    {
      if(response.success){
        this.budgetList.set(response.data);
        this.budgetList().sort((a, b) => b.usedAmount - a.usedAmount);
      }
    })
  }

  deleteBudget(budgetMasterId :  string) {
    this.budgetService.deleteBuget(budgetMasterId).subscribe( response =>{
      if(response.success){
        this.budgetList.set(this.budgetList().filter(budget => budget.budgetMasterId !== budgetMasterId));
      }
    })
  }
}
