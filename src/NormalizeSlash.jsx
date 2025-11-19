import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NormalizeSlash() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!import.meta.env.DEV) return; // prod에서는 동작하지 않음

        if (location.pathname === "/user") {
            navigate("/user/", { replace: true });
        }
    }, [location.pathname, navigate]);

    return null;
}
