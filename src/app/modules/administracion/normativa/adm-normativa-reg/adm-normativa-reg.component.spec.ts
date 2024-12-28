import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmNormativaRegComponent } from './adm-normativa-reg.component';

describe('AdmNormativaRegComponent', () => {
  let component: AdmNormativaRegComponent;
  let fixture: ComponentFixture<AdmNormativaRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmNormativaRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmNormativaRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
