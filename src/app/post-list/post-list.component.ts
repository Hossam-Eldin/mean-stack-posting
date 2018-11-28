import { PostServiceService } from './../posts/post-service.service';
import { Post } from './../posts/post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {



  posts: Post[] = [];
  private postSub: Subscription;

  constructor(private postService: PostServiceService) { }
  
  onDelete(postId: String) {
    //  console.log(postId);
      this.postService.deletePost(postId);
  }

  ngOnInit() {

    this.postService.getPost();
    this.postSub = this.postService.getPostList()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }


  ngOnDestroy() {
    this.postSub.unsubscribe();
  }


}
