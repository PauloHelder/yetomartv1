
import React from 'react';

interface VideoPlayerProps {
  url: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  if (!url) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
        <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        <span className="text-[10px] font-black uppercase tracking-widest">Nenhum vídeo configurado</span>
      </div>
    );
  }

  // Helper para detetar YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper para detetar Wistia
  const getWistiaId = (url: string) => {
    const regExp = /(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed\/iframe)\/(\w+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper para detetar Vimeo
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);
  const wistiaId = getWistiaId(url);

  if (youtubeId) {
    return (
      <div className="relative w-full h-0 pb-[56.25%] overflow-hidden bg-black rounded-lg shadow-2xl group">
        {/* SHIELD TOP-LEFT: Bloqueia apenas do lado esquerdo para esconder Título e Canal,
            mas deixa o lado direito (Volume, Settings, CC) livre para clicar */}
        <div className="absolute top-0 left-0 w-[70%] h-[15%] bg-transparent z-40 cursor-default" />
        
        {/* MÁSCARA VISUAL TOP-LEFT: Esconde fisicamente o perfil/título no canto superior esquerdo */}
        <div className="absolute top-0 left-0 w-[70%] h-[15%] bg-black z-35 pointer-events-none" />

        {/* SHIELD LOGO: Bloqueia apenas o Logotipo do YouTube no canto inferior direito 
            Deixamos o resto da barra de tempo (Seekbar) clicável */}
        <div className="absolute bottom-0 right-0 w-[100px] h-[50px] bg-transparent z-40 cursor-default" />

        {/* Contentor do Iframe com Escala Lateral para esconder as bordas e barra de cima */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&disablekb=1&fs=1&cc_load_policy=1&autohide=1&color=white`}
            title={title || "Video Player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-[102%] h-[118%] scale-[1.10] origin-center -translate-y-[4%]"
            style={{ pointerEvents: 'auto' }}
          ></iframe>
        </div>
      </div>
    );
  }

  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&badge=0&autopause=0&title=0&byline=0&portrait=0`}
        title={title || "Video Player"}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    );
  }

  if (wistiaId) {
    return (
      <iframe 
        src={`https://fast.wistia.net/embed/iframe/${wistiaId}?videoFoam=true&autoplay=false`} 
        title={title || "Video Player"}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen 
        frameBorder="0" 
        className="w-full h-full"
      ></iframe>
    );
  }

  // Se não for YouTube nem Vimeo, assume-se que é um link direto de vídeo (mp4, etc)
  return (
    <video
      key={url}
      className="w-full h-full"
      controls
      src={url}
    >
      Desculpe, seu navegador não suporta vídeos incorporados.
    </video>
  );
};

export default VideoPlayer;
