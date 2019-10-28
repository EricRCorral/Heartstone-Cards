import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/authcartas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

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

  login( form: NgForm) {
    if (form.invalid) {return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: ' Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(
      resp => {

        Swal.close();

        localStorage.setItem('emailEditores' , this.usuario.email);

        if (this.recordarme) {
          localStorage.setItem('email', this.usuario.email);
        }
        this.router.navigateByUrl('/cartas');
      },
      (err) => {
        Swal.fire({
          type: 'error',
          title: 'Error al ingresar ',
          text: err.error.error.message
        });
      }
    );
  }

  borrarEmail() {
    if (this.recordarme === true) {
      localStorage.removeItem('email');
    }
  }

}
