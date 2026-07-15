export type RelacaoFamilia =
  | 'PAI'
  | 'MAE'
  | 'FILHO'
  | 'FILHA'
  | 'IRMAO'
  | 'IRMA'
  | 'ESPOSO'
  | 'ESPOSA'
  | 'AVÔ'
  | 'AVÓ'
  | 'NETO'
  | 'NETA'
  | 'TIO'
  | 'TIA'
  | 'SOBRINHO'
  | 'SOBRINHA'
  | 'PRIMO'
  | 'PRIMA'
  | 'CUNHADO'
  | 'CUNHADA'
  | 'SOGRO'
  | 'SOGRA'
  | 'GENRO'
  | 'NORA'
  | 'OUTRO';

export interface Member {
  nome: string;
  email: string;
  data: string;
  aniversario: string;
  familiaId: number[];
  familia: string[];
  tipoRelacao: RelacaoFamilia;
}

export interface MemberSaveDto {
  nome: string;
  email: string;
  data: string;
  familiaId: number[];
  tipoRelacao: RelacaoFamilia;
}

export interface Familia {
  id: number;
  nome: string;
}

export interface RelacaoFamiliaOption {
  valor: RelacaoFamilia;
  descricao: string;
}