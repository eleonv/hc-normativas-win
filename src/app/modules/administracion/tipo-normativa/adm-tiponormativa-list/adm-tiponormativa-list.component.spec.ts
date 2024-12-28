import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTiponormativaListComponent } from './adm-tiponormativa-list.component';

describe('AdmTiponormativaListComponent', () => {
  let component: AdmTiponormativaListComponent;
  let fixture: ComponentFixture<AdmTiponormativaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmTiponormativaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmTiponormativaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
