import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabButtonWithItemsComponent } from './fab-button-with-items.component';

describe('FabButtonWithItemsComponent', () => {
  let component: FabButtonWithItemsComponent;
  let fixture: ComponentFixture<FabButtonWithItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabButtonWithItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabButtonWithItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
