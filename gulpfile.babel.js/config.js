import { resolve, join } from 'path';

const src = resolve('.', 'src');
const dest = resolve('.', 'public');

export default {
    root: {
        src,
        dest,
    },
    css: {
        src: join(src, 'styles'),
        dest: join(dest, 'styles'),
    },
    js: {
        src: join(src, 'scripts'),
        dest: join(src, 'scripts'),
    },
    html: {
        src: join(src, 'html'),
        dest,
    },
    images: {
        src: join(src, 'assets'),
        dest: join(dest, 'assets'),
    },
    static: {
        src: join(src, 'static'),
        dest,
    },
};
