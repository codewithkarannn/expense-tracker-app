import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {AuthService} from '../../services/auth/auth-service';
import {ExpensePieChartData} from '../../models/transaction';
import {TransactionStateService} from '../../services/transactions/transaction-state-service';
import {CommonServices} from '../../services/common-services/common-services';

Chart.register(...registerables);

@Component({
  selector: 'app-expense-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './expense-pie-chart.html',
  styleUrl: './expense-pie-chart.css',
})
export class ExpensePieChart implements OnInit {
  transactionService = inject(TransactionsService);
  authStateService = inject(AuthService);
  commonService = inject(CommonServices);
  transactionStateService = inject(TransactionStateService);
  categoryExpense = signal<ExpensePieChartData[]>([]);

  // Add loading state
  isLoading = signal<boolean>(true);

  // Initialize with empty data structure instead of undefined
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#4ade80', // green
        '#22c55e',
        '#16a34a',

        '#f87171', // red
        '#ef4444',
        '#dc2626',

        '#60a5fa', // blue
        '#3b82f6',
        '#2563eb',

        '#facc15', // yellow
        '#eab308',
        '#ca8a04',

        '#a78bfa', // purple
        '#8b5cf6',
        '#7c3aed',

        '#34d399', // emerald
        '#10b981',

        '#2dd4bf', // teal
        '#14b8a6',

        '#38bdf8', // sky
        '#0ea5e9',

        '#fb923c', // orange
        '#f97316',

        '#f472b6', // pink
        '#ec4899',

        '#c084fc', // violet
        '#a855f7',

        '#94a3b8', // gray/blue
        '#64748b',

        '#fde047', // warm yellow
        '#fbbf24',

        '#bef264', // lime
        '#84cc16',

        '#67e8f9', // cyan
        '#06b6d4'
      ],
    }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend:{
        position: 'right',
      } ,
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const val = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${this.commonService.currencySymbol}${val.toLocaleString()}`;
          }
        }
      }
    }
  };

  constructor() {
    effect(() => {
      this.transactionStateService.refreshTrigger$();
      this.getExpensePieChartData();
    });
  }

  ngOnInit(): void {
    this.getExpensePieChartData();
  }

  getExpensePieChartData() {
    const userId = this.authStateService.userId();
    this.isLoading.set(true);

    this.transactionService.getExpensePieChartData(userId, 1).subscribe({
      next: (response) => {
        if (response.success && response.data?.length > 0) {
          this.categoryExpense.set(response.data);
          // Update existing object instead of creating new one
          this.pieChartData.labels = this.categoryExpense().map(c => c.expenseCategory);
          this.pieChartData.datasets[0].data = this.categoryExpense().map(c => c.amount);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading pie chart data:', err);
        this.isLoading.set(false);
      }
    });
  }
}
