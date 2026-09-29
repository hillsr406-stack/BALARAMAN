import React, { useState } from 'react';
import { Note } from '../types';
import { Search, Plus, Pin, Trash2, Copy, Check, Download } from 'lucide-react';
import { sounds } from '../utils/sound';

interface NotesScratchpadProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  soundEnabled: boolean;
}

export const NotesScratchpad: React.FC<NotesScratchpadProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  soundEnabled,
}) => {
  const [search, setSearch] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tag.toLowerCase().includes(search.toLowerCase())
  );

  // Pinned first, then by updatedAt
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.pinned ? -1 : 1;
  });

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleCreateNew = () => {
    sounds.playCheck(soundEnabled);
    const newNote = {
      title: 'Untitled Note',
      content: '',
      tag: 'General',
      pinned: false,
    };
    onAddNote(newNote);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    sounds.playCheck(soundEnabled);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadMarkdown = (note: Note) => {
    const blob = new Blob([`# ${note.title}\n\n${note.content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/\s+/g, '-') || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Engineering Scratchpad & Notes</h2>
          <p className="text-xs text-neutral-400 mt-1">Capture technical blueprints, meeting points, and quick flashes of insight.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[520px]">
        {/* Left Sidebar: List of Notes */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearchQuerySafe(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
            {sortedNotes.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                No notes found
              </div>
            ) : (
              sortedNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neutral-800/90 border-indigo-500/50 shadow-sm'
                        : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700/80 hover:bg-neutral-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-200 truncate">
                        {note.title || 'Untitled'}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {note.pinned && (
                          <Pin className="w-3 h-3 text-indigo-400 fill-current" />
                        )}
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {note.content || 'Empty note...'}
                    </p>
                    <div className="mt-2 text-[10px] text-neutral-500">
                      <span>{note.tag}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Note Editor */}
        <div className="md:col-span-7 bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          {activeNote ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, {
                      title: e.target.value,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  placeholder="Note Title"
                  className="text-base font-bold text-white bg-transparent focus:outline-none w-full mr-4"
                />

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() =>
                      onUpdateNote(activeNote.id, {
                        pinned: !activeNote.pinned,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      activeNote.pinned ? 'text-indigo-400 bg-indigo-500/10' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                    title={activeNote.pinned ? 'Unpin' : 'Pin note'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(activeNote.content, activeNote.id)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedId === activeNote.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadMarkdown(activeNote)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
                    title="Download Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteNote(activeNote.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tag Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500 font-medium">Category:</span>
                <input
                  type="text"
                  value={activeNote.tag}
                  onChange={(e) =>
                    onUpdateNote(activeNote.id, {
                      tag: e.target.value,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="text-xs px-2 py-0.5 bg-neutral-950/70 border border-neutral-800 rounded text-neutral-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Content Body */}
              <textarea
                value={activeNote.content}
                onChange={(e) =>
                  onUpdateNote(activeNote.id, {
                    content: e.target.value,
                    updatedAt: new Date().toISOString(),
                  })
                }
                placeholder="Type your notes, ideas, code snippets or meeting summaries here..."
                rows={14}
                className="w-full flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none resize-none font-mono leading-relaxed"
              />

              <div className="pt-2 text-[10px] text-neutral-500 border-t border-neutral-800 flex justify-between font-mono">
                <span>{activeNote.content.split(/\s+/).filter(Boolean).length} words</span>
                <span>Last updated {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500 text-xs">
              Select or create a note to start writing
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function setSearchQuerySafe(val: string) {
    setSearch(val);
  }
};
