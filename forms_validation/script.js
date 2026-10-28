document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');
  const fields = form.querySelectorAll('input[id], select[id], textarea[id]');
  const bioTextarea = document.getElementById('bio');
  const charCount = document.getElementById('charCount');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const birthDate = document.getElementById('birthDate');
  const status = document.getElementById('formStatus');

  // Дата рождения не может быть в будущем
  birthDate.max = new Date().toISOString().split('T')[0];

  // Счётчик символов для textarea
  bioTextarea.addEventListener('input', function () {
    charCount.textContent = this.value.length;
  });

  // Валидация в реальном времени:
  // blur — проверяем поле, когда пользователь его покинул;
  // input — убираем ошибку, как только пользователь продолжил ввод.
  fields.forEach(function (field) {
    field.addEventListener('blur', validateField);
    field.addEventListener('input', clearError);
    if (field.type === 'checkbox' || field.tagName === 'SELECT') {
      field.addEventListener('change', validateField);
    }
  });

  // Подтверждение пароля проверяется при вводе в любое из двух полей
  confirmPassword.addEventListener('input', validatePasswordMatch);
  password.addEventListener('input', function () {
    if (confirmPassword.value) {
      validatePasswordMatch();
    }
  });

  // Отправка формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    let firstInvalid = null;

    fields.forEach(function (field) {
      if (!validateField({ target: field })) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!validatePasswordMatch()) {
      isValid = false;
      if (!firstInvalid) firstInvalid = confirmPassword;
    }

    if (isValid) {
      showSuccessMessage();
    } else {
      showErrorMessage('НЕ-НЕ-НЕ-НЕ, иди исправляй ошибки');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // Кнопка «Очистить форму»
  form.addEventListener('reset', function () {
    charCount.textContent = '0';
    resetAllErrors();
    status.textContent = '';
    status.className = 'form-status';
  });

  // ---------- Функции валидации ----------

  function validateField(e) {
    const field = e.target;

    // Подтверждение пароля проверяется отдельной функцией (сравнение с паролем)
    if (field === confirmPassword) {
      return validatePasswordMatch();
    }

    // Необязательные пустые поля пропускаем
    if (!field.required && !String(field.value).trim()) {
      clearErrorForField(field);
      return true;
    }

    // Встроенная HTML5-валидация (required, minlength, pattern, type=email ...)
    if (!field.checkValidity()) {
      showErrorForField(field, getErrorMessage(field));
      return false;
    }

    clearErrorForField(field);
    return true;
  }

  function validatePasswordMatch() {
    const same = password.value === confirmPassword.value;

    if (confirmPassword.value && !same) {
      showErrorForField(confirmPassword, 'Пароли не совпадают');
      return false;
    }
    if (!confirmPassword.value && confirmPassword.required) {
      showErrorForField(confirmPassword, 'Это поле обязательно для заполнения');
      return false;
    }
    clearErrorForField(confirmPassword);
    return true;
  }

  function getErrorMessage(field) {
    const v = field.validity;

    if (v.valueMissing) {
      return field.type === 'checkbox'
        ? 'Необходимо принять условия'
        : 'Это поле обязательно для заполнения';
    }
    if (v.typeMismatch && field.type === 'email') {
      return 'Введите корректный email адрес';
    }
    if (v.tooShort) {
      return 'Введите не менее ' + field.minLength + ' символов';
    }
    if (v.tooLong) {
      return 'Введите не более ' + field.maxLength + ' символов';
    }
    if (v.rangeUnderflow || v.rangeOverflow) {
      return 'Дата вне допустимого диапазона';
    }
    if (v.patternMismatch) {
      if (field.type === 'password') {
        return 'Пароль должен содержать заглавные и строчные буквы, цифры (не менее 8 символов)';
      }
      if (field.type === 'tel') {
        return 'Введите телефон в формате +7 (999) 999-99-99';
      }
    }
    return 'Некорректное значение';
  }

  // ---------- Отображение ошибок ----------

  function showErrorForField(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearErrorForField(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  function clearError(e) {
    clearErrorForField(e.target);
  }

  function resetAllErrors() {
    document.querySelectorAll('.error-message').forEach(function (el) {
      el.textContent = '';
    });
    document.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
      el.removeAttribute('aria-invalid');
    });
  }

  function showSuccessMessage() {
    form.reset(); // сработает обработчик reset: очистит ошибки и счётчик
    status.textContent = 'Форма успешно отправлена!';
    status.className = 'form-status success';
  }

  function showErrorMessage(message) {
    status.textContent = message;
    status.className = 'form-status fail';
  }
});
