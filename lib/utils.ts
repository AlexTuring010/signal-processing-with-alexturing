import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9Ͱ-Ͽἀ-῿\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
