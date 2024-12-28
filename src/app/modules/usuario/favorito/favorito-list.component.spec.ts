import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritoListComponent } from './favorito-list.component';

describe('FavoritoListComponent', () => {
  let component: FavoritoListComponent;
  let fixture: ComponentFixture<FavoritoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
