export const API_URL = 'https://find-yourself-2szr.onrender.com';

export const API_REGISTER_URL = `${API_URL}/register`;

export const LOCAL_CATEGORIES = ["Все", "Будівництво", "Виробництво", "Логістика", "Готельно-ресторанна сфера", "IT", "Водії"];

export const CATEGORIES = [
  { id: "building", name: "Будівництво", icon: "🏗️" },
  { id: "production", name: "Виробництво", icon: "🏭" },
  { id: "logistics", name: "Логістика", icon: "📦" },
  { id: "horeca", name: "Готельно-ресторанна сфера", icon: "🏨" },
  { id: "it", name: "IT", icon: "💻" },
  { id: "drivers", name: "Водії", icon: "🚚" },
  { id: "others", name: "Інші", icon: "💼" },
];

export interface Category {
  id: string;
  name: string;
  icon: string;
}