'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
  const config = this.config;
  const perPage = config.tag_generator.per_page;
  const paginationDir = config.pagination_dir || 'page';
  const orderBy = config.tag_generator.order_by || '-date';

  let authors = [];
  // console.log(posts);

  const Query = this.model('Post').Query;
  locals.posts.each(function(post,index){
            //console.log(post.title)
            var authorName = post.author.name
            //console.log(authorName);
            if(authorName == undefined && authorName != "")
                return;
            var found = false;
            authors.forEach((author,index)=>{
                if(authorName == author.name){
                  authors[index].posts.push(post);
                  found = true;
                }
            });
            if(!found){
                var newAuthor = {
                    name: "",
                    posts: []
                }
                newAuthor.name = post.author.name;
                // console.log("author:"+newAuthor.name);
                newAuthor.posts.push(post);
                authors.push(newAuthor);
                // console.log(newAuthor);
            }
  });

  const pages = authors.reduce((result, author) => {
    if (!author.posts.length) return result;
    var posts = author.posts;
    var postObj = new Query(posts)
    const data = pagination("authors/"+author.name, postObj.sort(orderBy), {
      perPage: perPage,
      layout: ['archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        author: author.name
      }
    });

    return result.concat(data);
  }, []);

var authorDir = "authors/";
var allPosts = locals.posts.sort(orderBy)
pages.push({
          path: authorDir,
          layout: ['archive','index'],
          posts: allPosts,
          data: {
            base: authorDir,
            total: 1,
            current: 1,
            current_url: authorDir,
            posts: allPosts,
            prev: 0,
            prev_link: '',
            next: 0,
            next_link: ''
          }
        });
  return pages;
};
