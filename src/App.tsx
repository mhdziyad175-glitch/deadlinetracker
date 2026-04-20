/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onSnapshot, 
  collection, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ListTodo,
  ShieldCheck,
  PartyPopper,
  Plus
} from 'lucide-react';
import { auth, db, signInWithGoogle, logout, testConnection } from './lib/firebase';
import { Assignment, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { StatCard } from './components/StatCard';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentModal } from './components/AssignmentModal';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>({
    uid: 'demo-user-123',
    displayName: 'Demo Student',
    email: 'demo@example.com',
    photoURL: 'https://picsum.photos/seed/student/200/200',
  });
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'overdue'>('all');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  useEffect(() => {
    if (!user) {
      setAssignments([]);
      return;
    }

    const q = query(
      collection(db, 'assignments'),
      where('userId', '==', user.uid),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
      setAssignments(data);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const overdue = assignments.filter(a => 
      a.status === 'pending' && new Date(a.dueDate) < new Date()
    ).length;

    return { total, pending, completed, overdue };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    const now = new Date();
    switch (filter) {
      case 'upcoming': 
        return assignments.filter(a => a.status === 'pending' && new Date(a.dueDate) >= now);
      case 'completed': 
        return assignments.filter(a => a.status === 'completed');
      case 'overdue': 
        return assignments.filter(a => a.status === 'pending' && new Date(a.dueDate) < now);
      default: 
        return assignments;
    }
  }, [assignments, filter]);

  const handleAddOrUpdate = async (data: Partial<Assignment>) => {
    if (!user) return;

    try {
      if (editingAssignment) {
        const docRef = doc(db, 'assignments', editingAssignment.id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, 'assignments'), {
          ...data,
          userId: user.uid,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setEditingAssignment(null);
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    const newStatus = assignment.status === 'pending' ? 'completed' : 'pending';
    
    try {
      await updateDoc(doc(db, 'assignments', id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      
      if (newStatus === 'completed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteDoc(doc(db, 'assignments', id));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-deep font-sans pb-20 relative overflow-hidden">
      <div className="fixed inset-0 mesh-bg animate-glow pointer-events-none" />
      
      <Navbar 
        user={user} 
        onAddClick={() => {
          setEditingAssignment(null);
          setIsModalOpen(true);
        }} 
      />

      <main className="relative pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Welcome */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white text-4xl sm:text-5xl font-black tracking-tight mb-2"
            >
              Hi, {user.displayName?.split(' ')[0]} 👋
            </motion.h2>
            <p className="text-slate-400 text-lg font-medium">Ready to conquer your tasks today?</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-6 mb-1">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Overall Progress</p>
                <p className="text-2xl font-black text-white">{completionRate}%</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative p-2">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                  <circle 
                    cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="6" 
                    strokeDasharray="214"
                    strokeDashoffset={214 - (214 * completionRate) / 100}
                    className="text-brand-primary transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-slate-500 text-xs font-semibold">
              {stats.completed} of {stats.total} assignments completed
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total" value={stats.total} icon={ListTodo} color="blue" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="orange" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="green" />
          <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} color="red" />
        </section>

        {/* Filters & Content */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
              {(['all', 'upcoming', 'completed', 'overdue'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                    filter === t ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <button
               onClick={() => {
                setEditingAssignment(null);
                setIsModalOpen(true);
              }}
              className="bg-brand-primary text-white p-4 rounded-2xl sm:hidden flex items-center justify-center gap-2 font-bold shadow-xl shadow-brand-primary/20"
            >
              <Plus size={20} /> New Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredAssignments.map((assignment) => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  onToggleStatus={handleToggleStatus}
                  onEdit={(a) => {
                    setEditingAssignment(a);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>

            {filteredAssignments.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center glass-card rounded-[32px] border-dashed border-white/10"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-500">
                  <ListTodo size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No assignments found</h3>
                <p className="text-slate-500 mb-8 max-w-xs text-center">
                  Your desk is clean! Add a new task to keep tracking your academic goals.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-8 py-3 rounded-2xl font-bold transition-all"
                >
                  Create First Task
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <AssignmentModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editingAssignment}
      />

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-brand-primary/30 blur-[100px]"
              />
              <div className="glass-card p-12 rounded-full border-brand-primary shadow-2xl shadow-brand-primary/50 flex flex-col items-center text-center">
                <PartyPopper size={80} className="text-brand-primary mb-4 animate-bounce" />
                <h2 className="text-4xl font-black text-white italic">TASK CONQUERED!</h2>
                <p className="text-brand-accent font-bold mt-2 uppercase tracking-widest">Keep that momentum going</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
