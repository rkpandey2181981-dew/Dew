/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Template } from './types';

export const TEMPLATES: Template[] = [
  {
    id: 'blog-post-idea',
    name: 'Blog Post Ideas',
    description: 'Generate creative blog post titles and outlines based on your niche.',
    category: 'Blog',
    icon: 'Lightbulb',
    prompt: 'Generate 5 creative blog post titles and a brief 3-sentence outline for each based on the following topic and audience. Topic: {topic}. Target Audience: {audience}.',
    fields: [
      { id: 'topic', label: 'What is your blog topic?', type: 'text', placeholder: 'e.g., Sustainable Fashion, AI in Healthcare' },
      { id: 'audience', label: 'Who is your target audience?', type: 'text', placeholder: 'e.g., Eco-conscious millenials, Medical professionals' },
    ],
  },
  {
    id: 'instagram-caption',
    name: 'Instagram Captions',
    description: 'Create engaging Instagram captions with hashtags.',
    category: 'Social',
    icon: 'Instagram',
    prompt: 'Write 3 different Instagram captions for a post about: {post_details}. Style: {style}. Include relevant hashtags.',
    fields: [
      { id: 'post_details', label: 'What is the post about?', type: 'textarea', placeholder: 'e.g., A photo of my new puppy at the park' },
      { id: 'style', label: 'What is the tone/style?', type: 'text', placeholder: 'e.g., Funny, Minimalist, Inspirational' },
    ],
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Hook your customers with compelling product descriptions.',
    category: 'Marketing',
    icon: 'ShoppingBag',
    prompt: 'Write a persuasive product description for: {product_name}. Features: {features}. Tone: {tone}. Target Audience: {audience}.',
    fields: [
      { id: 'product_name', label: 'Product Name', type: 'text', placeholder: 'e.g., Eco-Friendly Water Bottle' },
      { id: 'features', label: 'Key Features', type: 'textarea', placeholder: 'e.g., BPA-free, Keeps water cold for 24h, bamboo lid' },
      { id: 'tone', label: 'Tone', type: 'text', placeholder: 'e.g., Adventurous, Premium, Playful' },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., Hikers, Office workers' },
    ],
  },
  {
    id: 'email-subject-line',
    name: 'Email Subject Lines',
    description: 'Boost your open rates with catchy email subject lines.',
    category: 'Email',
    icon: 'Mail',
    prompt: 'Generate 10 eye-catching email subject lines for an email about: {email_purpose}. Target Audience: {audience}.',
    fields: [
      { id: 'email_purpose', label: 'What is the email about?', type: 'textarea', placeholder: 'e.g., A 20% off summer sale starting tomorrow' },
      { id: 'audience', label: 'Who are the subscribers?', type: 'text', placeholder: 'e.g., Past customers, Newsletter subscribers' },
    ],
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    description: 'Write professional LinkedIn posts to build your personal brand.',
    category: 'Social',
    icon: 'Linkedin',
    prompt: 'Write a thought-provoking LinkedIn post about: {topic}. Tone: Professional. Include a call to action.',
    fields: [
      { id: 'topic', label: 'What is the topic?', type: 'textarea', placeholder: 'e.g., The importance of emotional intelligence in leadership' },
    ],
  },
  {
    id: 'business-motto',
    name: 'Business Motto',
    description: 'Create a memorable slogan or motto for your brand.',
    category: 'Business',
    icon: 'Briefcase',
    prompt: 'Generate 10 punchy slogans or mottos for a business named "{business_name}" that provides "{business_service}".',
    fields: [
      { id: 'business_name', label: 'Business Name', type: 'text', placeholder: 'e.g., Zenith Digital' },
      { id: 'business_service', label: 'What do you do?', type: 'text', placeholder: 'e.g., High-end web design services' },
    ],
  },
];
