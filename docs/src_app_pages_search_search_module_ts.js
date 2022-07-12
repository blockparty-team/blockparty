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
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _search_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./search.page.html?ngResource */ 2671);
/* harmony import */ var _search_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search.page.scss?ngResource */ 9541);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _app_shared_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/shared/utils */ 2134);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 823);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 3298);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 9095);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 6942);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 8759);
/* harmony import */ var _services_supabase_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/supabase.service */ 1829);








let SearchPage = class SearchPage {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.searchTerm = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControl('');
    }
    ngOnInit() {
        this.searchResults$ = this.searchTerm.valueChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.debounceTime)(200), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.distinctUntilChanged)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.switchMap)(term => this.supabaseService.searchArtist(term)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(res => res.data), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.tap)(console.log));
    }
    imgUrl(path) {
        return path ? (0,_app_shared_utils__WEBPACK_IMPORTED_MODULE_2__.pathToImageUrl)(path) : 'assets/distortion_logo.png';
    }
};
SearchPage.ctorParameters = () => [
    { type: _services_supabase_service__WEBPACK_IMPORTED_MODULE_3__.SupabaseService }
];
SearchPage = (0,tslib__WEBPACK_IMPORTED_MODULE_10__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_11__.Component)({
        selector: 'app-search',
        template: _search_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        styles: [_search_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], SearchPage);



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

module.exports = ".container {\n  padding: 30px 10px 10px 10px;\n}\n.container .search-mode {\n  display: flex;\n  justify-content: center;\n}\n.container .search-mode ion-segment {\n  width: 200px;\n}\n.container .filter-badges {\n  width: 100%;\n  display: flex;\n  justify-content: center;\n}\n.container .filter-badges ion-badge {\n  margin: 5px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlYXJjaC5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSw0QkFBQTtBQUNKO0FBQ0k7RUFDSSxhQUFBO0VBQ0EsdUJBQUE7QUFDUjtBQUNRO0VBQ0ksWUFBQTtBQUNaO0FBR0k7RUFDSSxXQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0FBRFI7QUFHUTtFQUNJLFdBQUE7QUFEWiIsImZpbGUiOiJzZWFyY2gucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMzBweCAxMHB4IDEwcHggMTBweDtcblxuICAgIC5zZWFyY2gtbW9kZSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICAgICAgIGlvbi1zZWdtZW50IHtcbiAgICAgICAgICAgIHdpZHRoOiAyMDBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5maWx0ZXItYmFkZ2VzIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICAgICAgIGlvbi1iYWRnZSB7XG4gICAgICAgICAgICBtYXJnaW46IDVweDtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0= */";

/***/ }),

/***/ 2671:
/*!**********************************************************!*\
  !*** ./src/app/pages/search/search.page.html?ngResource ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = "<ion-header>\n  <ion-toolbar color=\"primary\">\n    <ion-title>search</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content fullscreen=\"\">\n  <div class=\"container\">\n\n    <div class=\"search-mode\">\n      <ion-segment mode=\"ios\" value=\"all\">\n        <ion-segment-button value=\"all\">\n          <ion-label>All</ion-label>\n        </ion-segment-button>\n        <ion-segment-button value=\"near_by\">\n          <ion-label>Near by</ion-label>\n        </ion-segment-button>\n      </ion-segment>\n    </div>\n\n    <ion-searchbar [formControl]=\"searchTerm\"></ion-searchbar>\n\n    <div class=\"filter-badges\">\n      <ion-badge color=\"primary\">artists</ion-badge>\n      <ion-badge color=\"secondary\">stage</ion-badge>\n      <ion-badge color=\"tertiary\">event</ion-badge>\n    </div>\n\n    <div class=\"search-results\" *ngIf=\"searchResults$ | async as result\">\n      <ion-list>\n        <ion-item *ngFor=\"let artist of result\" [routerLink]=\"['/tabs', 'artist', artist.id]\">\n          <ion-avatar slot=\"start\">\n            <img [src]=\"imgUrl(artist.storage_path)\" />\n          </ion-avatar>\n          <ion-label>\n            <h2>{{artist.name}}</h2>\n          </ion-label>\n          <ion-badge slot=\"end\" color=\"primary\">artist</ion-badge>\n        </ion-item>\n      </ion-list>\n    </div>\n  </div>\n</ion-content>\n\n<!-- <ng-template #loading>\n  <ion-spinner></ion-spinner>\n</ng-template> -->";

/***/ })

}]);
//# sourceMappingURL=src_app_pages_search_search_module_ts.js.map