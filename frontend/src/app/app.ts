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

  private apiService = inject(ApiService);

  private readonly sections = ['home', 'about', 'resume'];
  private readonly HEADER_OFFSET = 88;

  activeSection = signal<string>('home');
  visitorCount = signal<number | null>(null);

  ngOnInit(): void {
    this.loadVisitorCount();
  }

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

  private loadVisitorCount(): void {
    this.apiService.getVisitorCount().subscribe({
      next: (count) => this.visitorCount.set(count),
      error: (err) => {
        console.error('Visitor count fetch failed:', err);
        this.visitorCount.set(0);
      },
    });
  }

  readonly profileData = {
    imageSrc: 'assets/images/profile-pic.jpg',

    profileSummary:
      `
        Frontend-focused Software Engineer specialising in Angular (v17/18+), 
        TypeScript, and Azure serverless architectures. I design and scaffold full-lifecycle 
        web applications — from component architecture and state management to CI/CD pipelines 
        and cloud-native API integration. Experienced in building secure, enterprise-grade SaaS 
        and kiosk ecosystems where I own the end-to-end technical architecture, from hardware 
        interaction to backend integration. I combine deep frontend engineering with Level 2 
        production support expertise to deliver resilient, performance-optimised systems at scale.
      `,
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
        title: 'Frontend Engineer & Developer Support',
        years: '2023 - PRESENT',
        responsibilities: [
          'Architected and scaffolded enterprise Angular applications from the ground up, owning component structure, routing, state management, and API integration.',
          'Designed end-to-end data flows for SaaS and kiosk ecosystems — from hardware-level user interaction through to Azure serverless backend services.',
          'Built and maintained CI/CD pipelines using GitHub Actions for automated testing and deployment to Azure Static Web Apps.',
          'Implemented Angular Signals and OnPush change detection strategies to optimise rendering performance across high-frequency UI workflows.',
          'Integrated Azure Functions, SignalR, and Application Insights into production Angular applications.',
          'Led Level 2 production support — diagnosing and resolving critical frontend and integration issues in live enterprise environments.',
        ],
        skills: [
          'Angular', 'TypeScript', 'TailwindCSS', 'Azure Functions',
          'Azure Static Web Apps', 'Cosmos DB', 'SignalR', 'Application Insights',
          'REST APIs', 'RxJS', 'GitHub Actions', 'Figma',
          'Postman', 'Cypress', 'Jasmine/Karma',
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
