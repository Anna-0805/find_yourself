
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../mockApi";
import { contactSchema} from "../utils/validation";
import type { ContactFormValues } from "../utils/validation";

export default function Contacts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "optimistic_success" | "final_success" | "error">("idle");
  const [networkError, setNetworkError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      contact: "",
      message: "",
    },
  });

  const messageValue = useWatch({ control, name: "message" }) || "";

  const onSubmit = async (data: ContactFormValues) => {
    setNetworkError(null);
    setIsSubmitting(true);
    setSubmitStatus("optimistic_success"); 

    const savedFormData = { 
  ...data, 
  message: data.message ?? "" 
};

    try {
      await api.submitApplication(savedFormData);
      setSubmitStatus("final_success");
    } catch (err: unknown) {
      const errorInstance = err as Error;
      setNetworkError(errorInstance.message || "Сталася помилка при відправці. Спробуйте ще раз.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Зв'яжіться з нами</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Є питання щодо платформи або пропозиції про співпрацю? Напишіть нам, і ми відповімо найближчим часом.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-blue-400">VV Work HQ</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Платформа для ефективного пошуку роботи та підбору кваліфікованого персоналу в країнах Європейського Союзу.</p>
          </div>
          
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-3"><span>📍</span> Європейська площа, Київ / Варшава</div>
            <div className="flex items-center gap-3"><span>✉️</span> support@vvwork.eu</div>
            <div className="flex items-center gap-3"><span>📱</span> @vv_work_support</div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
            Технічна підтримка кандидатів працює 24/7.
          </div>
        </div>
     
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
          
          {(submitStatus === "optimistic_success" || submitStatus === "final_success") && (
            <div className="text-center py-12 space-y-4 animate-fadeIn">
              <span className="text-4xl p-4 bg-green-50 rounded-full inline-block">🎉</span>
              <h3 className="text-xl font-bold text-slate-900">Заявку успішно надіслано!</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {submitStatus === "optimistic_success" 
                  ? "Дякуємо! Ваше повідомлення обробляється..." 
                  : "Ваше повідомлення доставлено до нашої бази даних. Менеджер зв'яжеться з вами найближчим часом."}
              </p>
              {submitStatus === "final_success" && (
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-4 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Надіслати ще одне повідомлення
                </button>
              )}
            </div>
          )}

          {(submitStatus === "idle" || submitStatus === "error") && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {submitStatus === "error" && networkError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  ⚠️ {networkError} Спробуйте натиснути кнопку відправки ще раз.
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Ваше ім'я *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Введіть ваше ім'я"
                  {...register("name")}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm ${
                    errors.name ? "border-red-400 focus:border-red-500 focus:bg-white" : "border-slate-200 focus:border-blue-500 focus:bg-white"
                  }`}
                />
                {errors.name && <span className="text-xs text-red-500 font-medium pl-1">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact" className="text-sm font-semibold text-slate-700">Телефон або Telegram *</label>
                <input
                  id="contact"
                  type="text"
                  placeholder="Наприклад: +380931234567 або @username"
                  {...register("contact")}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm ${
                    errors.contact ? "border-red-400 focus:border-red-500 focus:bg-white" : "border-slate-200 focus:border-blue-500 focus:bg-white"
                  }`}
                />
                {errors.contact && <span className="text-xs text-red-500 font-medium pl-1">{errors.contact.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">Супровідний текст</label>
                  <span className={`text-xs ${messageValue.length > 500 ? "text-red-500 font-bold" : "text-slate-400"}`}>
                    {messageValue.length} / 500
                  </span>
                </div>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Напишіть ваше питання або деталі пропозиції..."
                  {...register("message")}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm resize-none ${
                    errors.message ? "border-red-400 focus:border-red-500 focus:bg-white" : "border-slate-200 focus:border-blue-500 focus:bg-white"
                  }`}
                />
                {errors.message && <span className="text-xs text-red-500 font-medium pl-1">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Надсилання..." : "Надіслати форму"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}