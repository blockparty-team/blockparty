"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_pages_artist-detail_artist-detail_module_ts"],{

/***/ 4119:
/*!*********************************************************************!*\
  !*** ./src/app/pages/artist-detail/artist-detail-routing.module.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArtistDetailPageRoutingModule": () => (/* binding */ ArtistDetailPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _artist_detail_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail.page */ 5861);




const routes = [
    {
        path: '',
        component: _artist_detail_page__WEBPACK_IMPORTED_MODULE_0__.ArtistDetailPage
    }
];
let ArtistDetailPageRoutingModule = class ArtistDetailPageRoutingModule {
};
ArtistDetailPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], ArtistDetailPageRoutingModule);



/***/ }),

/***/ 5334:
/*!*************************************************************!*\
  !*** ./src/app/pages/artist-detail/artist-detail.module.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArtistDetailPageModule": () => (/* binding */ ArtistDetailPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 3819);
/* harmony import */ var _artist_detail_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail-routing.module */ 4119);
/* harmony import */ var _artist_detail_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./artist-detail.page */ 5861);







let ArtistDetailPageModule = class ArtistDetailPageModule {
};
ArtistDetailPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _artist_detail_routing_module__WEBPACK_IMPORTED_MODULE_0__.ArtistDetailPageRoutingModule
        ],
        declarations: [_artist_detail_page__WEBPACK_IMPORTED_MODULE_1__.ArtistDetailPage]
    })
], ArtistDetailPageModule);



/***/ }),

/***/ 5861:
/*!***********************************************************!*\
  !*** ./src/app/pages/artist-detail/artist-detail.page.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArtistDetailPage": () => (/* binding */ ArtistDetailPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _artist_detail_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail.page.html?ngResource */ 5195);
/* harmony import */ var _artist_detail_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./artist-detail.page.scss?ngResource */ 8691);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _app_services_supabase_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/services/supabase.service */ 1829);
/* harmony import */ var _app_shared_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/shared/utils */ 2134);
/* harmony import */ var _app_store_store_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/store/store.service */ 2923);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 6942);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 9095);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 8759);









let ArtistDetailPage = class ArtistDetailPage {
    constructor(activatedRoute, store, supabaseService) {
        this.activatedRoute = activatedRoute;
        this.store = store;
        this.supabaseService = supabaseService;
        // artist$: Observable<definitions['artist']> = this.activatedRoute.paramMap.pipe(
        //   map(paramMap => paramMap.get('id')),
        //   switchMap(id => this.supabaseService.artist(id)),
        //   tap(console.log)
        // );
        this.artist$ = this.activatedRoute.paramMap.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.map)(paramMap => paramMap.get('id')), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.switchMap)(id => this.store.artists$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.map)(artists => artists.find(artist => artist.id === id)))), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.tap)(console.log));
    }
    ngOnInit() {
    }
    imgUrl(path) {
        return path ? (0,_app_shared_utils__WEBPACK_IMPORTED_MODULE_3__.pathToImageUrl)(path) : 'assets/distortion_logo.png';
    }
};
ArtistDetailPage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_8__.ActivatedRoute },
    { type: _app_store_store_service__WEBPACK_IMPORTED_MODULE_4__.StoreService },
    { type: _app_services_supabase_service__WEBPACK_IMPORTED_MODULE_2__.SupabaseService }
];
ArtistDetailPage = (0,tslib__WEBPACK_IMPORTED_MODULE_9__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.Component)({
        selector: 'app-artist-detail',
        template: _artist_detail_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        styles: [_artist_detail_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], ArtistDetailPage);



/***/ }),

/***/ 8691:
/*!************************************************************************!*\
  !*** ./src/app/pages/artist-detail/artist-detail.page.scss?ngResource ***!
  \************************************************************************/
/***/ ((module) => {

module.exports = "ion-toolbar, ion- {\n  --background: transparent;\n  --ion-toolbar-text-color: white;\n}\n\n.artist-info {\n  padding: 10px;\n}\n\n.artist-info .acts p {\n  color: var(--ion-color-medium);\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  margin: 8px 0;\n}\n\n.loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow-x: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFydGlzdC1kZXRhaWwucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0kseUJBQUE7RUFDQSwrQkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtBQUNKOztBQUVRO0VBQ0ksOEJBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxhQUFBO0FBQVo7O0FBS0E7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7QUFGSiIsImZpbGUiOiJhcnRpc3QtZGV0YWlsLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImlvbi10b29sYmFyLCBpb24tIHtcbiAgICAtLWJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIC0taW9uLXRvb2xiYXItdGV4dC1jb2xvcjogd2hpdGU7XG59XG5cbi5hcnRpc3QtaW5mbyB7XG4gICAgcGFkZGluZzogMTBweDtcblxuICAgIC5hY3RzIHtcbiAgICAgICAgcCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLW1lZGl1bSk7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgXG4gICAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDA7IFxuICAgICAgICB9XG4gICAgfVxufVxuXG4ubG9hZGluZyB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xufVxuIl19 */";

/***/ }),

/***/ 5195:
/*!************************************************************************!*\
  !*** ./src/app/pages/artist-detail/artist-detail.page.html?ngResource ***!
  \************************************************************************/
/***/ ((module) => {

module.exports = "<ng-container *ngIf=\"artist$ | async as artist; else loading\">\n  <ion-header>\n    <ion-toolbar color=\"medium\">\n      <ion-buttons slot=\"start\">\n        <ion-back-button defaultHref=\"tabs/artist\"></ion-back-button>\n      </ion-buttons>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-fab vertical=\"top\" horizontal=\"end\" edge slot=\"fixed\">\n      <ion-fab-button color=\"secondary\">\n        <ion-icon name=\"open-outline\"></ion-icon>\n      </ion-fab-button>\n\n      <ion-fab-list side=\"left\">\n        <ion-fab-button size=\"small\">\n          <ion-icon name=\"copy-outline\"></ion-icon>\n        </ion-fab-button>\n      </ion-fab-list>\n\n      <ion-fab-list side=\"bottom\">\n        <a *ngIf=\"artist.instagram\" [href]=\"artist.instagram\" target=\"_blank\">\n          <ion-fab-button size=\"small\">\n            <ion-icon size=\"large\" name=\"logo-instagram\"></ion-icon>\n          </ion-fab-button>\n        </a>\n        <a *ngIf=\"artist.soundcloud\" [href]=\"artist.soundcloud\" target=\"_blank\">\n          <ion-fab-button size=\"small\">\n            <ion-icon size=\"large\" name=\"logo-soundcloud\"></ion-icon>\n          </ion-fab-button>\n        </a>\n        <a *ngIf=\"artist.spotify\" [href]=\"artist.spotify\" target=\"_blank\">\n          <ion-fab-button size=\"small\">\n            <ion-icon size=\"large\" src=\"assets/so-me-icons/spotify.svg\"></ion-icon>\n          </ion-fab-button>\n        </a>\n        <a *ngIf=\"artist.bandcamp\" [href]=\"artist.bandcamp\" target=\"_blank\">\n          <ion-fab-button size=\"small\">\n            <ion-icon size=\"large\" src=\"assets/so-me-icons/bandcamp.svg\"></ion-icon>\n          </ion-fab-button>\n        </a>\n        <a *ngIf=\"artist.apple_music\" [href]=\"artist.apple_music\" target=\"_blank\">\n          <ion-icon size=\"large\" name=\"logo-soundcloud\"></ion-icon>\n        </a>\n        <a *ngIf=\"artist.tidal\" [href]=\"artist.tidal\" target=\"_blank\">\n          <ion-fab-button size=\"small\">\n            <ion-icon size=\"large\" name=\"logo-soundcloud\"></ion-icon>\n          </ion-fab-button>\n        </a>\n        <a *ngIf=\"artist.youtube\" [href]=\"artist.youtube\" target=\"_blank\">\n          <ion-fab-button size=\"small\">\n            <ion-icon size=\"large\" name=\"logo-youtube\"></ion-icon>\n          </ion-fab-button>\n        </a>\n      </ion-fab-list>\n    </ion-fab>\n\n    <ion-img [src]=\"imgUrl(artist.storage_path)\"></ion-img>\n    <div class=\"artist-info\">\n      <h1>{{artist.name}}</h1>\n      <div class=\"acts\">\n        <p *ngFor=\"let act of artist.timetable\">\n          {{act.day.name}} |\n          {{act.start_time | date:'HH:mm'}} -\n          {{act.end_time | date:'HH:mm'}} |\n          {{act.stage.name}}\n          slkdkfkslkldkfskf\n        </p>\n      </div>\n      <p>{{artist.description}}</p>\n\n      <iframe style=\"border: 0; width: 100%; height: 42px;\"\n        src=\"https://bandcamp.com/EmbeddedPlayer/album=827433845/size=small/bgcol=ffffff/linkcol=0687f5/transparent=true/\"\n        seamless><a href=\"https://djkoze.bandcamp.com/album/knock-knock-pampacd013\">knock knock - (PAMPACD013) by DJ\n          Koze</a></iframe>\n\n    </div>\n  </ion-content>\n</ng-container>\n\n<ng-template #loading>\n  <div class=\"loading\">\n    <ion-spinner></ion-spinner>\n  </div>\n</ng-template>";

/***/ })

}]);
//# sourceMappingURL=src_app_pages_artist-detail_artist-detail_module_ts.js.map