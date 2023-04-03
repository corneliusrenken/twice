import React from 'react';

type Props = {
  scrollPos: number;
};

export default function Masks({ scrollPos }: Props) {
  const translucentMaskExpandPercentage = Math.min(1, scrollPos / 25);

  return (
    <div className="masks">
      <div
        className="mask full"
        style={{
          height: 'calc(75px + var(--layout-vertical-margin))',
          bottom: 'calc(-75px + 50px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black var(--layout-vertical-margin), transparent)',
        }}
      />
      <div
        className="mask full"
        style={{
          height: 'var(--layout-vertical-margin)',
          bottom: 'calc(50px + var(--layout-vertical-margin, 0px) - 100vh)',
        }}
      />
      <div
        className="mask block-mouse"
        style={{
          height: '100px',
          bottom: '-50px',
        }}
      />
      <div
        className="mask translucent"
        style={{
          height: `${100 + 28 * translucentMaskExpandPercentage}px`,
          bottom: `-${50 + 28 * translucentMaskExpandPercentage}px`,
          WebkitMaskImage: `linear-gradient(to bottom, black ${100 - 35 * translucentMaskExpandPercentage}%, transparent)`,
        }}
      />
    </div>
  );
}
