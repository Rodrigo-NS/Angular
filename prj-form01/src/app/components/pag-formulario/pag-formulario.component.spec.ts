import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagFormularioComponent } from './pag-formulario.component';

describe('PagFormularioComponent', () => {
  let component: PagFormularioComponent;
  let fixture: ComponentFixture<PagFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagFormularioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
