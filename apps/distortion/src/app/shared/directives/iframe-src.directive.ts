import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'iframe',
  standalone: true,
})
export class IframeSrcDirective {
  @Input()
  public get iframeSrc(): string {
    return this.elRef.nativeElement.src;
  }
  public set iframeSrc(src: string) {
    if (this.elRef.nativeElement.src !== src) {
      this.renderer.setAttribute(this.elRef.nativeElement, 'src', src);
    }
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}
