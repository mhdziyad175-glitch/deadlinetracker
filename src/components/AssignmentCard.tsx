/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Clock, MoreVertical, CheckCircle2, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow, isPast, isWithinInterval, addDays } from 'date-fns';
import { Assignment } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleStatus: (id: string) => void | Promise<void>;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void | Promise<void>;
  key?: string | number;
}

export function AssignmentCard({ assignment, onToggleStatus, onEdit, onDelete }: AssignmentCardProps) {
  const dueDate = new Date(assignment.dueDate);
  const overdue = isPast(dueDate) && assignment.status === 'pending';
  const urgent = !overdue && isWithinInterval(dueDate, { 
    start: new Date(), 
    end: addDays(new Date(), 2) 
  });
  
  const getUrgencyStyles = () => {
    if (assignment.status === 'completed') return 'bg-green-500/10 border-green-500/20 text-green-400';
    if (overdue) return 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse';
    if (urgent) return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  };

  const getThemeGlow = () => {
    if (assignment.status === 'completed') return 'safe-glow';
    if (overdue || assignment.priority === 'high') return 'urgent-glow'; // High priority or overdue get the urgent glow
    if (assignment.priority === 'medium') return 'warning-glow';
    return 'safe-glow';
  };

  const priorityColors = {
    low: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    medium: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    high: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "glass-card p-5 rounded-2xl group relative overflow-hidden flex flex-col gap-4 transition-all",
        getThemeGlow(),
        assignment.status === 'completed' && "opacity-75"
      )}
    >
      {/* Decorative element from design (removing the strip and using glow instead) */}
      <div className="absolute inset-0 bg-white/1 opacity-[0.02] pointer-events-none" />

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", priorityColors[assignment.priority])}>
              {assignment.priority} Priority
            </span>
            {overdue && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500 text-white animate-bounce">
                <AlertCircle size={10} /> Overdue
              </span>
            )}
          </div>
          <h3 className={cn(
            "text-lg font-semibold text-white transition-all",
            assignment.status === 'completed' && "line-through text-slate-500"
          )}>
            {assignment.title}
          </h3>
          <p className="text-slate-400 text-sm font-medium">{assignment.module}</p>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(assignment)}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(assignment.id)}
            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-auto">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Calendar size={14} className="text-brand-primary" />
          <span>{format(dueDate, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Clock size={14} className="text-brand-secondary" />
          <span className={cn(overdue && "text-red-400 font-bold")}>
            {assignment.status === 'completed' ? 'Completed' : formatDistanceToNow(dueDate, { addSuffix: true })}
          </span>
        </div>
      </div>

      <button
        onClick={() => onToggleStatus(assignment.id)}
        className={cn(
          "mt-2 w-full py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all border",
          getUrgencyStyles()
        )}
      >
        <CheckCircle2 size={18} className={assignment.status === 'completed' ? "fill-green-400 text-white" : ""} />
        {assignment.status === 'completed' ? 'Completed' : 'Mark as Done'}
      </button>
    </motion.div>
  );
}
