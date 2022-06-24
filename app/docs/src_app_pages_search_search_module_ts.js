"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_pages_search_search_module_ts"],{

/***/ 6980:
/*!*******************************************************!*\
  !*** ./src/app/pages/search/search-routing.module.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchPageRoutingModule": () => (/* binding */ SearchPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _search_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./search.page */ 9166);




const routes = [
    {
        path: '',
        component: _search_page__WEBPACK_IMPORTED_MODULE_0__.SearchPage
    }
];
let SearchPageRoutingModule = class SearchPageRoutingModule {
};
SearchPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], SearchPageRoutingModule);



/***/ }),

/***/ 281:
/*!***********************************************!*\
  !*** ./src/app/pages/search/search.module.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchPageModule": () => (/* binding */ SearchPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 3819);
/* harmony import */ var _search_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./search-routing.module */ 6980);
/* harmony import */ var _search_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search.page */ 9166);







let SearchPageModule = class SearchPageModule {
};
SearchPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _search_routing_module__WEBPACK_IMPORTED_MODULE_0__.SearchPageRoutingModule
        ],
        declarations: [_search_page__WEBPACK_IMPORTED_MODULE_1__.SearchPage]
    })
], SearchPageModule);



/***/ }),

/***/ 9166:
/*!*********************************************!*\
  !*** ./src/app/pages/search/search.page.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchPage": () => (/* binding */ SearchPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _search_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./search.page.html?ngResource */ 2671);
/* harmony import */ var _search_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search.page.scss?ngResource */ 9541);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 823);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 3298);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 9095);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 6942);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 8759);
/* harmony import */ var _services_supabase_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/supabase.service */ 1829);







let SearchPage = class SearchPage {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.searchTerm = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl('');
    }
    ngOnInit() {
        this.searchResults$ = this.searchTerm.valueChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.debounceTime)(200), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.distinctUntilChanged)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.switchMap)(term => this.supabaseService.searchArtist(term)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(res => res.data), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.tap)(console.log));
    }
};
SearchPage.ctorParameters = () => [
    { type: _services_supabase_service__WEBPACK_IMPORTED_MODULE_2__.SupabaseService }
];
SearchPage = (0,tslib__WEBPACK_IMPORTED_MODULE_9__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.Component)({
        selector: 'app-search',
        template: _search_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        styles: [_search_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], SearchPage);



/***/ }),

/***/ 1925:
/*!**********************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/Scheduler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scheduler": () => (/* binding */ Scheduler)
/* harmony export */ });
class Scheduler {
  constructor(SchedulerAction, now = Scheduler.now) {
    this.SchedulerAction = SchedulerAction;
    this.now = now;
  }

  schedule(work, delay = 0, state) {
    return new this.SchedulerAction(this, work).schedule(state, delay);
  }

}

Scheduler.now = () => Date.now();

/***/ }),

/***/ 823:
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/operators/debounceTime.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounceTime": () => (/* binding */ debounceTime)
/* harmony export */ });
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ 14);
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ 328);


function debounceTime(dueTime, scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__.async) {
  return source => source.lift(new DebounceTimeOperator(dueTime, scheduler));
}

class DebounceTimeOperator {
  constructor(dueTime, scheduler) {
    this.dueTime = dueTime;
    this.scheduler = scheduler;
  }

  call(subscriber, source) {
    return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
  }

}

class DebounceTimeSubscriber extends _Subscriber__WEBPACK_IMPORTED_MODULE_1__.Subscriber {
  constructor(destination, dueTime, scheduler) {
    super(destination);
    this.dueTime = dueTime;
    this.scheduler = scheduler;
    this.debouncedSubscription = null;
    this.lastValue = null;
    this.hasValue = false;
  }

  _next(value) {
    this.clearDebounce();
    this.lastValue = value;
    this.hasValue = true;
    this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
  }

  _complete() {
    this.debouncedNext();
    this.destination.complete();
  }

  debouncedNext() {
    this.clearDebounce();

    if (this.hasValue) {
      const {
        lastValue
      } = this;
      this.lastValue = null;
      this.hasValue = false;
      this.destination.next(lastValue);
    }
  }

  clearDebounce() {
    const debouncedSubscription = this.debouncedSubscription;

    if (debouncedSubscription !== null) {
      this.remove(debouncedSubscription);
      debouncedSubscription.unsubscribe();
      this.debouncedSubscription = null;
    }
  }

}

function dispatchNext(subscriber) {
  subscriber.debouncedNext();
}

/***/ }),

/***/ 5353:
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/scheduler/Action.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action)
/* harmony export */ });
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Subscription */ 2425);

class Action extends _Subscription__WEBPACK_IMPORTED_MODULE_0__.Subscription {
  constructor(scheduler, work) {
    super();
  }

  schedule(state, delay = 0) {
    return this;
  }

}

/***/ }),

/***/ 3670:
/*!**********************************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/scheduler/AsyncAction.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AsyncAction": () => (/* binding */ AsyncAction)
/* harmony export */ });
/* harmony import */ var _Action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Action */ 5353);

class AsyncAction extends _Action__WEBPACK_IMPORTED_MODULE_0__.Action {
  constructor(scheduler, work) {
    super(scheduler, work);
    this.scheduler = scheduler;
    this.work = work;
    this.pending = false;
  }

  schedule(state, delay = 0) {
    if (this.closed) {
      return this;
    }

    this.state = state;
    const id = this.id;
    const scheduler = this.scheduler;

    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay);
    }

    this.pending = true;
    this.delay = delay;
    this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
    return this;
  }

  requestAsyncId(scheduler, id, delay = 0) {
    return setInterval(scheduler.flush.bind(scheduler, this), delay);
  }

  recycleAsyncId(scheduler, id, delay = 0) {
    if (delay !== null && this.delay === delay && this.pending === false) {
      return id;
    }

    clearInterval(id);
    return undefined;
  }

  execute(state, delay) {
    if (this.closed) {
      return new Error('executing a cancelled action');
    }

    this.pending = false;

    const error = this._execute(state, delay);

    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  }

  _execute(state, delay) {
    let errored = false;
    let errorValue = undefined;

    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = !!e && e || new Error(e);
    }

    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  }

  _unsubscribe() {
    const id = this.id;
    const scheduler = this.scheduler;
    const actions = scheduler.actions;
    const index = actions.indexOf(this);
    this.work = null;
    this.state = null;
    this.pending = false;
    this.scheduler = null;

    if (index !== -1) {
      actions.splice(index, 1);
    }

    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, null);
    }

    this.delay = null;
  }

}

/***/ }),

/***/ 2901:
/*!*************************************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/scheduler/AsyncScheduler.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AsyncScheduler": () => (/* binding */ AsyncScheduler)
/* harmony export */ });
/* harmony import */ var _Scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Scheduler */ 1925);

class AsyncScheduler extends _Scheduler__WEBPACK_IMPORTED_MODULE_0__.Scheduler {
  constructor(SchedulerAction, now = _Scheduler__WEBPACK_IMPORTED_MODULE_0__.Scheduler.now) {
    super(SchedulerAction, () => {
      if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
        return AsyncScheduler.delegate.now();
      } else {
        return now();
      }
    });
    this.actions = [];
    this.active = false;
    this.scheduled = undefined;
  }

  schedule(work, delay = 0, state) {
    if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
      return AsyncScheduler.delegate.schedule(work, delay, state);
    } else {
      return super.schedule(work, delay, state);
    }
  }

  flush(action) {
    const {
      actions
    } = this;

    if (this.active) {
      actions.push(action);
      return;
    }

    let error;
    this.active = true;

    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());

    this.active = false;

    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }

      throw error;
    }
  }

}

/***/ }),

/***/ 328:
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/scheduler/async.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "async": () => (/* binding */ async),
/* harmony export */   "asyncScheduler": () => (/* binding */ asyncScheduler)
/* harmony export */ });
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncAction */ 3670);
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsyncScheduler */ 2901);


const asyncScheduler = new _AsyncScheduler__WEBPACK_IMPORTED_MODULE_0__.AsyncScheduler(_AsyncAction__WEBPACK_IMPORTED_MODULE_1__.AsyncAction);
const async = asyncScheduler;

/***/ }),

/***/ 9541:
/*!**********************************************************!*\
  !*** ./src/app/pages/search/search.page.scss?ngResource ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzZWFyY2gucGFnZS5zY3NzIn0= */";

/***/ }),

/***/ 2671:
/*!**********************************************************!*\
  !*** ./src/app/pages/search/search.page.html?ngResource ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-title>search</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ion-item>\n    <ion-label position=\"floating\">Search</ion-label>\n    <ion-input [formControl]=\"searchTerm\"></ion-input>\n  </ion-item>\n  <div class=\"search-results\" *ngIf=\"searchResults$ | async as result\">\n    <ion-list>\n      <ion-item *ngFor=\"let artist of result\">\n        <!-- <ion-avatar slot=\"start\">\n          <img src=\"./avatar-finn.png\" />\n        </ion-avatar> -->\n        <ion-label>\n          <h2>{{artist.name}}</h2>\n        </ion-label>\n      </ion-item>\n    </ion-list>\n    <!-- <ng-template #loading></ng-template> -->\n  </div>\n</ion-content>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_pages_search_search_module_ts.js.map