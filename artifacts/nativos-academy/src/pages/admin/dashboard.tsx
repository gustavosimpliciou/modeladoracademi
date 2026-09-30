import { useState, useEffect } from 'react';
import { AdminLayout, AdminPageHeader, AdminStatCard, AdminCard, AdminButton, AdminLoading, AdminEmptyState, AdminQuickActions, AdminTaskList, AdminAlertList, AdminTable, AdminBadge, AdminProgressBar } from '../../components/admin-ui';
import { Users, BookOpen, Layers, Play, ClipboardList, Award, TrendingUp, Clock, Star, AlertTriangle, CheckCircle, XCircle, Activity, Eye, Edit, Trash2, Plus, RefreshCw, Download, Filter, Search, ChevronLeft, ChevronRight, MoreVertical, Copy, ExternalLink, Calendar, Target, Zap, Heart, ThumbsUp, ThumbsDown, Flag, Bookmark, Share2, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageSquare, Bell, Settings, LogOut, Menu, X, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, GripVertical, Link2, Unlink, Lock, Unlock, EyeOff, DollarSign, Percent, BarChart3, PieChart, LineChart, Activity as ActivityIcon, Database, HardDrive, Server, Wifi, WifiOff, Shield, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, FileText, Image, Video, Upload, FolderOpen, Tag, Type, Code, Quote, List, Table, Columns, Layout, Grid, Maximize, Minimize, RotateCcw, Save, Check, Info, HelpCircle, AlertCircle, XOctagon, CheckCircle2, AlertTriangle as AlertTriangleIcon, Clock as ClockIcon, Calendar as CalendarIcon, MapPin as MapPinIcon, Phone as PhoneIcon, Mail as MailIcon, Globe as GlobeIcon, Link as LinkIcon, ExternalLink as ExternalLinkIcon, Copy as CopyIcon, Check as CheckIcon, X as XIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, ArrowUp, ArrowDown, Minus, Plus as PlusIcon, Edit2, Edit3, Trash, Trash2 as Trash2Icon, Archive, ArchiveRestore, RotateCcw as RotateCcwIcon, RefreshCw as RefreshCwIcon, Download as DownloadIcon, Upload as UploadIcon, Filter as FilterIcon, Search as SearchIcon, MoreVertical as MoreVerticalIcon, MoreHorizontal, GripVertical as GripVerticalIcon, Move, MoveVertical, MoveHorizontal, Maximize2, Minimize2, Expand, Shrink, ZoomIn, ZoomOut, RotateCw, RotateCcw as RotateCcwIcon2, FlipHorizontal, FlipVertical, Crop, Scissors, Paperclip, Clipboard, ClipboardCopy, ClipboardCheck, ClipboardX, ClipboardPaste, ClipboardType, ClipboardList as ClipboardListIcon, ClipboardEdit, File, FileText as FileTextIcon, FileImage, FileVideo, FileAudio, FileArchive, FileCode, FileJson, FileType, FileType2, FileSpreadsheet, FileSliders, FileCog, FileCheck, FileX, FilePlus, FileMinus, FileSearch, FileEdit, FileInput, FileOutput, FileUp, FileDown, FileLock, FileKey, FileWarning, FileQuestion, FileClock, FileCalendar, FileUser, FileUsers, FileHeart, FileStar, FileFlag, FileBookmark, FileTag, FileLink, FileExternal, FileCopy, FileMove, FileTrash, FileArchive, FileRestore, FileDownload, FileUpload, FileSync, FileRefresh, FileHistory, FileVersion, FileDiff, FileCompare, FileMerge, FileSplit, FileJoin, FileGroup, FileUngroup, FileSort, FileFilter, FileSearch as FileSearchIcon, FileFind, FileReplace, FileSwap, FileExchange, FileTransfer, FileShare, FileShare2, FileLock2, FileUnlock, FileKey2, FileShield, FileShieldCheck, FileShieldX, FileShieldAlert, FileShieldQuestion, FileShieldPlus, FileShieldMinus, FileShieldEdit, FileShieldTrash, FileShieldArchive, FileShieldRestore, FileShieldDownload, FileShieldUpload, FileShieldSync, FileShieldRefresh, FileShieldHistory, FileShieldVersion, FileShieldDiff, FileShieldCompare, FileShieldMerge, FileShieldSplit, FileShieldJoin, FileShieldGroup, FileShieldUngroup, FileShieldSort, FileShieldFilter, FileShieldSearch, FileShieldFind, FileShieldReplace, FileShieldSwap, FileShieldExchange, FileShieldTransfer, FileShieldShare, FileShieldShare2 } from 'lucide-react';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('clerk_token') || ''}` }
    })
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  const stats = data?.stats || {};

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Visão geral da plataforma"
        actions={
          <>
            <AdminButton variant="secondary" icon={Download}>Exportar</AdminButton>
            <AdminButton variant="primary" icon={RefreshCw}>Atualizar</AdminButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total de Alunos" value={stats.totalStudents || 0} icon={Users} trend="up" change="+12% este mês" />
        <AdminStatCard label="Alunos Ativos" value={stats.activeStudents || 0} icon={Activity} trend="up" change="+8% este mês" />
        <AdminStatCard label="Cursos Publicados" value={stats.publishedCourses || 0} icon={BookOpen} trend="up" change="+3 este mês" />
        <AdminStatCard label="Certificados Emitidos" value={stats.issuedCertificates || 0} icon={Award} trend="up" change="+15 este mês" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminCard className="p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Cursos Mais Acessados</h3>
            <div className="space-y-3">
              {(data?.topCourses || []).map((course: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#1a1a1a]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6a00]/10">
                    <BookOpen size={16} className="text-[#ff6a00]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.enrolledCount || 0} alunos</p>
                  </div>
                  <AdminBadge variant="default">#{i + 1}</AdminBadge>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminTaskList
            tasks={[
              { id: '1', label: 'Atividades pendentes', count: stats.pendingActivities || 0, icon: ClipboardList, onClick: () => {} },
              { id: '2', label: 'Provas realizadas', count: stats.completedQuizzes || 0, icon: FileText, onClick: () => {} },
              { id: '3', label: 'Cursos em rascunho', count: stats.draftCourses || 0, icon: Edit, onClick: () => {} },
            ]}
          />

          <AdminAlertList
            alerts={[
              { id: '1', type: 'warning', message: '3 vídeos com erro de processamento' },
              { id: '2', type: 'info', message: '5 novos alunos esta semana' },
            ]}
          />
        </div>
      </div>

      <div className="mt-8">
        <AdminCard className="p-5">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Atividade Recente</h3>
          <div className="space-y-3">
            {(data?.recentActivity || []).map((activity: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#1a1a1a]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]">
                  <Activity size={16} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.createdAt ? new Date(activity.createdAt).toLocaleString('pt-BR') : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}