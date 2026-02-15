import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseModel} from '../../models/response-model';
import {TransactionType} from '../../models/transaction';
import {APP_CONFIG} from '../../env/env';
import {BudgetDetailsDto, CreateBudgetMasterDto} from '../../models/budget-master';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {

  http =  inject(HttpClient);
  private refreshTrigger = signal<number>(0);
  refreshTrigger$ = this.refreshTrigger.asReadonly();

  // Store current page (optional - maintains page after adding transaction)
  currentPage = signal<number>(1);

  // Call after adding/updating/deleting transaction
  triggerRefresh(resetToFirstPage: boolean = true) {
    if (resetToFirstPage) {
      this.currentPage.set(1); // Reset to page 1
    }
    this.refreshTrigger.update(v => v + 1);
  }

  setCurrentPage(page: number) {
    this.currentPage.set(page);
  }


  addBudget(payload :  CreateBudgetMasterDto): Observable<ResponseModel<any>>{
    return this.http
      .post<ResponseModel<any>>(APP_CONFIG.baseUrl + '/budget/addnewbudget', payload);
  }

  deleteBuget(budgetMasterId : string) : Observable<ResponseModel<boolean>>{
    return this.http.put<ResponseModel<boolean>>(APP_CONFIG.baseUrl + '/budget/deletebudget/'+ budgetMasterId , null) ;
  }
  getAllBudget(userId : string) : Observable<ResponseModel<BudgetDetailsDto[]>>{
    return  this.http.get<ResponseModel<BudgetDetailsDto[]>>(APP_CONFIG.baseUrl + '/budget/getAllBudget/' + userId );
  }
}
