import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BeService } from '../../services/be/be.service';
import { hrtime } from 'process';
import { MatDialog } from '@angular/material/dialog';
import { NotApprovedCptComponent } from '../../dialog/not-approved-cpt/not-approved-cpt.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  identfiant!: string;
  constructor(
    private beService: BeService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private plateformId: Object
  ) {
    
  }

  identifiant!: string;
  password!: string;
  isError: boolean = true;
  login() {
    if (this.identifiant && this.password) {
      const data = {
        id: this.identifiant,
        password: this.password,
      };
      this.beService.logIn(data).subscribe((result: any) => {
        if (result.success) {
          console.log(result.login_user[0]);
          const id = result.login_user[0].id;
          const nom = result.login_user[0].nom;
          const state = result.login_user[0].state;
          this.isError = true;
          const approved_cpt = result.login_user[0].approved;
          const approved_be = result.login_user[0].approved_be;
          const approved_cf = result.login_user[0].approved_cf;
          window.localStorage.setItem(
            'connected_user',
            id +
              '/' +
              nom +
              '/' +
              state +
              '/' +
              approved_cpt +
              '/' +
              approved_be +
              '/' +
              approved_cf
          );
          if (approved_cpt == '1') {
            window.location.href = 'main';
          } else {
            this.dialog.open(NotApprovedCptComponent, {
              data: {
                title: 'Veuillez patientez',
                message:
                  "Votre compte est en attente d'aprobation à un administrateur  ",
              },
            });
          }
        } else {
          console.log(result.error);
          this.isError = false;
        }
      });
    }
  }

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.plateformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.plateformId)) {
      localStorage.setItem(key, value);
    }
  }
}
