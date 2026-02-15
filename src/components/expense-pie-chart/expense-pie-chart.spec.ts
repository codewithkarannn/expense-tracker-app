import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePieChart } from './expense-pie-chart';

describe('ExpensePieChart', () => {
  let component: ExpensePieChart;
  let fixture: ComponentFixture<ExpensePieChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensePieChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensePieChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
