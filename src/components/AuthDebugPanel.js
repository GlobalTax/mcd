import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Bug, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { debugAuth, authDebugger } from '@/utils/authDebugger';
import { useAuth } from '@/hooks/useAuth';

const AuthDebugPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState(null);
  const { user, loading } = useAuth();

  const runDiagnostic = async () => {
    setIsRunning(true);
    authDebugger.clearLogs();
    
    try {
      const diagnosticReport = await debugAuth();
      setReport(diagnosticReport);
    } catch (error) {
      console.error('Error running diagnostic:', error);
      setReport({
        summary: { errors: 1, warnings: 0, successes: 0 },
        logs: [{ message: '❌ Error ejecutando diagnóstico', data: error }],
        recommendations: ['🔧 Error inesperado durante el diagnóstico']
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bug className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Panel de Diagnóstico de Autenticación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado actual del usuario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-sm text-gray-600">Estado de Usuario</h3>
            <p className="text-lg font-bold">
              {loading ? 'Cargando...' : user ? 'Autenticado' : 'No autenticado'}
            </p>
            {user && (
              <div className="text-sm text-gray-500 mt-1">
                {user.email} ({user.role})
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-sm text-gray-600">ID de Usuario</h3>
            <p className="text-sm font-mono break-all">
              {user?.id || 'N/A'}
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-sm text-gray-600">Rol</h3>
            <Badge variant={user?.role ? 'default' : 'secondary'}>
              {user?.role || 'Sin rol'}
            </Badge>
          </div>
        </div>

        {/* Botón de diagnóstico */}
        <div className="flex justify-center">
          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ejecutando diagnóstico...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Ejecutar Diagnóstico
              </>
            )}
          </Button>
        </div>

        {/* Resultados del diagnóstico */}
        {report && (
          <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{report.summary.totalChecks}</div>
                <div className="text-sm text-gray-600">Total de verificaciones</div>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{report.summary.successes}</div>
                <div className="text-sm text-gray-600">Exitosos</div>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{report.summary.warnings}</div>
                <div className="text-sm text-gray-600">Advertencias</div>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{report.summary.errors}</div>
                <div className="text-sm text-gray-600">Errores</div>
              </div>
            </div>

            {/* Recomendaciones */}
            {report.recommendations.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <strong>Recomendaciones:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {report.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Logs detallados */}
            <div className="space-y-2">
              <h3 className="font-semibold">Logs Detallados:</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {report.logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border text-sm ${getStatusColor(
                      log.message.includes('✅') ? 'success' :
                      log.message.includes('❌') ? 'error' :
                      log.message.includes('⚠️') ? 'warning' : 'default'
                    )}`}
                  >
                    <div className="flex items-start gap-2">
                      {getStatusIcon(
                        log.message.includes('✅') ? 'success' :
                        log.message.includes('❌') ? 'error' :
                        log.message.includes('⚠️') ? 'warning' : 'default'
                      )}
                      <div className="flex-1">
                        <div className="font-mono text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="mt-1">{log.message}</div>
                        {log.data && (
                          <pre className="mt-2 text-xs bg-black bg-opacity-10 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel; 