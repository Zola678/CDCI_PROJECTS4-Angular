import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PurchaseService } from '../../services/purchase.service';

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
  // armazenar id do item que está a ser comprado; evita desativar todos os botões
  buyingId: number | null = null;
  lastError = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    // Não carregamos mais do localStorage, mas podemos manter para histórico offline se quiseres
    // this.loadPurchases(); 
  }

  buy(item: Product): void {
    
    this.successMessage = '';
    this.lastError = '';
    this.buyingId = item.id;
    // feedback imediato para o utilizador (fallback)
    this.successMessage = `Enviando compra: ${item.name}...`;
    try { this.cdr.detectChanges(); } catch(e) {}
    // 🔥 Integração REAL com Backend
    this.http.post('http://localhost:8000/api/products', {
      name: item.name,
      description: item.description || '',
      quantity: 1,
      price: item.price
    }).subscribe({
      next: (res: any) => {
        // mostra sucesso
        console.debug('Resposta do servidor (compra):', res);
        this.successMessage = `Sucesso! Você adquiriu: ${item.name}`;

        // adiciona compra localmente (optimistic) e notifica o dashboard com detalhe
        try {
          const created = res; // backend retorna o product criado
          console.debug('Compra criada:', created);
          this.purchasedItems.push(created);
          // notificar via PurchaseService (in-memory) para o dashboard atualizar imediatamente
          try {
            const p = { id: created.id, name: created.name, date: created.created_at || new Date().toISOString() };
            this.purchaseService.push(p);
          } catch(e) {}
          // manter dispatch window para compatibilidade
          window.dispatchEvent(new CustomEvent('products-updated', { detail: created, bubbles: true, composed: true }));
        } catch (e) {
          window.dispatchEvent(new CustomEvent('products-updated', { bubbles: true, composed: true }));
        }

        // Auto-hide message
        setTimeout(() => { this.successMessage = ''; try { this.cdr.detectChanges(); } catch(e) {} }, 4000);
        // notificar toast global (dashboard pode mostrar mensagem)
        try {
          // guardar em sessionStorage como fallback caso o dashboard não esteja carregado
          // dispatch real-time only; não persistir em storage para evitar mostrar mensagem quando
          // o utilizador apenas navega depois da compra
          console.debug('Dispatching purchase-success with message:', this.successMessage);
          window.dispatchEvent(new CustomEvent('purchase-success', { detail: this.successMessage, bubbles: true, composed: true }));
        } catch (e) {
          // ambiente sem CustomEvent (fallback)
          try { window.dispatchEvent(new Event('purchase-success')); } catch {}
        }
        this.buyingId = null;
        try { this.cdr.detectChanges(); } catch(e) {}
      },
      error: (err) => {
        console.error('Erro na compra:', err);
        this.lastError = err?.error?.message || err?.message || 'Erro ao processar a compra.';
        alert(this.lastError);
        // limpar mensagem de envio se houver
        this.successMessage = '';
        this.buyingId = null;
        try { this.cdr.detectChanges(); } catch(e) {}
      }
    });
  }

  isBuying(id: number): boolean {
    return this.buyingId === id;
  }

  trackById(index: number, item: Product): number {
    return item.id;
  }
}
