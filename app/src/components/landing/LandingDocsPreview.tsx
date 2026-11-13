'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DOCS } from '@/data/docs';

export default function LandingDocsPreview() {
  return (
    <section className="border-b border-[#20283A] py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0D111A]">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-emerald-400 text-xs uppercase tracking-[0.2em] font-medium">
              Engineering Documentation
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Authoritative Specifications & Runbooks
            </h2>
            <p className="text-slate-400 text-sm">
              Pure Markdown AST documents shipping with the repository. No marketing fluff, only verifiable technical truth.
            </p>
          </div>

          <Link
            href="/docs"
            className="px-4 py-2 bg-[#161B27] hover:bg-[#1E2536] border border-[#20283A] text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <span>View All 5 Documents</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOCS.slice(1, 4).map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group border border-[#20283A] bg-[#0E121B] hover:border-emerald-500/50 p-6 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400 font-semibold">
                  {doc.eyebrow}
                </span>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-300 transition-colors mt-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {doc.summary}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#20283A] font-mono text-xs text-amber-400 flex items-center gap-1">
                <span>Read Spec</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
