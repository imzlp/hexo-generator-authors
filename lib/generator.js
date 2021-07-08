'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
  const config = this.config;
  const perPage = config.tag_generator.per_page;
  const paginationDir = config.pagination_dir || 'page';
  const orderBy = config.tag_generator.order_by || '-date';
  let authorsDir = config.hexo_authors_generator.authors_dir || "authors/";

  if (authorsDir[authorsDir.length - 1] !== '/') authorsDir += '/';

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
    const data = pagination(authorsDir + author.name, postObj.sort(orderBy), {
      perPage: perPage,
      layout: ['archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        author: author.name
      }
    });

    return result.concat(data);
  }, []);

  if(config.hexo_authors_generator.create_root)
  {
    var allPosts = locals.posts.sort(orderBy)
    pages.push({
      path: authorsDir,
      layout: ['archive','index'],
      posts: allPosts,
      data: {
        base: authorsDir,
        total: 1,
        current: 1,
        current_url: authorsDir,
        posts: allPosts,
        prev: 0,
        prev_link: '',
        next: 0,
        next_link: ''
      }
    }); 
  }

  return pages;
};
