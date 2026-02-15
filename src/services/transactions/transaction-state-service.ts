import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionStateService {
  // Trigger for refresh
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


}
