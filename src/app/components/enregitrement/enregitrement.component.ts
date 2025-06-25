import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  BeService,
  BeFormData,
  RegFormData,
} from '../../services/be/be.service';
import { TemplateType, ActiviteType } from '../../models/interfaces';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { BeDataComponent } from '../../bottom-sheet/dialog/be-data.component';
import { PdfViewerComponent } from '../../dialog/pdf-viewer/pdf-viewer.component';
import { PdfViewerEnregComponent } from '../../dialog/pdf-viewer-enreg/pdf-viewer-enreg.component';
import { RegSearchComponent } from '../../dialog/reg-search/reg-search.component';

@Component({
  selector: 'app-enregitrement',
  standalone: false,
  templateUrl: './enregitrement.component.html',
  styleUrl: './enregitrement.component.scss',
})
export class EnregitrementComponent {
  activites: string[] = [
    'Bonification',
    'Avancement',
    'Reclassement indiciaire',
    'Majoration indiciaire',
    'Nomination',
    'Reclassement par diplôme',
    'Titularisation',
    'Admission à la retraite',
    'Autorisation de sortie',
    'Départ en stage',
    'Intégration',
    'Révision de situation',
    'Renouvellement de contrat',
    'Avenant',
    'Radiation',
    'Accident de travail et Maladie Professionnel',
    'Immatriculation',
  ];

  ministeres: string[] = [
    'Ministère des Forces Armées',
    'Ministère des Affaires Étrangères',
    'Ministère de la Justice',
    'Ministère de la Décentralisation et de l’Aménagement du Territoire',
    'Ministère de l’Économie et des Finances',
    'Ministère de l’Intérieur',
    'Ministère de la Sécurité Publique:',
    'Ministère de l’Industrialisation et du Commerce',
    'Ministère de l’Agriculture et de l’Elevage',
    'Ministère de l’Enseignement Supérieur et de 0la Recherche Scientifique',
    'Ministère de l’Education Nationale',
    'Ministère de l’Enseignement Technique et de la Formation Professionnelle',
    'Ministère de la Santé Publique',
    'Ministère de la Population et des Solidarités',
    'Ministère du Tourisme et de l’Artisanat',
    'Ministère du Développement numérique, des Postes et des Télécommunications',
    'Ministère de l’Energie et des Hydrocarbures',
    'Ministère des Travaux Publics',
    'Ministère des Transports et de la Météorologie',
    'Ministère du Travail, de l’Emploi et de la Fonction Publique',
    'Ministère de l’Eau, de l’Assainissement et de l’Hygiène',
    'Ministère de la Pêche et de l’Economie Bleue',
    'Ministère des Mines',
    'Ministère de la Communication et de la Culture',
    'Ministère de la Jeunesse et des Sports',
    'Ministère de l’Environnement et du Développement Durable',
    'Ministère délégué en charge de la Gendarmerie Nationale',
    'Assemblée Nationale',
    'Sénat',
    'Présidence',
    'Primature',
    'Bianco',
    'Gendarmerie Nationale',
    'Imatep',
    "SENVH - Secrétariat d'Etat Charge des Nouvelles Villes et de l’Habitat",
    'Fofifa',
    'Enam',
    'Haute Cour Constitutionnelle',
    'Région Analamanga',
    'CFM, Conseil du Fampihavanana',
    'CSI - Conseil pour la Sauvegarde de l’Intégrité',
  ];

  sigleMinistere: string[] = [
    'MFA',
    'MAE',
    'MJ',
    'MDAT',
    'MEF',
    'MI',
    'MSecuP',
    'MIC',
    'MinAgri',
    'MESupReS',
    'MEN',
    'METFP',
    'MSANP',
    'MPopS',
    'MinTour',
    'MDPT',
    'MEH',
    'MTP',
    'MTM',
    'MTEFoP',
    'MEAH',
    'MPEB',
    'Mines',
    'MCC',
    'MJS',
    'MEDD',
    'Gendrm',
    'AN',
    'Sénat',
    'PRM',
    'SGG',
    'Bianco',
    'GN',
    'Imatep',
    'SENVH',
    'Fofifa',
    'Enam',
    'HCC',
    'REG',
    'CFM',
    'CSI',
  ];

  sigleActivite: string[] = [
    'bonif',
    'avance',
    'RI',
    'MJ',
    'Nomina',
    'Reclass',
    'Titul',
    'Retraite',
    'AS',
    'Dép stg',
    'IntégR',
    'Rev situ',
    'R.contR',
    'Avenant',
    'Radiation',
    'ATMP',
    'IMM',
  ];

  pour: string[] = ['ORD', 'Avant VISA', 'Après Visa', 'Signature'];

  dispatch: string[] = [
    'P008',
    'P016',
    'P116',
    'P201',
    'P203',
    'P204',
    'P205',
    'P206',
    'P207',
    'P208',
    'P214',
    'P215',
  ];

  pdfForm!: FormGroup;
  isLoading = false;
  backendStatus = false;
  temp!: string;
  regData: any;
  constructor(
    private fb: FormBuilder,
    private beService: BeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkBackendConnection();
  }

  private initializeForm(): void {
    this.pdfForm = this.fb.group({
      nombreConsorts: [
        null,
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
      consorts: this.fb.array([]),
      transmise: null,
    });
  }

  private checkBackendConnection(): void {
    this.beService.checkBackendStatus().subscribe({
      next: (status) => {
        this.backendStatus = status;
        if (status) {
          this.showSnackBar('Connexion au serveur établie', 'success');
        }
      },
      error: (error) => {
        this.backendStatus = false;
        this.showSnackBar('Erreur de connexion au serveur', 'error');
        console.error('Erreur de connexion:', error);
      },
    });
  }

  get consortsArray(): FormArray {
    return this.pdfForm.get('consorts') as FormArray;
  }

  onNombreChange(): void {
    const nombre = this.pdfForm.get('nombreConsorts')?.value || 0;
    const consorts = this.consortsArray;

    // Validation du nombre
    if (nombre > 50) {
      this.pdfForm.get('nombreConsorts')?.setValue(50);
      this.showSnackBar('Nombre maximum de consorts: 50', 'warning');
      return;
    }

    if (nombre < 0) {
      this.pdfForm.get('nombreConsorts')?.setValue(0);
      return;
    }

    // Ajuster le FormArray
    while (consorts.length < nombre) {
      consorts.push(this.createConsortGroup());
    }
    while (consorts.length > nombre) {
      consorts.removeAt(consorts.length - 1);
    }
  }

  private createConsortGroup(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      matricule: ['', [Validators.required, this.matriculeValidator]],
      numeroReg: [null, Validators.required],
      activite: [null, Validators.required],
      ministere: [null, Validators.required],
      pour: [null, Validators.required],
      dispatch: [null, Validators.required],
    });
  }

  private matriculeValidator(
    control: FormControl
  ): { [key: string]: any } | null {
    if (!control.value) return null;

    const cleaned = control.value.replace(/\D/g, '');
    if (cleaned.length !== 6) {
      return { matriculeLength: true };
    }
    return null;
  }

  onCodeInput(index: number): void {
    const group = this.consortsArray.at(index);
    const control = group.get('matricule');

    if (control) {
      let raw = control.value.replace(/\D/g, '');
      if (raw.length > 6) raw = raw.substring(0, 6);

      // Format en XXX XXX
      let formatted = '';
      for (let i = 0; i < raw.length; i += 3) {
        if (i > 0) formatted += ' ';
        formatted += raw.substring(i, i + 3);
      }

      control.setValue(formatted, { emitEvent: false });
    }
  }

  generateNumero(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const lastSaved = localStorage.getItem('lastYear');
    let count = parseInt(localStorage.getItem('count') || '0', 10);

    if (lastSaved !== year) {
      count = 1;
    } else {
      count += 1;
    }

    localStorage.setItem('lastYear', year);
    localStorage.setItem('count', count.toString());

    const padded = count.toString().padStart(3, '0');
    return `${year}-${padded}`;
  }

  exportPdf(): void {
    if (!this.backendStatus) {
      this.showSnackBar(
        'Serveur non accessible. Vérifiez la connexion.',
        'error'
      );
      return;
    }

    if (!this.pdfForm.valid) {
      this.showSnackBar('Veuillez remplir tous les champs requis', 'warning');
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    const formData: RegFormData = {
      ...this.pdfForm.value,
      numero_document: this.generateNumero(),
      date_document: new Date().toLocaleDateString('fr-FR'),
    };

    console.log('Données à exporter:', formData);

    this.beService.sendDataReg(formData).subscribe({
      next: (pdfBlob) => {
        this.isLoading = false;
        this.beService.downloadPdf(
          pdfBlob,
          `bordereau_${formData.numero_document?.replace('-', '_')}.pdf`
        );
        this.showSnackBar('PDF généré avec succès', 'success');
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Erreur lors de l'export PDF:", error);
        this.showSnackBar(`Erreur: ${error.message}`, 'error');
      },
    });
  }

  showPdf(): void {
    if (!this.backendStatus) {
      this.showSnackBar(
        'Serveur non accessible. Vérifiez la connexion.',
        'error'
      );
      return;
    }

    if (!this.pdfForm.valid) {
      this.showSnackBar('Veuillez remplir tous les champs requis', 'warning');
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    const formData: RegFormData = {
      ...this.pdfForm.value,
      numero_document: this.generateNumero(),
      date_document: new Date().toLocaleDateString('fr-FR'),
    };

    const numDoc = formData.numero_document;
    console.log('Données à exporter:', formData);

    this.beService.sendDataReg(formData).subscribe({
      next: (pdfBlob) => {
        this.isLoading = false;
        this.beService.getPdf(pdfBlob);
        this.showSnackBar('PDF généré avec succès', 'success');
        this.openShowPdf(pdfBlob, formData);
        //this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Erreur lors de l'export PDF:", error);
        this.showSnackBar(`Erreur: ${error.message}`, 'error');
      },
    });
  }

  openShowPdf(pdfBlob: Blob, data: RegFormData) {
    const dialogRef = this.dialog.open(PdfViewerEnregComponent, {
      width: '90%',
      data: {
        pdfBlob: pdfBlob,
        donnee: data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.resetForm();
      }
    });
  }

  testConnection(): void {
    this.isLoading = true;

    this.beService.testConnection().subscribe({
      next: (pdfBlob) => {
        this.isLoading = false;
        this.beService.downloadPdf(pdfBlob, 'test_bordereau.pdf');
        this.showSnackBar('Test réussi - PDF téléchargé', 'success');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors du test:', error);
        this.showSnackBar(`Erreur de test: ${error.message}`, 'error');
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.pdfForm.controls).forEach((key) => {
      const control = this.pdfForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((group) => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach((subKey) => {
              group.get(subKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.pdfForm.reset();
    while (this.consortsArray.length > 0) {
      this.consortsArray.removeAt(0);
    }
  }

  private showSnackBar(
    message: string,
    type: 'success' | 'error' | 'warning' = 'success'
  ): void {
    const config = {
      duration: 4000,
      panelClass: [`snackbar-${type}`],
    };

    this.snackBar.open(message, 'Fermer', config);
  }

  // Getters pour les erreurs de validation
  get templateError(): string | null {
    const control = this.pdfForm.get('template');
    if (control?.errors && control.touched) {
      return 'Veuillez sélectionner un template';
    }
    return null;
  }

  get activiteError(): string | null {
    const control = this.pdfForm.get('activite');
    if (control?.errors && control.touched) {
      return 'Veuillez sélectionner une activité';
    }
    return null;
  }

  get nombreConsortsError(): string | null {
    const control = this.pdfForm.get('nombreConsorts');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Nombre requis';
      if (control.errors['min']) return 'Minimum 1 consort';
      if (control.errors['max']) return 'Maximum 50 consorts';
    }
    return null;
  }

  getConsortNomError(index: number): string | null {
    const control = this.consortsArray.at(index)?.get('nom');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Nom requis';
      if (control.errors['minlength']) return 'Nom trop court';
    }
    return null;
  }

  getConsortMatriculeError(index: number): string | null {
    const control = this.consortsArray.at(index)?.get('matricule');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Matricule requis';
      if (control.errors['matriculeLength'])
        return 'Matricule doit contenir 6 chiffres';
    }
    return null;
  }

  openBottomSheet() {
    this.beService.getAllReg().subscribe((response: any) => {
      this.regData = response.data;
      console.log(this.regData);
      this.dialog.open(RegSearchComponent, {
        minWidth: '70vw',
        minHeight: '400px',
        data: {
          lists: this.regData,
        },
      });
    });
  }
}
