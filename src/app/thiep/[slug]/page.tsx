'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { WeddingInvitationData } from '@/types/wedding';
import { DEFAULT_WEDDING_DATA, TEMPLATES } from '@/constants/templates';
import { WeddingView } from '@/components/wedding-view';

function DynamicWeddingInvitationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const guestName = searchParams?.get('to') || searchParams?.get('guest') || '';
  const templateParam = searchParams?.get('template');

  const [data, setData] = useState<WeddingInvitationData>(DEFAULT_WEDDING_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeddingData() {
      if (typeof window === 'undefined' || !slug) return;

      let weddingData: WeddingInvitationData | null = null;
      const stored = localStorage.getItem(`wedding_${slug}`);

      if (stored) {
        try {
          weddingData = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse localStorage wedding data:', e);
        }
      }

      if (!weddingData) {
        try {
          const res = await fetch(`/api/wedding?slug=${encodeURIComponent(slug)}`);
          if (res.ok) {
            const json = await res.json();
            if (json.found && json.data) {
              weddingData = json.data;
              try {
                localStorage.setItem(`wedding_${slug}`, JSON.stringify(json.data));
              } catch (err) {}
            }
          }
        } catch (e) {
          console.error('Failed to fetch wedding data from API:', e);
        }
      }

      if (weddingData) {
        if (templateParam) {
          const found = TEMPLATES.find((t) => t.id === templateParam);
          if (found) {
            weddingData.templateId = found.id;
            weddingData.themeName = found.name;
            weddingData.primaryColor = found.primaryColor;
          }
        }
        setData(weddingData);
      } else {
        const found = templateParam ? TEMPLATES.find((t) => t.id === templateParam) : null;
        setData({
          ...DEFAULT_WEDDING_DATA,
          slug: slug,
          ...(found
            ? {
                templateId: found.id,
                themeName: found.name,
                primaryColor: found.primaryColor
              }
            : {})
        });
      }
      setLoading(false);
    }

    loadWeddingData();
  }, [slug, templateParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white font-serif">
        <div className="text-center space-y-3">
          <span className="text-3xl block animate-bounce">💌</span>
          <p className="text-sm tracking-widest uppercase text-amber-200">
            Đang tải thiệp cưới...
          </p>
        </div>
      </div>
    );
  }

  return <WeddingView data={data} guestName={guestName} isLivePreview={false} />;
}

export default function DynamicWeddingInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white font-serif">
          <div className="text-center space-y-3">
            <span className="text-3xl block animate-bounce">💌</span>
            <p className="text-sm tracking-widest uppercase text-amber-200">
              Đang tải thiệp cưới...
            </p>
          </div>
        </div>
      }
    >
      <DynamicWeddingInvitationContent />
    </Suspense>
  );
}
