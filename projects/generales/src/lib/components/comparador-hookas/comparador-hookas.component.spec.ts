import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparadorHookasComponent } from './comparador-hookas.component';

describe('ComparadorHookasComponent', () => {
  let component: ComparadorHookasComponent;
  let fixture: ComponentFixture<ComparadorHookasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparadorHookasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparadorHookasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
