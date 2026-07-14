import {
	useEffect,
	useState,
} from "react";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import api from "../../services/api";
import type {
	Dashboard as DashboardType,
	Graficos,
} from "../../types";

export default function Dashboard() {
	const [dashboard, setDashboard] =
		useState<DashboardType | null>(null);

	const [graficos, setGraficos] =
		useState<Graficos | null>(null);

	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState("");
	const [ultimaAtualizacao, setUltimaAtualizacao] =
		useState("");

	useEffect(() => {
		carregarDashboard();
	}, []);

	async function carregarDashboard() {
		try {
			setLoading(true);
			setErro("");

			const [
				dashboardResponse,
				graficosResponse,
			] = await Promise.all([
				api.get<DashboardType>("/dashboard"),
				api.get<Graficos>("/graficos"),
			]);

			setDashboard(dashboardResponse.data);
			setGraficos(graficosResponse.data);

			setUltimaAtualizacao(
				new Date().toLocaleString("pt-BR")
			);
		} catch {
			setErro(
				"Não foi possível carregar o dashboard."
			);
		} finally {
			setLoading(false);
		}
	}

	function formatarMoeda(valor: number) {
		return valor.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
		});
	}

	function formatarValorResumido(valor: number) {
		return new Intl.NumberFormat("pt-BR", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(valor);
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
			<div
				className="alert alert-danger"
				role="alert"
			>
				{erro}
			</div>
		);
	}

	if (!dashboard || !graficos) {
		return null;
	}

	return (
		<>
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
				<div>
					<h1 className="h2 mb-1">
						Dashboard
					</h1>

					<p className="text-body-secondary mb-0">
						Visão geral da execução orçamentária.
					</p>
				</div>

				<small className="text-body-secondary">
					Última atualização: {ultimaAtualizacao}
				</small>
			</div>

			<div className="row g-3">
				<div className="col-12 col-md-6 col-xl-3">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h2 className="h6 text-body-secondary">
								Órgãos
							</h2>

							<p className="display-6 mb-0">
								{dashboard.total_orgaos}
							</p>
						</div>
					</div>
				</div>

				<div className="col-12 col-md-6 col-xl-3">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h2 className="h6 text-body-secondary">
								Contratos
							</h2>

							<p className="display-6 mb-0">
								{dashboard.total_contratos}
							</p>
						</div>
					</div>
				</div>

				<div className="col-12 col-md-6 col-xl-3">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h2 className="h6 text-body-secondary">
								Orçamento total
							</h2>

							<p className="h4 mb-0">
								{formatarMoeda(
									dashboard.orcamento_total
								)}
							</p>
						</div>
					</div>
				</div>

				<div className="col-12 col-md-6 col-xl-3">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h2 className="h6 text-body-secondary">
								Saldo
							</h2>

							<p className="h4 text-success mb-0">
								{formatarMoeda(
									dashboard.saldo
								)}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="card shadow-sm mt-4">
				<div className="card-body">
					<h2 className="h5 mb-4">
						Execução orçamentária geral
					</h2>

					<div className="row g-3 mb-4">
						<div className="col-12 col-md-4">
							<small className="text-body-secondary d-block">
								Empenhado
							</small>

							<strong>
								{formatarMoeda(
									dashboard.empenhado
								)}
							</strong>
						</div>

						<div className="col-12 col-md-4">
							<small className="text-body-secondary d-block">
								Liquidado
							</small>

							<strong>
								{formatarMoeda(
									dashboard.liquidado
								)}
							</strong>
						</div>

						<div className="col-12 col-md-4">
							<small className="text-body-secondary d-block">
								Pago
							</small>

							<strong>
								{formatarMoeda(
									dashboard.pago
								)}
							</strong>
						</div>
					</div>

					<div className="d-flex justify-content-between mb-2">
						<span>
							Percentual de execução
						</span>

						<strong>
							{dashboard.percentual_execucao}%
						</strong>
					</div>

					<div
						className="progress"
						role="progressbar"
						aria-label="Percentual de execução"
						aria-valuenow={
							dashboard.percentual_execucao
						}
						aria-valuemin={0}
						aria-valuemax={100}
						style={{ height: "24px" }}
					>
						<div
							className="progress-bar"
							style={{
								width: `${Math.min(
									dashboard.percentual_execucao,
									100
								)}%`,
							}}
						>
							{dashboard.percentual_execucao}%
						</div>
					</div>
				</div>
			</div>

			<h2 className="h4 mt-5 mb-3">
				Gráficos
			</h2>

			<div className="row g-4">
				<div className="col-12">
					<div className="card shadow-sm">
						<div className="card-header">
							<strong>
								Empenhado, liquidado e pago por ano
							</strong>
						</div>

						<div className="card-body">
							<div style={{ width: "100%", height: 360 }}>
								<ResponsiveContainer>
									<LineChart
										data={
											graficos.empenhado_x_pago
										}
										margin={{
											top: 10,
											right: 20,
											left: 10,
											bottom: 10,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
										/>

										<XAxis
											dataKey="ano"
										/>

										<YAxis
											tickFormatter={
												formatarValorResumido
											}
											width={80}
										/>

										<Tooltip
											formatter={(
												valor
											) =>
												formatarMoeda(
													Number(valor)
												)
											}
										/>

										<Legend />

										<Line
											type="monotone"
											dataKey="empenhado"
											name="Empenhado"
											stroke="#0d6efd"
											strokeWidth={2}
										/>

										<Line
											type="monotone"
											dataKey="liquidado"
											name="Liquidado"
											stroke="#ffc107"
											strokeWidth={2}
										/>

										<Line
											type="monotone"
											dataKey="pago"
											name="Pago"
											stroke="#198754"
											strokeWidth={2}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				<div className="col-12 col-xl-6">
					<div className="card shadow-sm h-100">
						<div className="card-header">
							<strong>
								Execução por órgão
							</strong>
						</div>

						<div className="card-body">
							<div style={{ width: "100%", height: 420 }}>
								<ResponsiveContainer>
									<BarChart
										data={
											graficos.execucao_por_orgao
										}
										layout="vertical"
										margin={{
											top: 10,
											right: 20,
											left: 20,
											bottom: 10,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
										/>

										<XAxis
											type="number"
											tickFormatter={
												formatarValorResumido
											}
										/>

										<YAxis
											type="category"
											dataKey="orgao_sigla"
											width={75}
										/>

										<Tooltip
											formatter={(
												valor
											) =>
												formatarMoeda(
													Number(valor)
												)
											}
											labelFormatter={(
												sigla
											) => `Órgão: ${sigla}`}
										/>

										<Legend />

										<Bar
											dataKey="orcamento_total"
											name="Orçamento total"
											fill="#0d6efd"
										/>

										<Bar
											dataKey="execucao"
											name="Empenhado"
											fill="#198754"
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				<div className="col-12 col-xl-6">
					<div className="card shadow-sm h-100">
						<div className="card-header">
							<strong>
								Execução por programa
							</strong>
						</div>

						<div className="card-body">
							<div style={{ width: "100%", height: 420 }}>
								<ResponsiveContainer>
									<BarChart
										data={
											graficos.execucao_por_programa
										}
										layout="vertical"
										margin={{
											top: 10,
											right: 20,
											left: 20,
											bottom: 10,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
										/>

										<XAxis
											type="number"
											tickFormatter={
												formatarValorResumido
											}
										/>

										<YAxis
											type="category"
											dataKey="programa_codigo"
											width={80}
										/>

										<Tooltip
											formatter={(
												valor
											) =>
												formatarMoeda(
													Number(valor)
												)
											}
											labelFormatter={(
												codigo
											) =>
												`Programa: ${codigo}`
											}
										/>

										<Legend />

										<Bar
											dataKey="orcamento_total"
											name="Orçamento total"
											fill="#0d6efd"
										/>

										<Bar
											dataKey="execucao"
											name="Empenhado"
											fill="#198754"
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				<div className="col-12">
					<div className="card shadow-sm">
						<div className="card-header">
							<strong>
								Maiores contratos por valor
							</strong>
						</div>

						<div className="card-body">
							<div style={{ width: "100%", height: 450 }}>
								<ResponsiveContainer>
									<BarChart
										data={
											graficos.top_contratos
										}
										layout="vertical"
										margin={{
											top: 10,
											right: 30,
											left: 20,
											bottom: 10,
										}}
									>
										<CartesianGrid
											strokeDasharray="3 3"
										/>

										<XAxis
											type="number"
											tickFormatter={
												formatarValorResumido
											}
										/>

										<YAxis
											type="category"
											dataKey="numero"
											width={100}
										/>

										<Tooltip
											formatter={(
												valor
											) =>
												formatarMoeda(
													Number(valor)
												)
											}
											labelFormatter={(
												numero
											) =>
												`Contrato: ${numero}`
											}
										/>

										<Bar
											dataKey="valor"
											name="Valor"
											fill="#0d6efd"
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}