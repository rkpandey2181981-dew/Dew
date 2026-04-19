/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '../types';
import { 
  LayoutGrid, 
  PenTool, 
  Share2, 
  Target, 
  Mail, 
  Briefcase,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const CATEGORIES: { name: Category; icon: React.ReactNode }[] = [
  { name: 'All', icon: <LayoutGrid className="w-5 h-5" /> },
  { name: 'Blog', icon: <PenTool className="w-5 h-5" /> },
  { name: 'Social', icon: <Share2 className="w-5 h-5" /> },
  { name: 'Marketing', icon: <Target className="w-5 h-5" /> },
  { name: 'Email', icon: <Mail className="w-5 h-5" /> },
  { name: 'Business', icon: <Briefcase className="w-5 h-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col h-screen sticky top-0 shrink-0 select-none hidden lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Forge AI
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-3 mb-4">
            Collections
          </p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all group rounded-xl",
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("transition-colors", activeCategory === cat.name ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-foreground")}>
                    {cat.icon}
                  </span>
                  <span className="font-medium">{cat.name}</span>
                </div>
                {activeCategory === cat.name && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1 h-4 rounded-full bg-primary-foreground/40" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="p-6 rounded-2xl bg-muted/50 border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <h3 className="text-xs font-bold uppercase tracking-widest mb-1 text-foreground">Forge Pro</h3>
          <p className="text-[10px] text-muted-foreground mb-4 font-medium leading-relaxed">Access advanced neural networks and dedicated compute cycles.</p>
          <button className="w-full py-2.5 rounded-xl bg-foreground text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};
