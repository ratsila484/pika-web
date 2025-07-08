import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  BarControllerChartOptions,
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
} from 'chart.js';
import { BeService } from '../../services/be/be.service';

interface DocumentBE {
  id: string;
  numero: string;
  fichier: string;
  activite: string;
  description: string;
  reference: string;
  date: string;
  ministere: string;
}

interface DocumentPS {
  id: string;
  numero: string;
  date: string;
  nom: string;
  reference: string;
  activite: string;
  description: string;
}

interface DocumentEnreg {
  id: string;
  titre: string;
  numero: string;
  ministere: string;
  activite: string;
  reference: string;
  code: string;
  type: string;
  date: string;
  fichier: string;
}

@Component({
  selector: 'app-statistique',
  standalone: false,
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.scss',
})
export class StatistiqueComponent {
  documentsPS: any[] = [];
  documentsBE: any[] = [];
  documentsEnreg: any[] = [];
  constructor(private beService: BeService) {}
  //exepmle de donnee
  // Données simulées basées sur vos exemples

  // Options de filtres
  documentTypes = ['Tous', 'BE', 'PS', 'ENREG'];
  activites: string[] = [];
  ministeres: string[] = [];

  // Filtres sélectionnés
  selectedDocumentType = 'Tous';
  selectedActivite = '';
  selectedMinistere = '';
  selectedDate: Date | null = null;

  // Configuration du graphique
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };

  public barChartOption: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statistiques des Documents',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Catégories',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Nombre de documents',
        },
        beginAtZero: true,
      },
    },
  };

  ngOnInit() {
    this.beService.getAllPsStat().subscribe((resultPs: any) => {
      this.beService.getAllBEStat().subscribe((resultBe: any) => {
        this.beService.getAllRegStat().subscribe((resultReg: any) => {
          this.documentsPS = resultPs.data;
          this.documentsBE = resultBe.data;
          this.documentsEnreg = resultReg.data;
          this.initializeFilters();
          this.updateChart();
        });
      });
    });
  }

  initializeFilters() {
    console.log(this.documentsPS)
    console.log(this.documentsBE)
    console.log(this.documentsEnreg)
    const activitesPS = this.documentsPS.map((doc) => doc.activite);
    const activitesBE = this.documentsBE.map((doc) => doc.activite);
    const activitesEnreg = this.documentsEnreg.map((doc) => doc.activite);

    this.activites = [
      'Tous',
      ...new Set([...activitesBE, ...activitesPS, ...activitesEnreg]),
    ];

    // Extraire tous les ministères uniques
    const ministeresEnreg = this.documentsEnreg.map((doc) => doc.ministere);

    this.ministeres = [
      'Tous',
      ...new Set([...ministeresEnreg]),
    ];
  }

  onFilterChange() {
    this.updateChart();
  }

  updateChart() {
    const filteredData = this.getFilteredData();

    if (this.selectedDocumentType === 'Tous') {
      this.createCombinedChart(filteredData);
    } else {
      this.createTypeSpecificChart(filteredData);
    }
  }

  getFilteredData() {
    let allDocs: any[] = [];

    if (
      this.selectedDocumentType === 'Tous' ||
      this.selectedDocumentType === 'BE'
    ) {
      allDocs = [
        ...allDocs,
        ...this.documentsBE.map((doc) => ({ ...doc, type: 'BE' })),
      ];
      console.log(allDocs)
    }
    if (
      this.selectedDocumentType === 'Tous' ||
      this.selectedDocumentType === 'PS'
    ) {
      allDocs = [
        ...allDocs,
        ...this.documentsPS.map((doc: any) => ({ ...doc, type: 'PS' })),
      ];
    }
    if (
      this.selectedDocumentType === 'Tous' ||
      this.selectedDocumentType === 'ENREG'
    ) {
      allDocs = [
        ...allDocs,
        ...this.documentsEnreg.map((doc) => ({ ...doc, type: 'ENREG' })),
      ];
    }

    // Appliquer les filtres
    return allDocs.filter((doc) => {
      let matches = true;

      if (this.selectedActivite && this.selectedActivite !== 'Tous') {
        matches = matches && doc.activite === this.selectedActivite;
      }

      if (this.selectedMinistere && this.selectedMinistere !== 'Tous') {
        matches = matches && doc.ministere === this.selectedMinistere;
      }

      if (this.selectedDate) {
        const docDate = new Date(doc.date);
        const filterDate = new Date(this.selectedDate);
        matches =
          matches &&
          docDate.getFullYear() === filterDate.getFullYear() &&
          docDate.getMonth() === filterDate.getMonth() &&
          docDate.getDate() === filterDate.getDate();
      }

      return matches;
    });
  }

  createCombinedChart(data: any[]) {
    // Graphique par type de document
    const typeCount = {
      BE: data.filter((d) => d.type === 'BE').length,
      PS: data.filter((d) => d.type === 'PS').length,
      ENREG: data.filter((d) => d.type === 'ENREG').length,
    };

    this.barChartData = {
      labels: Object.keys(typeCount),
      datasets: [
        {
          label: 'Nombre de documents',
          data: Object.values(typeCount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderWidth: 1,
        },
      ],
    };
  }

  createTypeSpecificChart(data: any[]) {
    if (
      this.selectedDocumentType === 'BE' ||
      this.selectedDocumentType === 'PS' ||
      this.selectedDocumentType === 'ENREG'
    ) {
      // Graphique par activité
      const activiteCount: { [key: string]: number } = {};
      data.forEach((doc) => {
        if (doc.activite) {
          activiteCount[doc.activite] = (activiteCount[doc.activite] || 0) + 1;
        }
      });

      this.barChartData = {
        labels: Object.keys(activiteCount),
        datasets: [
          {
            label: `Documents ${this.selectedDocumentType} par activité`,
            data: Object.values(activiteCount),
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1,
          },
        ],
      };
    }
  }

  createMinistereChart(data: any[]) {
    const ministereCount: { [key: string]: number } = {};
    data.forEach((doc) => {
      if (doc.ministere) {
        ministereCount[doc.ministere] =
          (ministereCount[doc.ministere] || 0) + 1;
      }
    });

    this.barChartData = {
      labels: Object.keys(ministereCount),
      datasets: [
        {
          label: 'Documents par ministère',
          data: Object.values(ministereCount),
          backgroundColor: '#FFCE56',
          borderColor: '#FFCE56',
          borderWidth: 1,
        },
      ],
    };
  }

  createDateChart(data: any[]) {
    const dateCount: { [key: string]: number } = {};
    data.forEach((doc) => {
      const date = new Date(doc.date);
      const dateKey = date.toLocaleDateString('fr-FR');
      dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
    });

    this.barChartData = {
      labels: Object.keys(dateCount),
      datasets: [
        {
          label: 'Documents par date',
          data: Object.values(dateCount),
          backgroundColor: '#FF9F40',
          borderColor: '#FF9F40',
          borderWidth: 1,
        },
      ],
    };
  }

  chartClicked(event: any) {
    console.log('Chart clicked:', event);
  }

  chartHovered(event: any) {
    console.log('Chart hovered:', event);
  }

  onSearch() {
    this.updateChart();
  }
}
