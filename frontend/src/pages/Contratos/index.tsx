import {
	useEffect,
	useState,
	type FormEvent,
} from "react";

import { Link } from "react-router-dom";
import api from "../../services/api";
import type {
	Contrato,
	ContratoSortBy,
	ContratoStatus,
	Orgao,
	PaginatedResponse,
	SortDirection,
} from "../../types";

interface Filtros {
	orgaoId: string;
	status: "" | ContratoStatus;
	fornecedorId: string;
	sortBy: ContratoSortBy;
	sortDirection: SortDirection;
}

const filtrosIniciais: Filtros = {
	orgaoId: "",
	status: "",
	fornecedorId: "",
	sortBy: "data_fim",
	sortDirection: "desc",
};

export default function Contratos() {
	const [contratos, setContratos] =
		useState<PaginatedResponse<Contrato> | null>(null);

	const [orgaos, setOrgaos] = useState<Orgao[]>([]);

	const [filtrosFormulario, setFiltrosFormulario] =
		useState<Filtros>(filtrosIniciais);

	const [filtrosAplicados, setFiltrosAplicados] =
		useState<Filtros>(filtrosIniciais);

	const [pagina, setPagina] = useState(1);
	const [porPagina, setPorPagina] = useState(10);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState("");

	useEffect(() => {
		async function carregarOrgaos() {
			try {
				const response = await api.get<{
					data: Orgao[];
				}>("/orgaos", {
					params: {
						per_page: 100,
					},
				});

				setOrgaos(response.data.data);
			} catch {
				setErro(
					"Não foi possível carregar as opções de órgãos."
				);
			}
		}

		carregarOrgaos();
	}, []);

	useEffect(() => {
		async function carregarContratos() {
			try {
				setLoading(true);
				setErro("");

				const response = await api.get<
					PaginatedResponse<Contrato>
				>("/contratos", {
					params: {
						orgao_id:
							filtrosAplicados.orgaoId ||
							undefined,
						status:
							filtrosAplicados.status ||
							undefined,
						fornecedor_id:
							filtrosAplicados.fornecedorId ||
							undefined,
						sort_by: filtrosAplicados.sortBy,
						sort_direction:
							filtrosAplicados.sortDirection,
						per_page: porPagina,
						page: pagina,
					},
				});

				setContratos(response.data);
			} catch {
				setErro(
					"Não foi possível carregar os contratos."
				);
			} finally {
				setLoading(false);
			}
		}

		carregarContratos();
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

	function aplicarFiltros(
		event: FormEvent<HTMLFormElement>
	) {
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
		valor: number | null | undefined
	) {
		if (valor === null || valor === undefined) {
			return "Informação não disponível.";
		}

		return valor.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
		});
	}

	function formatarData(
		data: string | null | undefined
	) {
		if (!data) {
			return null;
		}

		const [ano, mes, dia] = data
			.substring(0, 10)
			.split("-");

		if (!ano || !mes || !dia) {
			return data;
		}

		return `${dia}/${mes}/${ano}`;
	}

	function formatarStatus(status: ContratoStatus) {
		const nomes: Record<ContratoStatus, string> = {
			vigente: "Vigente",
			vencido: "Vencido",
			encerrado: "Encerrado",
			suspenso: "Suspenso",
		};

		return nomes[status];
	}

	function classeStatus(status: ContratoStatus) {
		const classes: Record<ContratoStatus, string> = {
			vigente: "text-bg-success",
			vencido: "text-bg-danger",
			encerrado: "text-bg-secondary",
			suspenso: "text-bg-warning",
		};

		return classes[status];
	}

	function nomeOrdenacao(sortBy: ContratoSortBy) {
		const nomes: Record<ContratoSortBy, string> = {
			valor: "Valor",
			data_inicio: "Data de início",
			data_fim: "Data de fim",
			encerrado_em: "Data de encerramento",
			suspenso_em: "Data de suspensão",
		};

		return nomes[sortBy];
	}

	function irParaPagina(novaPagina: number) {
		if (
			!contratos ||
			novaPagina < 1 ||
			novaPagina > contratos.meta.last_page
		) {
			return;
		}

		setPagina(novaPagina);

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	function valorOuIndisponivel(
		valor: string | number | null | undefined
	) {
		if (
			valor === null ||
			valor === undefined ||
			valor === ""
		) {
			return (
				<span className="text-warning fw-semibold">
					Informação não disponível.
				</span>
			);
		}

		return valor;
	}

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
				<div>
					<h1 className="h2 mb-1">
						Contratos
					</h1>

					<p className="text-body-secondary mb-0">
						Consulte os contratos vinculados aos
						orçamentos.
					</p>
				</div>

				<div className="d-flex align-items-center gap-2">
					<label
						className="form-label text-nowrap mb-0"
						htmlFor="contratos-por-pagina"
					>
						Itens por página:
					</label>

					<select
						id="contratos-por-pagina"
						className="form-select"
						value={porPagina}
						onChange={(event) => {
							setPagina(1);
							setPorPagina(
								Number(event.target.value)
							);
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
									htmlFor="contrato-orgao"
								>
									Órgão
								</label>

								<select
									id="contrato-orgao"
									className="form-select"
									value={
										filtrosFormulario.orgaoId
									}
									onChange={(event) =>
										atualizarFiltro(
											"orgaoId",
											event.target.value
										)
									}
								>
									<option value="">
										Todos
									</option>

									{orgaos.map((orgao) => (
										<option
											key={orgao.id}
											value={orgao.id}
										>
											{orgao.sigla} -{" "}
											{orgao.nome}
										</option>
									))}
								</select>
							</div>

							<div className="col-12 col-md-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="contrato-status"
								>
									Status
								</label>

								<select
									id="contrato-status"
									className="form-select"
									value={
										filtrosFormulario.status
									}
									onChange={(event) =>
										atualizarFiltro(
											"status",
											event.target.value
										)
									}
								>
									<option value="">
										Todos
									</option>

									<option value="vigente">
										Vigente
									</option>

									<option value="vencido">
										Vencido
									</option>

									<option value="encerrado">
										Encerrado
									</option>

									<option value="suspenso">
										Suspenso
									</option>
								</select>
							</div>

							<div className="col-12 col-md-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="fornecedor-id"
								>
									ID do fornecedor
								</label>

								<input
									id="fornecedor-id"
									className="form-control"
									type="number"
									min="1"
									value={
										filtrosFormulario.fornecedorId
									}
									onChange={(event) =>
										atualizarFiltro(
											"fornecedorId",
											event.target.value
										)
									}
									placeholder="Ex.: 10"
								/>
							</div>

							<div className="col-12 col-md-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="contrato-sort-by"
								>
									Ordenar por
								</label>

								<select
									id="contrato-sort-by"
									className="form-select"
									value={
										filtrosFormulario.sortBy
									}
									onChange={(event) =>
										atualizarFiltro(
											"sortBy",
											event.target.value
										)
									}
								>
									<option value="valor">
										Valor
									</option>

									<option value="data_inicio">
										Data de início
									</option>

									<option value="data_fim">
										Data de fim
									</option>

									<option value="encerrado_em">
										Data de encerramento
									</option>

									<option value="suspenso_em">
										Data de suspensão
									</option>
								</select>
							</div>

							<div className="col-12 col-md-6 col-xl-2">
								<label
									className="form-label"
									htmlFor="contrato-sort-direction"
								>
									Direção
								</label>

								<select
									id="contrato-sort-direction"
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
									<option value="asc">
										Crescente
									</option>

									<option value="desc">
										Decrescente
									</option>
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
				<div
					className="alert alert-danger"
					role="alert"
				>
					{erro}
				</div>
			)}

			{loading && (
				<div className="text-center py-5">
					<div
						className="spinner-border text-primary"
						role="status"
					>
						<span className="visually-hidden">
							Carregando...
						</span>
					</div>
				</div>
			)}

			{!loading &&
				!erro &&
				contratos?.data.length === 0 && (
					<div
						className="alert alert-info"
						role="alert"
					>
						Nenhum contrato foi encontrado com os
						filtros informados.
					</div>
				)}

			{!loading && !erro && contratos && (
				<>
					<div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-3">
						<span className="text-body-secondary">
							{contratos.meta.total} contrato(s)
							encontrado(s)
						</span>

						<span className="text-body-secondary">
							Ordenação:{" "}
							{nomeOrdenacao(
								filtrosAplicados.sortBy
							)}{" "}
							—{" "}
							{filtrosAplicados.sortDirection ===
							"asc"
								? "crescente"
								: "decrescente"}
						</span>
					</div>

					<div className="row g-3">
						{contratos.data.map((contrato) => (
							<div
								className="col-12"
								key={contrato.id}
							>
								<div className="card shadow-sm h-100">
									<div className="card-body">
										<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-4">
											<div>
												<h2 className="h5 mb-1">
													Contrato{" "}
													{contrato.numero}
												</h2>

												<small className="text-body-secondary">
													ID #{contrato.id}
												</small>
											</div>

											<span
												className={`badge ${classeStatus(
													contrato.status
												)}`}
											>
												{formatarStatus(
													contrato.status
												)}
											</span>
										</div>

										<div className="row g-4">
											<div className="col-12 col-lg-6">
												<small className="text-body-secondary d-block mb-1">
													Fornecedor
												</small>

												<strong>
													{valorOuIndisponivel(
														contrato.fornecedor
															?.nome
													)}
												</strong>
											</div>

											<div className="col-12 col-sm-6 col-lg-3">
												<small className="text-body-secondary d-block mb-1">
													Valor
												</small>

												<strong>
													{formatarMoeda(
														contrato.valor
													)}
												</strong>
											</div>

											<div className="col-12 col-sm-6 col-lg-3">
												<small className="text-body-secondary d-block mb-1">
													Orçamento
												</small>

												{contrato.orcamento ? (
                                                    <Link
                                                        to={`/orcamentos/${contrato.orcamento.id}`}
                                                        className="fw-semibold text-decoration-none"
                                                    >
                                                        Orçamento #{contrato.orcamento.id}
                                                    </Link>
                                                ) : (
                                                    <span className="text-warning fw-semibold">
                                                        Informação não disponível.
                                                    </span>
                                                )}
											</div>

											<div className="col-12 col-sm-6 col-lg-3">
												<small className="text-body-secondary d-block mb-1">
													Data de início
												</small>

												{valorOuIndisponivel(
													formatarData(
														contrato.data_inicio
													)
												)}
											</div>

											<div className="col-12 col-sm-6 col-lg-3">
												<small className="text-body-secondary d-block mb-1">
													Data de fim
												</small>

												{valorOuIndisponivel(
													formatarData(
														contrato.data_fim
													)
												)}
											</div>

											<div className="col-12 col-sm-6 col-lg-3">
												<small className="text-body-secondary d-block mb-1">
													Suspenso em
												</small>

												{valorOuIndisponivel(
													formatarData(
														contrato.suspenso_em
													)
												)}
											</div>

											<div className="col-12 col-sm-6 col-lg-3">
												<small className="text-body-secondary d-block mb-1">
													Encerrado em
												</small>

												{valorOuIndisponivel(
													formatarData(
														contrato.encerrado_em
													)
												)}
											</div>

											<div className="col-12">
												<small className="text-body-secondary d-block mb-1">
													Objeto
												</small>

												<div>
													{valorOuIndisponivel(
														contrato.objeto
													)}
												</div>
											</div>

											<div className="col-12 col-lg-6">
												<small className="text-body-secondary d-block mb-1">
													Órgão responsável
												</small>

												{contrato.orcamento
													?.unidade_gestora
													?.orgao ? (
													<strong>
														{
															contrato
																.orcamento
																.unidade_gestora
																.orgao
																.sigla
														}{" "}
														-{" "}
														{
															contrato
																.orcamento
																.unidade_gestora
																.orgao
																.nome
														}
													</strong>
												) : (
													<span className="text-warning fw-semibold">
														Informação não
														disponível.
													</span>
												)}
											</div>

											<div className="col-12 col-lg-6">
												<small className="text-body-secondary d-block mb-1">
													Unidade gestora
												</small>

												{valorOuIndisponivel(
													contrato.orcamento
														?.unidade_gestora
														?.nome
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{contratos.meta.last_page > 1 && (
						<nav
							className="mt-4"
							aria-label="Paginação dos contratos"
						>
							<ul className="pagination justify-content-center flex-wrap">
								<li
									className={`page-item ${
										pagina === 1
											? "disabled"
											: ""
									}`}
								>
									<button
										className="page-link"
										type="button"
										onClick={() =>
											irParaPagina(
												pagina - 1
											)
										}
									>
										Anterior
									</button>
								</li>

								{Array.from(
									{
										length:
											contratos.meta
												.last_page,
									},
									(_, indice) =>
										indice + 1
								)
									.filter(
										(numeroPagina) =>
											numeroPagina ===
												1 ||
											numeroPagina ===
												contratos.meta
													.last_page ||
											Math.abs(
												numeroPagina -
													pagina
											) <= 1
									)
									.map(
										(numeroPagina) => {
											return (
												<li
													className="page-item"
													key={
														numeroPagina
													}
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
														{
															numeroPagina
														}
													</button>
												</li>
											);
										}
									)}

								<li
									className={`page-item ${
										pagina ===
										contratos.meta
											.last_page
											? "disabled"
											: ""
									}`}
								>
									<button
										className="page-link"
										type="button"
										onClick={() =>
											irParaPagina(
												pagina + 1
											)
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