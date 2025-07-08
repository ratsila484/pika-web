import { NgModule } from '@angular/core';
import { RouterModule, RouterState, Routes } from '@angular/router';
import { BeComponent } from './components/be/be.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './main/main.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'be',
    component: BeComponent
  },
  {
    path: 'signIn',
    component: SignInComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
