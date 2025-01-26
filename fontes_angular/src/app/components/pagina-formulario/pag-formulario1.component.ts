import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { ShippingCompany } from '../../ShippingCompany';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Buffer } from "buffer";

import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pagina-formulario',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './pagina-formulario.component.html',
  styleUrl: './pagina-formulario.component.css'
})
export class PaginaFormularioComponent implements OnInit {
  
  //Dados da Interface
  private shippingValues: ShippingCompany = {
    cnpj: "",
    name: "",
    email: ""
  };

  //Dados de autenticação no Protheus
  private user: string = "daniel.atilio";
  private pass: string = "dHN0MTIz";
  private bearerToken: string = "";
  private lastTime: number = new Date().getTime();
  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {};

  //Na Inicialização da página
  ngOnInit(): void {
    this.generateToken();
  }

  //Aciona o REST para gerar o Bearer Token
  generateToken(): void {
    var passDecode  = Buffer.from(this.pass, 'base64').toString('binary');
    var minutesTst  = 2400000; //2.400.000 milissegundos são 40 minutos
    var currentTime = new Date().getTime();

    //Se o Token tiver vazio, ou tiver passado de 40 minutos
    if ((this.bearerToken.length == 0) || (currentTime > this.lastTime + minutesTst)) {

      //Realiza um POST no Protheus para gerar o Bearer
      this.http.post<any>('http://127.0.0.1:8400/rest/api/oauth2/v1/token?grant_type=password&password=' + passDecode + '&username=' + this.user, { /* httpOptions */ }).subscribe({
        next: (v) => {
          this.bearerToken = v.access_token;
          this.lastTime = new Date().getTime();

          //console.log("Bearer encontrado: " + this.bearerToken);
        },
        error: (e) => {          
          console.error("Falha ao gerar o Bearer: " + e.status + " - " + e.statusText);
          this.snackbar.open("Falha ao gerar o Bearer, contate o Administrador (fecha em 3s)", 'Fechar', {duration: 3000});
          
        },
        complete: () => {
          console.log('Busca do Bearer Completa');
        }

      });
    }
  }

  //Campo de CNPJ
  validCNPJInput(): void {
    var cnpjValue  = (document.getElementById("cnpj") as HTMLInputElement).value;

    //Aciona a geração do Token, caso tenha expirado
    this.generateToken();

    //console.log("Saiu do campo CNPJ, foi digitado: " + cnpjValue);

    //Zera os campos de nome e eMail
    (document.getElementById("name") as HTMLInputElement).value = "";
    (document.getElementById("email") as HTMLInputElement).value = "";

    //Monta o header da requisição
    var httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':   'application/json',
      'Authorization':  'Bearer ' + this.bearerToken
    })};

    //Realiza um Get no Protheus para buscar a transportadora
    this.http.get<any>('http://127.0.0.1:8400/rest/zWsTransport/get_id?id=' + cnpjValue, httpOptions).subscribe({
      next: (v) => {
        (document.getElementById("name") as HTMLInputElement).value  = v.nome.trim();
        (document.getElementById("email") as HTMLInputElement).value = v.email.trim();
      },
      error: (e) => {
        console.error("Falha buscar a Transportadora: " + e.status + " - " + e.statusText)
        this.snackbar.open("Falha ao buscar a Transportadora, contate o Administrador (fecha em 3s)", 'Fechar', {duration: 3000});
      },
      complete: () => {
        console.log('Busca da Transportadora Completa');
        this.snackbar.open("Busca da Transportadora efetuada com sucesso (fecha em 3s)", 'Fechar', {duration: 3000});
      }

    });
  }

  //Botão Confirmar
  clickedOnConfirm(): void {
    //Captura valores da tela
    var cnpjValue  = (document.getElementById("cnpj") as HTMLInputElement).value;
    var nameValue  = (document.getElementById("name") as HTMLInputElement).value;
    var emailValue = (document.getElementById("email") as HTMLInputElement).value;

    //Aciona a geração do Token, caso tenha expirado
    this.generateToken();

    //Define na Interface
    this.shippingValues.cnpj  = cnpjValue;
    this.shippingValues.name  = nameValue;
    this.shippingValues.email = emailValue;

    //Exibe a mensagem
    //alert("Clicou no Confirmar: \n CNPJ: " + cnpjValue+ " \n Nome: " + nameValue + " \n eMail: " + emailValue);
    //alert("Clicou no Confirmar: \n CNPJ: " + this.shippingValues.cnpj+ " \n Nome: " + this.shippingValues.name + " \n eMail: " + this.shippingValues.email);

    //Monta o header da requisição
    var httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':   'application/json',
      'Authorization':  'Bearer ' + this.bearerToken
    })};

    //Monta os parâmetros do body
    var httpBody = {
      "cgc": this.shippingValues.cnpj,
      "nome": this.shippingValues.name,
      "email": this.shippingValues.email
    };

    //Realiza um Post no Protheus para atualizar novas informações na Transportadora (seja inclusão ou alteração)
    this.http.post<any>('http://127.0.0.1:8400/rest/zWsTransport/new', httpBody, httpOptions).subscribe({
      next: (v) => {
        this.clickedOnClear();
      },
      error: (e) => {
        console.error("Falha na gravação da Transportadora: " + e.status + " - " + e.statusText)
        this.snackbar.open("Falha na gravação da Transportadora, contate o Administrador (fecha em 3s)", 'Fechar', {duration: 3000});
      },
      complete: () => {
        console.log('Gravação da Transportadora Completa');
        this.snackbar.open("Transportadora gravada com sucesso (fecha em 3s)", 'Fechar', {duration: 3000});
      }

    });
  }

  //Botão Limpar
  clickedOnClear(): void {
    (document.getElementById("cnpj") as HTMLInputElement).value = "";
    (document.getElementById("name") as HTMLInputElement).value = "";
    (document.getElementById("email") as HTMLInputElement).value = "";
  }
}
