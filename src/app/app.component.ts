import { Component, input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  page:string = "";
  menuCliked(data:string){
    this.page = data;
    console.log(data);
  }
}
