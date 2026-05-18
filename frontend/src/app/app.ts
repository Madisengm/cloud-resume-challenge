import { Component, HostListener, inject, signal } from '@angular/core';
import { ApiService } from './core/services/api-service';
import { VisitorCounter } from "./shared/visitor-counter/visitor-counter";

@Component({
  selector: 'app-root',
  imports: [VisitorCounter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // ─── Services ─────────────────────────────────────────────────────────────
  private apiService = inject(ApiService);

  // ─── Constants ────────────────────────────────────────────────────────────
  private readonly sections = ['home', 'about', 'resume'];
  private readonly HEADER_OFFSET = 88;

  // ─── State ────────────────────────────────────────────────────────────────
  activeSection = signal<string>('home');
  visitorCount = signal<number | null>(null);

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadVisitorCount();
  }

  // ─── Scroll tracking ──────────────────────────────────────────────────────
  @HostListener('window:scroll')
  onScroll(): void {
    const scrollY = window.scrollY + this.HEADER_OFFSET + 10;
    for (const id of this.sections) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        this.activeSection.set(id);
      }
    }
  }

  // ─── Scroll actions ───────────────────────────────────────────────────────
  scrollAction(direction: 'up' | 'down'): void {
    const idx = this.sections.indexOf(this.activeSection());
    const targetIdx = direction === 'down'
      ? Math.min(idx + 1, this.sections.length - 1)
      : Math.max(idx - 1, 0);
    this.smoothScrollTo(this.sections[targetIdx]);
  }

  smoothScrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - this.HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // ─── API ──────────────────────────────────────────────────────────────────
  private loadVisitorCount(): void {
    this.apiService.getVisitorCount().subscribe({
      next: (count) => this.visitorCount.set(count),
      error: (err) => {
        console.error('Visitor count fetch failed:', err);
        this.visitorCount.set(0);
      },
    });
  }

  // ─── Profile Data ─────────────────────────────────────────────────────────
  readonly profileData = {
    imageSrc: 'assets/images/profile-pic.jpg',

    profileSummary: `Security-focused Frontend Engineer specializing in Angular (v17/18+), TypeScript, and Azure serverless architectures. 
                    Experienced in designing and developing secure, intuitive self-service web interfaces for workflow-driven enterprise applications. 
                    Strong background in secure coding practices, state management optimization using Angular Signals, and cloud-native CI/CD pipelines. 
                    Combines frontend engineering expertise with Level 2 production support experience to build resilient, scalable, and performance-optimized web applications.`,
    education: [
      {
        institution: 'IIE ROSEBANK COLLEGE',
        years: '2015 - 2018',
        degree: 'Diploma in Network Management',
      },
      {
        institution: 'Angular Developer Bootcamp (Udemy)',
        years: '2025',
      },
      {
        institution: 'Microsoft Certified: Azure Fundamentals',
        years: '2025',
        certificate: 'AZ-900 Certification',
      },
    ],

    workExperience: [
      {
        company: 'Verisec SA',
        title: 'Developer Support Engineer',
        years: '2023 - PRESENT',
        responsibilities: [
          'I orchestrate the end-to-end technical architecture and business workflows for enterprise-grade SaaS and Kiosk ecosystems. My role involves designing the full-lifecycle data flow—from hardware-level user interaction to backend integration—ensuring the system is scalable, performant, and globally accessible.',
        ],
        skills: [
          'Angular', 'TypeScript', 'TailwindCSS', 'Firebase', 'Azure Functions',
          'REST APIs', 'RxJS', 'SignalR', 'Application Insights', 'GitHub Actions',
          'Figma', 'Postman', 'Cypress', 'Jasmine/Karma', 'Azure SWA', 'System Architecture',
        ],
      },
      {
        company: 'SoluGrowth',
        title: 'Level 2 Support Engineer',
        years: '2022 - 2023',
        responsibilities: [
          'Diagnosed and resolved production-level Angular and .NET issues.',
          'Collaborated with backend teams to identify data and API discrepancies.',
          'Created reusable troubleshooting scripts and process automation tools.',
          'Documented complex cases and created internal technical articles.',
        ],
        skills: [
          'PowerShell', 'MSSQL Server', 'Azure', 'RDP', 'SIMS',
          'JIRA', 'Bitbucket', 'Chrome DevTools', 'Postman', 'Github',
        ],
      },
      {
        company: 'Green Beetle Branding',
        title: 'Internal Key Account Support',
        years: '2021 - 2022',
        responsibilities: [
          'Streamlined CRM and project workflows for internal departments.',
          'Developed reporting dashboards to improve project tracking.',
          'Automated operational tasks using Excel macros and data scripts.',
          'Enhanced client communication pipelines with optimised ticket management.',
        ],
        skills: [
          'Excel VBA', 'Power BI', 'WordPress', 'CRM', 'Adobe', 'SharePoint',
          'HTML', 'CSS', 'Canva',
        ],
      },
    ],
  };
}
