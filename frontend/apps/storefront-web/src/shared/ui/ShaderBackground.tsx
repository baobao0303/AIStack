'use client';

import React, { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas!.clientWidth || 1280;
      const h = canvas!.clientHeight || 720;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas!);
    }
    syncSize();

    const gl = (canvas!.getContext('webgl') || canvas!.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    float n1 = snoise(uv * 2.0 + u_time * 0.1);
    float n2 = snoise(uv * 3.5 - u_time * 0.08);
    float flow = n1 * 0.5 + n2 * 0.25;
    
    vec3 colorA = vec3(0.553, 0.667, 0.569); // Sage
    vec3 colorB = vec3(0.98, 0.976, 0.965);  // Cream
    vec3 colorC = vec3(0.85, 0.85, 0.82);   // Mid tone
    
    vec3 finalColor = mix(colorB, colorA, clamp(flow + 0.3, 0.0, 1.0));
    finalColor = mix(finalColor, colorC, clamp(n2 * 0.4, 0.0, 1.0));
    
    float vignette = 1.0 - length(uv - 0.5) * 0.5;
    gl_FragColor = vec4(finalColor * vignette, 1.0);
}`;

    function cs(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vsShader = cs(gl.VERTEX_SHADER, vs);
    const fsShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vsShader || !fsShader) return;

    gl.attachShader(prog, vsShader);
    gl.attachShader(prog, fsShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas!.width / 2, y: canvas!.height / 2 };
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas!.width;
        mouse.y = ny * canvas!.height;
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let frameId: number;
    function render(t: number) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      if (uTime) gl!.uniform1f(uTime, t * 0.001);
      if (uRes) gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      if (uMouse) gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    }
    frameId = requestAnimationFrame(render);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(frameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 opacity-30 pointer-events-none block">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
