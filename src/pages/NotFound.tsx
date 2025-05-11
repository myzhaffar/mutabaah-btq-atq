
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-kid-red to-kid-orange rounded-full flex items-center justify-center text-white text-4xl font-bold">
          404
        </div>
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-kid-red to-kid-orange bg-clip-text text-transparent">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="rounded-full bg-gradient-to-r from-kid-green to-kid-teal text-white hover:opacity-90"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
