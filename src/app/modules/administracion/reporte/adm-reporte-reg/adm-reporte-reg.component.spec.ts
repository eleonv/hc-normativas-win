import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmReporteRegComponent } from './adm-reporte-reg.component';

describe('AdmReporteRegComponent', () => {
  let component: AdmReporteRegComponent;
  let fixture: ComponentFixture<AdmReporteRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmReporteRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmReporteRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
