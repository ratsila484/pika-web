import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { dataBe } from '../../models/interfaces';

export interface BeFormData {
  template: string;
  activite: string;
  nombreConsorts: number;
  consorts: Array<{
    nom: string;
    matricule: string;
  }>;
  numero_document?: string;
  date_document?: string;
  transmise?: string;
}

export interface SaveBe {
  template: string;
  activite: string;
  nombreConsorts: number;
  consorts: Array<{
    nom: string;
    matricule: string;
  }>;
  numero_document?: string;
  date_document?: string;
  transmise?: string;
}

export interface SavePs {
  activite: string;
  nombreConsorts: number;
  consorts: Array<{
    nom: string;
    matricule: string;
  }>;
  numero_document?: string;
  date_document?: string;
  pdf?: Blob;
}

export interface PsFormData {
  activite: string;
  nombreConsorts: number;
  consorts: Array<{
    nom: string;
    matricule: string;
  }>;
  numero_document?: string;
  date_document?: string;
}

export interface BeApiRequest {
  template: string;
  activite: string;
  numero_document: string;
  date_document: string;
  consorts: Array<{
    nom: string;
    numero: string;
    nombres: number;
  }>;
  transmise?: string;
}

export interface PsApiRequest {
  activite: string;
  numero_document: string;
  date_document: string;
  consorts: Array<{
    nom: string;
    numero: string;
    nombres: number;
  }>;
}

export interface RegFormData {
  numero_document: string;
  date_document: string;
  consorts: Array<{
    nom: string;
    matricule: string;
    numeroReg: string;
    activite: string;
    ministere: string;
    pour: string;
    dispatch: string;
  }>;
}

export interface SaveReg {
  numero_document: string;
  date_document: string;
  consorts: Array<{
    nom: string;
    matricule: string;
    numeroReg: string;
    activite: string;
    ministere: string;
    pour: string;
    dispatch: string;
  }>;
}

export interface RegApiRequest {
  numero_document: string;
  date_document: string;
  consorts: Array<{
    nom: string;
    matricule: string;
    numeroReg: string;
    activite: string;
    ministere: string;
    pour: string;
    dispatch: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class BeService {
  private readonly baseUrl = 'http://localhost:5000'; // URL de votre backend Flask

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'blob' as 'json', // Important pour recevoir le PDF
  };

  constructor(private http: HttpClient) {}

  /**
   * Envoie les données du formulaire BE au backend Flask pour générer le PDF
   * @param formData - Données du formulaire Angular
   * @returns Observable<Blob> - Le PDF généré
   */
  sendBeData(formData: BeFormData): Observable<Blob> {
    // Transformer les données du formulaire Angular vers le format attendu par Flask
    const apiRequest: BeApiRequest =
      this.transformFormDataToApiRequest(formData);

    console.log('Données envoyées au backend:', apiRequest);

    return this.http
      .post<Blob>(`${this.baseUrl}/overlay_pdf`, apiRequest, this.httpOptions)
      .pipe(
        map((response: any) => {
          // Créer un Blob à partir de la réponse
          return new Blob([response], { type: 'application/pdf' });
        }),
        catchError(this.handleError)
      );
  }
  //poursignature
  sendDataPS(formData: PsFormData): Observable<Blob> {
    //transformer les donnee en donnee consummable par l'PI
    const apiRequest: PsApiRequest =
      this.transformFormDataToApiRequestPs(formData);
    console.log('Donnee envote au backend ', apiRequest);

    return this.http
      .post<Blob>(
        `${this.baseUrl}/ps_overlay_pdf`,
        apiRequest,
        this.httpOptions
      )
      .pipe(
        map((response: any) => {
          //creer le blob a partir de la response
          return new Blob([response], { type: 'application/pdf' });
        }),
        catchError(this.handleError)
      );
  }

  //enregistrement
  sendDataReg(formData: RegFormData): Observable<Blob> {
    const apiRequest: RegApiRequest =
      this.transformFormDataToApiRequestReg(formData);
    console.log('Donnee envote au backend ', apiRequest);
    return this.http
      .post<Blob>(
        `${this.baseUrl}/reg_overlay_pdf`,
        apiRequest,
        this.httpOptions
      )
      .pipe(
        map((response: any) => {
          return new Blob([response], { type: 'application/pdf' });
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Test de connexion avec le backend - utilise l'endpoint de test
   * @returns Observable<Blob> - PDF de test
   */
  testConnection(): Observable<Blob> {
    return this.http
      .get<Blob>(`${this.baseUrl}/test_overlay`, {
        ...this.httpOptions,
        headers: new HttpHeaders({}),
      })
      .pipe(
        map((response: any) => {
          return new Blob([response], { type: 'application/pdf' });
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Upload d'un nouveau template PDF
   * @param file - Fichier PDF template
   * @returns Observable<any> - Réponse du serveur
   */
  uploadTemplate(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.baseUrl}/upload_template`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Vérifie si le backend est accessible
   * @returns Observable<boolean>
   */
  checkBackendStatus(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/`, { responseType: 'text' }).pipe(
      map(() => true),
      catchError(() => {
        console.error('Backend Flask non accessible');
        return throwError(() => new Error('Backend non accessible'));
      })
    );
  }

  /**
   * Transforme les données du formulaire Angular vers le format API Flask
   * @param formData - Données du formulaire
   * @returns BeApiRequest - Format attendu par l'API Flask
   */
  private transformFormDataToApiRequest(formData: BeFormData): BeApiRequest {
    return {
      transmise: formData.transmise || '',
      template: formData.template || '',
      activite: formData.activite || '',
      numero_document: formData.numero_document || '',
      date_document:
        formData.date_document || new Date().toLocaleDateString('fr-FR'),
      consorts: formData.consorts.map((consort) => ({
        nom: consort.nom.trim(),
        numero: this.cleanMatricule(consort.matricule),
        nombres: 1, // Valeur par défaut, peut être modifiée selon vos besoins
      })),
    };
  }

  private transformFormDataToApiRequestPs(formData: PsFormData): PsApiRequest {
    return {
      activite: formData.activite || '',
      numero_document: formData.numero_document || '',
      date_document:
        formData.date_document || new Date().toLocaleDateString('fr-FR'),
      consorts: formData.consorts.map((consort) => ({
        nom: consort.nom.trim(),
        numero: this.cleanMatricule(consort.matricule),
        nombres: 1, // Valeur par défaut, peut être modifiée selon vos besoins
      })),
    };
  }

  private transformFormDataToApiRequestReg(
    formData: RegFormData
  ): RegApiRequest {
    return {
      numero_document: formData.numero_document || '',
      date_document:
        formData.date_document || new Date().toLocaleDateString('fr-FR'),
      consorts: formData.consorts.map((consort) => ({
        nom: consort.nom.trim(),
        matricule: this.cleanMatricule(consort.matricule),
        numeroReg: consort.numeroReg || '',
        activite: consort.activite || '',
        ministere: consort.ministere || '',
        pour: consort.pour || '',
        dispatch: consort.dispatch || '',
        // Valeur par défaut, peut être modifiée selon vos besoins
      })),
    };
  }

  /**
   * Nettoie le matricule en retirant les espaces et caractères non numériques
   * @param matricule - Matricule formaté (ex: "123 456")
   * @returns string - Matricule nettoyé (ex: "123456")
   */
  private cleanMatricule(matricule: string): string {
    if (!matricule) return '000000';

    // Retire tous les caractères non numériques
    const cleaned = matricule.replace(/\D/g, '');

    // Assure que le matricule fait 6 chiffres
    return cleaned.padStart(6, '0').substring(0, 6);
  }

  /**
   * Gestion des erreurs HTTP
   * @param error - Erreur HTTP
   * @returns Observable<never>
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else if (error.status === 0) {
      // Erreur de connexion
      errorMessage =
        'Impossible de se connecter au serveur. Vérifiez que le backend Flask est démarré.';
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur serveur (${error.status}): ${error.message}`;

      // Si c'est un blob d'erreur, essayer de l'analyser
      if (error.error instanceof Blob) {
        error.error.text().then((text: string) => {
          try {
            const errorJson = JSON.parse(text);
            console.error('Erreur détaillée du serveur:', errorJson);
          } catch {
            console.error('Erreur serveur:', text);
          }
        });
      }
    }

    console.error('Erreur dans BeService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Télécharge le PDF généré
   * @param blob - Blob du PDF
   * @param filename
   * @param data- Nom du fichier (optionnel)
   */
  downloadPdfPs(blob: Blob, filename?: string, data?: SavePs): void {
    /*//sauver dan sla bdd
    const base64data = 
    this.http
      .post(`${this.baseUrl}/save_in_database`, data)
      .subscribe((response) => {
        if (response) {
          console.log(response);
        }
      });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download =
      filename || `bordereau_${new Date().toISOString().split('T')[0]}.pdf`;

    // Ajouter temporairement au DOM pour déclencher le téléchargement
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);*/
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result as string;

      // Ajouter le PDF base64 dans l'objet data
      const fullData = {
        ...data,
        pdf_base64: base64data, // ← champ que tu recevras dans Flask
      };

      // Sauvegarde dans la base via POST
      this.http
        .post(`${this.baseUrl}/save_in_database`, fullData)
        .subscribe((response) => {
          console.log(response);
        });

      // Téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        filename || `bordereau_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    // Lancer la lecture du blob
    reader.readAsDataURL(blob);
  }

  downloadPdfBE(blob: Blob, filename?: string, data?: SaveBe): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result as string;

      // Ajouter le PDF base64 dans l'objet data
      const fullData = {
        ...data,
        pdf_base64: base64data, // ← champ que tu recevras dans Flask
      };

      // Sauvegarde dans la base via POST
      this.http
        .post(`${this.baseUrl}/save_in_database_be`, fullData)
        .subscribe((response) => {
          console.log(response);
        });

      // Téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        filename || `bordereau_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    // Lancer la lecture du blob
    reader.readAsDataURL(blob);
  }

  downloadPdf(blob: Blob, filename?: string, data?: SavePs): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result as string;

      // Ajouter le PDF base64 dans l'objet data
      const fullData = {
        ...data,
        pdf_base64: base64data, // ← champ que tu recevras dans Flask
      };

      // Sauvegarde dans la base via POST
      this.http
        .post(`${this.baseUrl}/save_in_database`, fullData)
        .subscribe((response) => {
          console.log(response);
        });

      // Téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        filename || `bordereau_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    // Lancer la lecture du blob
    reader.readAsDataURL(blob);
  }

  downloadPdfEnreg(blob: Blob, filename?: string, data?: SaveReg): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result as string;

      // Ajouter le PDF base64 dans l'objet data
      const fullData = {
        ...data,
        pdf_base64: base64data, // ← champ que tu recevras dans Flask
      };

      // Sauvegarde dans la base via POST
      this.http
        .post(`${this.baseUrl}/save_in_database_reg`, fullData)
        .subscribe((response) => {
          console.log(response);
        });

      // Téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        filename || `bordereau_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    // Lancer la lecture du blob
    reader.readAsDataURL(blob);
  }

  getPdf(data: any) {
    return this.http.post(this.baseUrl + '/overlay_pdf', data, {
      responseType: 'blob', // important pour recevoir un PDF
    });
  }

  getAllPS() {
    return this.http.get(this.baseUrl + '/get_ps');
  }

  getAllBE() {
    return this.http.get(this.baseUrl + '/get_be');
  }

  getAllReg() {
    return this.http.get(this.baseUrl + '/get_reg');
  }

  //recuperer le fichier pdf deuis back-end
  getPsPdf(id: string) {
    return this.http.post(
      this.baseUrl + '/getPs_pdf',
      { id },
      {
        responseType: 'blob',
      }
    );
  }

  //recuperer le fichier pdf deuis back-end
  getBePdf(id: string) {
    return this.http.post(
      this.baseUrl + '/getBe_pdf',
      { id },
      {
        responseType: 'blob',
      }
    );
  }

  //recuperer le fichier pdf deuis back-end
  getRegPdf(id: string) {
    return this.http.post(
      this.baseUrl + '/getReg_pdf',
      { id },
      {
        responseType: 'blob',
      }
    );
  }
}
