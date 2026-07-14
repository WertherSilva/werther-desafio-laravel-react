import {
	useEffect,
	useState,
	type FormEvent,
	type ReactNode,
} from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";
import type {
	ApiResource,
	Contrato,
	ContratoStatus,
	Orcamento,
	OrcamentoStatus,
	RevisaoResponse,
} from "../../types";

interface CampoDetalheProps {
	titulo: string;
	valor: ReactNode;
	className?: string;
}

function CampoDetalhe({
	titulo,
	valor,
	className = "col-12 col-md-6 col-xl-4",
}: CampoDetalheProps) {
	const informacaoAusente =
		valor === null ||
		valor === undefined ||
		valor === "";

	return (
		<div className={className}>
			<small className="text-body-secondary d-block mb-1">
				{titulo}
			</small>

			{informacaoAusente ? (
				<span className="text-warning fw-semibold">
					Informação não disponível.
				</span>
			) : (
				<span className="fw-semibold">{valor}</span>
			)}
		</div>
	);
}

export default function OrcamentoDetalhe() {
	const { id } = useParams();

	const [orcamento, setOrcamento] =
		useState<Orcamento | null>(null);

	const [observacaoRevisao, setObservacaoRevisao] =
		useState("");

	const [loading, setLoading] = useState(true);
	const [revisando, setRevisando] = useState(false);
	const [erro, setErro] = useState("");
	const [erroRevisao, setErroRevisao] = useState("");
	const [mensagemSucesso, setMensagemSucesso] =
		useState("");

	useEffect(() => {
		async function carregarOrcamento() {
			if (!id) {
				setErro("Orçamento inválido.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setErro("");

				const response = await api.get<
					ApiResource<Orcamento>
				>(`/orcamentos/${id}`);

				setOrcamento(response.data.data);
			} catch {
				setErro(
					"Não foi possível carregar as informações do orçamento."
				);
			} finally {
				setLoading(false);
			}
		}

		carregarOrcamento();
	}, [id]);

	async function marcarComoRevisado(
		event: FormEvent<HTMLFormElement>
	) {
		event.preventDefault();

		if (!id || !orcamento) {
			return;
		}

		try {
			setRevisando(true);
			setErroRevisao("");
			setMensagemSucesso("");

			const response = await api.patch<RevisaoResponse>(
				`/orcamentos/${id}/revisao`,
				{
					observacao_revisao:
						observacaoRevisao.trim() || null,
				}
			);

			setOrcamento((orcamentoAtual) => {
				if (!orcamentoAtual) {
					return response.data.data;
				}

				return {
					...orcamentoAtual,
					...response.data.data,
					contratos: orcamentoAtual.contratos,
				};
			});

			setMensagemSucesso(response.data.message);
			setObservacaoRevisao("");
		} catch {
			setErroRevisao(
				"Não foi possível marcar o orçamento como revisado."
			);
		} finally {
			setRevisando(false);
		}
	}

	function formatarMoeda(
		valor: number | null | undefined
	) {
		if (valor === null || valor === undefined) {
			return null;
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

		const apenasData = data.substring(0, 10);
		const [ano, mes, dia] = apenasData.split("-");

		if (!ano || !mes || !dia) {
			return data;
		}

		return `${dia}/${mes}/${ano}`;
	}

	function formatarDataHora(
		data: string | null | undefined
	) {
		if (!data) {
			return null;
		}

		const dataConvertida = new Date(data);

		if (Number.isNaN(dataConvertida.getTime())) {
			return data;
		}

		return dataConvertida.toLocaleString("pt-BR");
	}

	function formatarStatusOrcamento(
		status: OrcamentoStatus | null | undefined
	) {
		if (!status) {
			return null;
		}

		const nomes: Record<OrcamentoStatus, string> = {
			empenhado: "Empenhado",
			liquidado: "Liquidado",
			pago: "Pago",
		};

		return nomes[status];
	}

	function formatarStatusContrato(
		status: ContratoStatus | null | undefined
	) {
		if (!status) {
			return null;
		}

		const nomes: Record<ContratoStatus, string> = {
			vigente: "Vigente",
			encerrado: "Encerrado",
			suspenso: "Suspenso",
		};

		return nomes[status];
	}

	function classeStatusContrato(
		status: ContratoStatus
	) {
		const classes: Record<ContratoStatus, string> = {
			vigente: "text-bg-success",
			encerrado: "text-bg-secondary",
			suspenso: "text-bg-warning",
		};

		return classes[status];
	}

	function renderizarContrato(contrato: Contrato) {
		return (
			<div
				className="col-12"
				key={contrato.id}
			>
				<div className="card h-100">
					<div className="card-body">
						<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-3">
							<div>
								<h3 className="h5 mb-1">
									Contrato {contrato.numero}
								</h3>

								<small className="text-body-secondary">
									ID #{contrato.id}
								</small>
							</div>

							{contrato.status ? (
								<span
									className={`badge ${classeStatusContrato(
										contrato.status
									)}`}
								>
									{formatarStatusContrato(
										contrato.status
									)}
								</span>
							) : (
								<span className="text-warning fw-semibold">
									Informação não disponível.
								</span>
							)}
						</div>

						<div className="row g-3">
							<CampoDetalhe
								titulo="Fornecedor"
								valor={contrato.fornecedor?.nome}
								className="col-12 col-lg-6"
							/>

							<CampoDetalhe
								titulo="Valor"
								valor={formatarMoeda(
									contrato.valor
								)}
								className="col-12 col-sm-6 col-lg-3"
							/>

							<CampoDetalhe
								titulo="Data de início"
								valor={formatarData(
									contrato.data_inicio
								)}
								className="col-12 col-sm-6 col-lg-3"
							/>

							<CampoDetalhe
								titulo="Data de fim"
								valor={formatarData(
									contrato.data_fim
								)}
								className="col-12 col-sm-6 col-lg-3"
							/>

							<CampoDetalhe
								titulo="Suspenso em"
								valor={formatarData(
									contrato.suspenso_em
								)}
								className="col-12 col-sm-6 col-lg-3"
							/>

							<CampoDetalhe
								titulo="Encerrado em"
								valor={formatarData(
									contrato.encerrado_em
								)}
								className="col-12 col-sm-6 col-lg-3"
							/>

							<CampoDetalhe
								titulo="Objeto"
								valor={contrato.objeto}
								className="col-12"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
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
		);
	}

	if (erro) {
		return (
			<>
				<div className="alert alert-danger" role="alert">
					{erro}
				</div>

				<Link
					className="btn btn-outline-primary"
					to="/orcamentos"
				>
					Voltar para orçamentos
				</Link>
			</>
		);
	}

	if (!orcamento) {
		return null;
	}

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
				<div>
					<Link
						className="text-decoration-none"
						to="/orcamentos"
					>
						← Voltar para orçamentos
					</Link>

					<div className="d-flex flex-wrap align-items-center gap-2 mt-3">
						<h1 className="h2 mb-0">
							Orçamento #{orcamento.id}
						</h1>

						{orcamento.status && (
							<span className="badge text-bg-primary">
								{formatarStatusOrcamento(
									orcamento.status
								)}
							</span>
						)}

						{orcamento.revisado_em && (
							<span className="badge text-bg-success">
								Revisado
							</span>
						)}
					</div>

					<p className="text-body-secondary mt-2 mb-0">
						Exercício {orcamento.ano}
					</p>
				</div>
			</div>

			{mensagemSucesso && (
				<div
					className="alert alert-success alert-dismissible fade show"
					role="alert"
				>
					{mensagemSucesso}

					<button
						className="btn-close"
						type="button"
						aria-label="Fechar"
						onClick={() =>
							setMensagemSucesso("")
						}
					/>
				</div>
			)}

			<div className="card shadow-sm mb-4">
				<div className="card-header">
					<strong>Classificação orçamentária</strong>
				</div>

				<div className="card-body">
					<div className="row g-4">
						<CampoDetalhe
							titulo="Ano"
							valor={orcamento.ano}
						/>

						<CampoDetalhe
							titulo="Unidade gestora"
							valor={
								orcamento.unidade_gestora?.nome
							}
						/>

						<CampoDetalhe
							titulo="Órgão"
							valor={
								orcamento.unidade_gestora?.orgao
									? `${orcamento.unidade_gestora.orgao.sigla} - ${orcamento.unidade_gestora.orgao.nome}`
									: null
							}
						/>

						<CampoDetalhe
							titulo="Programa"
							valor={
								orcamento.acao?.programa
									? `${orcamento.acao.programa.codigo} - ${orcamento.acao.programa.nome}`
									: null
							}
						/>

						<CampoDetalhe
							titulo="Ação"
							valor={
								orcamento.acao
									? `${orcamento.acao.codigo} - ${orcamento.acao.nome}`
									: null
							}
						/>

						<CampoDetalhe
							titulo="Função"
							valor={
								orcamento.subfuncao?.funcao
									? `${orcamento.subfuncao.funcao.codigo} - ${orcamento.subfuncao.funcao.nome}`
									: null
							}
						/>

						<CampoDetalhe
							titulo="Subfunção"
							valor={orcamento.subfuncao?.nome}
						/>

						<CampoDetalhe
							titulo="Natureza da despesa"
							valor={
								orcamento.natureza_despesa?.nome
							}
						/>

						<CampoDetalhe
							titulo="Fonte de recurso"
							valor={
								orcamento.fonte_recurso?.nome
							}
						/>

						<CampoDetalhe
							titulo="Status"
							valor={formatarStatusOrcamento(
								orcamento.status
							)}
						/>
					</div>
				</div>
			</div>

			<div className="card shadow-sm mb-4">
				<div className="card-header">
					<strong>Valores orçamentários</strong>
				</div>

				<div className="card-body">
					<div className="row g-4">
						<CampoDetalhe
							titulo="Dotação inicial"
							valor={formatarMoeda(
								orcamento.dotacao_inicial
							)}
						/>

						<CampoDetalhe
							titulo="Suplementações"
							valor={formatarMoeda(
								orcamento.suplementacoes
							)}
						/>

						<CampoDetalhe
							titulo="Anulações"
							valor={formatarMoeda(
								orcamento.anulacoes
							)}
						/>

						<CampoDetalhe
							titulo="Dotação atualizada"
							valor={formatarMoeda(
								orcamento.dotacao_atualizada
							)}
						/>

						<CampoDetalhe
							titulo="Valor empenhado"
							valor={formatarMoeda(
								orcamento.valor_empenhado
							)}
						/>

						<CampoDetalhe
							titulo="Valor liquidado"
							valor={formatarMoeda(
								orcamento.valor_liquidado
							)}
						/>

						<CampoDetalhe
							titulo="Valor pago"
							valor={formatarMoeda(
								orcamento.valor_pago
							)}
						/>

						<CampoDetalhe
							titulo="Saldo"
							valor={formatarMoeda(
								orcamento.saldo
							)}
						/>

						<CampoDetalhe
							titulo="Percentual de execução"
							valor={
								orcamento.percentual_execucao !==
									null &&
								orcamento.percentual_execucao !==
									undefined
									? `${orcamento.percentual_execucao}%`
									: null
							}
						/>
					</div>

					<div className="mt-4">
						<div className="d-flex justify-content-between mb-2">
							<span>Execução orçamentária</span>

							<strong>
								{orcamento.percentual_execucao !==
									null &&
								orcamento.percentual_execucao !==
									undefined
									? `${orcamento.percentual_execucao}%`
									: "Informação não disponível."}
							</strong>
						</div>

						{orcamento.percentual_execucao !== null &&
						orcamento.percentual_execucao !==
							undefined ? (
							<div
								className="progress"
								role="progressbar"
								aria-label="Percentual de execução orçamentária"
								aria-valuenow={
									orcamento.percentual_execucao
								}
								aria-valuemin={0}
								aria-valuemax={100}
								style={{ height: "24px" }}
							>
								<div
									className="progress-bar"
									style={{
										width: `${Math.min(
											orcamento.percentual_execucao,
											100
										)}%`,
									}}
								>
									{orcamento.percentual_execucao}%
								</div>
							</div>
						) : (
							<div className="text-warning fw-semibold">
								Informação não disponível.
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="card shadow-sm mb-4">
				<div className="card-header">
					<strong>Revisão</strong>
				</div>

				<div className="card-body">
					{orcamento.revisado_em ? (
						<div className="row g-4">
							<CampoDetalhe
								titulo="Revisor"
								valor={orcamento.revisor?.name}
							/>

							<CampoDetalhe
								titulo="E-mail do revisor"
								valor={orcamento.revisor?.email}
							/>

							<CampoDetalhe
								titulo="Data da revisão"
								valor={formatarDataHora(
									orcamento.revisado_em
								)}
							/>

							<CampoDetalhe
								titulo="Observação"
								valor={
									orcamento.observacao_revisao
								}
								className="col-12"
							/>
						</div>
					) : (
						<form onSubmit={marcarComoRevisado}>
							{erroRevisao && (
								<div
									className="alert alert-danger"
									role="alert"
								>
									{erroRevisao}
								</div>
							)}

							<div className="mb-3">
								<label
									className="form-label"
									htmlFor="observacao-revisao"
								>
									Observação da revisão
								</label>

								<textarea
									id="observacao-revisao"
									className="form-control"
									rows={4}
									maxLength={1000}
									value={observacaoRevisao}
									onChange={(event) =>
										setObservacaoRevisao(
											event.target.value
										)
									}
									placeholder="Observação opcional"
									disabled={revisando}
								/>

								<div className="form-text text-end">
									{observacaoRevisao.length}/1000
								</div>
							</div>

							<button
								className="btn btn-success"
								type="submit"
								disabled={revisando}
							>
								{revisando && (
									<span
										className="spinner-border spinner-border-sm me-2"
										aria-hidden="true"
									/>
								)}

								{revisando
									? "Marcando como revisado..."
									: "Marcar como Revisado"}
							</button>
						</form>
					)}
				</div>
			</div>

			<div className="card shadow-sm">
				<div className="card-header d-flex justify-content-between align-items-center">
					<strong>Contratos vinculados</strong>

					<span className="badge text-bg-secondary">
						{orcamento.contratos?.length ?? 0}
					</span>
				</div>

				<div className="card-body">
					{!orcamento.contratos ||
					orcamento.contratos.length === 0 ? (
						<div
							className="alert alert-info mb-0"
							role="alert"
						>
							Nenhum contrato está vinculado a este
							orçamento.
						</div>
					) : (
						<div className="row g-3">
							{orcamento.contratos.map(
								renderizarContrato
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}