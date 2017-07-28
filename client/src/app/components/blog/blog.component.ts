import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { BlogService } from './../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogFrmGrp:FormGroup;
  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  processing = false;
  username;
  blogPosts;

  constructor(private frmBldr: FormBuilder, private router:Router, private authService:AuthService, private blogService: BlogService) { }

  ngOnInit() {
    this.createNewBlogPost();
    this.getAllBlogs();
  }

  newBlogForm()
  {
    this.newPost = true;
  }

  reloadBlogs()
  {
    this.loadingBlogs = true;

    //Get all blogs
    this.getAllBlogs();

    setTimeout(() => {
      this.loadingBlogs = false; 
    }, 5000);
  }

  createNewBlogPost()
  {
    this.blogFrmGrp = this.frmBldr.group({
      title : ['', Validators.compose([ Validators.required, Validators.minLength(5), Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9 ]+$/) ])],
      body : ['', Validators.compose([ Validators.required, Validators.minLength(5), Validators.maxLength(500)])],
      createdBy : ['']
    });

    this.authService.getProfile().subscribe(profile => { this.username = profile.user.username });

  }

  goBack()
  {
    window.location.reload();
  }

  draftComment()
  {

  }


  disableForm()
  {
    this.blogFrmGrp.controls['title'].disable();
    this.blogFrmGrp.controls['body'].disable();
  }

  enableForm()
  {
    this.blogFrmGrp.controls['title'].enable();
    this.blogFrmGrp.controls['body'].enable();
  }

  onBlogSubmit(formData: any)
  {
    this.processing = true;
    this.disableForm();
    const blog = { title : formData.title, body: formData.body, createdBy: this.username };
    this.blogService.newBlog(blog).subscribe(data => {
    if(!data.success)
      {
        this.messageClass = 'alert alert-danger'
        this.message = data.message;
        this.processing = false;
        this.enableForm()
      }else
      {
        this.messageClass = 'alert alert-success'
        this.message = data.message;
        this.getAllBlogs();
        setTimeout(function() {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.blogFrmGrp.reset();
          this.enableForm();
        }, 2000);
      }
    });
  }

  getAllBlogs()
  {
    this.createNewBlogPost();
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
    });
  }
}
