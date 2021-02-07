import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargandoCachimbasComponent } from './cargando-cachimbas.component';

describe('CargandoCachimbasComponent', () => {
  let component: CargandoCachimbasComponent;
  let fixture: ComponentFixture<CargandoCachimbasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargandoCachimbasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargandoCachimbasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
