import { ApiService } from '../services/api.service';

export class LoginView {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="auth-container">
                <div class="auth-form">
                    <h2>Вход в аккаунт</h2>
                    <form id="login-form" data-registration>
                        <div class="form-group">
                            <label for="login">Логин или Email</label>
                            <input type="text" id="login" name="login" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit">Войти</button>
                    </form>
                    <p>Нет аккаунта? <a href="/register" data-link>Зарегистрироваться</a></p>
                </div>
            </div>
        `;

        const form = document.getElementById('login-form');
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        try {
            const result = await ApiService.login({
                login: formData.get('login') as string,
                password: formData.get('password') as string
            });
            
            if (result) {
                window.location.href = '/';
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Login failed');
        }
    }
}