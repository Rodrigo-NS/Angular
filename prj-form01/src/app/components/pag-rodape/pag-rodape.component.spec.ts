import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRodapeComponent } from './pag-rodape.component';

describe('PagRodapeComponent', () => {
  let component: PagRodapeComponent;
  let fixture: ComponentFixture<PagRodapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagRodapeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagRodapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
