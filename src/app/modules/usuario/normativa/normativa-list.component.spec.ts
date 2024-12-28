import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativaListComponent } from './normativa-list.component';

describe('NormativaListComponent', () => {
  let component: NormativaListComponent;
  let fixture: ComponentFixture<NormativaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormativaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormativaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
