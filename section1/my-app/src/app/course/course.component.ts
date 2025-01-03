import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {merge, fromEvent, throwError} from "rxjs";
import { Lesson } from '../model/lesson';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course!:Course;

    // order is important for displaying column
    displayedColumns = ['seqNo', 'description', "duration"];

    lessons: Lesson[];

    loading: boolean = false;

    // get referance of the first paginator
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {

        this.course = this.route.snapshot.data["course"];

        this.loadLessonPage();
    }

    loadLessonPage(){
      this.loading = true;                                     //paginator is initialize in ngAfterInit 
      this.coursesService.findLessons(this.course.id, "asc",  this.paginator?.pageIndex ?? 0 , this.paginator?.pageSize ?? 3)
      .pipe(
        tap((lessons)=>this.lessons = lessons),
        catchError((err:any)=>{
          console.log("Error loading lessons", err);
          alert("Error loading lessons");
          return throwError(err);
        }),
        finalize(()=>{
          this.loading = false;
        })
      )
      .subscribe()
    }

    ngAfterViewInit() {
      this.paginator.page
      .pipe(
        tap(()=> this.loadLessonPage())
      )
      .subscribe();

    }

}
