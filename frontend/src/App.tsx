import {
	Navigate,
	Route,
	Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import { useAuth } from "./contexts/AuthContext";
import Contratos from "./pages/Contratos";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import OrcamentoDetalhe from "./pages/OrcamentoDetalhe/OrcamentoDetalhe";
import Orcamentos from "./pages/Orcamentos";
import PrivateRoute from "./routes";
import Orgaos from "./pages/Orgaos";

function RedirecionamentoPadrao() {
	const { token } = useAuth();

	return (
		<Navigate
			to={token ? "/dashboard" : "/login"}
			replace
		/>
	);
}

export default function App() {
	return (
		<Routes>
			<Route
				path="/login"
				element={<Login />}
			/>

			<Route
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}
			>
				<Route
					path="/dashboard"
					element={<Dashboard />}
				/>

				<Route
					path="/orcamentos"
					element={<Orcamentos />}
				/>

				<Route
					path="/orcamentos/:id"
					element={<OrcamentoDetalhe />}
				/>

				<Route
					path="/contratos"
					element={<Contratos />}
				/>

				<Route
					path="/orgaos"
					element={<Orgaos />}
				/>
			</Route>

			<Route
				path="*"
				element={<RedirecionamentoPadrao />}
			/>
		</Routes>
	);
}