import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedTransactions } from './fixed-transactions';

describe('FixedTransactions', () => {
  let component: FixedTransactions;
  let fixture: ComponentFixture<FixedTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
