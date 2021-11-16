// TODO: derive from store config when available
export default (searchValue, categoryId) => {
    // start with the current uri
    const uri = new URL('/search.html', window.location);

    // update the query params
    uri.searchParams.set('q', searchValue);
    uri.searchParams.set(
        'filter',
        JSON.stringify({ category_id: [categoryId] })
    );

    const { pathname, search } = uri;

    // return only the pieces React Router wants
    return { pathname, search };
};
