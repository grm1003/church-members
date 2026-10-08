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

export type Genero = 'MASCULINO' | 'FEMININO';

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
  genero?: Genero;
  familiaId?: number[];
  familia: string[];
  relacoes?: MemberRelacao[];
  tipoRelacao?: RelacaoFamilia;
}

export interface MemberSaveDto {
  nome: string;
  email?: string | null;
  data: string;
  genero: Genero;
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

export interface MemberEstatisticasDto {
  total: number;
  totalMasculino: number;
  totalFeminino: number;
}

export interface MemberResumoDto {
  id: number;
  nome: string;
  genero: Genero;
  dataNascimento: string;
  idade: number | null;
}

export interface MemberFiltroResponseDto {
  total: number;
  membros: MemberResumoDto[];
}
