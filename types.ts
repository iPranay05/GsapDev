
export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface GeneratedOutput {
  files: ProjectFile[];
  previewHtml: string;
  explanation: string;
}

export interface GenerationState {
  prompt: string;
  output: GeneratedOutput | null;
  isLoading: boolean;
  error: string | null;
}

export enum AnimationStyle {
  FADE_UP = 'Fade Up',
  SLIDE_LEFT = 'Slide Left',
  SCALE_IN = 'Scale In',
  ROTATE_3D = '3D Rotate',
  MORPH = 'Morph'
}

export type EntryAnimation = 'fade-in' | 'slide-down' | 'scale-up' | 'none';

export interface SiteSection {
  id: string;
  type: 'hero' | 'features' | 'showcase' | 'cta' | 'contact' | 'about';
  title: string;
  description: string;
  animationStyle: AnimationStyle;
  // GSAP granular controls
  scrub: number | boolean;
  pin: boolean;
  entryAnimation?: EntryAnimation; // Specific for hero
}

export interface SiteConfig {
  siteName: string;
  primaryColor: string;
  sections: SiteSection[];
}
