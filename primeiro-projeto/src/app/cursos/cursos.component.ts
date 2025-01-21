import { Component } from '@angular/core';
import { CursosDetalheComponent } from './cursos-detalhe/cursos-detalhe.component';
import { CommonModule } from '@angular/common';
import { CursosService } from './cursos.service';

@Component({
  selector: 'app-cursos',
  imports: [ CommonModule, CursosDetalheComponent ],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss'
})
export class CursosComponent {
  nomePortal: string;
  cursos: string[] | undefined;

  constructor(private cursosService: CursosService){
    this.nomePortal = 'https://loiane.training';

    /*for (let i=0; i < this.cursos.length; i++) {
      let curso = this.cursos[i];
    }*/
    
    //  let servico = new CursosService();
    this.cursos = this.cursosService.getCursos();

  }
}
