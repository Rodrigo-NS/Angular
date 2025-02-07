import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

// Importando a biblioteca do Protheus
import { ProtheusLibCoreModule, ProAppConfigService } from '@totvs/protheus-lib-core';

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

  token: string | null = null;
  apiBaseUrl: string = '';

  constructor(private proAppConfigService: ProAppConfigService, private http: HttpClient, private router: Router) {   
  }

  ngOnInit() {
    // Tenta obter a URL da API do sessionStorage ou define um valor padrão
    this.apiBaseUrl = this.getApiBaseUrl();
    console.log('API Base URL:', this.apiBaseUrl);

    // Autentica o usuário e obtém o token
    this.authenticateUser();
  }

  /**
   * Obtém a URL base da API de forma segura
   */
  private getApiBaseUrl(): string {
    try {
      // Tenta carregar a configuração da aplicação
      this.proAppConfigService.loadAppConfig();

      // Tenta pegar a URL do sessionStorage
      const config = sessionStorage.getItem('PROAPP_CONFIG');
      if (config) {
        const parsedConfig = JSON.parse(config);
        return parsedConfig.api_baseUrl || 'http://localhost:8081/rest'; // Valor padrão
      }
    } catch (error) {
      console.error('Erro ao obter API Base URL:', error);
    }
    return 'http://localhost:8081/rest'; // URL padrão caso falhe
  }

  /**
   * Autentica o usuário no Protheus via API REST e armazena o token
   */
  private authenticateUser() {
    const username = 'rodrigo';
    const password = '01';
    const tokenUrl = `${this.apiBaseUrl}/api/oauth2/v1/token?grant_type=password&password=${password}&username=${username}`;


    this.http.post<any>(tokenUrl, {}).subscribe({
      next: (response) => {
        this.token = response.access_token;

        // Armazena o token no sessionStorage
        sessionStorage.setItem("ERPTOKEN", JSON.stringify(response));

        console.log('Token armazenado:', this.token);
      },
      error: (err: any) => {
        console.error('Erro ao autenticar:', err);
      }
    });
  }

  /**
   * Define os menus principais da aplicação
   */
  readonly menus: Array<PoMenuItem> = [
    { label: 'Cadastro do Grupo', action: this.browseClick.bind(this), icon: 'po-icon-clipboard', shortLabel: 'Cadastro' },
    { label: 'Ajuda (Help)',      action: this.aboutClick.bind(this),  icon: 'po-icon-help',      shortLabel: 'Ajuda' },
    { label: 'Sair',              action: this.closeApp.bind(this),    icon: 'po-icon-exit',      shortLabel: 'Sair' }
  ];

  // Navegação para a página de cadastro de grupo
  private browseClick() {
    this.router.navigate(['/', 'browse']);
  }

  // Navegação para a página de ajuda
  private aboutClick() {
    this.router.navigate(['/', 'about']);
  }

  // Ao clicar no botão "Sair", verifica se está dentro do Protheus
  private closeApp() {
    if (this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.callAppClose();
    } else {
      alert("Clique não veio do Protheus");
    }
  }
}
