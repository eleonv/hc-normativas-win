import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPerfilRegComponent } from './adm-perfil-reg.component';

describe('AdmPerfilRegComponent', () => {
  let component: AdmPerfilRegComponent;
  let fixture: ComponentFixture<AdmPerfilRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmPerfilRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmPerfilRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
