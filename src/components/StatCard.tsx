/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'orange' | 'green' | 'red';
}

const colorMap = {
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-500/10',
  orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20 shadow-orange-500/10',
  green: 'text-green-400 bg-green-400/10 border-green-400/20 shadow-green-500/10',
  red: 'text-red-400 bg-red-400/10 border-red-400/20 shadow-red-500/10',
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card p-6 rounded-3xl flex flex-col gap-4",
        "transition-colors duration-300"
      )}
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", colorMap[color])}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium tracking-wide uppercase">{label}</h3>
        <p className="text-4xl font-bold text-white mt-1 tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
