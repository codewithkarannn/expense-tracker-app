import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpenseBarChart } from './monthly-expense-bar-chart';

describe('MonthlyExpenseBarChart', () => {
  let component: MonthlyExpenseBarChart;
  let fixture: ComponentFixture<MonthlyExpenseBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyExpenseBarChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpenseBarChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
