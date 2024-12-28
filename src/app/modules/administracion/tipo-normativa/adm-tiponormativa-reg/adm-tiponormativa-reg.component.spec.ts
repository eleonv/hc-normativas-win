import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTiponormativaRegComponent } from './adm-tiponormativa-reg.component';

describe('AdmTiponormativaRegComponent', () => {
  let component: AdmTiponormativaRegComponent;
  let fixture: ComponentFixture<AdmTiponormativaRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmTiponormativaRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmTiponormativaRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
