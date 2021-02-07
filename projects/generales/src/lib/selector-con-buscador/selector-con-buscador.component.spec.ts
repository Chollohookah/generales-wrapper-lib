import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorConBuscadorComponent } from './selector-con-buscador.component';

describe('SelectorConBuscadorComponent', () => {
  let component: SelectorConBuscadorComponent;
  let fixture: ComponentFixture<SelectorConBuscadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorConBuscadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorConBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
