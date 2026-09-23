'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, Brain, Utensils, BookOpen, History, LayoutDashboard, MessageCircle } from 'lucide-react';

const NAV_LINKS = [
  { href: '/enhanced-mood', label: 'Track Mood', icon: Brain },
  { href: '/food-log', label: 'Track Food', icon: Utensils },
  { href: '/food-history', label: 'Journal', icon: BookOpen },
  { href: '/mood-history', label: 'History', icon: History },
] as const;

const Navigation = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    cn(
      'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      pathname === path
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
    );

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between h-16 gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            gutSync
          </Link>

          <div className="flex items-center gap-1 flex-wrap">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={linkClasses(href)}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}

            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-accent text-accent-foreground hover:opacity-90',
                pathname === '/dashboard' && 'ring-2 ring-ring'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Insights
            </Link>

            <Link
              href="/chat"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:opacity-90',
                pathname === '/chat' && 'ring-2 ring-ring'
              )}
            >
              <MessageCircle className="h-4 w-4" />
              AI Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;