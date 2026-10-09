export type RelacaoFamilia = 'FILIADO' | 'CONJUGE';

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
  aniversario?: string;
  genero?: Genero;
  endereco?: string;
  numero?: string;
  bairro?: string;
  celular?: string;
  estadoCivil?: string;
  filiacao?: string;
  conjuge?: string;
  recebidoPor?: string;
  dataRecebimento?: string;
  meioRecepcao?: string;
  familiaId?: number[];
  familia?: string[];
  relacoes?: MemberRelacao[];
  tipoRelacao?: RelacaoFamilia;
}

export interface MemberSaveDto {
  nome: string;
  email?: string | null;
  data: string;
  genero: Genero;
  endereco?: string;
  numero?: string;
  bairro?: string;
  celular?: string;
  estadoCivil?: string;
  filiacao?: string;
  conjuge?: string;
  recebidoPor?: string;
  dataRecebimento?: string;
  meioRecepcao?: string;
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