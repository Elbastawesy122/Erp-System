"use client";

import { HeatmapLoader } from "react-loadly";
import { useState, useEffect } from "react";

function LoadlyProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <HeatmapLoader
          size={80}
          color="#a39999"
          speed={1}
          aria-label="Loading"
          showText={true}
          loadingText="Loading..."
          loaderCenter={true}
          rows={5}
          cols={5}
        />
      </div>
    );
  }

  return <>{children}</>;
}

export default LoadlyProvider;
