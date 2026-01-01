'use client'

import { Avatar } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

interface CompanyAvatarProps {
  company: string
  size?: number
  logoUrl?: string
}

export default function CompanyAvatar({
  company,
  size = 56,
  logoUrl,
}: CompanyAvatarProps) {
  const [imageError, setImageError] = useState(false)

  // Generate logo path from company name
  const getLogoPath = (companyName: string): string => {
    const normalizedName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/-+/g, '_')
      .replace(/^-|-$/g, '')

    return `/company_logos/${normalizedName}.jpeg`
  }

  const logoPath = logoUrl ?? getLogoPath(company)
  const showImage = !imageError

  return (
    <Avatar
      variant='rounded'
      sx={{
        bgcolor: showImage ? 'transparent' : '#0a66c2',
        width: size,
        height: size,
        fontSize: `${size * 0.027}rem`,
        fontWeight: 'bold',
        borderRadius: 2,
      }}
    >
      {showImage ? (
        <Image
          src={logoPath}
          alt={`${company} logo`}
          width={size}
          height={size}
          style={{
            objectFit: 'contain',
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        company?.charAt(0)?.toUpperCase() || 'C'
      )}
    </Avatar>
  )
}
