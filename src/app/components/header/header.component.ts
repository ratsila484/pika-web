import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, output, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  identifiant!: string;
  user_state!: string;
  ngOnInit(): void {
    const tmp = this.getItem('connected_user')?.split('/');
    if (isPlatformBrowser(this.plateformId)) {
      if (tmp) {
        this.identifiant = tmp[1];
        this.user_state = tmp[2];
      } else {
        window.location.href = '';
      }
    }

    console.log(this.identifiant);
  }

  constructor(@Inject(PLATFORM_ID) private plateformId: Object) {}
  page = output<string>();

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
  bePage() {
    this.page.emit('BE');
  }

  psPage() {
    this.page.emit('PS');
  }

  enregPage() {
    this.page.emit('REG');
  }

  archivePage() {
    this.page.emit('archives');
  }

  statPage() {
    this.page.emit('stat');
  }

  accueilPage() {
    this.page.emit('accueil');
  }

  deconnexion() {
    localStorage.removeItem('connected_user');
    window.location.href = 'http://localhost:4200/login';
  }

  autorisation(){
    this.page.emit('autorisation')
  }

  
}
