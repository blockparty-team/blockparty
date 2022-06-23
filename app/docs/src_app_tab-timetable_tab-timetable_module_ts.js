"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_tab-timetable_tab-timetable_module_ts"],{

/***/ 2499:
/*!***************************************************************!*\
  !*** ./src/app/tab-timetable/tab-timetable-routing.module.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabTimetablePageRoutingModule": () => (/* binding */ TabTimetablePageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _tab_timetable_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-timetable.page */ 9656);




const routes = [
    {
        path: '',
        component: _tab_timetable_page__WEBPACK_IMPORTED_MODULE_0__.TabTimetablePage,
    }
];
let TabTimetablePageRoutingModule = class TabTimetablePageRoutingModule {
};
TabTimetablePageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    })
], TabTimetablePageRoutingModule);



/***/ }),

/***/ 4619:
/*!*******************************************************!*\
  !*** ./src/app/tab-timetable/tab-timetable.module.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabTimetablePageModule": () => (/* binding */ TabTimetablePageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 3819);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _tab_timetable_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-timetable.page */ 9656);
/* harmony import */ var _tab_timetable_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-timetable-routing.module */ 2499);







let TabTimetablePageModule = class TabTimetablePageModule {
};
TabTimetablePageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonicModule,
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _tab_timetable_routing_module__WEBPACK_IMPORTED_MODULE_1__.TabTimetablePageRoutingModule
        ],
        declarations: [_tab_timetable_page__WEBPACK_IMPORTED_MODULE_0__.TabTimetablePage]
    })
], TabTimetablePageModule);



/***/ }),

/***/ 9656:
/*!*****************************************************!*\
  !*** ./src/app/tab-timetable/tab-timetable.page.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabTimetablePage": () => (/* binding */ TabTimetablePage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _tab_timetable_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-timetable.page.html?ngResource */ 4697);
/* harmony import */ var _tab_timetable_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-timetable.page.scss?ngResource */ 7827);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);




let TabTimetablePage = class TabTimetablePage {
    constructor() { }
};
TabTimetablePage.ctorParameters = () => [];
TabTimetablePage = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
        selector: 'app-tab-timetable',
        template: _tab_timetable_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        styles: [_tab_timetable_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], TabTimetablePage);



/***/ }),

/***/ 7827:
/*!******************************************************************!*\
  !*** ./src/app/tab-timetable/tab-timetable.page.scss?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0YWItdGltZXRhYmxlLnBhZ2Uuc2NzcyJ9 */";

/***/ }),

/***/ 4697:
/*!******************************************************************!*\
  !*** ./src/app/tab-timetable/tab-timetable.page.html?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = "<ion-header [translucent]=\"true\">\n  <ion-toolbar>\n    <ion-title>\n      Timetable\n    </ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n  Her comes timetable\n</ion-content>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_tab-timetable_tab-timetable_module_ts.js.map