import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmReporteListComponent } from './adm-reporte-list.component';

describe('AdmReporteListComponent', () => {
  let component: AdmReporteListComponent;
  let fixture: ComponentFixture<AdmReporteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmReporteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmReporteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
