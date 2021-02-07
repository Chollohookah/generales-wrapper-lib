import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeInputButtonInOneComponent } from './subscribe-input-button-in-one.component';

describe('SubscribeInputButtonInOneComponent', () => {
  let component: SubscribeInputButtonInOneComponent;
  let fixture: ComponentFixture<SubscribeInputButtonInOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeInputButtonInOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeInputButtonInOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
