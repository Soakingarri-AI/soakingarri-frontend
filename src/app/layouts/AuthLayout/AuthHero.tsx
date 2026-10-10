import React from 'react';
import { BookOpen, GraduationCap, Paperclip } from 'lucide-react';
import { BrandMark } from '@/shared/ui';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Grounded in real sources',
    body: 'Every answer on African history comes with citations you can open and check.',
  },
  {
    icon: GraduationCap,
    title: 'Learn at your level',
    body: 'Switch between beginner, normal and advanced explanations at any time.',
  },
  {
    icon: Paperclip,
    title: 'Bring your own documents',
    body: 'Attach notes, PDFs or images and ask questions about them directly.',
  },
];

/** Left half of the auth screens: brand artwork, pitch and feature list. Desktop only. */
export const AuthHero: React.FC = () => (
  <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-gold/10">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/bg.png)' }} />
    {/* Darken towards the copy so it stays readable over the artwork */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#070604]/95 via-[#070604]/80 to-[#070604]/40" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#070604] via-transparent to-[#070604]/60" />

    <div className="relative z-10 flex flex-col justify-between w-full px-12 xl:px-14 py-10 short:py-7">
      <BrandMark />

      <div className="max-w-lg">
        <div className="inline-flex items-center gap-2 mb-6 short:hidden px-3.5 py-1.5 rounded-full border border-gold/25 bg-black/40 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#F59E0B]" />
          <span className="text-xs text-white/80">Join 50K+ curious minds</span>
        </div>

        <h1 className="text-4xl xl:text-5xl short:text-4xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
          Soak in <span className="gold-text">Africa's story</span>, one question at a time
        </h1>

        <p className="text-white/65 text-lg short:text-base mb-8 short:mb-6 leading-relaxed">
          SOAKINGARRI AI turns centuries of African history into clear, cited answers, tuned to
          how you learn.
        </p>

        <div className="space-y-4 short:space-y-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="mt-0.5 w-9 h-9 short:w-8 short:h-8 shrink-0 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-white/55 text-sm mt-0.5 leading-snug">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/35">© {new Date().getFullYear()} SoakinGarri AI</p>
    </div>
  </div>
);
