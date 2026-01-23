
import React from 'react';
import { PodStatus } from '../types';

interface K8sVisualizerProps {
  pods: PodStatus[];
}

const K8sVisualizer: React.FC<K8sVisualizerProps> = ({ pods }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 15.6V9.4l7 3.1v6.2l-7-3.1zm9 3.1v-6.2l7-3.1v6.2l-7 3.1z"/>
          </svg>
          Cluster Visualizer (Minikube)
        </h3>
        <span className="text-xs font-mono px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded uppercase">
          Healthy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pods.map((pod, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg p-4 transition-all hover:border-blue-500/50">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-mono text-slate-300 truncate w-32">{pod.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                pod.status === 'Running' ? 'bg-green-500/20 text-green-400' : 
                pod.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {pod.status}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Restarts</span>
                <span className="text-slate-300 font-mono">{pod.restarts}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Age</span>
                <span className="text-slate-300 font-mono">{pod.age}</span>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${pod.status === 'Running' ? 'bg-blue-500 w-full' : 'bg-slate-600 w-1/3 animate-pulse'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default K8sVisualizer;
