import { Component, Inject, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeService } from '../../services/be/be.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-be-data',
  standalone: false,
  templateUrl: './be-data.component.html',
  styleUrl: './be-data.component.scss',
})
export class BeDataComponent {
  myBeData: any;
  dataFiltred: any;
  text: string = '';
  filteredData: any[][] = [];

  searchValue: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private beService: BeService
  ) {
    this.myBeData = data.lists;
    this.filteredData = this.myBeData;
  }

  //download fucntion
  download(id: string) {
    this.beService.getPsPdf(id).subscribe(
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
    this.filteredData = this.myBeData;
    const term = this.searchValue.toLowerCase().trim();

    if (!term) {
      this.filteredData = [...this.myBeData];
      return;
    }

    /*this.filteredData = this.myPsData.filter((item: any) =>
      item.some(
        (field: any) => field && field.toString().toLowerCase().includes(term)
      )
    );*/
    this.filteredData = this.myBeData.filter((item: any) =>
      item[4]?.toString().toLowerCase().includes(term)
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
