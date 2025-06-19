export class OverlayDraggable {
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  constructor(
    private readonly element: HTMLElement,
    private readonly onMove: (x: number, y: number) => void
  ) {
    this.initDrag();
  }

  private initDrag(): void {
    this.element.addEventListener('mousedown', (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.controls')) return;

      this.isDragging = true;
      this.offsetX = e.clientX - this.element.offsetLeft;
      this.offsetY = e.clientY - this.element.offsetTop;

      const onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;

        const newX = e.clientX - this.offsetX;
        const newY = e.clientY - this.offsetY;

        this.onMove(newX, newY);
        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
}
