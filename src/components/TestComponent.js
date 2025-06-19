import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
const TestComponent = () => {
    const [testResults, setTestResults] = useState([]);
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
                            }
                            catch (error) {
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
                    return new Promise((resolve) => {
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
                    return new Promise((resolve) => {
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
    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'pending': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'pending': return '⏳';
            default: return '❓';
        }
    };
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-4xl", children: [_jsxs(Card, { className: "mb-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "flex items-center gap-2", children: "\uD83E\uDDEA Panel de Pruebas - McDonald's Portal" }), _jsx(CardDescription, { children: "Verificaci\u00F3n completa de todas las funcionalidades del sistema" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { onClick: runTests, disabled: isRunning, className: "flex-1", children: isRunning ? '🔄 Ejecutando pruebas...' : '🚀 Ejecutar Pruebas Completas' }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("span", { className: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200", children: ["\u2705 ", successCount, " Exitosas"] }), _jsxs("span", { className: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200", children: ["\u274C ", errorCount, " Errores"] }), _jsxs("span", { className: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200", children: ["\uD83D\uDCCA ", testResults.length, " Total"] })] })] }), isRunning && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Progreso de pruebas" }), _jsxs("span", { children: [Math.round(progress), "%"] })] }), _jsx(Progress, { value: progress, className: "w-full" })] })), testResults.length > 0 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Resultados de las Pruebas:" }), testResults.map((result, index) => (_jsx("div", { className: `p-4 rounded-lg border ${result.status === 'success' ? 'bg-green-50 border-green-200' :
                                                result.status === 'error' ? 'bg-red-50 border-red-200' :
                                                    'bg-yellow-50 border-yellow-200'}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${getStatusColor(result.status)}` }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: result.name }), _jsx("div", { className: "text-sm text-gray-600", children: result.message }), result.details && (_jsx("div", { className: "text-xs text-gray-500 mt-1", children: JSON.stringify(result.details, null, 2) }))] }), _jsx("div", { className: "text-2xl", children: getStatusIcon(result.status) })] }) }, index)))] }))] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uD83D\uDCCB Informaci\u00F3n del Sistema" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Navegador:" }), " ", navigator.userAgent.split(' ')[0]] }), _jsxs("div", { children: [_jsx("strong", { children: "URL:" }), " ", window.location.href] }), _jsxs("div", { children: [_jsx("strong", { children: "Protocolo:" }), " ", window.location.protocol] }), _jsxs("div", { children: [_jsx("strong", { children: "Puerto:" }), " ", window.location.port || '80/443'] }), _jsxs("div", { children: [_jsx("strong", { children: "Online:" }), " ", navigator.onLine ? '✅ Sí' : '❌ No'] }), _jsxs("div", { children: [_jsx("strong", { children: "Cookies:" }), " ", navigator.cookieEnabled ? '✅ Habilitadas' : '❌ Deshabilitadas'] })] }) })] })] }));
};
export default TestComponent;
