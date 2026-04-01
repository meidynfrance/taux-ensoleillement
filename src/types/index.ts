export interface Region {
  code: string;
  nom: string;
  slug: string;
  ensoleillement_moyen: number | null;
}

export interface Departement {
  code: string;
  nom: string;
  slug: string;
  region_code: string;
  ensoleillement_moyen: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Commune {
  code_insee: string;
  nom: string;
  slug: string;
  code_postal: string | null;
  departement_code: string;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
  ensoleillement_annuel: number | null;
  ensoleillement_janvier: number | null;
  ensoleillement_fevrier: number | null;
  ensoleillement_mars: number | null;
  ensoleillement_avril: number | null;
  ensoleillement_mai: number | null;
  ensoleillement_juin: number | null;
  ensoleillement_juillet: number | null;
  ensoleillement_aout: number | null;
  ensoleillement_septembre: number | null;
  ensoleillement_octobre: number | null;
  ensoleillement_novembre: number | null;
  ensoleillement_decembre: number | null;
}

export interface DepartementWithRegion extends Departement {
  regions?: Region;
}

export interface CommuneWithDepartement extends Commune {
  departements?: Departement & { regions?: Region };
}

export const MOIS = [
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
] as const;

export const MOIS_LABELS: Record<string, string> = {
  janvier: 'Janvier',
  fevrier: 'Février',
  mars: 'Mars',
  avril: 'Avril',
  mai: 'Mai',
  juin: 'Juin',
  juillet: 'Juillet',
  aout: 'Août',
  septembre: 'Septembre',
  octobre: 'Octobre',
  novembre: 'Novembre',
  decembre: 'Décembre',
};

export const MOYENNE_NATIONALE = 1950; // heures d'ensoleillement moyen en France
