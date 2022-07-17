"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_pages_tab-artist_tab-artist_module_ts"],{

/***/ 1321:
/*!***************************************************************!*\
  !*** ./src/app/pages/tab-artist/tab-artist-routing.module.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabArtistPageRoutingModule": () => (/* binding */ TabArtistPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _tab_artist_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-artist.page */ 587);




const routes = [
    {
        path: '',
        component: _tab_artist_page__WEBPACK_IMPORTED_MODULE_0__.TabArtistPage
    }
];
let TabArtistPageRoutingModule = class TabArtistPageRoutingModule {
};
TabArtistPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], TabArtistPageRoutingModule);



/***/ }),

/***/ 4080:
/*!*******************************************************!*\
  !*** ./src/app/pages/tab-artist/tab-artist.module.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabArtistPageModule": () => (/* binding */ TabArtistPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 3819);
/* harmony import */ var _tab_artist_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-artist-routing.module */ 1321);
/* harmony import */ var _tab_artist_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-artist.page */ 587);







let TabArtistPageModule = class TabArtistPageModule {
};
TabArtistPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _tab_artist_routing_module__WEBPACK_IMPORTED_MODULE_0__.TabArtistPageRoutingModule
        ],
        declarations: [_tab_artist_page__WEBPACK_IMPORTED_MODULE_1__.TabArtistPage]
    })
], TabArtistPageModule);



/***/ }),

/***/ 587:
/*!*****************************************************!*\
  !*** ./src/app/pages/tab-artist/tab-artist.page.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabArtistPage": () => (/* binding */ TabArtistPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _tab_artist_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-artist.page.html?ngResource */ 5772);
/* harmony import */ var _tab_artist_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-artist.page.scss?ngResource */ 2359);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _app_shared_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/shared/utils */ 2134);
/* harmony import */ var _app_store_store_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/store/store.service */ 2923);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 6942);







let TabArtistPage = class TabArtistPage {
    constructor(store) {
        this.store = store;
    }
    ngOnInit() {
        this.groupedArtists$ = this.store.artists$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(artists => {
            return artists.reduce((acc, artist) => {
                const letter = artist.name[0].toUpperCase();
                if (acc.find(group => group.letter === letter) === undefined) {
                    acc.push({ letter, artists: [] });
                }
                ;
                acc.find(group => group.letter == letter).artists.push(artist);
                return acc;
            }, []);
        }));
    }
    imgUrl(path) {
        return path ? (0,_app_shared_utils__WEBPACK_IMPORTED_MODULE_2__.pathToImageUrl)(path) : 'assets/distortion_logo.png';
    }
};
TabArtistPage.ctorParameters = () => [
    { type: _app_store_store_service__WEBPACK_IMPORTED_MODULE_3__.StoreService }
];
TabArtistPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
        selector: 'app-tab-artist',
        template: _tab_artist_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_6__.ChangeDetectionStrategy.OnPush,
        styles: [_tab_artist_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], TabArtistPage);



/***/ }),

/***/ 2359:
/*!******************************************************************!*\
  !*** ./src/app/pages/tab-artist/tab-artist.page.scss?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0YWItYXJ0aXN0LnBhZ2Uuc2NzcyJ9 */";

/***/ }),

/***/ 5772:
/*!******************************************************************!*\
  !*** ./src/app/pages/tab-artist/tab-artist.page.html?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "<ion-header>\n  <ion-toolbar color=\"medium\">\n    <ion-title class=\"ion-text-center\">Artists</ion-title>\n    <ion-buttons slot=\"end\">\n      <ion-button>\n        <ion-icon name=\"heart\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ng-container *ngIf=\"groupedArtists$ | async as artists\">\n    <ion-item-group *ngFor=\"let artist of artists\">\n      <ion-item-divider sticky=\"true\" color=\"light\">\n        <ion-label>{{artist.letter}}</ion-label>\n      </ion-item-divider>\n\n      <ion-item *ngFor=\"let art of artist.artists\" [routerLink]=\"['./', art.id]\">\n        <ion-avatar slot=\"start\">\n          <img [src]=\"imgUrl(art.storage_path)\" />\n        </ion-avatar>\n        <ion-label>\n          <h2>\n            {{art.name}}\n          </h2>\n          <p *ngIf=\"art.timetable[0]\">\n            {{art.timetable[0].day.name}} | \n            {{art.timetable[0].start_time | date:'HH:mm'}} |\n            {{art.timetable[0].stage.name}}\n          </p>\n          <p *ngIf=\"!art.timetable[0]\">\n            -\n            <!-- {{art.description}} -->\n          </p>\n        </ion-label>\n        <div slot=\"end\" class=\"actions\">\n          <ion-icon name=\"heart-outline\"></ion-icon>\n        </div>\n      </ion-item>\n    </ion-item-group>\n  </ng-container>\n</ion-content>";

/***/ })

}]);
//# sourceMappingURL=src_app_pages_tab-artist_tab-artist_module_ts.js.map