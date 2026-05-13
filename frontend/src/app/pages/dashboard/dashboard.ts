import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Service {
  id: number;
  name: string;
  category: string;
  status: 'Em progresso' | 'Concluído' | 'Pendente';
  progress: number;
  createdAt: string;
  deadline: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {

  // 👉 dados simulados (depois vêm da API)
  services: Service[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadServices();
  }

  // 🔥 simulação de dados (substituir por API depois)
  loadServices(): void {
    this.services = [
      {
        id: 1,
        name: 'Edição de Vídeo Premium',
        category: 'Video',
        status: 'Em progresso',
        progress: 65,
        createdAt: '2026-05-01',
        deadline: '2026-05-10'
      },
      {
        id: 2,
        name: 'Logo Branding 3D',
        category: 'Design',
        status: 'Concluído',
        progress: 100,
        createdAt: '2026-04-20',
        deadline: '2026-04-28'
      }
    ];
  }

  // 🔐 logout seguro (limpa estado antes de sair)
  logout(): void {
    localStorage.removeItem('token'); // se estiveres a usar auth depois
    this.router.navigate(['/login']);
  }

  // 📌 função futura (abrir detalhes de serviço)
  openService(serviceId: number): void {
    this.router.navigate(['/service', serviceId]);
  }

}