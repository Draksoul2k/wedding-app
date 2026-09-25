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
    if (typeof window !== 'undefined' && slug) {
      const stored = localStorage.getItem(`wedding_${slug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (templateParam) {
            const found = TEMPLATES.find((t) => t.id === templateParam);
            if (found) {
              parsed.templateId = found.id;
              parsed.themeName = found.name;
              parsed.primaryColor = found.primaryColor;
            }
          }
          setData(parsed);
        } catch (e) {
          console.error('Failed to parse saved wedding data:', e);
        }
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
