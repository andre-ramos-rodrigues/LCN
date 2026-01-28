'use client';

import { useEffect, useState } from 'react';
import type { SocialLink } from '../../types';
import Link from 'next/link';
import Image from 'next/image';

export default function SocialLinks() {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch('/api/socials', { cache: 'no-store' })
      .then(res => res.json())
      .then(setSocials)
      .catch(console.error);
  }, []);

  if (!socials.length) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {/* Title */}
      <span className="text-sm font-semibold text-text-secondary">
        Redes Sociais
      </span>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {socials.map((social) => (
          <Link
            key={social.id}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.title}
            className="group"
          >
            <Image
              src={social.logo}
              alt={social.title}
              width={32}
              height={32}
              className="
                opacity-70
                transition
                duration-200
                group-hover:opacity-100
                group-hover:scale-110
              "
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
