/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Category, Template, GeneratedContent } from './types';
import { TEMPLATES } from './constants';
import { Sidebar } from './components/Sidebar';
import { TemplateCard } from './components/TemplateCard';
import { GeneratorView } from './components/GeneratorView';
import { Input } from '@/components/ui/input';
import { Search, History, Star, TrendingUp, Target, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('content_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveResult = (content: string, inputs: Record<string, string>) => {
    if (!selectedTemplate) return;
    
    const newEntry: GeneratedContent = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: selectedTemplate.id,
      content,
      createdAt: Date.now(),
      inputs
    };

    const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
    setHistory(updatedHistory);
    localStorage.setItem('content_history', JSON.stringify(updatedHistory));
  };

  return (
    <div className="flex h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground text-foreground overflow-hidden">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
          setSelectedTemplate(null);
        }} 
      />

      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <AnimatePresence mode="wait">
          {selectedTemplate ? (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm"
            >
              <GeneratorView 
                template={selectedTemplate} 
                onBack={() => setSelectedTemplate(null)}
                onSave={handleSaveResult}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12"
            >
              {/* Modern Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border pb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Version 2.0</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">Next Generation AI</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-sans font-bold tracking-tight text-foreground">
                    Forge <span className="text-primary italic">Intelligence</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Unleash high-fidelity content generation through optimized semantic architectures.
                  </p>
                </div>
                
                <div className="w-full lg:w-96">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Search protocols..." 
                      className="w-full pl-10 h-12 bg-muted/50 border-border focus-visible:ring-primary rounded-xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Archived Logs", value: history.length, icon: History },
                  { label: "Active Engine", value: "Gemini 1.5", icon: TrendingUp },
                  { label: "Tonal Models", value: "08", icon: Star },
                  { label: "Deployment", value: "Production", icon: Target }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between h-32 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Content Integration */}
              <Tabs defaultValue="templates" className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                  <TabsList className="bg-muted p-1 rounded-xl h-11">
                    <TabsTrigger 
                      value="templates" 
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 text-xs font-semibold"
                    >
                      Library
                    </TabsTrigger>
                    <TabsTrigger 
                      value="recent" 
                      className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 text-xs font-semibold"
                    >
                      History
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-4">
                    <TabsContent value="recent" className="m-0 p-0 h-auto">
                        <button 
                            onClick={() => {
                                setHistory([]);
                                localStorage.removeItem('content_history');
                            }}
                            className="bg-destructive/10 text-destructive text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:bg-destructive/20 transition-colors"
                        >
                            Purge Archives
                        </button>
                    </TabsContent>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        {activeCategory}
                    </div>
                  </div>
                </div>

                <TabsContent value="templates" className="mt-0 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredTemplates.map((template, idx) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <TemplateCard 
                            template={template} 
                            onClick={setSelectedTemplate} 
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {filteredTemplates.length === 0 && (
                    <div className="text-center py-24 rounded-3xl border border-dashed border-border">
                      <p className="text-muted-foreground font-medium">No results found for your query.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recent" className="mt-0 outline-none">
                   <div className="space-y-4">
                    {history.length > 0 ? (
                      history.map((entry) => {
                        const template = TEMPLATES.find(t => t.id === entry.templateId);
                        return (
                          <div 
                            key={entry.id} 
                            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-sm"
                            onClick={() => {
                              setSelectedTemplate(template || TEMPLATES[0]);
                            }}
                          >
                            <div className="lg:col-span-3 space-y-1">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Entry {entry.id.substring(0, 4)}</p>
                                <h4 className="text-lg font-bold">
                                    {template?.name || 'Untitled'}
                                </h4>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="lg:col-span-8">
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {entry.content}
                                </p>
                            </div>
                            <div className="lg:col-span-1 flex justify-end">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                  <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-24 rounded-3xl border border-dashed border-border flex flex-col items-center">
                        <History className="w-12 h-12 mb-4 text-muted-foreground/30" />
                        <p className="text-muted-foreground font-medium">The history archives are empty.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Modern Footer */}
              <footer className="pt-24 pb-12 border-t border-border flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <Sparkles className="text-primary-foreground w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Forge AI</span>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">High Performance Studio</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-foreground">Integrations</span>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Developer API</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-foreground">Company</span>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terminals</a></li>
                        </ul>
                    </div>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
