import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleselectComponent } from './multipleselect.component';

describe('MultipleselectComponent', () => {
  let component: MultipleselectComponent;
  let fixture: ComponentFixture<MultipleselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleselectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
