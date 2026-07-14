import {
	useEffect,
	useState,
	type FormEvent,
} from "react";
import {
	useNavigate,
} from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
	const navigate = useNavigate();
	const { login, token } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [erro, setErro] = useState("");

	useEffect(() => {
		if (token) {
			navigate("/dashboard", {
				replace: true,
			});
		}
	}, [navigate, token]);

	async function handleSubmit(
		event: FormEvent<HTMLFormElement>
	) {
		event.preventDefault();

		try {
			setLoading(true);
			setErro("");

			const response = await api.post<string>(
				"/auth/login",
				{
					email,
					password,
				},
				{
					responseType: "text",
				}
			);

			login(response.data);

			navigate("/dashboard", {
				replace: true,
			});
		} catch {
			setErro(
				"Não foi possível entrar. Verifique o e-mail e a senha."
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container vh-100 d-flex align-items-center justify-content-center">

		<div
			className="card shadow"
			style={{ maxWidth: 420, width: "100%" }}
		>

			<div className="card-body">

			<h3 className="text-center mb-4">
				Login
			</h3>

			{erro && (
				<div className="alert alert-danger">
				{erro}
				</div>
			)}

			<form onSubmit={handleSubmit}>

				<div className="mb-3">

				<label className="form-label">
					Email
				</label>

				<input
					className="form-control"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				</div>

				<div className="mb-4">

				<label className="form-label">
					Senha
				</label>

				<input
					className="form-control"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				</div>

				<button
				className="btn btn-primary w-100"
				disabled={loading}
				>
				{loading ? "Entrando..." : "Entrar"}
				</button>

			</form>

			</div>

		</div>

		</div>
	);
}