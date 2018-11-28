import { Subject  } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Portal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {

  }

  getPost() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postUpdated.next([...this.posts]);

      });
  }
  getPostList() {
    return this.postUpdated.asObservable();
  }


  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };


    this.http.post<{ message: String , postId: String }>('http://localhost:3000/api/posts', post).subscribe((response) => {
      // console.log(response);
      const id = response.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: String) {
    this.http.delete('http://localhost:3000/api/posts/' + postId ).subscribe(() => {
      console.log('deleted');
      const postUpdated = this.posts.filter( post => post.id !== postId);
      this.posts = postUpdated;
      this.postUpdated.next([...this.posts]);
    });
  }
}
