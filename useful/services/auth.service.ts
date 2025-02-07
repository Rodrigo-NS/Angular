import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = 'http://localhost:8081/rest/api/oauth2/v1/token';
  private readonly username = 'rodrigo';
  private readonly password = '01';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // Método para obter o token da API
  authenticate(): Observable<any> {
    const url = `${this.authUrl}?grant_type=password&password=${this.password}&username=${this.username}`;

    return this.http.post<any>(url, {}).pipe(
      tap((response) => {
        this.token = response.access_token;
        sessionStorage.setItem('TOKEN', this.token  ?? ''); // Armazena o token na sessão
      })
    );
  }

  // Método para obter o token armazenado
  getToken(): string | null {
    return this.token || sessionStorage.getItem('TOKEN');
  }
}
