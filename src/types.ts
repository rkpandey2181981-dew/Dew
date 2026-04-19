/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'All' | 'Blog' | 'Social' | 'Marketing' | 'Business' | 'Email';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  prompt: string;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'textarea';
    placeholder: string;
  }[];
}

export interface GeneratedContent {
  id: string;
  templateId: string;
  content: string;
  createdAt: number;
  inputs: Record<string, string>;
}
