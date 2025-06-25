import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeService } from '../../services/be/be.service';

@Component({
  selector: 'app-reg-search',
  standalone: false,
  templateUrl: './reg-search.component.html',
  styleUrl: './reg-search.component.scss',
})
export class RegSearchComponent {
  myPsData: any;
  dataFiltred: any;
  text: string = '';
  filteredData: any[][] = [];

  searchValue: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private beService: BeService
  ) {
    this.myPsData = data.lists;
    this.filteredData = this.myPsData;
  }

  //download fucntion
  download(id: string) {
    console.log(id);
    this.beService.getRegPdf(id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.pdf`; // ou un nom personnalisé si tu veux
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement :', error);
      }
    );
  }

  // Méthode de filtre appelée à chaque saisie
  filterData() {
    this.filteredData = this.myPsData;
    const term = this.searchValue.toLowerCase().trim();

    if (!term) {
      this.filteredData = [...this.myPsData];
      return;
    }

    /*this.filteredData = this.myPsData.filter((item: any) =>
      item.some(
        (field: any) => field && field.toString().toLowerCase().includes(term)
      )
    );*/
    this.filteredData = this.myPsData.filter((item: any) =>
      item[2]?.toString().toLowerCase().includes(term)
    );
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    const pad = (n: number): string => n.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // les mois commencent à 0
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
