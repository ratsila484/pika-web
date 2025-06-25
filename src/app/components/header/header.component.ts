import { Component, input, output, Output } from '@angular/core';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  page = output<string>();
  bePage(){
    this.page.emit("BE");
  }

  psPage(){
    this.page.emit("PS");
  }

  enregPage(){
    this.page.emit("REG");
  }

  archivePage(){
    this.page.emit("archives");
  }

  statPage(){
    this.page.emit("stat");
  }

  accueilPage(){
    this.page.emit("accueil");
  }
  
}
