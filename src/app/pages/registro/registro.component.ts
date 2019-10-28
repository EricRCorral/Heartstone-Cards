import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/authcartas.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;


  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {

    this.usuario = new UsuarioModel();

    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
   }
   onSubmit(form: NgForm) {
    if (form.invalid) {return; }
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.auth.nuevoUsuario(this.usuario).subscribe(
      resp => {Swal.fire({
        title: this.usuario.nombre,
        text: 'Se ha creado correctamente',
        type: 'success',
        allowOutsideClick: false,
        showConfirmButton: false,
      });
               if (this.recordarme) {
          localStorage.setItem('email', this.usuario.email);
        }
               setTimeout(() => {
          Swal.close();
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (err) => {
        Swal.fire({
          type: 'error',
          title: 'Error al registrar',
          text: err.error.error.message
        });
      }
    ) ;
   }
   borrarEmail() {
    if (this.recordarme === true) {
      localStorage.removeItem('email');
    }
  }
}
