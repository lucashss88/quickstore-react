export const getImageUrl = (url?: string): string => {
    if (!url) {
        return 'https://via.placeholder.com/300x300.png?text=Sem+Imagem';
    }

    if (url.startsWith('http')) {
        return url;
    }

    return `http://localhost:3000${url}`;
};