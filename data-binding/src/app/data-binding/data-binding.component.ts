import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-data-binding',
  imports: [ CommonModule],
  templateUrl: './data-binding.component.html',
  styleUrl: './data-binding.component.scss'
})
export class DataBindingComponent {
  
 url: string = 'https://loiane.training/';
 cursoAngular: boolean = true;
 isDisabled = true;
 urlImagem = 'https://images.unsplash.com/photo-1737079282750-5e2580fe5603?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
 isMouseOver: boolean = false;

 getIdade() {
  return 2025 - 1987;
 }
 botaoClicado(){
  alert('Botão Clicado!')
 }
 onMouseOverOut(){
  this.isMouseOver = !this.isMouseOver;
 }

}
