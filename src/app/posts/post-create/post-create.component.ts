import { Post } from './../post.model';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostServiceService } from '../post-service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  isLoading = false;
  model: any = [];
  post: Post;
  form: FormGroup;
  imagePreview: any;
  private mode = 'create';
  private postId: string;

  constructor(public postService: PostServiceService, public route: ActivatedRoute) { }



  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]  }),
      content: new FormControl(null, {validators: [ Validators.required] }),
      image: new FormControl(null, {validators: [Validators.required ]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((result) => {
          this.isLoading = false;
          this.post = {
             id: result.id, 
             title: result.title, 
             content: result.content ,
             imagePath: result.imagePath
            };

          this.form.setValue({
            title: this.post.title,
            content:this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }


onImagePicked(event: Event) {

  // get image from html
  const file = (event.target as HTMLInputElement).files[0];
  // put the image in the form 
  this.form.patchValue({image: file});
  // telling angular to update the value of  the image form
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result;
  }
  reader.readAsDataURL(file);
}


  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
         this.form.value.content,
          this.form.value.image);
          // console.log(this.form.value);
    } else {
      this.postService.editPost(
        this.postId, 
        this.form.value.title,
         this.form.value.content, 
         this.form.value.image);
    }
    this.form.reset();
  }

}
