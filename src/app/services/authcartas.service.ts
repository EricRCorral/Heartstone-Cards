import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { CartaModel } from '../models/carta.model';

// Servicio AuthFireBase

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:sign';
  private apikey = 'AIzaSyCyaaZpKjW2pNikubr226xNqK1VPgBm_tw';

  constructor(private http: HttpClient) {
    this.leerToken();
   }

  userToken: string;

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('emailCreador');
  }

  login(usuario: UsuarioModel) {

    const authData = {

      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };
    return this.http.post(
      `${this.url}InWithPassword?key=${this.apikey}`, authData).pipe(
        map( resp => {
          this.guardarToken( resp['idToken']);
          return resp;
        }));

  }

  nuevoUsuario(usuario: UsuarioModel) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };
    return this.http.post(
      `${this.url}Up?key=${this.apikey}`, authData
    ).pipe(
      map( resp => {
        this.guardarToken( resp['idToken']);
        return resp;
      }));

  }

  private guardarToken(idToken: string) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    const hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {

    if (localStorage.getItem('token')) {

      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
   }
  }

// Servicio Cartas

@Injectable({
    providedIn: 'root'
  })

export class CartasService {

    private url = 'https://login-app-38e79.firebaseio.com';

     constructor(private http: HttpClient) { }

     crearCarta( carta: CartaModel ) {

       return this.http.post(`${this.url}/cartas.json` , carta).pipe( map ( (resp: any) => {
         carta.id = resp.name;
         return carta;
       } ) );
     }

     actualizarCarta(carta: CartaModel) {

       const cartaTemp = {
         ...carta
       };
       delete cartaTemp.id;

       return this.http.put(`${this.url}/cartas/${carta.id}.json` , cartaTemp);
     }

     borrarCarta(id: string) {
       return this.http.delete(`${this.url}/cartas/${id}.json`);
     }

     getCarta(id: string) {
       return this.http.get(`${this.url}/cartas/${id}.json`);
     }

    getCartas() {
     return this.http.get(`${this.url}/cartas.json`).pipe ( map (this.crearArreglo));
   }

   private crearArreglo(cartasObj: object) {

     const cartas: CartaModel[] = [];

     if (cartasObj === null) {return []; }

     Object.keys( cartasObj ).forEach( key => {

       const carta: CartaModel = cartasObj[key];

       carta.id = key;

       cartas.push(carta);
     });

     return cartas;
   }
   }
