import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'iframe',
  standalone: true,
})
export class IframeSrcDirective {
  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input()
  public get iframeSrc(): string {
    return this.elRef.nativeElement.src;
  }
  public set iframeSrc(src: string) {
    if (this.elRef.nativeElement.src !== src) {
      this.renderer.setAttribute(this.elRef.nativeElement, 'src', src);
    }
  }
}
