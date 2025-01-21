import { Component } from '@angular/core';
import { OutletContext, RouterOutlet } from '@angular/router';
import { MeuPrimeiroComponent } from './meu-primeiro/meu-primeiro.component'; // Importe o componente criado
import { MeuPrimeiro2Component } from './meu-primeiro2/meu-primeiro2.component';
import { CursosModule } from './cursos/cursos.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MeuPrimeiroComponent, MeuPrimeiro2Component, CursosModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'primeiro-projeto';
}
//<router-outlet>
