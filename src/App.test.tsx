import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useState, useEffect } from 'react';

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

describe("Логіка інлайн-валідації форми контактів", () => {
  it("повинен повертати помилку, якщо і'мя занадто коротке", () => {
    const error = validateField('name', 'A');
    expect(error).toBe("Ім'я повинно містити мінімум 2 символи");
  });

  it("повинен пропускати валідне і'мя", () => {
    const error = validateField('name', 'VV Work User');
    expect(error).toBe("");
  });

  it("повинен повертати помилку для некоректного формату контакту", () => {
    const error = validateField('contact', 'not-a-phone-or-tg');
    expect(error).toBe("Введіть коректний номер телефону або Telegram-нік (починаючи з @)");
  });

  it("повинен успешно валідувати правильний телефон и Telegram", () => {
    expect(validateField('contact', '+380931234567')).toBe("");
    expect(validateField('contact', '@vv_worker')).toBe("");
  });
});



function DebounceSearchTester({ onSearch }: { onSearch: (val: string) => void }) {
  const [input, setInput] = useState("");
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input);
    }, 400);
    return () => clearTimeout(handler);
  }, [input, onSearch]);

  return <input data-testid="search-input" value={input} onChange={(e) => setInput(e.target.value)} />;
}

describe("Кастомна логіка ручного Debounce пошуку", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("не повинен викликати функцію пошуку миттєво при введенні літер", async () => {
    const searchMock = vi.fn();
    render(<DebounceSearchTester onSearch={searchMock} />);
    
    const input = screen.getByTestId('search-input');
     fireEvent.change(input, { target: { value: 'Водій' } });

    expect(searchMock).not.toHaveBeenCalledWith('Водій');
  });

  it("повинен викликати функцію пошуку рівно один раз після паузи в 400мс", async () => {
    const searchMock = vi.fn();
    render(<DebounceSearchTester onSearch={searchMock} />);
    
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Водій' } });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith('Водій');
  });
});