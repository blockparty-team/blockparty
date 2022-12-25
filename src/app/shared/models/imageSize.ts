type Resize = 'cover' | 'contain' | 'fill';

export interface TransformOptions {
    width: number;
    resize: Resize;
}

type Size = 'small' | 'medium' | 'large';

export const imageSize: Record<Size, TransformOptions> = {
    small: { width: 400, resize: 'cover' },
    medium: { width: 800, resize: 'cover' },
    large: { width: 1200, resize: 'cover' }
};
