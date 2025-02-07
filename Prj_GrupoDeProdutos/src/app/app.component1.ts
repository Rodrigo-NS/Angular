import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
    ProtheusLibCoreModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  private readonly apiUrl = 'http://localhost:8081/rest/api/oauth2/v1/token';
  private readonly username = 'UWS01'; //usuario web service
  private readonly password = 'api';  //senha de acesso

  constructor(private proAppConfigService: ProAppConfigService, private router: Router, private http: HttpClient ) {
    // Se não estiver dentro do Protheus, carrega configurações e autentica
    if (!this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.loadAppConfig();
      sessionStorage.setItem("insideProtheus", "0");

      // Busca o token de forma dinâmica
      this.fetchToken();
    } else {
      sessionStorage.setItem("insideProtheus", "1");
    }
  }

  ngOnInit(): void {}

  // Método para buscar o Token dinamicamente da API
  private fetchToken(): void {
    const authUrl = `${this.apiUrl}?grant_type=password&username=${this.username}&password=${this.password}`;

    this.http.post<any>(authUrl, {}).subscribe({
      next: (response) => {
        if (response.access_token) {
          console.log("Token obtido com sucesso!");
          
          // Salva o token obtido no sessionStorage
          sessionStorage.setItem("ERPTOKEN", JSON.stringify({
            access_token: response.access_token,
            scope: response.scope,
            token_type: response.token_type,
            expires_in: response.expires_in
          }));
        } else {
          console.error("Erro: Token retornado está vazio.");
        }
      },
      error: (err) => {
        console.error("Erro ao obter token da API:", err);
      }
    });
  }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Cadastro do Grupo', action: this.browseClick.bind(this), icon: 'po-icon-clipboard', shortLabel: 'Cadastro' },
    { label: 'Ajuda (Help)',      action: this.aboutClick.bind(this),  icon: 'po-icon-help',      shortLabel: 'Ajuda' },
    { label: 'Sair',              action: this.closeApp.bind(this),    icon: 'po-icon-exit',      shortLabel: 'Sair' }
  ];

  //Ao clicar no Cadastro
  private browseClick() {
    this.router.navigate(['/', 'browse']);
  }

  //Ao clicar no Sobre
  private aboutClick() {
    this.router.navigate(['/', 'about']);
  }

  //Ao clicar no Sair
  private closeApp() {
    if (this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.callAppClose();
    } else {
      alert("Clique não veio do Protheus");
    }
  }
}
