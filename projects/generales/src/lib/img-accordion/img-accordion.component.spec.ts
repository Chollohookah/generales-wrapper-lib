import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgAccordionComponent } from './img-accordion.component';

describe('ImgAccordionComponent', () => {
  let component: ImgAccordionComponent;
  let fixture: ComponentFixture<ImgAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
