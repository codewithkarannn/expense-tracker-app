import {Component, effect, inject, Input, OnInit, signal} from '@angular/core';
import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {MonthlyExpenseOverviewDTO} from '../../models/transaction';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {TransactionStateService} from '../../services/transactions/transaction-state-service';
import {AuthService} from '../../services/auth/auth-service';
import {HttpClient} from '@angular/common/http';
import {CommonServices} from '../../services/common-services/common-services';
// Register Bar-specific and common components
Chart.register(...registerables);
@Component({
  selector: 'app-monthly-expense-bar-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './monthly-expense-bar-chart.html',
  styleUrl: './monthly-expense-bar-chart.css',
})
export class MonthlyExpenseBarChart implements OnInit {
  transactionService  =  inject(TransactionsService);
  commonService =  inject(CommonServices);
  transationStateService  =  inject(TransactionStateService);
  authService  =  inject(AuthService);
  monthlyExpenseBarChartData = signal<MonthlyExpenseOverviewDTO>({} as MonthlyExpenseOverviewDTO );

  ngOnInit(): void {
    this.updateChartData();
  }


  constructor() {
    effect(() => {
      this.transationStateService.refreshTrigger$();
      this.updateChartData();
    });
  }

  public lineChartData!: ChartData<'line'>;

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        callbacks: {
          label: (item) => `${this.commonService.currencySymbol} ${item.raw?.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
          drawTicks: false
        },
        ticks: {
          color: '#9ca3af',
          callback: (value) => {
            const numValue = Number(value);
            if (numValue >= 1000) {
              return `${this.commonService.currencySymbol}` + (numValue / 1000).toFixed(1) + 'k';
            }
            return `${this.commonService.currencySymbol}` + numValue;
          }
          }
      }
    },
    elements: {
      line: {
        tension: 0.4 // Smooth curved line
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };
  updateChartData(): void {

    this.transactionService.getMonthlyExpenseLineChartData(this.authService.userId() ,  6).subscribe(
      response => {
        if(response.success){
          this.monthlyExpenseBarChartData.set(response.data);

          this.lineChartData = {
            labels: this.monthlyExpenseBarChartData().monthlyExpenses.map(d => `${d.month},${d.year}`),
            datasets: [
              {
                data: this.monthlyExpenseBarChartData().monthlyExpenses.map(d => d.amount),
                borderColor: '#6366f1', // Line color (indigo)
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1',
              }
            ]
          };

        }
      }
    );


}

}
