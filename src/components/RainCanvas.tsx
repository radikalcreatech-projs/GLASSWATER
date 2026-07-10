import { useEffect, useRef } from 'react';

export function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = container.clientWidth || window.innerWidth;
    let h = canvas.height = container.clientHeight || window.innerHeight;

    class Drop {
      x: number;
      y: number;
      r: number;
      speed: number;
      isStatic: boolean;
      wobble: number;

      constructor(isStatic = false) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.isStatic = isStatic;
        this.wobble = Math.random() * Math.PI * 2;
        
        if (this.isStatic) {
          this.r = Math.random() * 3 + 1.5;
          this.speed = 0;
        } else {
          this.r = Math.random() * 5 + 3;
          this.speed = Math.random() * 3 + 1;
        }
      }

      update() {
        if (this.isStatic) return;
        this.y += this.speed;
        this.wobble += 0.05;

        if (this.y > h + this.r * 2) {
          this.y = -this.r * 2;
          this.x = Math.random() * w;
          this.r = Math.random() * 5 + 3;
          this.speed = Math.random() * 3 + 1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        let xOffset = 0;
        if (!this.isStatic) {
          xOffset = Math.sin(this.wobble) * (this.r * 0.2);
        }
        
        const heightMultiplier = this.isStatic ? 1.1 : 1.4;
        drawWaterDrop(ctx, this.x + xOffset, this.y, this.r, this.r * heightMultiplier);
      }
    }

    function drawWaterDrop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
        
        // Shadow for the drop
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;
        
        // Gradient simulating the refraction on a light grey background
        const grd = ctx.createLinearGradient(0, -h, 0, h);
        grd.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        grd.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
        grd.addColorStop(0.8, 'rgba(0, 0, 0, 0.05)');
        grd.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Inner dark rim to give depth
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Main bright highlight (top-left)
        ctx.beginPath();
        ctx.ellipse(-w * 0.3, -h * 0.4, w * 0.3, h * 0.3, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        // Small secondary highlight (bottom-right)
        ctx.beginPath();
        ctx.arc(w * 0.25, h * 0.5, w * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        
        ctx.restore();
    }

    let staticDrops = Array.from({length: 120}, () => new Drop(true));
    let dynamicDrops = Array.from({length: 25}, () => new Drop(false));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of staticDrops) { 
        d.draw(ctx);
      }
      for (const d of dynamicDrops) {
        d.update();
        d.draw(ctx);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    let oldW = w;
    let oldH = h;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          w = canvas.width = newW;
          h = canvas.height = newH;
          if (Math.abs(oldW - newW) > 100 || Math.abs(oldH - newH) > 100) {
            staticDrops = Array.from({length: 120}, () => new Drop(true));
            dynamicDrops = Array.from({length: 25}, () => new Drop(false));
            oldW = newW;
            oldH = newH;
          }
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#EAECEE]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
      />
    </div>
  );
}
