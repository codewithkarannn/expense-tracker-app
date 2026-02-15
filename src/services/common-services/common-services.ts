import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonServices {


  currencySymbol: string = "₹";
  formatCurr(value: number | undefined): string {
    const userDetailsString = localStorage.getItem('userDetails');
    const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
    const currencyCode = userDetails?.currencyCode ||  'INR' ; // fallback to INR
    this.currencySymbol = userDetails?.currencySymbol ||  '₹';

    if (value === undefined || value === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
