export interface Usuario {
	id: number;
	name: string;
	email: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
}

export interface Dashboard {
	total_orgaos: number;
	total_contratos: number;
	orcamento_total: number;
	empenhado: number;
	liquidado: number;
	pago: number;
	saldo: number;
	percentual_execucao: number;
}

export interface Paginacao<T> {
	current_page: number;
	data: T[];
	last_page: number;
	per_page: number;
	total: number;
}

export interface Opcao {
	id: number;
	nome: string;
}

export interface Orgao {
	id: number;
	sigla: string;
	nome: string;
	ativo: boolean;
}

export interface Programa {
	id: number;
	codigo: string;
	nome: string;
}

export interface Acao {
	id: number;
	codigo: string;
	nome: string;
	programa_id: number;
}

export interface AcaoComPrograma extends Acao {
	programa: Programa;
}

export interface UnidadeGestora {
	id: number;
	nome: string;
	orgao_id: number;
	orgao: Orgao;
}

export type OrcamentoStatus = "empenhado" | "liquidado" | "pago";

export type OrcamentoSortBy = "ano" | "valor_pago";

export type SortDirection = "asc" | "desc";

export interface Orcamento {
	id: number;
	ano: number;
	dotacao_inicial: number;
	suplementacoes: number;
	anulacoes: number;
	dotacao_atualizada: number;
	valor_empenhado: number;
	valor_liquidado: number;
	valor_pago: number;
	percentual_execucao: number;
	status: OrcamentoStatus;
	saldo: number;
	revisado_em: string | null;
	observacao_revisao: string | null;
	revisor: Usuario | null;
	unidade_gestora: UnidadeGestora;
	acao: AcaoComPrograma;
	subfuncao: Subfuncao;
	natureza_despesa: NaturezaDespesa;
	fonte_recurso: FonteRecurso;
	contratos?: Contrato[];
}

export interface ApiCollection<T> {
	data: T[];
}

export interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	links: {
		first: string | null;
		last: string | null;
		prev: string | null;
		next: string | null;
	};
	meta: {
		current_page: number;
		from: number | null;
		last_page: number;
		links: PaginationLink[];
		path: string;
		per_page: number;
		to: number | null;
		total: number;
	};
}

export interface Funcao {
	id: number;
	codigo: string;
	nome: string;
}

export interface Subfuncao {
	id: number;
	nome: string;
	funcao_id: number;
	funcao: Funcao;
}

export interface NaturezaDespesa {
	id: number;
	nome: string;
}

export interface FonteRecurso {
	id: number;
	nome: string;
}

export interface Fornecedor {
	id: number;
	nome: string;
}

export type ContratoStatus =
	| "vigente"
	| "vencido"
	| "encerrado"
	| "suspenso";

export type ContratoSortBy =
	| "valor"
	| "data_inicio"
	| "data_fim"
	| "encerrado_em"
	| "suspenso_em";

export interface Contrato {
	id: number;
	numero: string;
	objeto: string;
	valor: number;
	data_inicio: string | null;
	data_fim: string | null;
	suspenso_em: string | null;
	encerrado_em: string | null;
	status: ContratoStatus;
	fornecedor: Fornecedor | null;
	orcamento?: Orcamento;
}

export interface ApiResource<T> {
	data: T;
}

export interface RevisaoResponse {
	data: Orcamento;
	message: string;
}

export interface ExecucaoPorOrgao {
	orgao_id: number;
	orgao_sigla: string;
	orgao_nome: string;
	orcamento_total: number;
	execucao: number;
	percentual_execucao: number;
}

export interface ExecucaoPorPrograma {
	programa_id: number;
	programa_codigo: string;
	programa_nome: string;
	orcamento_total: number;
	execucao: number;
	percentual_execucao: number;
}

export interface EmpenhadoXPago {
	ano: number;
	empenhado: number;
	liquidado: number;
	pago: number;
}

export interface TopContrato {
	id: number;
	numero: string;
	objeto: string;
	valor: number;
	data_inicio: string;
	data_fim: string;
	fornecedor_nome: string;
	orgao_sigla: string;
	orgao_nome: string;
}

export interface Graficos {
	execucao_por_orgao: ExecucaoPorOrgao[];
	execucao_por_programa: ExecucaoPorPrograma[];
	empenhado_x_pago: EmpenhadoXPago[];
	top_contratos: TopContrato[];
}