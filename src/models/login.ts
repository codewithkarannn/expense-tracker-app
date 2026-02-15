export interface Login {
userEmail: string;
password: string;
}

export  interface UserMaster{
  userMasterId : string;
  userEmail : string;
  firstName : string;
  lastName : string;
  userRoleId : number;
  userRole : string;
  currencySymbol :string | null;
  currencyCode :string | null;
  currencyMasterId : number |  null;
}
