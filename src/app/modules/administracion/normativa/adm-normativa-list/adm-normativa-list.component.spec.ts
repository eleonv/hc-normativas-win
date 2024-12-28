import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmNormativaListComponent } from './adm-normativa-list.component';

describe('AdmNormativaListComponent', () => {
  let component: AdmNormativaListComponent;
  let fixture: ComponentFixture<AdmNormativaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmNormativaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmNormativaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
