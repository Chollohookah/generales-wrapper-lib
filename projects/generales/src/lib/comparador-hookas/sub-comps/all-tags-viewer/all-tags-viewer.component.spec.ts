import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTagsViewerComponent } from './all-tags-viewer.component';

describe('AllTagsViewerComponent', () => {
  let component: AllTagsViewerComponent;
  let fixture: ComponentFixture<AllTagsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTagsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTagsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
