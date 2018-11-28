import { Post } from './../post.model';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostServiceService } from '../post-service.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {


  model: any = [];

  constructor(public postService: PostServiceService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
