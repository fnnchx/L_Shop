import { ApiService } from '../services/api.service';

export class RegisterView {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="auth-container">
                <div class="auth-form">
                    <h2>Регистрация</h2>
                    <form id="register-form" data-registration>
                        <div class="form-group">
                            <label for="name">Имя</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="login">Логин</label>
                            <input type="text" id="login" name="login" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Телефон</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit">Зарегистрироваться</button>
                    </form>
                    <p>Уже есть аккаунт? <a href="/login" data-link>Войти</a></p>
                </div>
            </div>
        `;

        const form = document.getElementById('register-form');
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        try {
            const result = await ApiService.register({
                name: formData.get('name'),
                email: formData.get('email'),
                login: formData.get('login'),
                phone: formData.get('phone'),
                password: formData.get('password')
            });
            
            if (result) {
                window.location.href = '/';
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Registration failed');
        }
    }
}