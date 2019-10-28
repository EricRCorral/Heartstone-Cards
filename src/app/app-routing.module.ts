import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { CartasComponent } from './pages/cartas/cartas.component';
import { CartaComponent } from './pages/carta/carta.component';

const routes: Routes = [
  { path: 'cartas', component: CartasComponent, canActivate: [AuthGuard] },
  { path: 'carta/:id', component: CartaComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'login'   , component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
