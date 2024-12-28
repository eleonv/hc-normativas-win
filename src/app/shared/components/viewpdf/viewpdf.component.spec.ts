import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpdfComponent } from './viewpdf.component';

describe('ViewpdfComponent', () => {
  let component: ViewpdfComponent;
  let fixture: ComponentFixture<ViewpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewpdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
