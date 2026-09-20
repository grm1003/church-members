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

export interface RelacaoDto {
  familiaId: number;
  tipoRelacao: RelacaoFamilia;
}

export interface Member {
  id?: number;
  nome: string;
  email?: string | null;
  data: string;
  aniversario: string;
  familiaId?: number[];
  familia: string[];
  relacoes?: MemberRelacao[];
  tipoRelacao?: RelacaoFamilia;
}

export interface MemberSaveDto {
  nome: string;
  email?: string | null;
  data: string;
  tipoRelacao?: RelacaoDto[];
}

export interface Familia {
  id: number;
  nome: string;
}

export interface RelacaoFamiliaOption {
  valor: RelacaoFamilia;
  descricao: string;
}

export interface MemberImportResponseDto {
  totalProcessados: number;
  membrosSalvos: number;
  familiasCriadas: number;
  erros: string[];
}

export interface MemberRelacao {
  familiaId: number;
  nomeFamilia?: string;
  membroId?: number;
  emailMembro?: string | null;
  nomeMembro: string;
  tipoRelacao: RelacaoFamilia;
}
