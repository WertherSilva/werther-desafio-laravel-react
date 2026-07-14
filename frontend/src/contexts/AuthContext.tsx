import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

interface JwtPayload {
	exp: number;
	preferred_username: string;
}

interface AuthContextType {
	token: string | null;
	usuario: string | null;
	login: (token: string) => void;
	logout: () => void;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function lerPayload(token: string): JwtPayload | null {
	try {
		const payload = token.split(".")[1];
		const base64 = payload
			.replace(/-/g, "+")
			.replace(/_/g, "/");

		return JSON.parse(atob(base64));
	} catch {
		return null;
	}
}

export function AuthProvider({
	children,
}: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);

	const payload = token ? lerPayload(token) : null;
	const usuario = payload?.preferred_username ?? null;

	function login(novoToken: string) {
		localStorage.setItem("token", novoToken);
		setToken(novoToken);
	}

	function logout() {
		localStorage.removeItem("token");
		setToken(null);
	}

	useEffect(() => {
		if (!payload?.exp) {
			return;
		}

		const tempoAteExpirar =
			payload.exp * 1000 - Date.now();

		if (tempoAteExpirar <= 0) {
			logout();
			return;
		}

		const timer = window.setTimeout(
			logout,
			tempoAteExpirar
		);

		return () => window.clearTimeout(timer);
	}, [token]);

	return (
		<AuthContext.Provider
			value={{
				token,
				usuario,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const contexto = useContext(AuthContext);

	if (!contexto) {
		throw new Error(
			"useAuth deve ser usado dentro de AuthProvider."
		);
	}

	return contexto;
}