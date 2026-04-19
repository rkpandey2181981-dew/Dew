/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Template } from '../types';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[template.icon] || LucideIcons.FileText;

  return (
    <div 
      className="cursor-pointer bg-card border border-border p-6 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all group relative flex flex-col h-full overflow-hidden"
      onClick={() => onClick(template)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>
        <Badge variant="secondary" className="text-[10px] h-5 bg-muted/60 text-muted-foreground border-none font-bold uppercase tracking-wider">
          {template.category}
        </Badge>
      </div>
      
      <div className="mt-auto relative z-10 flex flex-col items-start gap-3">
        <h3 className="text-lg font-bold text-foreground transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-3">
          {template.description}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
          <LucideIcons.ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
