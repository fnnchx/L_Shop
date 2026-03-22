import { HomeView } from './views/HomeView.js';
import { LoginView } from './views/LoginView.js';
import { RegisterView } from './views/RegisterView.js';
import { CartView } from './views/CartView.js';
import { DeliveryView } from './views/DeliveryView.js';
import { ApiService } from './services/api.service.js';

class Router {
    private root: HTMLElement;
    private currentUser: any = null;

    constructor() {
        this.root = document.getElementById('root')!;
        this.init();
    }

    async init() {
        const userData = await ApiService.getCurrentUser();
        this.currentUser = userData?.user || null;
        
        this.updateAuthUI();
        this.setupNavigation();
        this.handleRoute();
        
        window.addEventListener('popstate', () => this.handleRoute());
    }

    private setupNavigation() {
        document.body.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('[data-link]');
            
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href')!;
                history.pushState(null, '', href);
                this.handleRoute();
            }
        });
    }

    private async handleRoute() {
        const path = window.location.pathname;
        
        switch (path) {
            case '/':
                await this.renderHome();
                break;
            case '/login':
                await this.renderLogin();
                break;
            case '/register':
                await this.renderRegister();
                break;
            case '/cart':
                await this.renderCart();
                break;
            case '/delivery':
                await this.renderDelivery();
                break;
            default:
                await this.renderHome();
        }
    }

    private async renderHome() {
        const view = new HomeView(this.root);
        await view.render();
    }

    private async renderLogin() {
        const view = new LoginView(this.root);
        view.render();
    }

    private async renderRegister() {
        const view = new RegisterView(this.root);
        view.render();
    }

    private async renderCart() {
        if (!this.currentUser) {
            window.location.href = '/login';
            return;
        }
        const view = new CartView(this.root);
        await view.render();
    }

    private async renderDelivery() {
        if (!this.currentUser) {
            window.location.href = '/login';
            return;
        }
        const view = new DeliveryView(this.root);
        view.render();
    }

    private updateAuthUI() {
        const authButtons = document.getElementById('auth-buttons');
        if (!authButtons) return;
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <span class="user-name">${this.currentUser.name}</span>
                <button id="logout-btn" class="logout-btn">Выйти</button>
            `;
            
            const logoutBtn = document.getElementById('logout-btn');
            logoutBtn?.addEventListener('click', async () => {
                await ApiService.logout();
                window.location.href = '/';
            });
        } else {
            authButtons.innerHTML = `
                <a href="/login" class="nav-link" data-link>Вход</a>
                <a href="/register" class="nav-link" data-link>Регистрация</a>
            `;
        }
    }
}

new Router();