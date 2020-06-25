export const fetchNews = (params) => fetch("http://hn.algolia.com/api/v1/search" + params);

export const upvoteNews = (id, count) => fetch(`/api/upvote/?id=${id}&count=${count}`).then(response => response.json());

export const hideNews = (id) => fetch(`/api/hide/?id=${id}`).then(response => response.json());