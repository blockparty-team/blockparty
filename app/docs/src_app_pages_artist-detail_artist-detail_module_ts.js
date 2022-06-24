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
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _artist_detail_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail.page.html?ngResource */ 5195);
/* harmony import */ var _artist_detail_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./artist-detail.page.scss?ngResource */ 8691);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _app_services_supabase_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/services/supabase.service */ 1829);
/* harmony import */ var _app_shared_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/shared/utils */ 2134);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 6942);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 9095);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 8759);








let ArtistDetailPage = class ArtistDetailPage {
    constructor(activatedRoute, supabaseService) {
        this.activatedRoute = activatedRoute;
        this.supabaseService = supabaseService;
        this.artist$ = this.activatedRoute.paramMap.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(paramMap => paramMap.get('id')), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.switchMap)(id => this.supabaseService.artist(id)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.tap)(console.log));
    }
    ngOnInit() {
    }
    imgUrl(path) {
        return (0,_app_shared_utils__WEBPACK_IMPORTED_MODULE_3__.pathToImageUrl)(path);
    }
};
ArtistDetailPage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__.ActivatedRoute },
    { type: _app_services_supabase_service__WEBPACK_IMPORTED_MODULE_2__.SupabaseService }
];
ArtistDetailPage = (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_9__.Component)({
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

module.exports = "ion-toolbar, ion- {\n  --background: transparent;\n  --ion-toolbar-text-color: white;\n}\n\n.artist-info {\n  padding: 10px;\n}\n\n.artist-info .actions {\n  display: flex;\n  justify-content: space-evenly;\n}\n\n.loading {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFydGlzdC1kZXRhaWwucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0kseUJBQUE7RUFDQSwrQkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtBQUNKOztBQUNJO0VBQ0ksYUFBQTtFQUNBLDZCQUFBO0FBQ1I7O0FBR0E7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0FBQUoiLCJmaWxlIjoiYXJ0aXN0LWRldGFpbC5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpb24tdG9vbGJhciwgaW9uLSB7XG4gICAgLS1iYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAtLWlvbi10b29sYmFyLXRleHQtY29sb3I6IHdoaXRlO1xufVxuXG4uYXJ0aXN0LWluZm8ge1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgXG4gICAgLmFjdGlvbnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICB9XG59XG5cbi5sb2FkaW5nIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuIl19 */";

/***/ }),

/***/ 5195:
/*!************************************************************************!*\
  !*** ./src/app/pages/artist-detail/artist-detail.page.html?ngResource ***!
  \************************************************************************/
/***/ ((module) => {

module.exports = "<ng-container *ngIf=\"artist$ | async as artist; else loading\">\n  <ion-header>\n    <ion-toolbar translucent>\n      <ion-buttons slot=\"start\">\n        <ion-back-button defaultHref=\"tabs/artist\"></ion-back-button>\n      </ion-buttons>\n    </ion-toolbar>\n  </ion-header>\n  \n  <ion-content>\n    <ion-img [src]=\"imgUrl(artist.storage_path)\"></ion-img>\n    <div class=\"artist-info\">\n      <h1>{{artist.name}}</h1>\n      <p>{{artist.description}}</p>\n      <div class=\"actions\">\n        <a [href]=\"artist.intagram\" target=\"_blank\">\n          <ion-icon size=\"large\" name=\"logo-instagram\"></ion-icon>\n        </a>\n        <a [href]=\"artist.soundcloud\" target=\"_blank\">\n          <ion-icon size=\"large\" name=\"logo-soundcloud\"></ion-icon>\n        </a>\n        <ion-icon size=\"large\" name=\"logo-youtube\"></ion-icon>\n        <ion-icon size=\"large\" name=\"play\"></ion-icon>\n      </div>\n    </div>\n  </ion-content>\n</ng-container>\n\n<ng-template #loading>\n  <div class=\"loading\">\n    <ion-spinner></ion-spinner>\n  </div>\n</ng-template>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_pages_artist-detail_artist-detail_module_ts.js.map