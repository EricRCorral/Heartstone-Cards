import { Component, OnInit } from '@angular/core';
import { CartasService, AuthService } from '../../services/authcartas.service';
import { Router } from '@angular/router';

import { CartaModel } from '../../models/carta.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-carta',
  templateUrl: './cartas.component.html',
})
export class CartasComponent implements OnInit {

  carta: CartaModel [] = [] ;

  cargando = false;

  constructor(private cartasService: CartasService,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {

    this.cargando = true;

    this.cartasService.getCartas().subscribe( resp => {
      this.carta = resp;

      this.cargando = false;
    });
  }

  borrarCarta(carta: CartaModel , i: number) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: ` Esta seguro que desea borrar a ${ carta.nombre }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
    }).then( resp => {
      if (resp.value) {
        this.carta.splice( i , 1 );
        this.cartasService.borrarCarta(carta.id).subscribe();
      }
    });

  }
  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }


}
