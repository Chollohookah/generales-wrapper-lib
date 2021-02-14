import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HookaSearcherInputComponent } from './hooka-searcher-input.component';

describe('HookaSearcherInputComponent', () => {
  let component: HookaSearcherInputComponent;
  let fixture: ComponentFixture<HookaSearcherInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HookaSearcherInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HookaSearcherInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
