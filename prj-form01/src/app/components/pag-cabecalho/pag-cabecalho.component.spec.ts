import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagCabecalhoComponent } from './pag-cabecalho.component';

describe('PagCabecalhoComponent', () => {
  let component: PagCabecalhoComponent;
  let fixture: ComponentFixture<PagCabecalhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagCabecalhoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagCabecalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
