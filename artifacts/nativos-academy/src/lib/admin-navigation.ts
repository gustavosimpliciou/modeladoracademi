import { LayoutDashboard, BookOpen, Layers, Image, Users, HelpCircle, BarChart3, Settings, ScrollText, Palette, GraduationCap } from 'lucide-react';

export const adminNavigation = [
  { href: '/admin', label: 'Painel administrativo', icon: LayoutDashboard },
  { href: '/admin/cursos', label: 'Gerenciar cursos', icon: BookOpen },
  { href: '/admin/construtor', label: 'Construtor de cursos', icon: Layers },
  { href: '/admin/midia', label: 'Biblioteca de mídia', icon: Image },
  { href: '/admin/alunos', label: 'Gerenciar alunos', icon: Users },
  { href: '/admin/instrutores', label: 'Instrutores', icon: GraduationCap },
  { href: '/admin/quizzes', label: 'Quizzes', icon: HelpCircle },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
  { href: '/admin/personalizacao', label: 'Personalização', icon: Palette },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];
