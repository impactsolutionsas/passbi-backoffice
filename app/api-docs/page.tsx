'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Import dynamique pour éviter les problèmes de SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    async function fetchSpec() {
      const response = await fetch('/api/docs');
      const data = await response.json();
      setSpec(data);
    }
    fetchSpec();
  }, []);

  if (!spec) {
    return <div className="flex items-center justify-center min-h-screen">Chargement de la documentation...</div>;
  }

  return (
    <div className="swagger-container">
      <SwaggerUI spec={spec} />
      <style jsx global>{`
        .swagger-ui .opblock-tag {
          font-size: 20px;
          margin: 10px 0;
        }
        .swagger-ui .opblock .opblock-summary-operation-id {
          font-size: 14px;
        }
        .swagger-ui .opblock .opblock-summary-path {
          font-size: 14px;
          font-weight: bold;
        }
        .swagger-container {
          margin: 20px;
        }
      `}</style>
    </div>
  );
}