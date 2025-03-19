declare module 'swagger-ui-react' {
    import { ComponentType } from 'react';
  
    export interface SwaggerUIProps {
      spec?: object;
      url?: string;
      requestInterceptor?: (req: any) => any;
      responseInterceptor?: (res: any) => any;
      onComplete?: (system: any) => void;
      docExpansion?: 'list' | 'full' | 'none';
      defaultModelExpandDepth?: number;
      defaultModelsExpandDepth?: number;
      showExtensions?: boolean;
      showCommonExtensions?: boolean;
      supportedSubmitMethods?: string[];
      [key: string]: any;
    }
  
    const SwaggerUI: ComponentType<SwaggerUIProps>;
    export default SwaggerUI;
  }
  
  declare module 'swagger-ui-react/swagger-ui.css' {
    const content: any;
    export default content;
  }