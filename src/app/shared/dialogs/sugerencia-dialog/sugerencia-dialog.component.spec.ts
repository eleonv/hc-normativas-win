import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciaDialogComponent } from './sugerencia-dialog.component';

describe('SugerenciaDialogComponent', () => {
  let component: SugerenciaDialogComponent;
  let fixture: ComponentFixture<SugerenciaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugerenciaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugerenciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
