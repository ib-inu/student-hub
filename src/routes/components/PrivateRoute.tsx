// components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

interface PrivateRouteProps {
    children: JSX.Element;
}

// eslint-disable-next-line react/prop-types
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser } = useAuth();
    console.log(currentUser);

    return currentUser ? children : <Navigate to="/login" />;
    // return children;
};

export default PrivateRoute;
