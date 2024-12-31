import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from "@angular/core";

@Directive({
  selector: "[appTaskPriority]",
  standalone: true,
})
export class TaskPriorityDirective implements OnChanges {
  @Input({ required: true }) appTaskPriority!: "High" | "Medium" | "Low";

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {

  }

  ngOnChanges(): void {
    this.renderer.setStyle(this.el.nativeElement, "width", "10px");
    this.renderer.setStyle(this.el.nativeElement, "height", "10px");
    this.renderer.setStyle(this.el.nativeElement, "borderRadius", "50%");

    switch (this.appTaskPriority) {
      case "High":
        this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "red");
        break;
      case "Medium":
        this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "orange");
        break;
      case "Low":
        this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "green");
        break;
    }
  }
}
