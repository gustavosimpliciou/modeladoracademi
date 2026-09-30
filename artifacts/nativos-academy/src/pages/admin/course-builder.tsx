import { useState } from 'react';
import { AdminLayout, AdminPageHeader, AdminCard, AdminButton, AdminModal, AdminInput, AdminSelect, AdminTextarea, AdminDragDropList, AdminModuleCard, AdminLessonCard, AdminQuizCard, AdminBadge, AdminEmptyState, AdminConfirmDialog, AdminToast } from '../components/admin-ui';
import { Plus, GripVertical, Edit, Trash2, Eye, Copy, Save, X, ChevronDown, ChevronRight, BookOpen, Layers, Play, HelpCircle, FileText, ClipboardList, FolderOpen, Video, Image, Upload, Link2, Tag, Clock, Users, Star, TrendingUp, Activity, CheckCircle, XCircle, AlertTriangle, Info, Calendar, Target, Zap, Heart, ThumbsUp, ThumbsDown, Flag, Bookmark, Share2, Send, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, MessageSquare, Bell, Settings, LogOut, Menu, Search, Filter, Download, RefreshCw, MoreVertical, ExternalLink, Lock, Unlock, EyeOff, DollarSign, Percent, BarChart3, PieChart, LineChart, Database, HardDrive, Server, Wifi, Shield, Key, UserCheck, UserX, UserPlus, Users as UsersIcon, GraduationCap, Award, MessageCircle, MessageSquareDashed, MessageSquareOff, MessageSquarePlus, MessageSquareShare, MessageSquareReply, MessageSquareWarning, MessageSquareX, MessageSquareLock, MessageSquareHeart, MessageSquareStar, MessageSquareFlag, MessageSquareBookmark, MessageSquareTag, MessageSquareLink, MessageSquareExternal, MessageSquareCopy, MessageSquareCheck, MessageSquareEdit, MessageSquareTrash, MessageSquareArchive, MessageSquareRestore, MessageSquareDownload, MessageSquareUpload, MessageSquareSync, MessageSquareRefresh, MessageSquareHistory, MessageSquareVersion, MessageSquareDiff, MessageSquareCompare, MessageSquareMerge, MessageSquareSplit, MessageSquareJoin, MessageSquareGroup, MessageSquareUngroup, MessageSquareSort, MessageSquareFilter, MessageSquareSearch, MessageSquareFind, MessageSquareReplace, MessageSquareSwap, MessageSquareExchange, MessageSquareTransfer, MessageSquareShare2, MessageSquareLock2, MessageSquareUnlock, MessageSquareKey2, MessageSquareShield, MessageSquareShieldCheck, MessageSquareShieldX, MessageSquareShieldAlert, MessageSquareShieldQuestion, MessageSquareShieldPlus, MessageSquareShieldMinus, MessageSquareShieldEdit, MessageSquareShieldTrash, MessageSquareShieldArchive, MessageSquareShieldRestore, MessageSquareShieldDownload, MessageSquareShieldUpload, MessageSquareShieldSync, MessageSquareShieldRefresh, MessageSquareShieldHistory, MessageSquareShieldVersion, MessageSquareShieldDiff, MessageSquareShieldCompare, MessageSquareShieldMerge, MessageSquareShieldSplit, MessageSquareShieldJoin, MessageSquareShieldGroup, MessageSquareShieldUngroup, MessageSquareShieldSort, MessageSquareShieldFilter, MessageSquareShieldSearch, MessageSquareShieldFind, MessageSquareShieldReplace, MessageSquareShieldSwap, MessageSquareShieldExchange, MessageSquareShieldTransfer, MessageSquareShieldShare, MessageSquareShare2 as MessageSquareShare2Icon } from 'lucide-react';

export function AdminCourseBuilder() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([
    {
      id: 'mod-1',
      title: 'Introdução',
      description: 'Primeiros passos no ambiente 3D.',
      lessons: [
        { id: 'lesson-1', title: 'Boas-vindas e visão geral', type: 'video', duration: '08:15', status: 'completed' },
        { id: 'lesson-2', title: 'Configurando o ambiente', type: 'video', duration: '12:40', status: 'completed' },
      ],
    },
    {
      id: 'mod-2',
      title: 'Modelagem Básica',
      description: 'Conceitos e ferramentas essenciais para criar formas.',
      lessons: [
        { id: 'lesson-3', title: 'Conceitos e ferramentas essenciais', type: 'video', duration: '12:43', status: 'in_progress' },
        { id: 'lesson-4', title: 'Criando formas e editando malhas', type: 'video', duration: '18:36', status: 'available' },
        { id: 'lesson-5', title: 'Modelagem de peças complexas', type: 'video', duration: '21:10', status: 'locked' },
      ],
    },
  ]);

  const handleReorder = (newModules: any[]) => {
    setModules(newModules);
    setToast('Ordem salva automaticamente!');
  };

  return (
    <div>
      <AdminPageHeader
        title="Construtor de Cursos"
        subtitle="Arraste e solte para reorganizar módulos e aulas"
        actions={
          <>
            <AdminButton variant="secondary" icon={Eye}>Preview</AdminButton>
            <AdminButton variant="primary" icon={Save}>Salvar</AdminButton>
          </>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <AdminSelect
          label="Curso"
          value={selectedCourse?.id || ''}
          onChange={(e: any) => setSelectedCourse({ id: e.target.value })}
          options={[
            { value: '', label: 'Selecione um curso' },
            { value: 'course-1', label: 'Modelagem 3D e Preparação para Impressão' },
            { value: 'course-2', label: 'Fundamentos do Design de Produto' },
          ]}
          className="flex-1"
        />
        <AdminButton variant="secondary" icon={Plus}>Novo Módulo</AdminButton>
      </div>

      {modules.length === 0 ? (
        <AdminEmptyState
          icon={Layers}
          title="Nenhum módulo"
          description="Adicione módulos para começar a estruturar o curso"
          action={<AdminButton variant="primary" icon={Plus}>Adicionar Módulo</AdminButton>}
        />
      ) : (
        <div className="space-y-4">
          <AdminDragDropList
            items={modules}
            onReorder={handleReorder}
            renderItem={(module, index) => (
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6a00]/10">
                    <FolderOpen size={20} className="text-[#ff6a00]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{module.title}</h4>
                    <p className="text-sm text-gray-500">{module.description}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span>{module.lessons.length} aulas</span>
                      <span>{module.lessons.filter((l: any) => l.status === 'completed').length} concluídas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white">
                      <Edit size={16} />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 ml-13 space-y-2 border-l-2 border-[#222222] pl-4">
                  {module.lessons.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] p-3">
                      <GripVertical size={16} className="text-gray-600" />
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1a]">
                        <Play size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{lesson.title}</p>
                        <p className="text-xs text-gray-500">{lesson.duration} • {lesson.type}</p>
                      </div>
                      <AdminBadge variant={lesson.status === 'completed' ? 'success' : lesson.status === 'in_progress' ? 'warning' : lesson.status === 'locked' ? 'default' : 'info'}>
                        {lesson.status}
                      </AdminBadge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </div>
      )}

      {toast && <AdminToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}