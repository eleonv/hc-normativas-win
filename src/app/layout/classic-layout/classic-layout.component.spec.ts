import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicLayoutComponent } from './classic-layout.component';

describe('ClassicLayoutComponent', () => {
  let component: ClassicLayoutComponent;
  let fixture: ComponentFixture<ClassicLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassicLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
