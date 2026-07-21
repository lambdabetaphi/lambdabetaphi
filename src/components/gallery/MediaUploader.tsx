import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileSpreadsheet, Loader2, Image as ImageIcon } from 'lucide-react';
import { Member, GalleryItem } from '../../types';

export interface MediaUploaderProps {
  currentUser: Member;
  defaultAlbums: string[];
  onAddGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at'>) => Promise<void> | void;
  onClose: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

interface QueuedImage {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  errorMsg?: string;
}

export function MediaUploader({
  currentUser,
  defaultAlbums,
  onAddGalleryItem,
  onClose,
  showToast
}: MediaUploaderProps) {
  const [uploadAlbum, setUploadAlbum] = useState('General');
  const [customAlbum, setCustomAlbum] = useState('');
  const [queue, setQueue] = useState<QueuedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'uploading' | 'completed'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      addFilesToQueue(filesArray);
    }
  };

  const addFilesToQueue = (files: File[]) => {
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length === 0) {
      showToast('No valid image files detected. Please select images only.', 'error');
      return;
    }

    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newQueued: QueuedImage = {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          previewUrl: reader.result as string,
          caption: '',
          status: 'pending',
          progress: 0
        };
        setQueue(prev => [...prev, newQueued]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files) as File[];
      addFilesToQueue(filesArray);
    }
  };

  const handleRemoveFromQueue = (id: string) => {
    if (overallStatus === 'uploading') return;
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleCaptionChange = (id: string, text: string) => {
    if (overallStatus === 'uploading') return;
    setQueue(prev => prev.map(item => item.id === id ? { ...item, caption: text } : item));
  };

  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queue.length === 0) {
      showToast('Upload queue is empty. Please select files first.', 'error');
      return;
    }

    const targetAlbum = customAlbum.trim() ? customAlbum.trim() : uploadAlbum;
    setOverallStatus('uploading');

    // Process each queued file sequentially or pseudo-simulated parallel to show individual progress bars
    for (let i = 0; i < queue.length; i++) {
      const queuedItem = queue[i];
      if (queuedItem.status === 'success') continue; // Skip already succeeded files

      // Set item to uploading state
      setQueue(prev => prev.map(item => item.id === queuedItem.id ? { ...item, status: 'uploading', progress: 10 } : item));

      try {
        // Simulate progress bar movement elegantly
        await new Promise<void>((resolve) => {
          let currentProgress = 10;
          const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 20) + 10;
            if (currentProgress >= 90) {
              clearInterval(interval);
              resolve();
            } else {
              setQueue(prev => prev.map(item => item.id === queuedItem.id ? { ...item, progress: currentProgress } : item));
            }
          }, 100);
        });

        // Actually insert via onAddGalleryItem
        await onAddGalleryItem({
          album: targetAlbum,
          image_url: queuedItem.previewUrl,
          caption: queuedItem.caption.trim() || undefined,
          uploaded_by_name: currentUser.full_name
        });

        // Set to success
        setQueue(prev => prev.map(item => item.id === queuedItem.id ? { ...item, status: 'success', progress: 100 } : item));
      } catch (err) {
        setQueue(prev => prev.map(item => item.id === queuedItem.id ? { ...item, status: 'error', progress: 100, errorMsg: 'Failed to upload' } : item));
        showToast(`Failed to archive: ${queuedItem.file.name}`, 'error');
      }
    }

    setOverallStatus('completed');
    showToast('Batch photo archival complete!', 'success');
  };

  const activeUploadCount = queue.filter(q => q.status === 'uploading').length;
  const successUploadCount = queue.filter(q => q.status === 'success').length;
  const errorUploadCount = queue.filter(q => q.status === 'error').length;

  return (
    <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="media_uploader_overlay">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c5a059]/20 w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#c5a059]" />
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy-950/5">
          <div>
            <h3 className="font-serif font-black text-navy-950 text-sm uppercase tracking-wide">
              Archive Event Photos
            </h3>
            <p className="text-[8px] text-navy-400 font-bold uppercase tracking-widest mt-0.5">Sovereign Batch Archival Engine</p>
          </div>
          <button 
            id="close_uploader_btn"
            onClick={onClose}
            disabled={overallStatus === 'uploading'}
            className="p-1 rounded-full text-navy-400 hover:text-navy-950 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs scrollbar-thin">
          
          {/* Form setup: Album details */}
          <div className="grid grid-cols-2 gap-3 bg-[#fbf9f4] p-3 rounded-xl border border-navy-950/5">
            <div>
              <label className="block text-[8px] font-black text-navy-950 uppercase tracking-widest mb-1 text-left">
                Select Album Category
              </label>
              <select
                id="uploader_album_select"
                value={uploadAlbum}
                onChange={(e) => setUploadAlbum(e.target.value)}
                disabled={overallStatus === 'uploading'}
                className="w-full p-2 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-[10px] disabled:opacity-50"
              >
                {defaultAlbums.map((dalb, idx) => (
                  <option key={idx} value={dalb}>{dalb}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[8px] font-black text-navy-950 uppercase tracking-widest mb-1 text-left">
                Or Create Custom Album
              </label>
              <input
                id="uploader_custom_album_input"
                type="text"
                placeholder="e.g. Summer Camp 2026"
                value={customAlbum}
                onChange={(e) => setCustomAlbum(e.target.value)}
                disabled={overallStatus === 'uploading'}
                className="w-full p-2 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-[10px] placeholder-navy-300 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Drag & Drop Upload Area */}
          {overallStatus !== 'completed' && (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => {
                if (overallStatus !== 'uploading') fileInputRef.current?.click();
              }}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed p-4.5 text-center transition-all min-h-[110px] rounded-xl cursor-pointer ${
                dragActive 
                  ? 'border-gold-500 bg-gold-50/20' 
                  : 'border-navy-950/15 hover:border-[#c5a059]/50 bg-white'
              } ${overallStatus === 'uploading' ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <input
                id="multiple_file_input"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={overallStatus === 'uploading'}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-navy-400 mb-1 animate-bounce" />
              <p className="text-[10px] font-bold text-navy-950 uppercase tracking-wider">
                Select or Drop Multiple Photos
              </p>
              <p className="text-[8px] text-navy-400 uppercase tracking-wider font-mono mt-0.5">
                Drag & drop or Click to browse your device files
              </p>
            </div>
          )}

          {/* Queued Items Queue Area */}
          {queue.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-[9px] uppercase tracking-wider text-navy-950 flex items-center justify-between">
                <span>Upload Queue ({queue.length} items)</span>
                {overallStatus === 'uploading' && (
                  <span className="flex items-center gap-1 text-[#c5a059] font-mono text-[8px] lowercase font-normal">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    archiving batch...
                  </span>
                )}
              </h4>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {queue.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-3 bg-[#fdfdfd] border border-navy-950/5 p-2 rounded-xl items-center relative hover:shadow-sm transition-shadow"
                  >
                    {/* Image Thumbnail */}
                    <img 
                      src={item.previewUrl} 
                      alt="Thumbnail" 
                      className="w-12 h-12 rounded-lg object-cover border border-navy-950/10 shrink-0" 
                      referrerPolicy="no-referrer"
                    />

                    {/* Middle Details / Caption Input */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-mono text-[8px] text-navy-400 truncate max-w-[150px]">{item.file.name}</p>
                      {item.status === 'pending' ? (
                        <input
                          id={`caption_input_${item.id}`}
                          type="text"
                          placeholder="Add individual caption..."
                          value={item.caption}
                          onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                          className="w-full mt-1 px-2 py-1 bg-[#fbf9f4] border border-navy-950/5 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-gold-500 font-sans"
                        />
                      ) : (
                        <p className="text-[10px] font-sans text-navy-950/80 italic truncate mt-0.5">
                          {item.caption || 'No caption'}
                        </p>
                      )}
                    </div>

                    {/* Status & Progress View */}
                    <div className="w-28 shrink-0 flex flex-col items-end gap-1 font-mono text-[8px] uppercase font-bold pr-1">
                      {item.status === 'pending' && (
                        <button
                          type="button"
                          id={`remove_queue_item_${item.id}`}
                          onClick={() => handleRemoveFromQueue(item.id)}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded-md border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {item.status === 'uploading' && (
                        <div className="w-full text-right">
                          <span className="text-[#c5a059] flex items-center justify-end gap-1">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            {item.progress}%
                          </span>
                          <div className="w-full bg-navy-100 h-1 rounded-full overflow-hidden mt-1">
                            <div 
                              className="bg-[#c5a059] h-full transition-all duration-100" 
                              style={{ width: `${item.progress}%` }} 
                            />
                          </div>
                        </div>
                      )}

                      {item.status === 'success' && (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Archived
                        </span>
                      )}

                      {item.status === 'error' && (
                        <span className="text-rose-600 flex items-center gap-1" title={item.errorMsg}>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed State Summary Screen */}
          {overallStatus === 'completed' && (
            <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-xl p-4.5 text-center space-y-2 animate-fade-in" id="uploader_completed_summary">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">Archival Batch Compiled Successfully</h4>
              <p className="text-[10px] text-emerald-800/80 max-w-sm mx-auto">
                Successfully captured and organized {successUploadCount} photos into the chapter's secure, decentralized media registry.
              </p>
              {errorUploadCount > 0 && (
                <p className="text-[9px] text-rose-600 font-semibold font-mono">
                  ({errorUploadCount} visual assets encountered errors during upload).
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between p-4 bg-[#fbf9f4] border-t border-navy-950/5">
          {overallStatus === 'completed' ? (
            <button
              type="button"
              id="uploader_finish_btn"
              onClick={onClose}
              className="w-full py-2.5 bg-navy-950 text-gold-500 font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer text-[10px]"
            >
              Back to Media Library
            </button>
          ) : (
            <>
              <button
                type="button"
                id="uploader_cancel_btn"
                onClick={onClose}
                disabled={overallStatus === 'uploading'}
                className="px-5 py-2.5 border border-navy-950/10 text-navy-950 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-50 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                id="uploader_submit_btn"
                onClick={handleBatchUpload}
                disabled={queue.length === 0 || overallStatus === 'uploading'}
                className="px-6 py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
              >
                {overallStatus === 'uploading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Archiving...
                  </>
                ) : (
                  <>
                    Archive {queue.length} Photos
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
