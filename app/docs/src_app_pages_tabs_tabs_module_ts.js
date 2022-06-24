"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_pages_tabs_tabs_module_ts"],{

/***/ 5448:
/*!***************************************************!*\
  !*** ./src/app/pages/tabs/tabs-routing.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabsPageRoutingModule": () => (/* binding */ TabsPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _tabs_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tabs.page */ 4101);




const routes = [
    {
        path: 'tabs',
        component: _tabs_page__WEBPACK_IMPORTED_MODULE_0__.TabsPage,
        children: [
            {
                path: 'map',
                title: 'Map',
                loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_tab-map_tab-map_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../tab-map/tab-map.module */ 9015)).then(m => m.TabMapPageModule)
            },
            {
                path: 'timetable',
                title: 'Timetable',
                loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_tab-timetable_tab-timetable_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../tab-timetable/tab-timetable.module */ 5920)).then(m => m.TabTimetablePageModule)
            },
            {
                path: 'artist',
                title: 'Artist',
                children: [
                    {
                        path: '',
                        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_pages_tab-artist_tab-artist_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../tab-artist/tab-artist.module */ 4080)).then(m => m.TabArtistPageModule)
                    },
                    {
                        path: ':id',
                        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_pages_artist-detail_artist-detail_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../artist-detail/artist-detail.module */ 5334)).then(m => m.ArtistDetailPageModule)
                    }
                ]
            },
            {
                path: 'search',
                title: 'Search',
                loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_pages_search_search_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../search/search.module */ 281)).then(m => m.SearchPageModule)
            },
            {
                path: '',
                redirectTo: '/tabs/map',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full'
    }
];
let TabsPageRoutingModule = class TabsPageRoutingModule {
};
TabsPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
    })
], TabsPageRoutingModule);



/***/ }),

/***/ 5557:
/*!*******************************************!*\
  !*** ./src/app/pages/tabs/tabs.module.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabsPageModule": () => (/* binding */ TabsPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 3819);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _tabs_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tabs-routing.module */ 5448);
/* harmony import */ var _tabs_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tabs.page */ 4101);







let TabsPageModule = class TabsPageModule {
};
TabsPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonicModule,
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _tabs_routing_module__WEBPACK_IMPORTED_MODULE_0__.TabsPageRoutingModule
        ],
        declarations: [_tabs_page__WEBPACK_IMPORTED_MODULE_1__.TabsPage]
    })
], TabsPageModule);



/***/ }),

/***/ 4101:
/*!*****************************************!*\
  !*** ./src/app/pages/tabs/tabs.page.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabsPage": () => (/* binding */ TabsPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _tabs_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tabs.page.html?ngResource */ 7867);
/* harmony import */ var _tabs_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tabs.page.scss?ngResource */ 4436);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);




let TabsPage = class TabsPage {
    constructor() { }
};
TabsPage.ctorParameters = () => [];
TabsPage = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
        selector: 'app-tabs',
        template: _tabs_page_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
        styles: [_tabs_page_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__]
    })
], TabsPage);



/***/ }),

/***/ 4436:
/*!******************************************************!*\
  !*** ./src/app/pages/tabs/tabs.page.scss?ngResource ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "ion-tab-bar ion-tab-button {\n  --color-selected: var(--ion-color-secondary);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYnMucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdJO0VBQ0ksNENBQUE7QUFGUiIsImZpbGUiOiJ0YWJzLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImlvbi10YWItYmFyIHtcbiAgICAvLyBib3JkZXItcmFkaXVzOiA0MHB4IDQwcHggMCAwO1xuXG4gICAgaW9uLXRhYi1idXR0b24ge1xuICAgICAgICAtLWNvbG9yLXNlbGVjdGVkOiB2YXIoLS1pb24tY29sb3Itc2Vjb25kYXJ5KTtcbiAgICB9XG59XG4iXX0= */";

/***/ }),

/***/ 7867:
/*!******************************************************!*\
  !*** ./src/app/pages/tabs/tabs.page.html?ngResource ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "<ion-tabs>\n\n  <ion-tab-bar slot=\"bottom\">\n    <ion-tab-button tab=\"map\">\n      <ion-icon name=\"location\"></ion-icon>\n      <ion-label>Map</ion-label>\n    </ion-tab-button>\n\n    <ion-tab-button tab=\"timetable\">\n      <ion-icon name=\"calendar\"></ion-icon>\n      <ion-label>Timetable</ion-label>\n    </ion-tab-button>\n\n    <ion-tab-button tab=\"artist\">\n      <ion-icon name=\"musical-notes\"></ion-icon>\n      <ion-label>Artists</ion-label>\n    </ion-tab-button>\n\n    <ion-tab-button tab=\"search\">\n      <ion-icon name=\"search\"></ion-icon>\n      <ion-label>Search</ion-label>\n    </ion-tab-button>\n  </ion-tab-bar>\n\n</ion-tabs>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_pages_tabs_tabs_module_ts.js.map