export const normalizeSearchText = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
        .trim();
};

export const rankProductsBySearch = (products, searchQuery, limit = 6) => {
    const query = normalizeSearchText(searchQuery);
    if (!query) return [];

    const matchedProducts = products.filter((product) => {
        const normalizedName = normalizeSearchText(product.name || '');
        return normalizedName.includes(query);
    });
    return matchedProducts.slice(0, limit);
};