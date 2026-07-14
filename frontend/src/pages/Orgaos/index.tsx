import {
	useEffect,
	useState,
	type FormEvent,
} from "react";

import api from "../../services/api";
import type {
	Orgao,
	PaginatedResponse,
} from "../../types";

interface Filtros {
	busca: string;
	ativo: string;
}

const filtrosIniciais: Filtros = {
	busca: "",
	ativo: "",
};

export default function Orgaos() {
	const [orgaos, setOrgaos] =
		useState<PaginatedResponse<Orgao> | null>(null);

	const [filtros, setFiltros] =
		useState<Filtros>(filtrosIniciais);

	const [filtrosAplicados, setFiltrosAplicados] =
		useState<Filtros>(filtrosIniciais);

	const [pagina, setPagina] = useState(1);
	const [porPagina, setPorPagina] = useState(10);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState("");

	useEffect(() => {
		carregarOrgaos();
	}, [pagina, porPagina, filtrosAplicados]);

	async function carregarOrgaos() {
		try {
			setLoading(true);
			setErro("");

			const response = await api.get<
				PaginatedResponse<Orgao>
			>("/orgaos", {
				params: {
					busca:
						filtrosAplicados.busca.trim() ||
						undefined,
					ativo:
						filtrosAplicados.ativo ||
						undefined,
					per_page: porPagina,
					page: pagina,
				},
			});

			setOrgaos(response.data);
		} catch {
			setErro(
				"Não foi possível carregar os órgãos."
			);
		} finally {
			setLoading(false);
		}
	}

	function aplicarFiltros(
		event: FormEvent<HTMLFormElement>
	) {
		event.preventDefault();
		setPagina(1);
		setFiltrosAplicados(filtros);
	}

	function limparFiltros() {
		setPagina(1);
		setFiltros(filtrosIniciais);
		setFiltrosAplicados(filtrosIniciais);
	}

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
				<div>
					<h1 className="h2 mb-1">
						Órgãos
					</h1>

					<p className="text-body-secondary mb-0">
						Consulte os órgãos cadastrados.
					</p>
				</div>

				<div className="d-flex align-items-center gap-2">
					<label
						className="form-label text-nowrap mb-0"
						htmlFor="orgaos-por-pagina"
					>
						Itens por página:
					</label>

					<select
						id="orgaos-por-pagina"
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
					<strong>Filtros</strong>
				</div>

				<div className="card-body">
					<form onSubmit={aplicarFiltros}>
						<div className="row g-3">
							<div className="col-12 col-md-8">
								<label
									className="form-label"
									htmlFor="busca-orgao"
								>
									Nome ou sigla
								</label>

								<input
									id="busca-orgao"
									className="form-control"
									type="search"
									value={filtros.busca}
									onChange={(event) =>
										setFiltros({
											...filtros,
											busca:
												event.target.value,
										})
									}
									placeholder="Ex.: SEPLAG"
								/>
							</div>

							<div className="col-12 col-md-4">
								<label
									className="form-label"
									htmlFor="status-orgao"
								>
									Status
								</label>

								<select
									id="status-orgao"
									className="form-select"
									value={filtros.ativo}
									onChange={(event) =>
										setFiltros({
											...filtros,
											ativo:
												event.target.value,
										})
									}
								>
									<option value="">
										Todos
									</option>

									<option value="true">
										Ativos
									</option>

									<option value="false">
										Inativos
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
				orgaos?.data.length === 0 && (
					<div
						className="alert alert-info"
						role="alert"
					>
						Nenhum órgão foi encontrado com os
						filtros informados.
					</div>
				)}

			{!loading && !erro && orgaos && (
				<>
					<div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-3">
						<span className="text-body-secondary">
							{orgaos.meta.total} órgão(s)
							encontrado(s)
						</span>

						<span className="text-body-secondary">
							Página {orgaos.meta.current_page} de{" "}
							{orgaos.meta.last_page}
						</span>
					</div>

					<div className="row g-3">
						{orgaos.data.map((orgao) => (
							<div
								className="col-12 col-md-6"
								key={orgao.id}
							>
								<div className="card shadow-sm h-100">
									<div className="card-body">
										<div className="d-flex justify-content-between align-items-start gap-3">
											<div>
												<h2 className="h5 mb-1">
													{orgao.sigla}
												</h2>

												<p className="mb-0">
													{orgao.nome}
												</p>
											</div>

											<span
												className={`badge ${
													orgao.ativo
														? "text-bg-success"
														: "text-bg-secondary"
												}`}
											>
												{orgao.ativo
													? "Ativo"
													: "Inativo"}
											</span>
										</div>

										<small className="text-body-secondary d-block mt-3">
											ID #{orgao.id}
										</small>
									</div>
								</div>
							</div>
						))}
					</div>

					{orgaos.meta.last_page > 1 && (
						<nav
							className="mt-4 overflow-auto"
							aria-label="Paginação dos órgãos"
						>
							<ul className="pagination justify-content-center mb-0">
								<li
									className={`page-item ${
										pagina === 1 ? "disabled" : ""
									}`}
								>
									<button
										className="page-link"
										type="button"
										onClick={() =>
											setPagina(
												(paginaAtual) =>
													paginaAtual - 1
											)
										}
									>
										Anterior
									</button>
								</li>

								{Array.from(
									{
										length: orgaos.meta.last_page,
									},
									(_, indice) => indice + 1
								)
									.filter(
										(numeroPagina) =>
											numeroPagina === 1 ||
											numeroPagina ===
												orgaos.meta.last_page ||
											Math.abs(
												numeroPagina - pagina
											) <= 1
									)
									.map((numeroPagina) => (
										<li
											className="page-item"
											key={numeroPagina}
										>
											<button
												className={`page-link ${
													numeroPagina === pagina
														? "active"
														: ""
												}`}
												type="button"
												onClick={() =>
													setPagina(
														numeroPagina
													)
												}
												aria-current={
													numeroPagina === pagina
														? "page"
														: undefined
												}
											>
												{numeroPagina}
											</button>
										</li>
									))}

								<li
									className={`page-item ${
										pagina ===
										orgaos.meta.last_page
											? "disabled"
											: ""
									}`}
								>
									<button
										className="page-link"
										type="button"
										onClick={() =>
											setPagina(
												(paginaAtual) =>
													paginaAtual + 1
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