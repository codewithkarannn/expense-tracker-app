import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CreateTransaction,
  CurrencyMasterDTO,
  ExpensePieChartData,
  MonthlyExpenseOverviewDTO,
  PaginatedTransaction,
  TransactionCategory,
  TransactionPaymentMode,
  TransactionSummary,
  TransactionType
} from '../../models/transaction';
import {ResponseModel} from '../../models/response-model';
import {APP_CONFIG} from '../../env/env';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {

  http =  inject(HttpClient);

  getTransactionTypes(userId : string): Observable<ResponseModel<TransactionType[]>> {
    return this.http.get<ResponseModel<TransactionType[]>>(APP_CONFIG.baseUrl + `/transaction/transactionTypes/${userId}`);
  }

  getTransactionCategories(userId : string  , transactionTypeMasterId: number): Observable<ResponseModel<TransactionCategory[]>> {
    return this.http.get<ResponseModel<TransactionCategory[]>>(APP_CONFIG.baseUrl + `/transaction/transactioncategories/${userId}/${transactionTypeMasterId}`);
  }


  getTransactionPaymentModes(userId : string): Observable<ResponseModel<TransactionPaymentMode[]>> {
    return this.http.get<ResponseModel<TransactionPaymentMode[]>>(APP_CONFIG.baseUrl + `/transaction/transactionpaymentmodes/${userId}`);
  }

  addTransaction(payload :  CreateTransaction): Observable<ResponseModel<string>>{
    return this.http
      .post<ResponseModel<string>>(APP_CONFIG.baseUrl + '/Transaction/addtransaction', payload);
  }

  deleteTransaction(transactionMasterId :  string): Observable<ResponseModel<string>>{
    return this.http
      .delete<ResponseModel<string>>(APP_CONFIG.baseUrl + `/Transaction/deletetransaction/${transactionMasterId}`);
  }



  getTransactionsByUserId(userId : string ,  page : number , pageSize : number) : Observable<ResponseModel<PaginatedTransaction>> {
    return  this.http.get<ResponseModel<PaginatedTransaction>>(APP_CONFIG.baseUrl + `/transaction/usertransactions/${userId}/${page}/${pageSize}`);
  }

  getTransactionSummary(userId : string , numberOfMonth :  number | null): Observable<ResponseModel<TransactionSummary>> {
    if(numberOfMonth == null){
      return this.http.get<ResponseModel<TransactionSummary>>(APP_CONFIG.baseUrl + `/transaction/transactionsummary/${userId}`);
    }
    else
    {
      return this.http.get<ResponseModel<TransactionSummary>>(APP_CONFIG.baseUrl + `/transaction/transactionsummary/${userId}/${numberOfMonth}`);
    }

  }

  getExpensePieChartData(userId :  string ,  numberOfMonth : number) :  Observable<ResponseModel<ExpensePieChartData[]>>{
    return this.http.get<ResponseModel<ExpensePieChartData[]>>(APP_CONFIG.baseUrl + `/transaction/expensepiechartdata/${userId}/${numberOfMonth}`);
  }

  getMonthlyExpenseLineChartData(userId :  string ,  numberOfMonth : number) :  Observable<ResponseModel<MonthlyExpenseOverviewDTO>>{
    return this.http.get<ResponseModel<MonthlyExpenseOverviewDTO>>(APP_CONFIG.baseUrl + `/transaction/monthlyexpenselinechartdata/${userId}/${numberOfMonth}`);
  }

  getAllCurrencies(): Observable<ResponseModel<CurrencyMasterDTO[]>>{
    return this.http.get<ResponseModel<CurrencyMasterDTO[]>>(APP_CONFIG.baseUrl + `/transaction/currencies`);
  }
}
