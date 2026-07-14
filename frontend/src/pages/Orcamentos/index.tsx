import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import type {
	Acao,
	ApiCollection,
	Orcamento,
	OrcamentoSortBy,
	OrcamentoStatus,
	Orgao,
	PaginatedResponse,
	Programa,
	SortDirection,
} from "../../types";

interface Filtros {
	orgaoId: string;
	programaId: string;
	acaoId: string;
	ano: string;
	status: "" | OrcamentoStatus;
	percentualMinimo: string;
	percentualMaximo: string;
	sortBy: OrcamentoSortBy;
	sortDirection: SortDirection;
}

const filtrosIniciais: Filtros = {
	orgaoId: "",
	programaId: "",
	acaoId: "",
	ano: "",
	status: "",
	percentualMinimo: "",
	percentualMaximo: "",
	sortBy: "ano",
	sortDirection: "desc",
};

export default function Orcamentos() {
	const [orcamentos, setOrcamentos] =
		useState<PaginatedResponse<Orcamento> | null>(null);

	const [orgaos, setOrgaos] = useState<Orgao[]>([]);
	const [programas, setProgramas] = useState<Programa[]>([]);
	const [acoes, setAcoes] = useState<Acao[]>([]);

	const [filtrosFormulario, setFiltrosFormulario] =
		useState<Filtros>(filtrosIniciais);

	const [filtrosAplicados, setFiltrosAplicados] =
		useState<Filtros>(filtrosIniciais);

	const [pagina, setPagina] = useState(1);
	const [porPagina, setPorPagina] = useState(10);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState("");

	useEffect(() => {
		async function carregarOpcoes() {
			try {
				const [orgaosResponse, programasResponse, acoesResponse] =
					await Promise.all([
						api.get<ApiCollection<Orgao>>("/orgaos", {
							params: {
								per_page: 100,
							},
						}),
						api.get<ApiCollection<Programa>>("/programas"),
						api.get<ApiCollection<Acao>>("/acoes"),
					]);

				setOrgaos(orgaosResponse.data.data);
				setProgramas(programasResponse.data.data);
				setAcoes(acoesResponse.data.data);
			} catch {
				setErro("Não foi possível carregar as opções dos filtros.");
			}
		}

		carregarOpcoes();
	}, []);

	useEffect(() => {
		async function carregarOrcamentos() {
			try {
				setLoading(true);
				setErro("");

				const response = await api.get<PaginatedResponse<Orcamento>>(
					"/orcamentos",
					{
						params: {
							orgao_id: filtrosAplicados.orgaoId || undefined,
							programa_id:
								filtrosAplicados.programaId || undefined,
							acao_id: filtrosAplicados.acaoId || undefined,
							ano: filtrosAplicados.ano || undefined,
							status: filtrosAplicados.status || undefined,
							percentual_minimo:
								filtrosAplicados.percentualMinimo || undefined,
							percentual_maximo:
								filtrosAplicados.percentualMaximo || undefined,
							per_page: porPagina,
							page: pagina,
							sort_by: filtrosAplicados.sortBy,
							sort_direction:
								filtrosAplicados.sortDirection,
						},
					}
				);

				setOrcamentos(response.data);
			} catch {
				setErro("Não foi possível carregar os orçamentos.");
			} finally {
				setLoading(false);
			}
		}

		carregarOrcamentos();
	}, [filtrosAplicados, pagina, porPagina]);

	function atualizarFiltro(
		campo: keyof Filtros,
		valor: string
	) {
		setFiltrosFormulario((filtrosAtuais) => ({
			...filtrosAtuais,
			[campo]: valor,
		}));
	}

	function aplicarFiltros(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPagina(1);
		setFiltrosAplicados(filtrosFormulario);
	}

	function limparFiltros() {
		setPagina(1);
		setFiltrosFormulario(filtrosIniciais);
		setFiltrosAplicados(filtrosIniciais);
	}

	function formatarMoeda(
		valor: number | string | null | undefined
	) {
		if (
			valor === null ||
			valor === undefined ||
			valor === ""
		) {
			return null;
		}

		const valorNumerico = Number(valor);

		if (Number.isNaN(valorNumerico)) {
			return null;
		}

		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(valorNumerico);
	}

	function formatarStatus(status: OrcamentoStatus) {
		const nomes: Record<OrcamentoStatus, string> = {
			empenhado: "Empenhado",
			liquidado: "Liquidado",
			pago: "Pago",
		};

		return nomes[status];
	}

	function irParaPagina(novaPagina: number) {
		if (
			!orcamentos ||
			novaPagina < 1 ||
			novaPagina > orcamentos.meta.last_page
		) {
			return;
		}

		setPagina(novaPagina);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	const acoesFiltradas = filtrosFormulario.programaId
		? acoes.filter(
				(acao) =>
					acao.programa_id ===
					Number(filtrosFormulario.programaId)
			)
		: acoes;

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
				<div>
					<h1 className="h2 mb-1">Orçamentos</h1>

					<p className="text-body-secondary mb-0">
						Consulte e revise os orçamentos disponíveis.
					</p>
				</div>

				<div className="d-flex align-items-center gap-2">
					<label
						className="form-label text-nowrap mb-0"
						htmlFor="por-pagina"
					>
						Itens por página:
					</label>

					<select
						id="por-pagina"
						className="form-select"
						value={porPagina}
						onChange={(event) => {
							setPagina(1);
							setPorPagina(Number(event.target.value));
						}}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
					</select>
				</div>
			</div>

			<div className="card shadow-sm mb-4">
				<div className="card-header">
					<strong>Filtros e ordenação</strong>
				</div>

				<div className="card-body">
					<form onSubmit={aplicarFiltros}>
						<div className="row g-3">
							<div className="col-12 col-md-6 col-xl-4">
								<label
									className="form-label"
									htmlFor="orgao"
								>
									Órgão
								</label>

								<select
									id="orgao"
									className="form-select"
									value={filtrosFormulario.orgaoId}
									onChange={(event) =>
										atualizarFiltro(
											"orgaoId",
											event.target.value
										)
									}
								>
									<option value="">Todos</option>

									{orgaos.map((orgao) => (
										<option
											key={orgao.id}
											value={orgao.id}
										>
											{orgao.sigla} - {orgao.nome}
										</option>
									))}
								</select>
							</div>

							<div className="col-12 col-md-6 col-xl-4">
								<label
									className="form-label"
									htmlFor="programa"
								>
									Programa
								</label>

								<select
									id="programa"
									className="form-select"
									value={filtrosFormulario.programaId}
									onChange={(event) => {
										atualizarFiltro(
											"programaId",
											event.target.value
										);
										atualizarFiltro("acaoId", "");
									}}
								>
									<option value="">Todos</option>

									{programas.map((programa) => (
										<option
											key={programa.id}
											value={programa.id}
										>
											{programa.codigo} -{" "}
											{programa.nome}
										</option>
									))}
								</select>
							</div>

							<div className="col-12 col-md-6 col-xl-4">
								<label
									className="form-label"
									htmlFor="acao"
								>
									Ação
								</label>

								<select
									id="acao"
									className="form-select"
									value={filtrosFormulario.acaoId}
									onChange={(event) =>
										atualizarFiltro(
											"acaoId",
											event.target.value
										)
									}
								>
									<option value="">Todas</option>

									{acoesFiltradas.map((acao) => (
										<option
											key={acao.id}
											value={acao.id}
										>
											{acao.codigo} - {acao.nome}
										</option>
									))}
								</select>
							</div>

							<div className="col-12 col-sm-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="ano"
								>
									Ano
								</label>

								<input
									id="ano"
									className="form-control"
									type="number"
									min="1900"
									max="2100"
									value={filtrosFormulario.ano}
									onChange={(event) =>
										atualizarFiltro(
											"ano",
											event.target.value
										)
									}
									placeholder="Ex.: 2026"
								/>
							</div>

							<div className="col-12 col-sm-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="status"
								>
									Status
								</label>

								<select
									id="status"
									className="form-select"
									value={filtrosFormulario.status}
									onChange={(event) =>
										atualizarFiltro(
											"status",
											event.target.value
										)
									}
								>
									<option value="">Todos</option>
									<option value="empenhado">
										Empenhado
									</option>
									<option value="liquidado">
										Liquidado
									</option>
									<option value="pago">Pago</option>
								</select>
							</div>

							<div className="col-12 col-sm-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="percentual-minimo"
								>
									Execução mínima
								</label>

								<div className="input-group">
									<input
										id="percentual-minimo"
										className="form-control"
										type="number"
										min="0"
										max="100"
										step="0.01"
										value={
											filtrosFormulario.percentualMinimo
										}
										onChange={(event) =>
											atualizarFiltro(
												"percentualMinimo",
												event.target.value
											)
										}
									/>

									<span className="input-group-text">%</span>
								</div>
							</div>

							<div className="col-12 col-sm-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="percentual-maximo"
								>
									Execução máxima
								</label>

								<div className="input-group">
									<input
										id="percentual-maximo"
										className="form-control"
										type="number"
										min="0"
										max="100"
										step="0.01"
										value={
											filtrosFormulario.percentualMaximo
										}
										onChange={(event) =>
											atualizarFiltro(
												"percentualMaximo",
												event.target.value
											)
										}
									/>

									<span className="input-group-text">%</span>
								</div>
							</div>

							<div className="col-12 col-md-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="ordenar-por"
								>
									Ordenar por
								</label>

								<select
									id="ordenar-por"
									className="form-select"
									value={filtrosFormulario.sortBy}
									onChange={(event) =>
										atualizarFiltro(
											"sortBy",
											event.target.value
										)
									}
								>
									<option value="ano">Ano</option>
									<option value="valor_pago">
										Valor pago
									</option>
								</select>
							</div>

							<div className="col-12 col-md-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="direcao"
								>
									Direção
								</label>

								<select
									id="direcao"
									className="form-select"
									value={
										filtrosFormulario.sortDirection
									}
									onChange={(event) =>
										atualizarFiltro(
											"sortDirection",
											event.target.value
										)
									}
								>
									<option value="asc">Crescente</option>
									<option value="desc">Decrescente</option>
								</select>
							</div>
						</div>

						<div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={limparFiltros}
							>
								Limpar
							</button>

							<button
								className="btn btn-primary"
								type="submit"
							>
								Aplicar filtros
							</button>
						</div>
					</form>
				</div>
			</div>

			{erro && (
				<div className="alert alert-danger" role="alert">
					{erro}
				</div>
			)}

			{loading && (
				<div className="text-center py-5">
					<div
						className="spinner-border text-primary"
						role="status"
					>
						<span className="visually-hidden">Carregando...</span>
					</div>
				</div>
			)}

			{!loading && !erro && orcamentos?.data.length === 0 && (
				<div className="alert alert-info" role="alert">
					Nenhum orçamento foi encontrado com os filtros
					informados.
				</div>
			)}

			{!loading && !erro && orcamentos && (
				<>
					<div className="d-flex justify-content-between align-items-center mb-3">
						<span className="text-body-secondary">
							{orcamentos.meta.total} orçamento(s) encontrado(s)
						</span>

						<span className="text-body-secondary">
							Página {orcamentos.meta.current_page} de{" "}
							{orcamentos.meta.last_page}
						</span>
					</div>

					<div className="row g-3">
						{orcamentos.data.map((orcamento) => (
							<div
								className="col-12"
								key={orcamento.id}
							>
								<Link
									to={`/orcamentos/${orcamento.id}`}
									className="card shadow-sm text-decoration-none text-body h-100"
								>
									<div className="card-body">
										<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-3">
											<div>
												<h2 className="h5 mb-1">
													Orçamento #{orcamento.id}
												</h2>

												<span className="text-body-secondary">
													{orcamento.ano}
												</span>
											</div>

											<div className="d-flex flex-wrap gap-2">
												<span className="badge text-bg-primary">
													{formatarStatus(
														orcamento.status
													)}
												</span>

												{orcamento.revisado_em && (
													<span className="badge text-bg-success">
														Revisado
													</span>
												)}
											</div>
										</div>

										<div className="row g-3">
											<div className="col-12 col-lg-6">
												<small className="text-body-secondary d-block">
													Órgão
												</small>

												<strong>
													{
														orcamento
															.unidade_gestora
															.orgao.sigla
													}{" "}
													-{" "}
													{
														orcamento
															.unidade_gestora
															.orgao.nome
													}
												</strong>
											</div>

											<div className="col-12 col-lg-6">
												<small className="text-body-secondary d-block">
													Programa
												</small>

												<strong>
													{
														orcamento.acao
															.programa.codigo
													}{" "}
													-{" "}
													{
														orcamento.acao
															.programa.nome
													}
												</strong>
											</div>

											<div className="col-12 col-lg-6">
												<small className="text-body-secondary d-block">
													Ação
												</small>

												<span>
													{orcamento.acao.codigo} -{" "}
													{orcamento.acao.nome}
												</span>
											</div>

											<div className="col-6 col-md-4 col-lg-2">
												<small className="text-body-secondary d-block">
													Dotação atualizada
												</small>

												<strong>
													{formatarMoeda(
														orcamento.dotacao_atualizada
													) ?? (
														<span className="text-warning fw-semibold">
															Informação
															não
															disponível.
														</span>
													)}
												</strong>
											</div>

											<div className="col-6 col-md-4 col-lg-2">
												<small className="text-body-secondary d-block">
													Valor pago
												</small>

												<strong>
													{formatarMoeda(
														orcamento.valor_pago
													) ?? (
														<span className="text-warning fw-semibold">
															Informação
															não
															disponível.
														</span>
													)}
												</strong>
											</div>

											<div className="col-6 col-md-4 col-lg-2">
												<small className="text-body-secondary d-block">
													Saldo
												</small>

												<strong>
													{formatarMoeda(
														orcamento.saldo
													) ?? (
														<span className="text-warning fw-semibold">
															Informação
															não
															disponível.
														</span>
													)}
												</strong>
											</div>
										</div>

										<div className="mt-3">
											<div className="d-flex justify-content-between mb-1">
												<small>
													Execução orçamentária
												</small>

												<small>
													{Number(orcamento.percentual_execucao).toFixed(2)}
													%
												</small>
											</div>

											<div
												className="progress"
												role="progressbar"
												aria-label="Percentual de execução"
												aria-valuenow={
													orcamento.percentual_execucao
												}
												aria-valuemin={0}
												aria-valuemax={100}
												style={{ height: "8px" }}
											>
												<div
													className="progress-bar"
													style={{
														width: `${Math.min(
															orcamento.percentual_execucao,
															100
														)}%`,
													}}
												/>
											</div>
										</div>

										<div className="text-end mt-3">
											<span className="text-primary fw-semibold">
												Ver detalhes
											</span>
										</div>
									</div>
								</Link>
							</div>
						))}
					</div>

					{orcamentos.meta.last_page > 1 && (
						<nav
							className="mt-4"
							aria-label="Paginação dos orçamentos"
						>
							<ul className="pagination justify-content-center flex-wrap">
								<li
									className={`page-item ${
										pagina === 1 ? "disabled" : ""
									}`}
								>
									<button
										className="page-link"
										type="button"
										onClick={() =>
											irParaPagina(pagina - 1)
										}
									>
										Anterior
									</button>
								</li>

								{Array.from(
									{
										length:
											orcamentos.meta.last_page,
									},
									(_, indice) => indice + 1
								)
									.filter(
										(numeroPagina) =>
											numeroPagina === 1 ||
											numeroPagina ===
												orcamentos.meta.last_page ||
											Math.abs(
												numeroPagina - pagina
											) <= 1
									)
									.map((numeroPagina) => {
										return (
											<li
												className="page-item"
												key={numeroPagina}
											>
												<button
													className={`page-link ${
														numeroPagina ===
														pagina
															? "active"
															: ""
													}`}
													type="button"
													onClick={() =>
														irParaPagina(
															numeroPagina
														)
													}
													aria-current={
														numeroPagina ===
														pagina
															? "page"
															: undefined
													}
												>
													{numeroPagina}
												</button>
											</li>
										);
									})}

								<li
									className={`page-item ${
										pagina ===
										orcamentos.meta.last_page
											? "disabled"
											: ""
									}`}
								>
									<button
										className="page-link"
										type="button"
										onClick={() =>
											irParaPagina(pagina + 1)
										}
									>
										Próxima
									</button>
								</li>
							</ul>
						</nav>
					)}
				</>
			)}
		</>
	);
}