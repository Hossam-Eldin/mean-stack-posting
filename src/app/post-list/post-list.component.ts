import { AuthSerService } from './../auth/auth-ser.service';
import { PostServiceService } from './../posts/post-service.service';
import { Post } from './../posts/post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOption = [5, 10, 15, 25, 50, 100];

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  posts: Post[] = [];
  private postSub: Subscription;

  constructor(private postService: PostServiceService, private authService: AuthSerService) { }
  
  onDelete(postId: String) {
    //  console.log(postId);
    this.isLoading =true;
      this.postService.deletePost(postId).subscribe( () => {
        this.postService.getPosts(this.postPerPage , this.currentPage);
      });
  }



  ngOnInit() {
    this.isLoading= true;
    this.postService.getPosts(this.postPerPage , this.currentPage);
    this.postSub = this.postService.getPostList()
      .subscribe((postData:{posts: Post[], postCount: number} ) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
      
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
      .getAuthSatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });  
  }

  onPageChange(pageData: PageEvent) {

    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage , this.currentPage);


  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();

  }


}
