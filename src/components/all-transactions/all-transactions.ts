import {Component, computed, effect, inject, signal} from '@angular/core';
import {Transaction} from '../../models/transaction';
import {TransactionStateService} from '../../services/transactions/transaction-state-service';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {AuthService} from '../../services/auth/auth-service';
import {ToastService} from '../../services/toast/toast-service';
import {AddNewTransaction} from '../add-new-transaction/add-new-transaction';
import {CommonServices} from '../../services/common-services/common-services';
import {DatePipe, NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogService} from '../../services/dialog/dialog';


type PageItem = number | 'dots';

@Component({
  selector: 'app-all-transactions',
  imports: [
    AddNewTransaction,
    DatePipe,
    NgClass,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './all-transactions.html',
  styleUrl: './all-transactions.css',
})
export class AllTransactions {

  transactions  = signal<Transaction[]>([]);
  transactionStateService =  inject(TransactionStateService);
  transactionService =  inject(TransactionsService);
  authService =  inject(AuthService);
  toastService =  inject(ToastService);
  page =  signal(1) ;
  pageSize = signal(10);
  totalPages = computed(() =>
    Math.ceil(this.totalRecords() / this.pageSize())
  );
  visiblePages = computed<PageItem[]>(() => {
    const total = this.totalPages();
    const current = this.page();

    // show all if few pages
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // near beginning
    if (current <= 4) {
      return [1, 2, 3, 4, 5, 'dots', total];
    }

    // near end
    if (current >= total - 3) {
      return [1, 'dots', total - 4, total - 3, total - 2, total - 1, total];
    }

    // middle
    return [
      1,
      'dots',
      current - 1,
      current,
      current + 1,
      'dots',
      total
    ];
  });
  fromDate = signal<string | null>(null);
  toDate = signal<string | null>(null);
  selectedPaymentModes = signal<string[]>([]);
  paymentModes = computed(() => {
    const set = new Set(this.transactions().map(t => t.transactionPaymentMode));
    return Array.from(set).filter(Boolean);
  });
  totalRecords = signal(0);
  dialogService = inject(DialogService);
  showAddForm  =  signal<boolean>(false);
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  protected commonService =  inject(CommonServices);
  searchTerm  =  signal<string|  null>(null);
  selectedTypes = signal<string[]>([]);
  selectedCategory = signal<string>('');
  categories = computed(() => {
    const set = new Set(this.transactions().map(t => t.transactionCategory));
    return Array.from(set).filter(Boolean);
  });
  constructor() {
    effect(() => {
      this.transactionStateService.refreshTrigger$();
      const page = this.transactionStateService.currentPage();
      this.page.set(page);
      this.getTransactions();


    });
  }



  getTransactions() {

    const userId = this.authService.getUserId();

    if (userId) {
      this.transactionService
        .getTransactionsByUserId(userId, this.page(), this.pageSize())
        .subscribe(response => {

          if (response.success) {

            const sortedList = response.data.transactionList.sort((a, b) => {
              const dateDiff =
                +new Date(b.transactionDate) - +new Date(a.transactionDate);

              if (dateDiff !== 0) return dateDiff;

              return +new Date(b.createdAt ?? '') - +new Date(a.createdAt ?? '');
            });

            // ✅ ALWAYS replace data
            this.transactions.set(sortedList);

            this.totalRecords.set(response.data.totalRecords);
            this.page.set(response.data.page);
            this.pageSize.set(response.data.pageSize);

          } else {
            this.toastService.show("Something went wrong", 'error');
          }

        });
    }
  }

  changePageSize(size: number) {
    this.pageSize.set(size);

    const maxPage = Math.ceil(this.totalRecords() / size);

    if (this.page() > maxPage) {
      this.goToPage(maxPage);
    } else {
      this.goToPage(1);
    }
  }
  goToPage(p: number) {
    const total = this.totalPages();

    if (p < 1 || p > total) return;
    if (p === this.page()) return;

    this.page.set(p);
    this.transactionStateService.setCurrentPage(p);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filteredTransactions = computed(() => {
    let transactions = [...this.transactions()];

    const search = this.searchTerm()?.toLowerCase();
    const types = this.selectedTypes();
    const category = this.selectedCategory();

    //  SEARCH
    if (search) {
      transactions = transactions.filter(t =>
        t.transactionCategory?.toLowerCase().includes(search) ||
        t.transactionDescription?.toLowerCase().includes(search) ||
        t.transactionNote?.toLowerCase().includes(search) ||
        t.transactionPaymentMode?.toLowerCase().includes(search)
      );
    }

    //  TYPE FILTER
    if (types.length > 0) {
      transactions = transactions.filter(t => {
        const type = t.transactionTypeMasterId == 2 ? 'expense' : 'income';
        return types.includes(type);
      });
    }

    //  CATEGORY FILTER
    if (category) {
      transactions = transactions.filter(t =>
        t.transactionCategory === category
      );
    }


    // DATE FILTER
    const from = this.fromDate();
    const to = this.toDate();

    if (from) {
      transactions = transactions.filter(t =>
        new Date(t.transactionDate) >= new Date(from)
      );
    }

    if (to) {
      transactions = transactions.filter(t =>
        new Date(t.transactionDate) <= new Date(to)
      );
    }

    const paymentModes = this.selectedPaymentModes();

    if (paymentModes.length > 0) {
      transactions = transactions.filter(t =>
        paymentModes.includes(t.transactionPaymentMode!)
      );
    }

    return transactions;
  });



  toggleType(type: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedTypes.update(list =>
      checked ? [...list, type] : list.filter(t => t !== type)
    );
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  togglePayment(mode: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedPaymentModes.update(list =>
      checked ? [...list, mode] : list.filter(m => m !== mode)
    );
  }




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


  async  deleteTransaction(transactionMasterId: string | undefined ) {

    const confirmed = await this.dialogService.open({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?  This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonClass: 'btn-error',
      cancelButtonClass: 'btn-ghost'
    });

    if (confirmed)
    {
      const transactionId =  transactionMasterId;
      if(transactionMasterId !== undefined)
      {
        this.transactionService.deleteTransaction(transactionMasterId).subscribe(res => {
          if(res.success){
            this.toastService.show(res.message, "success");
            this.transactionStateService.triggerRefresh();
          }
        });
      }

    } else {
      console.log('User cancelled');
    }
  }


  clearFilters() {
    this.selectedTypes.set([]);
    this.selectedCategory.set('');
    this.selectedPaymentModes.set([]);
    this.fromDate.set(null);
    this.toDate.set(null);

    this.page.set(1); // reset pagination
  }
}
