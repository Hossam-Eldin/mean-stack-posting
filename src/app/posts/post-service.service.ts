import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[] , postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {

  }
  // fetch the posts from the server
  getPosts(postsPerPage: number, currentPage: number) {

    const  queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          return{ posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postUpdated.next({posts: [...this.posts ], postCount: transformedPostData.maxPosts });

      });
  }

  // return list of posts updated
  getPostList() {
    return this.postUpdated.asObservable();
  }

  /* for edit posts check the id  
   for the post exist and return copy from it */
  getPost(id: String) {
    return this.http.get<{ id: string, title: string,  content: string, imagePath: string , creator: string}>('http://localhost:3000/api/posts/' + id);
  }


  // adding post  to database
  addPost(title: string, content: string, image: File ) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image  , title);
    console.log(postData);
    this.http.post<{ message: String, post: Post }>('http://localhost:3000/api/posts', postData)
    .subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  editPost(id: string, title: string, content: string, image: File ) {
    // const post: Post = { id: id, title: title, content: content , imagePath: null};
      let postData:Post |FormData;
    if (typeof(image) === 'object') {
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image , title);

    } else {

        postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }


  // deleting posts
  deletePost(postId: String) {
  return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

}
