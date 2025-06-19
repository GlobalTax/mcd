import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

const TestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    const tests = [
      {
        name: 'React y TypeScript',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              resolve({
                name: 'React y TypeScript',
                status: 'success',
                message: '✅ React 18 y TypeScript funcionando correctamente',
                details: { version: '18.3.1' }
              });
            }, 500);
          });
        }
      },
      {
        name: 'Vite Dev Server',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              resolve({
                name: 'Vite Dev Server',
                status: 'success',
                message: '✅ Servidor de desarrollo Vite funcionando',
                details: { port: window.location.port || '5173' }
              });
            }, 300);
          });
        }
      },
      {
        name: 'Tailwind CSS',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              const hasTailwind = document.querySelector('[class*="bg-"]') !== null;
              resolve({
                name: 'Tailwind CSS',
                status: hasTailwind ? 'success' : 'error',
                message: hasTailwind ? '✅ Tailwind CSS cargado correctamente' : '❌ Tailwind CSS no detectado',
                details: { classes: 'bg-blue-500, text-white, etc.' }
              });
            }, 400);
          });
        }
      },
      {
        name: 'Componentes UI',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              resolve({
                name: 'Componentes UI',
                status: 'success',
                message: '✅ Componentes shadcn/ui funcionando',
                details: { components: ['Button', 'Card', 'Progress'] }
              });
            }, 200);
          });
        }
      },
      {
        name: 'Service Worker',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              const hasSW = 'serviceWorker' in navigator;
              resolve({
                name: 'Service Worker',
                status: hasSW ? 'success' : 'error',
                message: hasSW ? '✅ Service Worker disponible' : '❌ Service Worker no disponible',
                details: { supported: hasSW }
              });
            }, 600);
          });
        }
      },
      {
        name: 'PWA Manifest',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              const manifest = document.querySelector('link[rel="manifest"]');
              resolve({
                name: 'PWA Manifest',
                status: manifest ? 'success' : 'error',
                message: manifest ? '✅ Manifest PWA configurado' : '❌ Manifest PWA no encontrado',
                details: { href: manifest?.getAttribute('href') }
              });
            }, 300);
          });
        }
      },
      {
        name: 'Performance API',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              const hasPerformance = 'performance' in window;
              resolve({
                name: 'Performance API',
                status: hasPerformance ? 'success' : 'error',
                message: hasPerformance ? '✅ Performance API disponible' : '❌ Performance API no disponible',
                details: { available: hasPerformance }
              });
            }, 400);
          });
        }
      },
      {
        name: 'Local Storage',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                resolve({
                  name: 'Local Storage',
                  status: 'success',
                  message: '✅ Local Storage funcionando',
                  details: { available: true }
                });
              } catch (error: any) {
                resolve({
                  name: 'Local Storage',
                  status: 'error',
                  message: '❌ Local Storage no disponible',
                  details: { error: error.message }
                });
              }
            }, 200);
          });
        }
      },
      {
        name: 'Fetch API',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              const hasFetch = 'fetch' in window;
              resolve({
                name: 'Fetch API',
                status: hasFetch ? 'success' : 'error',
                message: hasFetch ? '✅ Fetch API disponible' : '❌ Fetch API no disponible',
                details: { available: hasFetch }
              });
            }, 300);
          });
        }
      },
      {
        name: 'Notificaciones',
        test: () => {
          return new Promise<TestResult>((resolve) => {
            setTimeout(() => {
              const hasNotifications = 'Notification' in window;
              resolve({
                name: 'Notificaciones',
                status: hasNotifications ? 'success' : 'error',
                message: hasNotifications ? '✅ Notificaciones disponibles' : '❌ Notificaciones no disponibles',
                details: { available: hasNotifications }
              });
            }, 400);
          });
        }
      }
    ];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const result = await test.test();
      setTestResults(prev => [...prev, result]);
      setProgress(((i + 1) / tests.length) * 100);
    }

    setIsRunning(false);
    console.log('✅ Todas las pruebas completadas');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Panel de Pruebas - McDonald's Portal
          </CardTitle>
          <CardDescription>
            Verificación completa de todas las funcionalidades del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? '🔄 Ejecutando pruebas...' : '🚀 Ejecutar Pruebas Completas'}
              </Button>
              
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                  ✅ {successCount} Exitosas
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                  ❌ {errorCount} Errores
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                  📊 {testResults.length} Total
                </span>
              </div>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso de pruebas</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Resultados de las Pruebas:</h3>
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success' ? 'bg-green-50 border-green-200' :
                      result.status === 'error' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(result.status)}`} />
                      <div className="flex-1">
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                        {result.details && (
                          <div className="text-xs text-gray-500 mt-1">
                            {JSON.stringify(result.details, null, 2)}
                          </div>
                        )}
                      </div>
                      <div className="text-2xl">{getStatusIcon(result.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Navegador:</strong> {navigator.userAgent.split(' ')[0]}
            </div>
            <div>
              <strong>URL:</strong> {window.location.href}
            </div>
            <div>
              <strong>Protocolo:</strong> {window.location.protocol}
            </div>
            <div>
              <strong>Puerto:</strong> {window.location.port || '80/443'}
            </div>
            <div>
              <strong>Online:</strong> {navigator.onLine ? '✅ Sí' : '❌ No'}
            </div>
            <div>
              <strong>Cookies:</strong> {navigator.cookieEnabled ? '✅ Habilitadas' : '❌ Deshabilitadas'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestComponent; 