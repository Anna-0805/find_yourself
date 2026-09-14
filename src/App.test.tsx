import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useState, useEffect } from 'react';

// --- 1. ТЕСТИРОВАНИЕ ЛОГИКИ ВАЛИДАЦИИ ФОРМЫ ---
// Фрагмент изолированной функции валидации с нашей страницы Contacts.tsx
const validateField = (name: string, value: string): string => {
  if (name === 'name') {
    if (!value.trim()) return "Ім'я є обов'язковим для заповнення";
    if (value.trim().length < 2) return "Ім'я повинно містити мінімум 2 символи";
  }
  if (name === 'contact') {
    if (!value.trim()) return "Вкажіть телефон або Telegram для зв'язку";
    const phoneRegex = /^(\+?\d{1,4}?[\s-]?)?\(?\d{2,3}?\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    const telegramRegex = /^@[a-zA-Z0-9_]{4,32}$/;
    if (!phoneRegex.test(value.trim()) && !telegramRegex.test(value.trim())) {
      return "Введіть коректний номер телефону або Telegram-нік (починаючи з @)";
    }
  }
  return "";
};

describe('Логіка інлайн-валідації форми контактів', () => {
  it('должен возвращать ошибку, если имя слишком короткое', () => {
    const error = validateField('name', 'A');
    expect(error).toBe("Ім'я повинно містити мінімум 2 символи");
  });

  it('должен пропускать валидное имя', () => {
    const error = validateField('name', 'VV Work User');
    expect(error).toBe("");
  });

  it('должен возвращать ошибку для некорректного формата контакта', () => {
    const error = validateField('contact', 'not-a-phone-or-tg');
    expect(error).toBe("Введіть коректний номер телефону або Telegram-нік (починаючи з @)");
  });

  it('должен успешно валидировать правильный телефон и Telegram', () => {
    expect(validateField('contact', '+380931234567')).toBe("");
    expect(validateField('contact', '@vv_worker')).toBe("");
  });
});


// --- 2. ТЕСТИРОВАНИЕ РУЧНОГО DEBOUNCE (Без библиотек) ---
// Тестовый мини-компонент, имитирующий логику поиска на странице Partner.tsx
function DebounceSearchTester({ onSearch }: { onSearch: (val: string) => void }) {
  const [input, setInput] = useState("");
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input);
    }, 400); // 400мс задержка из нашего ТЗ
    return () => clearTimeout(handler);
  }, [input, onSearch]);

  return <input data-testid="search-input" value={input} onChange={(e) => setInput(e.target.value)} />;
}

describe('Кастомна логіка ручного Debounce пошуку', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Включаем фейковые таймеры, чтобы контролировать время в тесте
  });

  it('не должен вызывать функцию поиска мгновенно при вводе букв', async () => {
    const searchMock = vi.fn();
    render(<DebounceSearchTester onSearch={searchMock} />);
    
    const input = screen.getByTestId('search-input');
     fireEvent.change(input, { target: { value: 'Водій' } });

    // Функция НЕ должна быть вызвана сразу, так как 400мс еще не прошло
    expect(searchMock).not.toHaveBeenCalledWith('Водій');
  });

  it('должен вызвать функцию поиска ровно один раз после паузы в 400мс', async () => {
    const searchMock = vi.fn();
    render(<DebounceSearchTester onSearch={searchMock} />);
    
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Водій' } });

    // Перематываем время на 400мс вперед
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Теперь функция должна успешно отработать
    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith('Водій');
  });
});