import { Value } from './../../../../fontes_angular/node_modules/regjsparser/parser.d';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'contador',
  imports: [],
  templateUrl: './output-property.component.html',
  styleUrl: './output-property.component.scss'
})
export class OutputPropertyComponent {
  
  @Input() valor: any= 0;
  
  @Output() mudouValor = new EventEmitter();

  @ViewChild('campoInput') campoValorInput!: ElementRef;

  incrementa() {
    console.log(this.campoValorInput);
    console.log(this.campoValorInput.nativeElement.Value);
    this.campoValorInput.nativeElement.Value++;
    //this.valor ++;
    this.mudouValor.emit({novoValor: this.valor});
  }
  decrementa() {
    this.valor --;
    this.mudouValor.emit({novoValor: this.valor});
  }

}
