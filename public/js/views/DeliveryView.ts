import { ApiService } from '../services/api.service';

export class DeliveryView {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="delivery-container">
                <h2>Оформление заказа</h2>
                <form id="delivery-form" data-delivery-form>
                    <div class="form-group">
                        <label for="address">Адрес доставки *</label>
                        <input type="text" id="address" name="address" required data-delivery="address">
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Телефон *</label>
                        <input type="tel" id="phone" name="phone" required data-delivery="phone">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required data-delivery="email">
                    </div>
                    
                    <div class="form-group">
                        <label for="payment">Способ оплаты *</label>
                        <select id="payment" name="paymentMethod" required data-delivery="payment">
                            <option value="">Выберите способ оплаты</option>
                            <option value="card">Банковская карта</option>
                            <option value="cash">Наличные при получении</option>
                            <option value="online">Онлайн-оплата</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="confirm-rules" required>
                            Я согласен с условиями обработки данных
                        </label>
                    </div>
                    
                    <button type="submit" class="submit-order">Оформить заказ</button>
                </form>
            </div>
        `;

        const form = document.getElementById('delivery-form');
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        try {
            const result = await ApiService.request('/delivery/create', {
                method: 'POST',
                body: JSON.stringify({
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    paymentMethod: formData.get('paymentMethod')
                })
            });
            
            if (result) {
                alert('Заказ успешно оформлен!');
                window.location.href = '/';
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Ошибка оформления заказа');
        }
    }
}