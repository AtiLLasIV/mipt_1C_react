import comments from '../assets/comments.json'

const COMMENTS_LOAD_DURATION = 100;

function selectByArticleId(totalData, id) {
    return totalData.filter(({articleId}) => articleId === id)
}

export async function getComments(articleId) {
    return new Promise(resolve => {
        const targetComments = selectByArticleId(comments, articleId)
        setTimeout(() => resolve(targetComments), COMMENTS_LOAD_DURATION)
    })
}