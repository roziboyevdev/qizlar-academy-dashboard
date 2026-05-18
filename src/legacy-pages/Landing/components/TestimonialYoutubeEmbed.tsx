import React, { useState } from 'react';

type Props = {
  youtubeId: string;
  title: string;
};

export function TestimonialYoutubeEmbed({ youtubeId, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const thumbSrc = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="testimonial-video-frame">
      {playing ? (
        <iframe
          className="testimonial-video-iframe"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="testimonial-video-launch"
          onClick={() => setPlaying(true)}
          aria-label={`${title} — videoni ijro etish`}
        >
          <img src={thumbSrc} alt="" className="testimonial-video-thumb" decoding="async" loading="lazy" />
          <span className="testimonial-video-play-badge" aria-hidden />
        </button>
      )}
    </div>
  );
}
