import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaDialogComponent } from './busqueda-dialog.component';

describe('BusquedaDialogComponent', () => {
  let component: BusquedaDialogComponent;
  let fixture: ComponentFixture<BusquedaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
