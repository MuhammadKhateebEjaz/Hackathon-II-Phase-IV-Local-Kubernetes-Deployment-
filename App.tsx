
import React, { useState, useEffect } from 'react';
import { DeploymentStep, PodStatus, TodoItem } from './types';
import ChatInterface from './components/ChatInterface';
import K8sVisualizer from './components/K8sVisualizer';
import { getK8sHealthAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<DeploymentStep>(DeploymentStep.SPEC);
  const [pods, setPods] = useState<PodStatus[]>([
    { name: 'todo-frontend-7c85d', status: 'Running', restarts: 0, age: '14m' },
    { name: 'todo-backend-8f21e', status: 'Running', restarts: 1, age: '12m' },
    { name: 'redis-master-0', status: 'Running', restarts: 0, age: '2d' },
  ]);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Define Phase IV Spec', status: 'completed', category: 'infra' },
    { id: '2', text: 'Generate Helm Charts', status: 'pending', category: 'infra' },
    { id: '3', text: 'Containerize Backend with Gordon', status: 'pending', category: 'backend' },
  ]);
  const [healthReport, setHealthReport] = useState<string>('Initializing health audit...');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const analysis = await getK8sHealthAnalysis(pods);
        setHealthReport(analysis || 'Health data unavailable.');
      } catch (e) {
        setHealthReport('Analysis failed. Check API Key.');
      }
    };
    fetchHealth();
  }, []);

  const handleCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd.includes('scale') || lowerCmd.includes('replica')) {
      const newPod: PodStatus = { 
        name: `todo-frontend-${Math.random().toString(36).substring(2, 7)}`, 
        status: 'Pending', 
        restarts: 0, 
        age: '1s' 
      };
      setPods(prev => [...prev, newPod]);
      setTimeout(() => {
        setPods(current => current.map(p => p.name === newPod.name ? { ...p, status: 'Running' } : p));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="font-bold text-xl tracking-tight">Cloud Native <span className="text-blue-500">Todo K8s</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {Object.values(DeploymentStep).map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`px-3 py-1 text-sm font-medium transition-colors relative ${
                activeStep === step ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {step}
              {activeStep === step && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-mono text-slate-300">Minikube Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Left Side: Workflow & Insights */}
        <div className="flex-1 space-y-8">
          {/* Welcome Card */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 15.6V9.4l7 3.1v6.2l-7-3.1zm9 3.1v-6.2l7-3.1v6.2l-7 3.1z"/>
              </svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Phase IV: Local Kubernetes Deployment</h2>
              <p className="text-slate-400 max-w-xl">
                Deploying the Todo Chatbot using the Agentic Dev Stack workflow: 
                <span className="text-blue-400 font-semibold italic"> Spec → Plan → Tasks → Implement</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded text-xs font-mono">Gordon (Docker AI)</span>
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded text-xs font-mono">kubectl-ai</span>
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded text-xs font-mono">Helm Charts</span>
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded text-xs font-mono">Kagent</span>
              </div>
            </div>
          </section>

          {/* Pod Status Visualizer */}
          <K8sVisualizer pods={pods} />

          {/* AI Insights & Kagent Report */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Kagent Intelligence Report
            </h3>
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
              {healthReport.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </section>

          {/* Progress Board */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Todo Progress Board</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todos.map(todo => (
                <div key={todo.id} className="bg-slate-800/30 border border-slate-700 p-4 rounded-xl flex items-center gap-4 group hover:bg-slate-800/50 transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    todo.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {todo.status === 'completed' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${todo.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {todo.text}
                    </p>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">{todo.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Chatbot Agent Terminal */}
        <div className="w-full lg:w-[400px] h-[600px] lg:h-auto sticky top-24">
          <ChatInterface onCommand={handleCommand} />
        </div>
      </main>

      <footer className="p-8 border-t border-slate-800 text-center text-slate-500 text-xs flex flex-col gap-2">
        <p>&copy; 2024 Phase IV Cloud Native Initiative. Powered by Google Gemini & Agentic Dev Stack.</p>
        <p className="font-medium text-slate-400">Developed by <span className="text-blue-500">Muhammad Khateeb Ejaz</span></p>
      </footer>
    </div>
  );
};

export default App;
