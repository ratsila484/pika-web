import { Component } from '@angular/core';
import { BeService, User } from '../../services/be/be.service';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(private beService: BeService) {}
  id!: string;
  password!: string;
  confirmPassword!: string;

  submit() {
    const newUser = {
      id: this.id,
      password: this.password,
    };
    console.log(newUser);
    if (this.password == this.confirmPassword) {
      console.log(newUser);
      this.beService.singIn(newUser).subscribe((result: any) => {
        if (result.success) {
          console.log(result.message);
          window.location.href = '';
        }
      });
      console.log('Inscription réussie de ' + this.id + ' ' + this.password);
    }
  }
}
