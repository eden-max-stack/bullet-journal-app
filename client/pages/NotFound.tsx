import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="max-w-2xl text-center">
        <div className="mb-10">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">Page not found</h1>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/">
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
            Return to Home
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
