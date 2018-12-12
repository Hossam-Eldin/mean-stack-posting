import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent {
    message = ' an unkown error occurreds';

  //  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

  constructor(@Inject(MAT_DIALOG_DATA) public data:{message: string}){}
}