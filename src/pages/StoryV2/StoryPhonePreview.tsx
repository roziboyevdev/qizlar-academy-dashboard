import { MediaType, StoryV2Type } from 'modules/story-v2/types';
import { cn } from 'utils/styleUtils';
import { MoreHorizontal, X, Heart, Send } from 'lucide-react';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface StoryPhonePreviewProps {
  story: StoryV2Type;
  mediaUrl: string;
  isVideo: boolean;
  className?: string;
}

const base = `${process.env.PUBLIC_URL ?? ''}`.replace(/\/$/, '');
function asset(file: string) {
  const path = base ? `${base}/${file}` : `/${file}`;
  return path.replace(/([^:]\/)\/+/g, '$1');
}

/** Chap tomonda storyni telefon ekranida ko‘rsatish. Realistik Instagram Story uslubi. */
export function StoryPhonePreview({ story, mediaUrl, isVideo, className }: StoryPhonePreviewProps) {
  const normalizedUrl = normalizeImgUrl(mediaUrl);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <p className="mb-4 text-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
        Instagram Preview
      </p>
      <div
        className="relative w-[min(300px,85vw)] select-none"
        style={{ filter: 'drop-shadow(0 20px 40px rgb(0 0 0 / 0.4))' }}
      >
        {/* Phone Frame (Realistic) */}
        <div className="rounded-[3rem] border-[8px] border-[#1C1C1E] bg-[#1C1C1E] p-1 shadow-2xl ring-1 ring-white/10 overflow-hidden">
          {/* Inner Screen */}
          <div
            className="relative overflow-hidden rounded-[2.5rem] bg-black shadow-inner"
            style={{ aspectRatio: '9 / 19.5' }}
          >
            {/* 1. Top Content (Progress Bars + User) */}
            <div className="absolute inset-x-0 top-0 z-30 p-3 pt-4 space-y-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              {/* Progress Bar Segments */}
              <div className="flex gap-1 px-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
                    {i === 1 && <div className="h-full w-2/3 bg-white animate-in slide-in-from-left duration-1000" />}
                  </div>
                ))}
              </div>

              {/* User Profil row */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full border border-white/20 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] p-[1.5px]">
                    <div className="size-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center p-1">
                      <img src={asset('logo_only.svg')} className="w-full h-full object-contain invert" alt="logo" />
                    </div>
                  </div>
                  <div className="flex flex-col -space-y-0.5">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1">
                      qizlar_akademiyasi 
                      <div className="size-2.5 bg-[#0095f6] rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="size-1.5 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                      </div>
                    </span>
                    <span className="text-[9px] text-white/70 font-medium tracking-tight">12s</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <MoreHorizontal size={16} />
                  <X size={18} />
                </div>
              </div>
            </div>

            {/* 2. Main Media (Full Screen) */}
            <div className="absolute inset-0 z-10 flex flex-col bg-black">
              {normalizedUrl ? (
                isVideo ? (
                  <video
                    src={normalizedUrl}
                    className="h-full w-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={normalizedUrl}
                    alt=""
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-10 text-center gap-4">
                  <img src={asset('logo_only.svg')} className="w-16 h-16 object-contain opacity-20 grayscale invert" alt="logo" />
                  <p className="text-[10px] text-zinc-600 italic leading-relaxed">
                    {story.title || 'Mavjud media fayl yo‘q'}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Bottom Interaction (Post Overlay) */}
            <div className="absolute inset-x-0 bottom-0 z-30 p-4 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              {/* Title overlay */}
              {story.title?.trim() && (
                <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-white text-[13px] font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center line-clamp-2 italic">
                    {story.title}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex-1 h-10 rounded-full border border-white/30 bg-black/10 backdrop-blur-xl px-4 flex items-center shadow-inner">
                  <span className="text-white/60 text-[11px] font-medium">Habar yuborish...</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Heart size={22} strokeWidth={2.5} className="hover:scale-110 active:scale-95 transition-transform" />
                  <Send size={22} strokeWidth={2.5} className="hover:scale-110 active:scale-95 transition-transform -rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Hardware Buttons */}
        <div className="absolute -right-[9px] top-32 h-16 w-[3.5px] rounded-r-full bg-[#1C1C1E] shadow-sm" />
        <div className="absolute -left-[9px] top-28 h-8 w-[3.5px] rounded-l-full bg-[#1C1C1E] shadow-sm" />
        <div className="absolute -left-[9px] top-40 h-12 w-[3.5px] rounded-l-full bg-[#1C1C1E] shadow-sm" />
      </div>
    </div>
  );
}


export function isStoryVideo(story: StoryV2Type) {
  return story.mediaType === MediaType.VIDEO || String(story.mediaType).toUpperCase() === 'VIDEO';
}
