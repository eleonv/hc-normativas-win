import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPerfilListComponent } from './adm-perfil-list.component';

describe('AdmPerfilListComponent', () => {
  let component: AdmPerfilListComponent;
  let fixture: ComponentFixture<AdmPerfilListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmPerfilListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmPerfilListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
