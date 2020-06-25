import React from 'react';
import timeAgo from "node-time-ago";
import { upvoteNews, hideNews } from '../utils/apiService';
import { useHistory } from "react-router-dom";
import { getUrlParameter } from "../utils/jsHelper";

const NewsItem = ({post, index, updateLocalData }) => {
    const history = useHistory();
    const { location: { search } } = history;
    let addon = 0;
    if(search && getUrlParameter(search) && getUrlParameter(search).page > 0){
        addon = 20 * getUrlParameter(search).page
    }
    const upvoteNewsItem = () => {
        upvoteNews(post.objectID, post.relevancy_score + 1).then((resp) => {
            if(resp.status === 'success'){
                updateLocalData({
                    objectID: post.objectID, 
                    relevancy_score: parseInt(post.relevancy_score) + 1,
                    created_at: new Date().getTime(),
                })
            }
        });
    };

    const hideNewsItem = () => {
        hideNews(post.objectID).then((resp) => {
            if(resp.status === 'success'){
                updateLocalData({
                    objectID: post.objectID, 
                    hide: true
                })
            }
        });
    };

    if(post && post.hide) return null;
    return (
        <div className="news-item">
            <p>
                <span className="news-position">{(parseInt(++index) + parseInt(addon))}. </span><span className="upvote-news" onClick={() => upvoteNewsItem()}>▲</span> {post.title}{" "}
                <small>(by {post.author})</small>
                <strong onClick={() => hideNewsItem()} className="hide-news">[HIDE]</strong>
            </p>
            <small className="news-details">
                {post.relevancy_score} upvotes | {timeAgo(post.created_at)}
            </small>
        </div>
    )
}

export default NewsItem;