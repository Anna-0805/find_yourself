import React, { useState } from "react";
import type { Vacancy } from "../mockApi";

interface ApplyModalProps {
  vacancy: Vacancy | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyModal({ vacancy, isOpen, onClose }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen || !vacancy) return null;

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        setCoverLetter("");
        setResumeFile(null);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-fadeIn">
        
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Відгук на вакансію</h3>
          <p className="text-sm text-blue-600 font-semibold">{vacancy.title}</p>
        </div>

        {successMessage ? (
          <div className="text-center py-8 space-y-3">
            <span className="text-4xl p-3 bg-green-50 rounded-full inline-block">🎉</span>
            <h4 className="text-lg font-bold text-slate-900">Відгук успішно надіслано!</h4>
            <p className="text-sm text-slate-500">Роботодавець отримає ваше резюме та супровідний лист.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Прикріпити резюме (PDF, DOCX) *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                required
                onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl cursor-pointer"
              />
              {resumeFile && (
                <span className="text-xs text-slate-500 block pl-1">Обрано файл: {resumeFile.name}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Супровідний лист</label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Коротко розкажіть, чому саме ви підходите на цю позицію..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm resize-none transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {isSubmitting ? "Надсилання..." : "Надіслати відгук"}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}