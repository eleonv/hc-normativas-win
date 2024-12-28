import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUsuarioListComponent } from './adm-usuario-list.component';

describe('AdmUsuarioListComponent', () => {
  let component: AdmUsuarioListComponent;
  let fixture: ComponentFixture<AdmUsuarioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmUsuarioListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmUsuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
