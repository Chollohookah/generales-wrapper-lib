import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralActionsComponent } from './lateral-actions.component';

describe('LateralActionsComponent', () => {
  let component: LateralActionsComponent;
  let fixture: ComponentFixture<LateralActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateralActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateralActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
