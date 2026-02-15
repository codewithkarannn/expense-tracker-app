export interface BudgetMaster {
}
export interface CreateBudgetMasterDto {
  userId :  string;
  categoryId :  string;
  amount :  number;
}

export interface BudgetDetailsDto {
  userId :  string;
  categoryId :  string;
  amount :  number;
  budgetMasterId: string;
  categoryName :  string;
  usedAmount :  number;
  usedPercentage :  number;
}
