import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPerfilComponent } from './auth-perfil.component';

describe('AuthPerfilComponent', () => {
  let component: AuthPerfilComponent;
  let fixture: ComponentFixture<AuthPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
