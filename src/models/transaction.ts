import {Observable} from 'rxjs';

export interface TransactionType {
  transactionTypeMasterId : number ,
  transactionTypename : string ,
  isCustom : false
}

export interface TransactionCategory {
  transactionCategoryMasterId : number ,
  transactionCategoryName : string ,
  isCustom : false
}

export interface TransactionPaymentMode {
  paymentModeId : number ,
  paymentMode : string ,
  isCustom : false,
  isActive :  number
}


export interface TransactionSummary {
  userId : number ,
  totalExpense : number ,
  currentBalance : number,
  totalIncome :  number,
  numberOfMonths :  number,
  averageMonthlyExpense : number
}

export  interface PaginatedTransaction {
  page : number;
  pageSize : number;
  totalRecords : number;
  transactionList : Transaction[];
}
export interface Transaction {
  transactionMasterId?: string;
  userId: string;
  transactionTypeMasterId: number;       // int
  transactionCategoryMasterId: number;   // int
  transactionPaymentModeId?: number | null; // int?
  transactionPaymentMode?: string | null;   // string?
  transactionDescription: string;        // string
  transactionAmount: number;             // double
  transactionDate: string | Date;        // DateTime (usually string from JSON)
  transactionNote?: string | null;       // string?
  isActive?: number | null;              // sbyte? (0 or 1)
  transactionType?: string | null;       // string?
  transactionCategory?: string | null;   // string?
  createdAt?: string | Date | null;      // DateTime?
  deletedAt?: string | Date | null;      // DateTime?
}


export interface CreateTransaction {
  userId: string;
  transactionTypeMasterId: number;
  transactionCategoryMasterId: number;
  transactionPaymentModeId: number;
  transactionDescription: string;
  transactionAmount: number;
  transactionDate: string;
  transactionNote?: string;
}

export interface ExpensePieChartData {

  expenseCategory:  string;
  amount  : number;

}

export interface MonthlyExpenseOverviewDTO {
  totalMonthlyExpense: number;
  percentageLastMonthlyExpense: number;
  sign: string;
  monthlyExpenses: MonthlyExpenseDTO[];
}

export interface MonthlyExpenseDTO {
  amount: number;
  month: string;
  monthNumber: number;
  year: string;
}

export class CurrencyMasterDTO {
  currencyMasterId!: number;
  currencyCode!: string;
  currencyName!: string;
  currencySymbol!: string;
}

