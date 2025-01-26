// components/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';


interface PublicRouteProps {
    children: JSX.Element;
}

// eslint-disable-next-line react/prop-types
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { currentUser } = useAuth();

    return currentUser ? <Navigate to="/" /> : children;
};

export default PublicRoute;
