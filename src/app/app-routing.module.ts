import { PostListComponent } from './post-list/post-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [

  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
  { path: 'login', component: LoginComponent  },
  { path: 'signup', component: SignupComponent  },
  { path: 'edit/:postId', component: PostCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
