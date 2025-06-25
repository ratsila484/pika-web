// interfaces.ts - Interfaces pour le service BE

export interface dataBe {
  numero: string;
  template: string;
  activite: string;
  consorts: Consort[];
  date: string;
}

export interface Consort {
  nom: string;
  matricule: string;
}

export interface BeFormData {
  template: string;
  activite: string;
  nombreConsorts: number;
  consorts: Consort[];
  numero_document?: string;
  date_document?: string;
  transmise?:string;
}

export interface BeApiRequest {
  template: string;
  activite: string;
  numero_document: string;
  date_document: string;
  transmise?:string;
  consorts: ConsortApiFormat[];
}

export interface ConsortApiFormat {
  nom: string;
  numero: string; // Matricule nettoyé
  nombres: number;
  observation?: string;
}

export interface FlaskErrorResponse {
  error: string;
}

export interface FlaskSuccessResponse {
  message: string;
}

// Types pour les templates disponibles
export type TemplateType =
  | 'CF ANE'
  | 'CF'
  | 'Fin Solde'
  | 'Fin Soldes ANE'
  | 'Fin effectif'
  | 'MAE ANE'
  | 'MAE'
  | 'SGG'
  | 'Traitement Info';

// Types pour les activités
export type ActiviteType =
  | 'Bonification'
  | 'Avancement'
  | 'Reclassement indiciaire'
  | 'Majoration indiciaire'
  | 'Nomination'
  | 'Reclassement par diplôme'
  | 'Titularisation'
  | 'Admission à la retraite'
  | 'Autorisation de sortie'
  | 'Départ en stage'
  | 'Intégration'
  | 'Révision de situation'
  | 'Renouvellement de contrat'
  | 'Avenant'
  | 'Radiation'
  | 'Accident de travail et Maladie Professionnel';

// Configuration du service
export interface BeServiceConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

// Réponse d'état du backend
export interface BackendStatus {
  status: 'online' | 'offline';
  version?: string;
  timestamp: Date;
}
