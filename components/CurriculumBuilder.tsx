
import React from 'react';
import { Module, Lesson } from '../types';

interface CurriculumBuilderProps {
  modules: Module[];
  onChange: (modules: Module[]) => void;
}

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({ modules, onChange }) => {
  
  const addModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Novo Módulo',
      lessons: []
    };
    onChange([...modules, newModule]);
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    onChange(modules.map(m => m.id === moduleId ? { ...m, title } : m));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Aula',
      duration: '00:00',
      locked: true
    };
    onChange(modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m));
  };

  const deleteModule = (moduleId: string) => {
    onChange(modules.filter(m => m.id !== moduleId));
  };
  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    onChange(modules.map(m => m.id === moduleId ? {
      ...m,
      lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
    } : m));
  };

  const addAttachment = (moduleId: string, lessonId: string) => {
    const newAttachment = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Arquivo.pdf',
      url: '#',
      size: '1.2MB'
    };
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    updateLesson(moduleId, lessonId, {
      attachments: [...(lesson.attachments || []), newAttachment]
    });
  };

  const removeAttachment = (moduleId: string, lessonId: string, attachmentId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    updateLesson(moduleId, lessonId, {
      attachments: lesson.attachments?.filter(a => a.id !== attachmentId)
    });
  };

  return (
    <div className="space-y-6">
      {modules.map((module, mIdx) => (
        <div key={module.id} className="bg-[#181818] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#202020] border-b border-white/10 flex items-center justify-between group">
            <div className="flex items-center flex-1 space-x-4">
              <span className="text-red-600 font-black italic tracking-tighter text-lg">M{mIdx + 1}</span>
              <input 
                type="text" 
                value={module.title}
                onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                className="bg-transparent font-black text-white text-xl outline-none focus:ring-1 focus:ring-red-600/50 rounded-sm px-2 py-1 flex-1 placeholder-white/30 uppercase tracking-wider"
                placeholder="Título do Módulo"
              />
            </div>
            <button 
              onClick={() => deleteModule(module.id)} 
              className="text-white/30 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Excluir Módulo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="p-4 space-y-3 bg-[#141414]">
            {module.lessons.map((lesson, lIdx) => (
              <div key={lesson.id} className="bg-[#1f1f1f] border border-white/5 p-4 rounded-sm flex flex-col space-y-4 shadow-lg hover:border-red-600/30 transition-all group/lesson">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-sm bg-red-600 flex items-center justify-center text-sm font-black text-white italic shadow-inner">
                    {lIdx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Título da Aula"
                      value={lesson.title}
                      onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                      className="bg-transparent text-sm font-bold text-white outline-none border-b border-white/10 focus:border-red-600 transition-colors py-1"
                    />
                    <input 
                      type="text" 
                      placeholder="Link do Vídeo (YouTube, Vimeo ou MP4)"
                      value={lesson.videoUrl || ''}
                      onChange={(e) => updateLesson(module.id, lesson.id, { videoUrl: e.target.value })}
                      className="bg-transparent text-xs text-white/50 outline-none border-b border-white/10 focus:border-red-600 transition-colors py-1"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateLesson(module.id, lesson.id, { locked: !lesson.locked })} 
                      className={`p-2 rounded-sm transition-all ${lesson.locked ? 'text-white/20 hover:text-white/50' : 'text-red-600 bg-red-600/10'}`}
                      title={lesson.locked ? "Desbloquear Aula" : "Bloquear Aula"}
                    >
                      {lesson.locked ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pl-14">
                  <textarea 
                    placeholder="Descrição da aula (opcional)..."
                    value={lesson.description || ''}
                    onChange={(e) => updateLesson(module.id, lesson.id, { description: e.target.value })}
                    className="w-full bg-white/5 p-3 rounded-sm border border-white/10 outline-none focus:border-red-600 transition-all text-white text-xs h-20 resize-none placeholder-white/20"
                  />
                </div>

                {/* Attachments Section */}
                <div className="pl-14 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Arquivos da Aula</span>
                    <button 
                      onClick={() => addAttachment(module.id, lesson.id)}
                      className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Anexar Arquivo
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {lesson.attachments?.map(att => (
                      <div key={att.id} className="flex items-center bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 group/att">
                        <svg className="w-3 h-3 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        <span className="text-[10px] text-slate-300 font-bold truncate max-w-[120px]">{att.name}</span>
                        <button 
                          onClick={() => removeAttachment(module.id, lesson.id, att.id)}
                          className="ml-2 text-slate-600 hover:text-red-600 opacity-0 group-hover/att:opacity-100 transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {(!lesson.attachments || lesson.attachments.length === 0) && (
                      <span className="text-[9px] text-slate-600 italic">Nenhum arquivo anexado</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => addLesson(module.id)}
              className="w-full py-3 border border-dashed border-white/10 rounded-sm text-white/40 text-xs font-black uppercase tracking-widest hover:border-red-600 hover:text-red-600 hover:bg-red-600/5 transition-all flex items-center justify-center group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Adicionar Aula
            </button>
          </div>
        </div>
      ))}

      <button 
        onClick={addModule}
        className="w-full py-5 bg-transparent border-2 border-red-600 border-dashed rounded-sm text-red-600 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-xl group"
      >
        <svg className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        Novo Módulo
      </button>
    </div>
  );
};

export default CurriculumBuilder;
