import React, { useState, useRef, useEffect } from "react";
import { VideoItem, VIDEOS } from "../types";
import { Play, RotateCcw, AlertCircle, FastForward, CheckCircle2 } from "lucide-react";

interface VideoPlayerProps {
  onAllVideosFinished: () => void;
  researcherMode: boolean;
}

export function VideoPlayer({ onAllVideosFinished, researcherMode }: VideoPlayerProps) {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [useFallback, setUseFallback] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeVideo = VIDEOS[currentVideoIdx];
  const videoSourceUrl = useFallback ? activeVideo.fallbackUrl : `./${activeVideo.filename}`;

  // Reset state when current video updates or the source URL switches
  useEffect(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setLoadError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentVideoIdx, videoSourceUrl]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setLoadError(null);
        })
        .catch((err) => {
          console.error("Playback block:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play()
              .then(() => {
                setIsPlaying(true);
                setLoadError("Audio muted for hardware safety. Unmute on standard controls! 🔊");
              })
              .catch(() => {
                setLoadError("Standard policy requires interacting directly with standard player elements.");
              });
          }
        });
    }
  };

  const handleVideoEnded = () => {
    setIsFinished(true);
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    if (!useFallback) {
      console.warn(`Local video ${activeVideo.filename} missing. Resolving with remote option.`);
      setUseFallback(true);
    } else {
      setLoadError(`Failed loading: "${activeVideo.filename}". Please place it in the folder.`);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIdx < VIDEOS.length - 1) {
      setCurrentVideoIdx((prev) => prev + 1);
    } else {
      onAllVideosFinished();
    }
  };

  const handleReplay = () => {
    setIsFinished(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      handlePlayClick();
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      
      {/* Dynamic Header */}
      <div className="bg-orange-500 p-5 text-white text-center relative flex flex-col items-center">
        <span className="absolute top-3 left-4 bg-orange-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
          Ad {currentVideoIdx + 1} of {VIDEOS.length}
        </span>
        <h2 className="text-lg md:text-xl font-bold font-sans tracking-tight uppercase mt-2">
          {activeVideo.title}
        </h2>
        <span className="bg-orange-600/70 text-orange-50 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md mt-1">
          Type: {activeVideo.typeLabel}
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-6 flex flex-col items-center">
        
        {/* Progress pills */}
        <div className="flex w-full justify-between items-center bg-slate-100 rounded-full h-3 p-0.5 relative">
          {VIDEOS.map((vid, idx) => {
            const isCompleted = idx < currentVideoIdx;
            const isActive = idx === currentVideoIdx;
            return (
              <div
                key={vid.id}
                className={`flex-1 h-full mx-0.5 rounded-full transition-all duration-300 ${
                  isCompleted ? "bg-emerald-500" : isActive ? "bg-orange-500 shadow-sm shadow-orange-300" : "bg-slate-250"
                }`}
              />
            );
          })}
        </div>

        {/* Video Frame */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-150 shadow-inner flex items-center justify-center">
          <video
            key={videoSourceUrl}
            ref={videoRef}
            src={videoSourceUrl}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            controls={isPlaying}
            className="w-full h-full object-contain"
            playsInline
          />

          {/* Big Play Overlay */}
          {!isPlaying && !isFinished && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center z-10">
              <button
                onClick={handlePlayClick}
                className="w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>
              <p className="text-white mt-4 uppercase font-bold text-xs tracking-wider">
                Click to Play Ad {currentVideoIdx + 1} 🎬
              </p>
            </div>
          )}

          {/* Completed Overlay */}
          {isFinished && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center z-10 text-white animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-pulse" />
              <p className="font-bold uppercase tracking-wider text-sm text-slate-100">
                Playback Finished
              </p>
              <p className="text-xs text-slate-450 max-w-xs mt-1">
                You have completely reviewed this material. Click below to continue.
              </p>

              <button
                onClick={handleReplay}
                className="mt-4 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3 h-3" /> Replay Material
              </button>
            </div>
          )}
        </div>

        {/* Load Status Warnings */}
        {loadError && (
          <div className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-xs py-2.5 px-3.5 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold uppercase text-[10px] tracking-wider text-slate-700">Notice:</p>
              <p className="leading-snug text-slate-500">{loadError}</p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full flex items-center justify-between gap-4">
          {researcherMode ? (
            <button
              onClick={handleVideoEnded}
              className="flex items-center gap-1.5 text-slate-500 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 font-extrabold py-2 px-3.5 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-slate-200"
              title="Skip this segment (Test Shortcut)"
            >
              <FastForward className="w-3 h-3" /> Skip Ad
            </button>
          ) : (
            <div />
          )}

          {isFinished ? (
            <button
              onClick={handleNextVideo}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-orange-200 active:scale-97 transition-all flex items-center gap-1 cursor-pointer text-xs uppercase tracking-wider"
            >
              <span>{currentVideoIdx < VIDEOS.length - 1 ? "Next Video" : "Proceed to Questions"}</span>
            </button>
          ) : (
            <p className="text-slate-400 text-[11px] italic font-medium">
              * Please complete viewing to proceed.
            </p>
          )}
        </div>

        {/* Dynamic Source Switch */}
        <div className="w-full text-center border-t border-slate-100 pt-4 flex flex-wrap justify-between items-center text-[10px] text-slate-400">
          <span>Source Mode: <strong className="text-slate-600 uppercase">{useFallback ? "Remote Fallback" : "Local mp4 File"}</strong></span>
          <button
            onClick={() => setUseFallback(!useFallback)}
            className="text-orange-500 hover:underline font-bold uppercase tracking-wider"
          >
            Switch to {useFallback ? "Local mp4" : "Remote Stream"}
          </button>
        </div>
      </div>
    </div>
  );
}
