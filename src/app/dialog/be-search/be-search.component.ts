import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeService } from '../../services/be/be.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-be-search',
  standalone: false,
  templateUrl: './be-search.component.html',
  styleUrl: './be-search.component.scss',
})
export class BeSearchComponent implements OnInit {
  myPsData: any;
  dataFiltred: any;
  text: string = '';
  filteredData: any[] = [];
  searchValue: string = '';
  
  // Variables de pagination
  currentPage: number = 1;
  pageSize: number = 25;
  totalRecords: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  
  Math = Math

  // Subject pour gérer le debounce de recherche
  private searchSubject = new Subject<string>();
  
  constructor(private beService: BeService) {
    // Configuration du debounce pour la recherche
    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged() // Éviter les doublons
    ).subscribe(searchTerm => {
      this.currentPage = 1; // Réinitialiser à la première page
      this.loadData();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.searchValue
    };
    this.beService.getAllBE(params).subscribe((result: any) => {
      if (result && result.message) {
        this.myPsData = result.data;
        this.filteredData = result.data;
        // Mettre à jour les informations de pagination
        if (result.pagination) {
          this.totalRecords = result.pagination.total_records;
          this.totalPages = result.pagination.total_pages;
          this.currentPage = result.pagination.current_page;
        }
        console.log('Données chargées:', this.filteredData);
        console.log('Pagination:', result.pagination);
      }
      this.isLoading = false;
    }, (error) => {
      console.error('Erreur lors du chargement des données:', error);
      this.isLoading = false;
    });
  }

  // Méthode de filtre appelée à chaque saisie
  filterData() {
    this.searchSubject.next(this.searchValue);
  }

  // Méthodes de navigation pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }

  goToPrevPage() {
    this.goToPage(this.currentPage - 1);
  }

  // Générer les numéros de pages à afficher
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxPagesToShow - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Changer la taille de page
  onPageSizeChange(event: any) {
    this.pageSize = event.value;
    this.currentPage = 1;
    this.loadData();
  }

  //download function
  download(id: string) {
    this.beService.getBePdf(id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.pdf`;
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const pad = (n: number): string => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}