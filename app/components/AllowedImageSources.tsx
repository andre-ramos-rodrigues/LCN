'use client';

import Link from 'next/link';
import React from 'react';

const imageSources = [
  {
    name: 'Unsplash',
    url: 'https://unsplash.com',
  },
  {
    name: 'Unsplash+',
    url: 'https://unsplash.com/plus',
  },
  {
    name: 'Pexels',
    url: 'https://www.pexels.com',
  },
  {
    name: 'Pixabay',
    url: 'https://pixabay.com',
  },
  {
    name: 'Lorem Picsum',
    url: 'https://picsum.photos',
  },
  {
    name: 'UI Avatars',
    url: 'https://ui-avatars.com',
  },
  {
    name: 'GitHub Avatars',
    url: 'https://github.com',
  },
  {
    name: 'Freepik',
    url: 'https://www.freepik.com',
  },
];

const AllowedImageSources: React.FC = () => {
  return (
    <div className="space-y-3 flex flex-col justify-between items-center">
      <h2 className="text-lg font-bold text-text-primary">
        Allowed Image Sources
      </h2>

      <p className="text-sm text-text-secondary">
        Use images only from these platforms. Other sources will not render.
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {imageSources.map(source => (
          <Link
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline transition"
          >
            {source.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllowedImageSources;
