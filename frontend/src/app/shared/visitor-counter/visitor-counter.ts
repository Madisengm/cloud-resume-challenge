import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-visitor-counter',
  imports: [DecimalPipe],
  templateUrl: './visitor-counter.html',
  styleUrl: './visitor-counter.css',
})
export class VisitorCounter {

  @Input() count: number | null = null;
}
