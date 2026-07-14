import {
	Link,
	useLocation,
	useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
	const { usuario, logout } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const [saindo, setSaindo] = useState(false);

	async function handleLogout() {
		try {
			setSaindo(true);
			await logout();
			navigate("/login", {
				replace: true,
			});
		} finally {
			setSaindo(false);
		}
	}

	function linkEstaAtivo(caminho: string) {
		if (caminho === "/dashboard") {
			return location.pathname === caminho;
		}

		return location.pathname.startsWith(caminho);
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
			<div className="container">
				<Link
					className="navbar-brand fw-bold"
					to="/dashboard"
				>
					SEPLAG
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#menu-principal"
					aria-controls="menu-principal"
					aria-expanded="false"
					aria-label="Abrir menu"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div
					id="menu-principal"
					className="collapse navbar-collapse"
				>
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link
								to="/dashboard"
								className={`nav-link ${
									linkEstaAtivo(
										"/dashboard"
									)
										? "active"
										: ""
								}`}
							>
								Dashboard
							</Link>
						</li>

						<li className="nav-item">
							<Link
								to="/orcamentos"
								className={`nav-link ${
									linkEstaAtivo(
										"/orcamentos"
									)
										? "active"
										: ""
								}`}
							>
								Orçamentos
							</Link>
						</li>

						<li className="nav-item">
							<Link
								to="/contratos"
								className={`nav-link ${
									linkEstaAtivo(
										"/contratos"
									)
										? "active"
										: ""
								}`}
							>
								Contratos
							</Link>
						</li>

						<li className="nav-item">
							<Link
								to="/orgaos"
								className={`nav-link ${
									linkEstaAtivo("/orgaos")
										? "active"
										: ""
								}`}
							>
								Órgãos
							</Link>
						</li>
					</ul>

					<div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3 py-2 py-lg-0">
						<span
							className="text-white text-break"
							title={usuario ?? undefined}
						>
							{usuario ??
								"Usuário autenticado"}
						</span>

						<button
							className="btn btn-outline-light btn-sm"
							type="button"
							onClick={handleLogout}
							disabled={saindo}
						>
							{saindo && (
								<span
									className="spinner-border spinner-border-sm me-2"
									aria-hidden="true"
								/>
							)}

							{saindo
								? "Saindo..."
								: "Logout"}
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}