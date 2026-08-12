import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Music, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.jsx';

export const PlayerBar = () => {
  const { currentTrack, isPlaying, playNext, playPrevious, setIsPlaying } = usePlayer();
  const [muted, setMuted] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);

  // Helper to send postMessage command or direct YT method call to YouTube iframe
  const sendIframeCommand = useCallback((func, args = '') => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current[func] === 'function') {
      try {
        ytPlayerRef.current[func](args);
      } catch (e) {}
    }
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (err) {}
    }
  }, []);

  // Synchronous click handler for Play / Pause button
  const handlePlayPauseClick = () => {
    if (isPlaying) {
      sendIframeCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  };

  // Load YouTube Iframe API script dynamically if not present
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }, []);

  // Whenever currentTrack.videoId changes, load the new video into the YouTube player!
  useEffect(() => {
    if (!currentTrack?.videoId) return;

    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(currentTrack.videoId);
      } catch (e) {
        sendIframeCommand('loadVideoById', currentTrack.videoId);
      }
    } else {
      sendIframeCommand('loadVideoById', currentTrack.videoId);
    }

    setIsPlaying(true);
  }, [currentTrack?.videoId, sendIframeCommand, setIsPlaying]);

  // Initialize YT.Player instance when iframe is available
  const initYTPlayer = useCallback(() => {
    if (!iframeRef.current || !window.YT || !window.YT.Player) return;

    try {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
      }

      ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            if (muted) event.target.mute();
            if (isPlaying) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            const state = event.data;
            if (window.YT && window.YT.PlayerState) {
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (
                state === window.YT.PlayerState.PAUSED ||
                state === window.YT.PlayerState.CUED ||
                state === window.YT.PlayerState.UNSTARTED
              ) {
                setIsPlaying(false);
              } else if (state === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                playNext();
              }
            } else {
              if (state === 1) setIsPlaying(true);
              else if (state === 2 || state === 5 || state === -1) setIsPlaying(false);
              else if (state === 0) { setIsPlaying(false); playNext(); }
            }
          }
        }
      });
    } catch (err) {
      console.warn('YT Player init fallback to postMessage:', err);
    }
  }, [setIsPlaying, playNext, muted, isPlaying]);

  // Bi-directional window postMessage listener backup
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        let state = undefined;

        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.playerState !== 'undefined') {
            state = data.info.playerState;
          }
        } else if (data.event === 'onStateChange') {
          if (typeof data.info === 'number') {
            state = data.info;
          } else if (data.info && typeof data.info.playerState !== 'undefined') {
            state = data.info.playerState;
          }
        } else if (data.event === 'initialDelivery' && data.info) {
          if (typeof data.info.playerState !== 'undefined') {
            state = data.info.playerState;
          }
        }

        if (state !== undefined) {
          if (state === 1) {
            setIsPlaying(true);
          } else if (state === 2 || state === 5 || state === -1) {
            setIsPlaying(false);
          } else if (state === 0) {
            setIsPlaying(false);
            playNext();
          }
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setIsPlaying, playNext]);

  // Sync play/pause state when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      sendIframeCommand('playVideo');
    } else {
      sendIframeCommand('pauseVideo');
    }
  }, [isPlaying, sendIframeCommand]);

  // Sync mute state
  useEffect(() => {
    if (muted) {
      sendIframeCommand('mute');
    } else {
      sendIframeCommand('unMute');
    }
  }, [muted, sendIframeCommand]);

  const handleIframeLoad = () => {
    sendIframeCommand('listening');
    if (window.YT && window.YT.Player) {
      initYTPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initYTPlayer();
      };
    }
    if (isPlaying) {
      sendIframeCommand('playVideo');
    } else {
      sendIframeCommand('pauseVideo');
    }
    if (muted) {
      sendIframeCommand('mute');
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Bottom Sticky Player Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Currently Playing Track Info & Clean Image Thumbnail */}
          <div className="flex items-center gap-3.5 w-1/3 min-w-0">
            <div
              onClick={() => setShowFullModal(true)}
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 cursor-pointer border border-indigo-500/40 shadow-lg group"
            >
              <img
                src={currentTrack.thumbnailUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0">
              <h5
                className="text-sm font-semibold text-white truncate hover:text-indigo-300 transition-colors cursor-pointer"
                onClick={() => setShowFullModal(true)}
              >
                {currentTrack.title}
              </h5>
              <p className="text-xs text-slate-400 truncate">
                {currentTrack.channelTitle}
              </p>
            </div>
          </div>

          {/* Single Main Player Controls (Prev, Play/Pause, Next) */}
          <div className="flex flex-col items-center gap-1 w-1/3">
            <div className="flex items-center gap-4">
              <button
                onClick={playPrevious}
                className="text-slate-400 hover:text-white transition-colors p-1.5 cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPauseClick}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                className="text-slate-400 hover:text-white transition-colors p-1.5 cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Player Actions */}
          <div className="flex items-center justify-end gap-3 w-1/3">
            <button
              onClick={() => setMuted(!muted)}
              className="text-slate-400 hover:text-white transition-colors p-1.5 hidden sm:block cursor-pointer"
            >
              {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowFullModal(!showFullModal)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{showFullModal ? 'Hide Video' : 'Watch Video'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Single YouTube Video Player & Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4 transition-all duration-300 ${
          showFullModal ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'
        }`}
      >
        <div className="glass-panel rounded-3xl w-full max-w-4xl overflow-hidden border border-slate-700/80 shadow-2xl relative">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base truncate max-w-xl">{currentTrack.title}</h3>
                <p className="text-xs text-slate-400">{currentTrack.channelTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setShowFullModal(false)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Single Shared YouTube iFrame Container */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              key={currentTrack.videoId}
              ref={iframeRef}
              id="main-youtube-player-iframe"
              src={`https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
              title={currentTrack.title}
              onLoad={handleIframeLoad}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </>
  );
};







