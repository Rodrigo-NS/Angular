import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { PagCabecalhoComponent } from './components/pag-cabecalho/pag-cabecalho.component';
import { PagFormularioComponent } from './components/pag-formulario/pag-formulario.component';
import { PagRodapeComponent } from './components/pag-rodape/pag-rodape.component';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/*RouterOutlet,*/ PagCabecalhoComponent, PagFormularioComponent, PagRodapeComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'form01';
}