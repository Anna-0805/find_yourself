export const validateField = (name: string, value: string): string => {
  let errorMsg = "";
  
  if (name === "name") {
    if (!value.trim()) errorMsg = "Ім'я є обов'язковим для заповнення";
    else if (value.trim().length < 2) errorMsg = "Ім'я повинно містити мінімум 2 символи";
  }
  
  if (name === "contact") {
    if (!value.trim()) {
      errorMsg = "Вкажіть телефон або Telegram для зв'язку";
    } else {
      const phoneRegex = /^(\+?\d{1,4}?[\s-]?)?\(?\d{2,3}?\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
      const telegramRegex = /^@[a-zA-Z0-9_]{4,32}$/;
      
      const isPhone = phoneRegex.test(value.trim());
      const isTg = telegramRegex.test(value.trim());
      
      if (!isPhone && !isTg) {
        errorMsg = "Введіть коректний номер телефону або Telegram-нік (починаючи з @)";
      }
    }
  }
  
  if (name === "message") {
    if (value.length > 500) errorMsg = "Повідомлення не може перевищувати 500 символів";
  }

  return errorMsg;
};