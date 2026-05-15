export interface Vacuna {
  id: string;
  nombre: string;
  fecha: Date;
  proximaVacunacion?: Date;
  notas?: string;
}

export interface Paloma {
  id: string;
  nombre: string;
  anillo: string;
  raza: string;
  sexo: "macho" | "hembra";
  fechaNacimiento: Date;
  color: string;
  padreId?: string;
  madreId?: string;
  vacunas: Vacuna[];
  notas?: string;
  foto?: string;
  estado: "activa" | "vendida" | "fallecida" | "retirada";
  createdAt: Date;
  updatedAt: Date;
}

export interface PalomaConPadres extends Paloma {
  padre?: Paloma | null;
  madre?: Paloma | null;
  hijos: Paloma[];
}

export interface ArbolGenealogico {
  paloma: Paloma;
  padre?: ArbolGenealogico;
  madre?: ArbolGenealogico;
  hijos: ArbolGenealogico[];
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  palomas: string[]; // IDs de palomas
  createdAt: Date;
}
