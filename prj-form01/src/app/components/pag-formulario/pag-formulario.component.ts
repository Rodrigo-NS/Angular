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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pag-formulario',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, MatSnackBarModule, FormsModule],
  templateUrl: './pag-formulario.component.html',
  styleUrl: './pag-formulario.component.scss'
})

export class PagFormularioComponent implements OnInit {
  // URL do servidor
  private readonly endServer: string = 'http://localhost:8081';

  // Dados de autenticação no Protheus
  private readonly user: string = 'rodrigo';
  private readonly pass: string = 'MDE='; //senha em base64
  private bearerToken: string = '';
  private lastTime: number = new Date().getTime();
  name: string = '';

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
     this.generateToken();
  }


  // Método para gerar o token de autenticação
  generateToken() {
  // Decodifica a senha de Base64 para UTF-8
  const passDecode = Buffer.from(this.pass, 'base64').toString('utf-8');
  const minutesTst = 2400000; // 40 minutos em milissegundos
  const currentTime = new Date().getTime();

  if (!this.bearerToken || currentTime > this.lastTime + minutesTst) {
    const url = `${this.endServer}/rest/api/oauth2/v1/token?grant_type=password&password=${passDecode}&username=${this.user}`;
    this.http.post<any>(url, {}).subscribe({
      next: (v) => {
        this.bearerToken = v.access_token;
        this.lastTime = new Date().getTime();
      },
      error: (e) => {
        console.error(`Falha ao gerar o Bearer: ${e.status} - ${e.statusText}`);
        this.snackbar.open('Falha ao gerar o Bearer, contate o Administrador (fecha em 3s)', 'Fechar', { duration: 3000 });
      },
      complete: () => {
        console.log('Busca do Bearer Completa');
      }
    });
  }
}


  // Método para validar o CNPJ
    validCNPJInput() {
    const cnpjInput = document.getElementById('cnpj') as HTMLInputElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;

    const cnpjValue = cnpjInput.value.trim();

    //Aciona a geração do Token, caso tenha expirado
    this.generateToken();

    // Limpa os campos de nome e e-mail
    //nameInput.value = '';
    //emailInput.value = '';

    // Codifica as credenciais em Base64
    //const credentials = btoa(`${this.user}:${this.pass}`);

    // Monta os cabeçalhos da requisição
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.bearerToken
      })
    };

    // Realiza a requisição GET para buscar a transportadora
    const url = `${this.endServer}/rest/zWsTransport/get_id?id=${cnpjValue}`;
    console.log(url);
    this.http.get<any>(url, httpOptions).subscribe({
      next: (response) => {
        nameInput.value = response.nome?.trim() || '';
        emailInput.value = response.email?.trim() || '';
      },
      error: (error) => {
        console.error(`Falha ao buscar a Transportadora: ${error.status} - ${error.statusText}`);
        this.snackbar.open('Falha ao buscar a Transportadora, contate o Administrador (fecha em 3s)', 'Fechar', { duration: 3000 });
      },
      complete: () => {
        console.log('Busca da Transportadora Completa');
        this.snackbar.open('Busca da Transportadora efetuada com sucesso (fecha em 3s)', 'Fechar', { duration: 3000 });
      }
    });
  }

  // Método chamado ao clicar no botão Confirmar
  clickedOnConfirm() {
    const cnpjValue = (document.getElementById('cnpj') as HTMLInputElement).value;
    const nameValue = (document.getElementById('name') as HTMLInputElement).value;
    const emailValue = (document.getElementById('email') as HTMLInputElement).value;

    // Gera o token de autenticação, se necessário
    this.generateToken();

    // Monta os cabeçalhos da requisição
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.bearerToken}`
      })
    };

    // Monta os parâmetros do corpo da requisição
    const httpBody = {
      cgc: cnpjValue,
      nome: nameValue,
      email: emailValue
    };

    // Realiza um POST no Protheus para atualizar as informações da Transportadora
    const url = `${this.endServer}/rest/zWsTransport/new`;
    this.http.post<any>(url, httpBody, httpOptions).subscribe({
      next: () => {
        this.clickedOnClear();
      },
      error: (e) => {
        console.error(`Falha na gravação da Transportadora: ${e.status} - ${e.statusText}`);
        this.snackbar.open('Falha na gravação da Transportadora, contate o Administrador (fecha em 3s)', 'Fechar', { duration: 3000 });
      },
      complete: () => {
        console.log('Gravação da Transportadora Completa');
        this.snackbar.open('Transportadora gravada com sucesso (fecha em 3s)', 'Fechar', { duration: 3000 });
      }
    });
  }

  // Método chamado ao clicar no botão Limpar
  clickedOnClear() {
    (document.getElementById('cnpj') as HTMLInputElement).value = '';
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('email') as HTMLInputElement).value = '';
  }
}
