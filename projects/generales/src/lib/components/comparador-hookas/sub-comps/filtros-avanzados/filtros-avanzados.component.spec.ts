import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosAvanzadosComponent } from './filtros-avanzados.component';

describe('FiltrosAvanzadosComponent', () => {
  let component: FiltrosAvanzadosComponent;
  let fixture: ComponentFixture<FiltrosAvanzadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosAvanzadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosAvanzadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
