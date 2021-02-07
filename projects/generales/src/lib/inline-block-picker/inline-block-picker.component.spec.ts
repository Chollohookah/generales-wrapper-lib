import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineBlockPickerComponent } from './inline-block-picker.component';

describe('InlineBlockPickerComponent', () => {
  let component: InlineBlockPickerComponent;
  let fixture: ComponentFixture<InlineBlockPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineBlockPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineBlockPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
