import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartasService } from '../../services/authcartas.service';

import { CartaModel } from '../../models/carta.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
})
export class CartaComponent implements OnInit {

  carta = new CartaModel();

  constructor(private cartasServices: CartasService,
              private route: ActivatedRoute,
              private router: Router) { }

   ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      this.cartasServices.getCarta( id ).subscribe((resp: CartaModel) => {
         this.carta = resp;
         this.carta.id = id;

         for (let i = 0; i < this.carta.emailEditores.length; i++) {
         if (this.carta.emailEditores.includes(localStorage.getItem('emailEditores'), i)) {
            return this.carta.emailEditores; } else {
              return this.carta.emailEditores.push(`${localStorage.getItem('emailEditores')}`);
        }
         }
          });
        } else {this.carta.emailEditores.push(`${localStorage.getItem('emailEditores')}`);
        }
      }

  guardar(form: NgForm) {

    if (form.invalid) { return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando cambios',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;


    if (this.carta.id) {
      peticion = this.cartasServices.actualizarCarta(this.carta);
      } else {
    peticion = this.cartasServices.crearCarta(this.carta);
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.carta.nombre,
        text: 'Se actualizo correctamente',
        type: 'success',
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      setTimeout(() => {
        Swal.close();
        this.router.navigateByUrl('cartas');
      }, 2000);
    });

 }

}
