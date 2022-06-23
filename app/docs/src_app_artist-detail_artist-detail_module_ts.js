"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_artist-detail_artist-detail_module_ts"],{

/***/ 8550:
/*!***************************************************************!*\
  !*** ./src/app/artist-detail/artist-detail-routing.module.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArtistDetailPageRoutingModule": () => (/* binding */ ArtistDetailPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _artist_detail_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail.page */ 5748);




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

/***/ 830:
/*!*******************************************************!*\
  !*** ./src/app/artist-detail/artist-detail.module.ts ***!
  \*******************************************************/
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
/* harmony import */ var _artist_detail_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail-routing.module */ 8550);
/* harmony import */ var _artist_detail_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./artist-detail.page */ 5748);







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

/***/ 5748:
/*!*****************************************************!*\
  !*** ./src/app/artist-detail/artist-detail.page.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArtistDetailPage": () => (/* binding */ ArtistDetailPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _artist_detail_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artist-detail.page.html?ngResource */ 4948);
/* harmony import */ var _artist_detail_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./artist-detail.page.scss?ngResource */ 8705);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);




let ArtistDetailPage = class ArtistDetailPage {
    constructor() { }
    ngOnInit() {
    }
};
ArtistDetailPage.ctorParameters = () => [];
ArtistDetailPage = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
        selector: 'app-artist-detail',
        template: _artist_detail_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        styles: [_artist_detail_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], ArtistDetailPage);



/***/ }),

/***/ 8705:
/*!******************************************************************!*\
  !*** ./src/app/artist-detail/artist-detail.page.scss?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcnRpc3QtZGV0YWlsLnBhZ2Uuc2NzcyJ9 */";

/***/ }),

/***/ 4948:
/*!******************************************************************!*\
  !*** ./src/app/artist-detail/artist-detail.page.html?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-title>artist-detail</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n\n</ion-content>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_artist-detail_artist-detail_module_ts.js.map