import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeController } from './theme-controller';

describe('ThemeController', () => {
  let component: ThemeController;
  let fixture: ComponentFixture<ThemeController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeController]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeController);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
