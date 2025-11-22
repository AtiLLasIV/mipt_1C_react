import articles from '../assets/articles.json'

const ARTICLES_LOAD_DURATION = 150;

export async function getArticles() {
    return new Promise(resolve => {
        setTimeout(() => resolve(articles), ARTICLES_LOAD_DURATION)
    })
}