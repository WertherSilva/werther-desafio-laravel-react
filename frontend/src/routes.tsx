import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "./contexts/AuthContext";

interface PrivateRouteProps {
	children: ReactNode;
}

export default function PrivateRoute({
	children,
}: PrivateRouteProps) {
	const { token } = useAuth();

	if (!token) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return children;
}