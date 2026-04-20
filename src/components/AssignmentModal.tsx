/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Type, Tag, Flag, StickyNote } from 'lucide-react';
import { Assignment, Priority } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: Partial<Assignment>) => void;
  initialData?: Assignment | null;
}

export function AssignmentModal({ isOpen, onClose, onSubmit, initialData }: AssignmentModalProps) {
  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    module: '',
    dueDate: '',
    priority: 'medium',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        module: '',
        dueDate: '',
        priority: 'medium',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass-card rounded-[32px] overflow-hidden p-8 luxury-shadow"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {initialData ? 'Edit Assignment' : 'Add Assignment'}
                </h2>
                <p className="text-slate-400 text-sm">Fill in the details below to stay organized.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                  <Type size={14} className="text-brand-primary" /> Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Modern Physics Lab Report"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                  <Tag size={14} className="text-brand-secondary" /> Module
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. PHY301"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 transition-all"
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                    <Calendar size={14} className="text-brand-accent" /> Due Date
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all [color-scheme:dark]"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                    <Flag size={14} className="text-orange-400" /> Priority
                  </label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all appearance-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                  <StickyNote size={14} className="text-slate-400" /> Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional details..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
                >
                  {initialData ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
