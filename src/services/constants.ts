export const API_URL = 'https://find-yourself-backend.onrender.com/api';

export const API_REGISTER_URL = `${API_URL}/register`;

export const LOCAL_CATEGORIES = ["Все", "Будівництво", "Виробництво", "Логістика", "Готельно-ресторанна сфера", "IT", "Водії"];

export const CATEGORIES = [
  { id: "building", name: "Будівництво", icon: "/architectural.svg" },
  { id: "production", name: "Виробництво", icon: "/industry.svg" },
  { id: "logistics", name: "Логістика", icon: "/delivery.png" },
  { id: "horeca", name: "Готельно-ресторанна сфера", icon: "/horeca.png" },
  { id: "it", name: "IT", icon: "/computer.svg" },
  { id: "drivers", name: "Водії", icon: "/car.svg" },
  { id: "others", name: "Інші", icon: "/other.png" },
];

export interface Category {
  id: string;
  name: string;
  icon: string;
}