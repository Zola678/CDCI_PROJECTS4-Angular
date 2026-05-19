import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: 'service' | 'hardware';
}

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-products.html',
  styleUrls: ['./user-products.css']
})
export class UserProductsComponent implements OnInit {

  // Serviços e Produtos Fixos de Multimédia e Tecnologia
  multimediaItems: Product[] = [
    { id: 101, name: 'Edição de Vídeo Profissional', description: 'Edição cinematográfica para YouTube, Redes Sociais ou Eventos.', price: 250, category: 'service' },
    { id: 102, name: 'Gestão de Marketing Digital', description: 'Gestão completa de tráfego pago e redes sociais.', price: 500, category: 'service' },
    { id: 103, name: 'Design Gráfico & Branding', description: 'Criação de logotipos e identidade visual de alto impacto.', price: 350, category: 'service' },
    { id: 104, name: 'Placa de Vídeo RTX 4090', description: 'A melhor performance para edição e renderização 3D.', price: 1800, category: 'hardware' },
    { id: 105, name: 'Monitor 4K Design Pro', description: 'Cores ultra precisas para designers e editores.', price: 800, category: 'hardware' },
    { id: 106, name: 'Licença Adobe Creative Cloud', description: 'Acesso total a todas as ferramentas Adobe (1 ano).', price: 600, category: 'hardware' }
  ];

  purchasedItems: any[] = [];
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Não carregamos mais do localStorage, mas podemos manter para histórico offline se quiseres
    // this.loadPurchases(); 
  }

  // 🔐 Headers com Token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  buy(item: Product): void {
    
    this.successMessage = '';

    // 🔥 Integração REAL com Backend
    this.http.post('http://127.0.0.1:8000/api/products', {
      name: item.name,
      description: item.description || '',
      quantity: 1,
      price: item.price
    }, this.getHeaders()).subscribe({
      next: (res: any) => {
        this.successMessage = `Sucesso! Você adquiriu: ${item.name}`;
        
        // Auto-hide message
        setTimeout(() => this.successMessage = '', 4000);

        // Notifica dashboard
        window.dispatchEvent(new Event('products-updated'));
      },
      error: (err) => {
        console.error('Erro na compra:', err);
        alert('Erro ao processar a compra. Tente novamente.');
      }
    });
  }

  trackById(index: number, item: Product): number {
    return item.id;
  }
}
