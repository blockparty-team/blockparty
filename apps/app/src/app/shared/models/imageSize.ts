type Size = 'small' | 'medium' | 'large';

type Resize = 'cover' | 'contain' | 'fill';

export interface TransformOptions {
  width: number;
  resize: Resize;
}

export const imageSize: Record<Size, TransformOptions> = {
  small: { width: 100, resize: 'cover' },
  medium: { width: 200, resize: 'cover' },
  large: { width: 300, resize: 'cover' },
};
