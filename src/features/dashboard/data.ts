import { ArrowRight, Code, LineChart, Wand2, type LucideIcon } from 'lucide-react';

// Static dashboard content. Swap these for an API call when the backend
// starts serving personalised suggestions.

export interface Suggestion {
  tag: string;
  tagColor: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const SUGGESTIONS: Suggestion[] = [
  {
    tag: 'Research',
    tagColor: '#10B981',
    icon: ArrowRight,
    title: 'Deep Analysis: Quantum Computing Trends 2024',
    desc: 'Summarize the recent breakthroughs in superconducting qubits.',
  },
  {
    tag: 'Creative',
    tagColor: '#10B981',
    icon: Wand2,
    title: 'Refine Design System Architecture',
    desc: 'Apply glass morphism principles to a financial dashboard UI.',
  },
  {
    tag: 'Code',
    tagColor: '#10B981',
    icon: Code,
    title: 'Learn Optimize Rust Microservices',
    desc: 'Debug memory leaks in the distributed caching layer.',
  },
  {
    tag: 'Strategy',
    tagColor: '#10B981',
    icon: LineChart,
    title: 'Q3 Market Expansion Plan',
    desc: 'Synthesize competitor data for the Southeast Asia entry.',
  },
];

export const PILLS = ['Factorizer', 'Meme', 'Finance', 'InfiniteParts', 'ExamFlow', 'Afrosimulator'];
