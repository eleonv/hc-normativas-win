import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVistaPreviaReporteComponent } from './modal-vista-previa-reporte.component';

describe('ModalVistaPreviaReporteComponent', () => {
  let component: ModalVistaPreviaReporteComponent;
  let fixture: ComponentFixture<ModalVistaPreviaReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVistaPreviaReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVistaPreviaReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
