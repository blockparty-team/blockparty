(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["default-src_app_services_supabase_service_ts"],{

/***/ 1829:
/*!**********************************************!*\
  !*** ./src/app/services/supabase.service.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SupabaseService": () => (/* binding */ SupabaseService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 4929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ 5683);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 4383);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 6942);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 2428);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 2340);






let SupabaseService = class SupabaseService {
    constructor() {
        this.client = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.supabaseUrl, src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.supabaseKey);
    }
    get artists$() {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .from('artist')
            .select(`
          *,
          timetable(
            start_time,
            end_time,
            day(
              name
            ),
            stage(
              name
            )
          )
        `)
            .order('name')).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)(res => res.data));
    }
    get dayMaskBounds$() {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .from('day_event_mask')
            .select(`
          id,
          bounds
        `)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)(res => res.data));
    }
    get days$() {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .from('day')
            .select(`
          id,
          day,
          name,
          description,
          event(
            id,
            name,
            description,
            bounds,
            stage(
              id,
              name, 
              description,
              timetable(
                id,
                start_time,
                end_time,
                artist(
                  *
                )

              )
            )
          )
        `)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.pluck)('data'));
    }
    artist(id) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .from('artist')
            .select()
            .filter('id', 'eq', id)
            .single()).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)(res => res.data));
        ;
    }
    searchArtist(searchTerm) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .from('artist')
            .select()
            .textSearch('ts', searchTerm, {
            config: 'english',
            type: 'plain'
        }));
    }
    stageTimeTable(stageId) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .from('timetable')
            .select(`
          start_time,
          end_time,
          artist(
            id,
            name
          ),
          stage(
            name
          )
        `)
            .filter('stage_id', 'eq', stageId)
            .order('start_time')).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.pluck)('data'));
    }
    downloadPhoto(bucket, path) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client
            .storage
            .from(bucket)
            .download(path));
    }
    //RPC
    tableAsGeojson(table) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.from)(this.client.rpc('table_as_geojson', { _tbl: table })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.pluck)('data', 'geojson'));
    }
};
SupabaseService.ctorParameters = () => [];
SupabaseService = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Injectable)({
        providedIn: 'root'
    })
], SupabaseService);



/***/ }),

/***/ 6001:
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/functions-js/dist/module/helper.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resolveFetch": () => (/* binding */ resolveFetch)
/* harmony export */ });
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const resolveFetch = customFetch => {
  let _fetch;

  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => __awaiter(void 0, void 0, void 0, function* () {
      return yield (yield __webpack_require__.e(/*! import() */ "node_modules_cross-fetch_dist_browser-ponyfill_js").then(__webpack_require__.t.bind(__webpack_require__, /*! cross-fetch */ 9119, 23))).fetch(...args);
    });
  } else {
    _fetch = fetch;
  }

  return (...args) => _fetch(...args);
};

/***/ }),

/***/ 3444:
/*!******************************************************************!*\
  !*** ./node_modules/@supabase/functions-js/dist/module/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionsClient": () => (/* binding */ FunctionsClient)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ 6001);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};


class FunctionsClient {
  constructor(url, {
    headers = {},
    customFetch
  } = {}) {
    this.url = url;
    this.headers = headers;
    this.fetch = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.resolveFetch)(customFetch);
  }
  /**
   * Updates the authorization header
   * @params token - the new jwt token sent in the authorisation header
   */


  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - the name of the function to invoke
   * @param invokeOptions - object with the following properties
   * `headers`: object representing the headers to send with the request
   * `body`: the body of the request
   * `responseType`: how the response should be parsed. The default is `json`
   */


  invoke(functionName, invokeOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const {
          headers,
          body
        } = invokeOptions !== null && invokeOptions !== void 0 ? invokeOptions : {};
        const response = yield this.fetch(`${this.url}/${functionName}`, {
          method: 'POST',
          headers: Object.assign({}, this.headers, headers),
          body
        });
        const isRelayError = response.headers.get('x-relay-error');

        if (isRelayError && isRelayError === 'true') {
          return {
            data: null,
            error: new Error(yield response.text())
          };
        }

        let data;
        const {
          responseType
        } = invokeOptions !== null && invokeOptions !== void 0 ? invokeOptions : {};

        if (!responseType || responseType === 'json') {
          data = yield response.json();
        } else if (responseType === 'arrayBuffer') {
          data = yield response.arrayBuffer();
        } else if (responseType === 'blob') {
          data = yield response.blob();
        } else {
          data = yield response.text();
        }

        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }

}

/***/ }),

/***/ 8685:
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/GoTrueApi.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GoTrueApi)
/* harmony export */ });
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/fetch */ 669);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/constants */ 8104);
/* harmony import */ var _lib_cookies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/cookies */ 595);
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/helpers */ 8327);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};





class GoTrueApi {
  constructor({
    url = '',
    headers = {},
    cookieOptions,
    fetch
  }) {
    this.url = url;
    this.headers = headers;
    this.cookieOptions = Object.assign(Object.assign({}, _lib_constants__WEBPACK_IMPORTED_MODULE_1__.COOKIE_OPTIONS), cookieOptions);
    this.fetch = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.resolveFetch)(fetch);
  }
  /**
   * Create a temporary object with all configured headers and
   * adds the Authorization token to be used on request methods
   * @param jwt A valid, logged-in JWT.
   */


  _createRequestHeaders(jwt) {
    const headers = Object.assign({}, this.headers);
    headers['Authorization'] = `Bearer ${jwt}`;
    return headers;
  }

  cookieName() {
    var _a;

    return (_a = this.cookieOptions.name) !== null && _a !== void 0 ? _a : '';
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param provider One of the providers supported by GoTrue.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param scopes A space-separated list of scopes granted to the OAuth application.
   */


  getUrlForProvider(provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`];

    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
    }

    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }

    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams);
      urlParams.push(`${query}`);
    }

    return `${this.url}/authorize?${urlParams.join('&')}`;
  }
  /**
   * Creates a new user using their email address.
   * @param email The email address of the user.
   * @param password The password of the user.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param data Optional user metadata.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */


  signUpWithEmail(email, password, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        let queryString = '';

        if (options.redirectTo) {
          queryString = '?redirect_to=' + encodeURIComponent(options.redirectTo);
        }

        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/signup${queryString}`, {
          email,
          password,
          data: options.data,
          gotrue_meta_security: {
            captcha_token: options.captchaToken
          }
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Logs in an existing user using their email address.
   * @param email The email address of the user.
   * @param password The password of the user.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   */


  signInWithEmail(email, password, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        let queryString = '?grant_type=password';

        if (options.redirectTo) {
          queryString += '&redirect_to=' + encodeURIComponent(options.redirectTo);
        }

        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/token${queryString}`, {
          email,
          password
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Signs up a new user using their phone number and a password.
   * @param phone The phone number of the user.
   * @param password The password of the user.
   * @param data Optional user metadata.
   */


  signUpWithPhone(phone, password, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/signup`, {
          phone,
          password,
          data: options.data,
          gotrue_meta_security: {
            captcha_token: options.captchaToken
          }
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Logs in an existing user using their phone number and password.
   * @param phone The phone number of the user.
   * @param password The password of the user.
   */


  signInWithPhone(phone, password) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        const queryString = '?grant_type=password';
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/token${queryString}`, {
          phone,
          password
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Logs in an OpenID Connect user using their id_token.
   * @param id_token The IDToken of the user.
   * @param nonce The nonce of the user. The nonce is a random value generated by the developer (= yourself) before the initial grant is started. You should check the OpenID Connect specification for details. https://openid.net/developers/specs/
   * @param provider The provider of the user.
   * @param client_id The clientID of the user.
   * @param issuer The issuer of the user.
   */


  signInWithOpenIDConnect({
    id_token,
    nonce,
    client_id,
    issuer,
    provider
  }) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        const queryString = '?grant_type=id_token';
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/token${queryString}`, {
          id_token,
          nonce,
          client_id,
          issuer,
          provider
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Sends a magic login link to an email address.
   * @param email The email address of the user.
   * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   */


  sendMagicLinkEmail(email, options = {}) {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        let queryString = '';

        if (options.redirectTo) {
          queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
        }

        const shouldCreateUser = (_a = options.shouldCreateUser) !== null && _a !== void 0 ? _a : true;
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/otp${queryString}`, {
          email,
          create_user: shouldCreateUser,
          gotrue_meta_security: {
            captcha_token: options.captchaToken
          }
        }, {
          headers
        });
        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Sends a mobile OTP via SMS. Will register the account if it doesn't already exist
   * @param phone The user's phone number WITH international prefix
   * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
   */


  sendMobileOTP(phone, options = {}) {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        const shouldCreateUser = (_a = options.shouldCreateUser) !== null && _a !== void 0 ? _a : true;
        const headers = Object.assign({}, this.headers);
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/otp`, {
          phone,
          create_user: shouldCreateUser,
          gotrue_meta_security: {
            captcha_token: options.captchaToken
          }
        }, {
          headers
        });
        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   */


  signOut(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/logout`, {}, {
          headers: this._createRequestHeaders(jwt),
          noResolveJson: true
        });
        return {
          error: null
        };
      } catch (e) {
        return {
          error: e
        };
      }
    });
  }
  /**
   * @deprecated Use `verifyOTP` instead!
   * @param phone The user's phone number WITH international prefix
   * @param token token that user was sent to their mobile phone
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   */


  verifyMobileOTP(phone, token, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/verify`, {
          phone,
          token,
          type: 'sms',
          redirect_to: options.redirectTo
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Send User supplied Email / Mobile OTP to be verified
   * @param email The user's email address
   * @param phone The user's phone number WITH international prefix
   * @param token token that user was sent to their mobile phone
   * @param type verification type that the otp is generated for
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   */


  verifyOTP({
    email,
    phone,
    token,
    type = 'sms'
  }, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/verify`, {
          email,
          phone,
          token,
          type,
          redirect_to: options.redirectTo
        }, {
          headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param data Optional user metadata
   */


  inviteUserByEmail(email, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        let queryString = '';

        if (options.redirectTo) {
          queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
        }

        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/invite${queryString}`, {
          email,
          data: options.data
        }, {
          headers
        });
        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Sends a reset request to an email address.
   * @param email The email address of the user.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   */


  resetPasswordForEmail(email, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const headers = Object.assign({}, this.headers);
        let queryString = '';

        if (options.redirectTo) {
          queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
        }

        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/recover${queryString}`, {
          email,
          gotrue_meta_security: {
            captcha_token: options.captchaToken
          }
        }, {
          headers
        });
        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */


  refreshAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/token?grant_type=refresh_token`, {
          refresh_token: refreshToken
        }, {
          headers: this.headers
        });
        const session = Object.assign({}, data);
        if (session.expires_in) session.expires_at = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.expiresAt)(data.expires_in);
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Set/delete the auth cookie based on the AuthChangeEvent.
   * Works for Next.js & Express (requires cookie-parser middleware).
   * @param req The request object.
   * @param res The response object.
   */


  setAuthCookie(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }

    const {
      event,
      session
    } = req.body;
    if (!event) throw new Error('Auth event missing!');

    if (event === 'SIGNED_IN') {
      if (!session) throw new Error('Auth session missing!');
      (0,_lib_cookies__WEBPACK_IMPORTED_MODULE_2__.setCookies)(req, res, [{
        key: 'access-token',
        value: session.access_token
      }, {
        key: 'refresh-token',
        value: session.refresh_token
      }].map(token => {
        var _a;

        return {
          name: `${this.cookieName()}-${token.key}`,
          value: token.value,
          domain: this.cookieOptions.domain,
          maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
          path: this.cookieOptions.path,
          sameSite: this.cookieOptions.sameSite
        };
      }));
    }

    if (event === 'SIGNED_OUT') {
      (0,_lib_cookies__WEBPACK_IMPORTED_MODULE_2__.setCookies)(req, res, ['access-token', 'refresh-token'].map(key => ({
        name: `${this.cookieName()}-${key}`,
        value: '',
        maxAge: -1
      })));
    }

    res.status(200).json({});
  }
  /**
   * Deletes the Auth Cookies and redirects to the
   * @param req The request object.
   * @param res The response object.
   * @param options Optionally specify a `redirectTo` URL in the options.
   */


  deleteAuthCookie(req, res, {
    redirectTo = '/'
  }) {
    (0,_lib_cookies__WEBPACK_IMPORTED_MODULE_2__.setCookies)(req, res, ['access-token', 'refresh-token'].map(key => ({
      name: `${this.cookieName()}-${key}`,
      value: '',
      maxAge: -1
    })));
    return res.redirect(307, redirectTo);
  }
  /**
   * Helper method to generate the Auth Cookie string for you in case you can't use `setAuthCookie`.
   * @param req The request object.
   * @param res The response object.
   * @returns The Cookie string that needs to be set as the value for the `Set-Cookie` header.
   */


  getAuthCookieString(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }

    const {
      event,
      session
    } = req.body;
    if (!event) throw new Error('Auth event missing!');

    if (event === 'SIGNED_IN') {
      if (!session) throw new Error('Auth session missing!');
      return (0,_lib_cookies__WEBPACK_IMPORTED_MODULE_2__.getCookieString)(req, res, [{
        key: 'access-token',
        value: session.access_token
      }, {
        key: 'refresh-token',
        value: session.refresh_token
      }].map(token => {
        var _a;

        return {
          name: `${this.cookieName()}-${token.key}`,
          value: token.value,
          domain: this.cookieOptions.domain,
          maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
          path: this.cookieOptions.path,
          sameSite: this.cookieOptions.sameSite
        };
      }));
    }

    if (event === 'SIGNED_OUT') {
      return (0,_lib_cookies__WEBPACK_IMPORTED_MODULE_2__.getCookieString)(req, res, ['access-token', 'refresh-token'].map(key => ({
        name: `${this.cookieName()}-${key}`,
        value: '',
        maxAge: -1
      })));
    }

    return res.getHeader('Set-Cookie');
  }
  /**
   * Generates links to be sent via email or other.
   * @param type The link type ("signup" or "magiclink" or "recovery" or "invite").
   * @param email The user's email.
   * @param password User password. For signup only.
   * @param data Optional user metadata. For signup only.
   * @param redirectTo The link type ("signup" or "magiclink" or "recovery" or "invite").
   */


  generateLink(type, email, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/admin/generate_link`, {
          type,
          email,
          password: options.password,
          data: options.data,
          redirect_to: options.redirectTo
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  } // User Admin API

  /**
   * Creates a new user.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   *
   * @param attributes The data you want to create the user with.
   */


  createUser(attributes) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(this.fetch, `${this.url}/admin/users`, attributes, {
          headers: this.headers
        });
        return {
          user: data,
          data,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */


  listUsers() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.get)(this.fetch, `${this.url}/admin/users`, {
          headers: this.headers
        });
        return {
          data: data.users,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */


  getUserById(uid) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.get)(this.fetch, `${this.url}/admin/users/${uid}`, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Get user by reading the cookie from the request.
   * Works for Next.js & Express (requires cookie-parser middleware).
   */


  getUserByCookie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!req.cookies) {
          throw new Error('Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!');
        }

        const access_token = req.cookies[`${this.cookieName()}-access-token`];
        const refresh_token = req.cookies[`${this.cookieName()}-refresh-token`];

        if (!access_token) {
          throw new Error('No cookie found!');
        }

        const {
          user,
          error: getUserError
        } = yield this.getUser(access_token);

        if (getUserError) {
          if (!refresh_token) throw new Error('No refresh_token cookie found!');
          if (!res) throw new Error('You need to pass the res object to automatically refresh the session!');
          const {
            data,
            error
          } = yield this.refreshAccessToken(refresh_token);

          if (error) {
            throw error;
          } else if (data) {
            (0,_lib_cookies__WEBPACK_IMPORTED_MODULE_2__.setCookies)(req, res, [{
              key: 'access-token',
              value: data.access_token
            }, {
              key: 'refresh-token',
              value: data.refresh_token
            }].map(token => {
              var _a;

              return {
                name: `${this.cookieName()}-${token.key}`,
                value: token.value,
                domain: this.cookieOptions.domain,
                maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                path: this.cookieOptions.path,
                sameSite: this.cookieOptions.sameSite
              };
            }));
            return {
              token: data.access_token,
              user: data.user,
              data: data.user,
              error: null
            };
          }
        }

        return {
          token: access_token,
          user: user,
          data: user,
          error: null
        };
      } catch (e) {
        return {
          token: null,
          user: null,
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */


  updateUserById(uid, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this; //

        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.put)(this.fetch, `${this.url}/admin/users/${uid}`, attributes, {
          headers: this.headers
        });
        return {
          user: data,
          data,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   *
   * @param uid The user uid you want to remove.
   */


  deleteUser(uid) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.remove)(this.fetch, `${this.url}/admin/users/${uid}`, {}, {
          headers: this.headers
        });
        return {
          user: data,
          data,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Gets the current user details.
   *
   * This method is called by the GoTrueClient `update` where
   * the jwt is set to this.currentSession.access_token
   * and therefore, acts like getting the currently authenticated user
   *
   * @param jwt A valid, logged-in JWT. Typically, the access_token for the currentSession
   */


  getUser(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.get)(this.fetch, `${this.url}/user`, {
          headers: this._createRequestHeaders(jwt)
        });
        return {
          user: data,
          data,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Updates the user data.
   * @param jwt A valid, logged-in JWT.
   * @param attributes The data you want to update.
   */


  updateUser(jwt, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__.put)(this.fetch, `${this.url}/user`, attributes, {
          headers: this._createRequestHeaders(jwt)
        });
        return {
          user: data,
          data,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          data: null,
          error: e
        };
      }
    });
  }

}

/***/ }),

/***/ 933:
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/GoTrueClient.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GoTrueClient)
/* harmony export */ });
/* harmony import */ var _GoTrueApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoTrueApi */ 8685);
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/helpers */ 8327);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/constants */ 8104);
/* harmony import */ var _lib_polyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/polyfills */ 9401);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};





(0,_lib_polyfills__WEBPACK_IMPORTED_MODULE_3__.polyfillGlobalThis)(); // Make "globalThis" available

const DEFAULT_OPTIONS = {
  url: _lib_constants__WEBPACK_IMPORTED_MODULE_2__.GOTRUE_URL,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  multiTab: true,
  headers: _lib_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_HEADERS
};
class GoTrueClient {
  /**
   * Create a new client for use in the browser.
   * @param options.url The URL of the GoTrue server.
   * @param options.headers Any additional headers to send to the GoTrue server.
   * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.localStorage Provide your own local storage implementation to use instead of the browser's local storage.
   * @param options.multiTab Set to "false" if you want to disable multi-tab/window events.
   * @param options.cookieOptions
   * @param options.fetch A custom fetch implementation.
   */
  constructor(options) {
    this.stateChangeEmitters = new Map();
    this.networkRetries = 0;
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.currentUser = null;
    this.currentSession = null;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.persistSession = settings.persistSession;
    this.multiTab = settings.multiTab;
    this.localStorage = settings.localStorage || globalThis.localStorage;
    this.api = new _GoTrueApi__WEBPACK_IMPORTED_MODULE_0__["default"]({
      url: settings.url,
      headers: settings.headers,
      cookieOptions: settings.cookieOptions,
      fetch: settings.fetch
    });

    this._recoverSession();

    this._recoverAndRefresh();

    this._listenForMultiTabEvents();

    this._handleVisibilityChange();

    if (settings.detectSessionInUrl && (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.isBrowser)() && !!(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('access_token')) {
      // Handle the OAuth redirect
      this.getSessionFromUrl({
        storeSession: true
      }).then(({
        error
      }) => {
        if (error) {
          console.error('Error getting session from URL.', error);
        }
      });
    }
  }
  /**
   * Creates a new user.
   * @type UserCredentials
   * @param email The user's email address.
   * @param password The user's password.
   * @param phone The user's phone number.
   * @param redirectTo The redirect URL attached to the signup confirmation link. Does not redirect the user if it's a mobile signup.
   * @param data Optional user metadata.
   */


  signUp({
    email,
    password,
    phone
  }, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this._removeSession();

        const {
          data,
          error
        } = phone && password ? yield this.api.signUpWithPhone(phone, password, {
          data: options.data,
          captchaToken: options.captchaToken
        }) : yield this.api.signUpWithEmail(email, password, {
          redirectTo: options.redirectTo,
          data: options.data,
          captchaToken: options.captchaToken
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw 'An error occurred on sign up.';
        }

        let session = null;
        let user = null;

        if (data.access_token) {
          session = data;
          user = session.user;

          this._saveSession(session);

          this._notifyAllSubscribers('SIGNED_IN');
        }

        if (data.id) {
          user = data;
        }

        return {
          user,
          session,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          session: null,
          error: e
        };
      }
    });
  }
  /**
   * Log in an existing user, or login via a third-party provider.
   * @type UserCredentials
   * @param email The user's email address.
   * @param phone The user's phone number.
   * @param password The user's password.
   * @param refreshToken A valid refresh token that was returned on login.
   * @param provider One of the providers supported by GoTrue.
   * @param redirectTo A URL to send the user to after they are confirmed (OAuth logins only).
   * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
   * @param scopes A space-separated list of scopes granted to the OAuth application.
   */


  signIn({
    email,
    phone,
    password,
    refreshToken,
    provider,
    oidc
  }, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this._removeSession();

        if (email && !password) {
          const {
            error
          } = yield this.api.sendMagicLinkEmail(email, {
            redirectTo: options.redirectTo,
            shouldCreateUser: options.shouldCreateUser,
            captchaToken: options.captchaToken
          });
          return {
            user: null,
            session: null,
            error
          };
        }

        if (email && password) {
          return this._handleEmailSignIn(email, password, {
            redirectTo: options.redirectTo
          });
        }

        if (phone && !password) {
          const {
            error
          } = yield this.api.sendMobileOTP(phone, {
            shouldCreateUser: options.shouldCreateUser,
            captchaToken: options.captchaToken
          });
          return {
            user: null,
            session: null,
            error
          };
        }

        if (phone && password) {
          return this._handlePhoneSignIn(phone, password);
        }

        if (refreshToken) {
          // currentSession and currentUser will be updated to latest on _callRefreshToken using the passed refreshToken
          const {
            error
          } = yield this._callRefreshToken(refreshToken);
          if (error) throw error;
          return {
            user: this.currentUser,
            session: this.currentSession,
            error: null
          };
        }

        if (provider) {
          return this._handleProviderSignIn(provider, {
            redirectTo: options.redirectTo,
            scopes: options.scopes,
            queryParams: options.queryParams
          });
        }

        if (oidc) {
          return this._handleOpenIDConnectSignIn(oidc);
        }

        throw new Error(`You must provide either an email, phone number, a third-party provider or OpenID Connect.`);
      } catch (e) {
        return {
          user: null,
          session: null,
          error: e
        };
      }
    });
  }
  /**
   * Log in a user given a User supplied OTP received via mobile.
   * @param email The user's email address.
   * @param phone The user's phone number.
   * @param token The user's password.
   * @param type The user's verification type.
   * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
   */


  verifyOTP(params, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this._removeSession();

        const {
          data,
          error
        } = yield this.api.verifyOTP(params, options);

        if (error) {
          throw error;
        }

        if (!data) {
          throw 'An error occurred on token verification.';
        }

        let session = null;
        let user = null;

        if (data.access_token) {
          session = data;
          user = session.user;

          this._saveSession(session);

          this._notifyAllSubscribers('SIGNED_IN');
        }

        if (data.id) {
          user = data;
        }

        return {
          user,
          session,
          error: null
        };
      } catch (e) {
        return {
          user: null,
          session: null,
          error: e
        };
      }
    });
  }
  /**
   * Inside a browser context, `user()` will return the user data, if there is a logged in user.
   *
   * For server-side management, you can get a user through `auth.api.getUserByCookie()`
   */


  user() {
    return this.currentUser;
  }
  /**
   * Returns the session data, if there is an active session.
   */


  session() {
    return this.currentSession;
  }
  /**
   * Force refreshes the session including the user data in case it was updated in a different session.
   */


  refreshSession() {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token)) throw new Error('Not logged in.'); // currentSession and currentUser will be updated to latest on _callRefreshToken

        const {
          error
        } = yield this._callRefreshToken();
        if (error) throw error;
        return {
          data: this.currentSession,
          user: this.currentUser,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          user: null,
          error: e
        };
      }
    });
  }
  /**
   * Updates user data, if there is a logged in user.
   */


  update(attributes) {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token)) throw new Error('Not logged in.');
        const {
          user,
          error
        } = yield this.api.updateUser(this.currentSession.access_token, attributes);
        if (error) throw error;
        if (!user) throw Error('Invalid user data.');
        const session = Object.assign(Object.assign({}, this.currentSession), {
          user
        });

        this._saveSession(session);

        this._notifyAllSubscribers('USER_UPDATED');

        return {
          data: user,
          user,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          user: null,
          error: e
        };
      }
    });
  }
  /**
   * Sets the session data from refresh_token and returns current Session and Error
   * @param refresh_token a JWT token
   */


  setSession(refresh_token) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!refresh_token) {
          throw new Error('No current session.');
        }

        const {
          data,
          error
        } = yield this.api.refreshAccessToken(refresh_token);

        if (error) {
          return {
            session: null,
            error: error
          };
        }

        this._saveSession(data);

        this._notifyAllSubscribers('SIGNED_IN');

        return {
          session: data,
          error: null
        };
      } catch (e) {
        return {
          error: e,
          session: null
        };
      }
    });
  }
  /**
   * Overrides the JWT on the current client. The JWT will then be sent in all subsequent network requests.
   * @param access_token a jwt access token
   */


  setAuth(access_token) {
    this.currentSession = Object.assign(Object.assign({}, this.currentSession), {
      access_token,
      token_type: 'bearer',
      user: this.user()
    });

    this._notifyAllSubscribers('TOKEN_REFRESHED');

    return this.currentSession;
  }
  /**
   * Gets the session data from a URL string
   * @param options.storeSession Optionally store the session in the browser
   */


  getSessionFromUrl(options) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.isBrowser)()) throw new Error('No browser detected.');
        const error_description = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('error_description');
        if (error_description) throw new Error(error_description);
        const provider_token = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('provider_token');
        const access_token = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('access_token');
        if (!access_token) throw new Error('No access_token detected.');
        const expires_in = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('expires_in');
        if (!expires_in) throw new Error('No expires_in detected.');
        const refresh_token = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('refresh_token');
        if (!refresh_token) throw new Error('No refresh_token detected.');
        const token_type = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('token_type');
        if (!token_type) throw new Error('No token_type detected.');
        const timeNow = Math.round(Date.now() / 1000);
        const expires_at = timeNow + parseInt(expires_in);
        const {
          user,
          error
        } = yield this.api.getUser(access_token);
        if (error) throw error;
        const session = {
          provider_token,
          access_token,
          expires_in: parseInt(expires_in),
          expires_at,
          refresh_token,
          token_type,
          user: user
        };

        if (options === null || options === void 0 ? void 0 : options.storeSession) {
          this._saveSession(session);

          const recoveryMode = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getParameterByName)('type');

          this._notifyAllSubscribers('SIGNED_IN');

          if (recoveryMode === 'recovery') {
            this._notifyAllSubscribers('PASSWORD_RECOVERY');
          }
        } // Remove tokens from URL


        window.location.hash = '';
        return {
          data: session,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session
   * and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
   *
   * For server-side management, you can disable sessions by passing a JWT through to `auth.api.signOut(JWT: string)`
   */


  signOut() {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      const accessToken = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token;

      this._removeSession();

      this._notifyAllSubscribers('SIGNED_OUT');

      if (accessToken) {
        const {
          error
        } = yield this.api.signOut(accessToken);
        if (error) return {
          error
        };
      }

      return {
        error: null
      };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @returns {Subscription} A subscription object which can be used to unsubscribe itself.
   */


  onAuthStateChange(callback) {
    try {
      const id = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.uuid)();
      const subscription = {
        id,
        callback,
        unsubscribe: () => {
          this.stateChangeEmitters.delete(id);
        }
      };
      this.stateChangeEmitters.set(id, subscription);
      return {
        data: subscription,
        error: null
      };
    } catch (e) {
      return {
        data: null,
        error: e
      };
    }
  }

  _handleEmailSignIn(email, password, options = {}) {
    var _a, _b;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        const {
          data,
          error
        } = yield this.api.signInWithEmail(email, password, {
          redirectTo: options.redirectTo
        });
        if (error || !data) return {
          data: null,
          user: null,
          session: null,
          error
        };

        if (((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.confirmed_at) || ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.email_confirmed_at)) {
          this._saveSession(data);

          this._notifyAllSubscribers('SIGNED_IN');
        }

        return {
          data,
          user: data.user,
          session: data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          user: null,
          session: null,
          error: e
        };
      }
    });
  }

  _handlePhoneSignIn(phone, password) {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        const {
          data,
          error
        } = yield this.api.signInWithPhone(phone, password);
        if (error || !data) return {
          data: null,
          user: null,
          session: null,
          error
        };

        if ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.phone_confirmed_at) {
          this._saveSession(data);

          this._notifyAllSubscribers('SIGNED_IN');
        }

        return {
          data,
          user: data.user,
          session: data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          user: null,
          session: null,
          error: e
        };
      }
    });
  }

  _handleProviderSignIn(provider, options = {}) {
    const url = this.api.getUrlForProvider(provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });

    try {
      // try to open on the browser
      if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.isBrowser)()) {
        window.location.href = url;
      }

      return {
        provider,
        url,
        data: null,
        session: null,
        user: null,
        error: null
      };
    } catch (e) {
      // fallback to returning the URL
      if (url) return {
        provider,
        url,
        data: null,
        session: null,
        user: null,
        error: null
      };
      return {
        data: null,
        user: null,
        session: null,
        error: e
      };
    }
  }

  _handleOpenIDConnectSignIn({
    id_token,
    nonce,
    client_id,
    issuer,
    provider
  }) {
    return __awaiter(this, void 0, void 0, function* () {
      if (id_token && nonce && (client_id && issuer || provider)) {
        try {
          const {
            data,
            error
          } = yield this.api.signInWithOpenIDConnect({
            id_token,
            nonce,
            client_id,
            issuer,
            provider
          });
          if (error || !data) return {
            user: null,
            session: null,
            error
          };

          this._saveSession(data);

          this._notifyAllSubscribers('SIGNED_IN');

          return {
            user: data.user,
            session: data,
            error: null
          };
        } catch (e) {
          return {
            user: null,
            session: null,
            error: e
          };
        }
      }

      throw new Error(`You must provide a OpenID Connect provider with your id token and nonce.`);
    });
  }
  /**
   * Attempts to get the session from LocalStorage
   * Note: this should never be async (even for React Native), as we need it to return immediately in the constructor.
   */


  _recoverSession() {
    try {
      const data = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getItemSynchronously)(this.localStorage, _lib_constants__WEBPACK_IMPORTED_MODULE_2__.STORAGE_KEY);
      if (!data) return null;
      const {
        currentSession,
        expiresAt
      } = data;
      const timeNow = Math.round(Date.now() / 1000);

      if (expiresAt >= timeNow + _lib_constants__WEBPACK_IMPORTED_MODULE_2__.EXPIRY_MARGIN && (currentSession === null || currentSession === void 0 ? void 0 : currentSession.user)) {
        this._saveSession(currentSession);

        this._notifyAllSubscribers('SIGNED_IN');
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */


  _recoverAndRefresh() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.getItemAsync)(this.localStorage, _lib_constants__WEBPACK_IMPORTED_MODULE_2__.STORAGE_KEY);
        if (!data) return null;
        const {
          currentSession,
          expiresAt
        } = data;
        const timeNow = Math.round(Date.now() / 1000);

        if (expiresAt < timeNow + _lib_constants__WEBPACK_IMPORTED_MODULE_2__.EXPIRY_MARGIN) {
          if (this.autoRefreshToken && currentSession.refresh_token) {
            this.networkRetries++;
            const {
              error
            } = yield this._callRefreshToken(currentSession.refresh_token);

            if (error) {
              console.log(error.message);

              if (error.message === _lib_constants__WEBPACK_IMPORTED_MODULE_2__.NETWORK_FAILURE.ERROR_MESSAGE && this.networkRetries < _lib_constants__WEBPACK_IMPORTED_MODULE_2__.NETWORK_FAILURE.MAX_RETRIES) {
                if (this.refreshTokenTimer) clearTimeout(this.refreshTokenTimer);
                this.refreshTokenTimer = setTimeout(() => this._recoverAndRefresh(), Math.pow(_lib_constants__WEBPACK_IMPORTED_MODULE_2__.NETWORK_FAILURE.RETRY_INTERVAL, this.networkRetries) * 100 // exponential backoff
                );
                return;
              }

              yield this._removeSession();
            }

            this.networkRetries = 0;
          } else {
            this._removeSession();
          }
        } else if (!currentSession) {
          console.log('Current session is missing data.');

          this._removeSession();
        } else {
          // should be handled on _recoverSession method already
          // But we still need the code here to accommodate for AsyncStorage e.g. in React native
          this._saveSession(currentSession);

          this._notifyAllSubscribers('SIGNED_IN');
        }
      } catch (err) {
        console.error(err);
        return null;
      }
    });
  }

  _callRefreshToken(refresh_token) {
    var _a;

    if (refresh_token === void 0) {
      refresh_token = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.refresh_token;
    }

    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!refresh_token) {
          throw new Error('No current session.');
        }

        const {
          data,
          error
        } = yield this.api.refreshAccessToken(refresh_token);
        if (error) throw error;
        if (!data) throw Error('Invalid session data.');

        this._saveSession(data);

        this._notifyAllSubscribers('TOKEN_REFRESHED');

        this._notifyAllSubscribers('SIGNED_IN');

        return {
          data,
          error: null
        };
      } catch (e) {
        return {
          data: null,
          error: e
        };
      }
    });
  }

  _notifyAllSubscribers(event) {
    this.stateChangeEmitters.forEach(x => x.callback(event, this.currentSession));
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */


  _saveSession(session) {
    this.currentSession = session;
    this.currentUser = session.user;
    const expiresAt = session.expires_at;

    if (expiresAt) {
      const timeNow = Math.round(Date.now() / 1000);
      const expiresIn = expiresAt - timeNow;
      const refreshDurationBeforeExpires = expiresIn > _lib_constants__WEBPACK_IMPORTED_MODULE_2__.EXPIRY_MARGIN ? _lib_constants__WEBPACK_IMPORTED_MODULE_2__.EXPIRY_MARGIN : 0.5;

      this._startAutoRefreshToken((expiresIn - refreshDurationBeforeExpires) * 1000);
    } // Do we need any extra check before persist session
    // access_token or user ?


    if (this.persistSession && session.expires_at) {
      this._persistSession(this.currentSession);
    }
  }

  _persistSession(currentSession) {
    const data = {
      currentSession,
      expiresAt: currentSession.expires_at
    };
    (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.setItemAsync)(this.localStorage, _lib_constants__WEBPACK_IMPORTED_MODULE_2__.STORAGE_KEY, data);
  }

  _removeSession() {
    return __awaiter(this, void 0, void 0, function* () {
      this.currentSession = null;
      this.currentUser = null;
      if (this.refreshTokenTimer) clearTimeout(this.refreshTokenTimer);
      (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.removeItemAsync)(this.localStorage, _lib_constants__WEBPACK_IMPORTED_MODULE_2__.STORAGE_KEY);
    });
  }
  /**
   * Clear and re-create refresh token timer
   * @param value time intervals in milliseconds
   */


  _startAutoRefreshToken(value) {
    if (this.refreshTokenTimer) clearTimeout(this.refreshTokenTimer);
    if (value <= 0 || !this.autoRefreshToken) return;
    this.refreshTokenTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
      this.networkRetries++;
      const {
        error
      } = yield this._callRefreshToken();
      if (!error) this.networkRetries = 0;
      if ((error === null || error === void 0 ? void 0 : error.message) === _lib_constants__WEBPACK_IMPORTED_MODULE_2__.NETWORK_FAILURE.ERROR_MESSAGE && this.networkRetries < _lib_constants__WEBPACK_IMPORTED_MODULE_2__.NETWORK_FAILURE.MAX_RETRIES) this._startAutoRefreshToken(Math.pow(_lib_constants__WEBPACK_IMPORTED_MODULE_2__.NETWORK_FAILURE.RETRY_INTERVAL, this.networkRetries) * 100); // exponential backoff
    }), value);
    if (typeof this.refreshTokenTimer.unref === 'function') this.refreshTokenTimer.unref();
  }
  /**
   * Listens for changes to LocalStorage and updates the current session.
   */


  _listenForMultiTabEvents() {
    if (!this.multiTab || !(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.isBrowser)() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      return false;
    }

    try {
      window === null || window === void 0 ? void 0 : window.addEventListener('storage', e => {
        var _a;

        if (e.key === _lib_constants__WEBPACK_IMPORTED_MODULE_2__.STORAGE_KEY) {
          const newSession = JSON.parse(String(e.newValue));

          if ((_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) {
            this._saveSession(newSession.currentSession);

            this._notifyAllSubscribers('SIGNED_IN');
          } else {
            this._removeSession();

            this._notifyAllSubscribers('SIGNED_OUT');
          }
        }
      });
    } catch (error) {
      console.error('_listenForMultiTabEvents', error);
    }
  }

  _handleVisibilityChange() {
    if (!this.multiTab || !(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.isBrowser)() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      return false;
    }

    try {
      window === null || window === void 0 ? void 0 : window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this._recoverAndRefresh();
        }
      });
    } catch (error) {
      console.error('_handleVisibilityChange', error);
    }
  }

}

/***/ }),

/***/ 2675:
/*!***************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GoTrueApi": () => (/* reexport safe */ _GoTrueApi__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "GoTrueClient": () => (/* reexport safe */ _GoTrueClient__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _GoTrueApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoTrueApi */ 8685);
/* harmony import */ var _GoTrueClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GoTrueClient */ 933);
/* harmony import */ var _lib_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/types */ 7670);





/***/ }),

/***/ 8104:
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/constants.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AUDIENCE": () => (/* binding */ AUDIENCE),
/* harmony export */   "COOKIE_OPTIONS": () => (/* binding */ COOKIE_OPTIONS),
/* harmony export */   "DEFAULT_HEADERS": () => (/* binding */ DEFAULT_HEADERS),
/* harmony export */   "EXPIRY_MARGIN": () => (/* binding */ EXPIRY_MARGIN),
/* harmony export */   "GOTRUE_URL": () => (/* binding */ GOTRUE_URL),
/* harmony export */   "NETWORK_FAILURE": () => (/* binding */ NETWORK_FAILURE),
/* harmony export */   "STORAGE_KEY": () => (/* binding */ STORAGE_KEY)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ 2027);

const GOTRUE_URL = 'http://localhost:9999';
const AUDIENCE = '';
const DEFAULT_HEADERS = {
  'X-Client-Info': `gotrue-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}`
};
const EXPIRY_MARGIN = 10; // in seconds

const NETWORK_FAILURE = {
  ERROR_MESSAGE: 'Request Failed',
  MAX_RETRIES: 10,
  RETRY_INTERVAL: 2 // in deciseconds

};
const STORAGE_KEY = 'supabase.auth.token';
const COOKIE_OPTIONS = {
  name: 'sb',
  lifetime: 60 * 60 * 8,
  domain: '',
  path: '/',
  sameSite: 'lax'
};

/***/ }),

/***/ 595:
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/cookies.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deleteCookie": () => (/* binding */ deleteCookie),
/* harmony export */   "getCookieString": () => (/* binding */ getCookieString),
/* harmony export */   "setCookie": () => (/* binding */ setCookie),
/* harmony export */   "setCookies": () => (/* binding */ setCookies)
/* harmony export */ });
/**
 * Serialize data into a cookie header.
 */
function serialize(name, val, options) {
  const opt = options || {};
  const enc = encodeURIComponent;
  /* eslint-disable-next-line no-control-regex */

  const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  const value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  let str = name + '=' + value;

  if (null != opt.maxAge) {
    const maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid');
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case 'lax':
        str += '; SameSite=Lax';
        break;

      case 'strict':
        str += '; SameSite=Strict';
        break;

      case 'none':
        str += '; SameSite=None';
        break;

      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}
/**
 * Based on the environment and the request we know if a secure cookie can be set.
 */


function isSecureEnvironment(req) {
  if (!req || !req.headers || !req.headers.host) {
    throw new Error('The "host" request header is not available');
  }

  const host = req.headers.host.indexOf(':') > -1 && req.headers.host.split(':')[0] || req.headers.host;

  if (['localhost', '127.0.0.1'].indexOf(host) > -1 || host.endsWith('.local')) {
    return false;
  }

  return true;
}
/**
 * Serialize a cookie to a string.
 */


function serializeCookie(cookie, secure) {
  var _a, _b, _c;

  return serialize(cookie.name, cookie.value, {
    maxAge: cookie.maxAge,
    expires: new Date(Date.now() + cookie.maxAge * 1000),
    httpOnly: true,
    secure,
    path: (_a = cookie.path) !== null && _a !== void 0 ? _a : '/',
    domain: (_b = cookie.domain) !== null && _b !== void 0 ? _b : '',
    sameSite: (_c = cookie.sameSite) !== null && _c !== void 0 ? _c : 'lax'
  });
}
/**
 * Get Cookie Header strings.
 */


function getCookieString(req, res, cookies) {
  const strCookies = cookies.map(c => serializeCookie(c, isSecureEnvironment(req)));
  const previousCookies = res.getHeader('Set-Cookie');

  if (previousCookies) {
    if (previousCookies instanceof Array) {
      Array.prototype.push.apply(strCookies, previousCookies);
    } else if (typeof previousCookies === 'string') {
      strCookies.push(previousCookies);
    }
  }

  return strCookies;
}
/**
 * Set one or more cookies.
 */

function setCookies(req, res, cookies) {
  res.setHeader('Set-Cookie', getCookieString(req, res, cookies));
}
/**
 * Set one or more cookies.
 */

function setCookie(req, res, cookie) {
  setCookies(req, res, [cookie]);
}
function deleteCookie(req, res, name) {
  setCookie(req, res, {
    name,
    value: '',
    maxAge: -1
  });
}

/***/ }),

/***/ 669:
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/fetch.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "post": () => (/* binding */ post),
/* harmony export */   "put": () => (/* binding */ put),
/* harmony export */   "remove": () => (/* binding */ remove)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ 8104);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};



const _getErrorMessage = err => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);

const handleError = (error, reject) => {
  if (!(error === null || error === void 0 ? void 0 : error.status)) {
    return reject({
      message: _constants__WEBPACK_IMPORTED_MODULE_0__.NETWORK_FAILURE.ERROR_MESSAGE
    });
  }

  if (typeof error.json !== 'function') {
    return reject(error);
  }

  error.json().then(err => {
    return reject({
      message: _getErrorMessage(err),
      status: (error === null || error === void 0 ? void 0 : error.status) || 500
    });
  });
};

const _getRequestParams = (method, options, body) => {
  const params = {
    method,
    headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
  };

  if (method === 'GET') {
    return params;
  }

  params.headers = Object.assign({
    'Content-Type': 'text/plain;charset=UTF-8'
  }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return params;
};

function _handleRequest(fetcher, method, url, options, body) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, body)).then(result => {
        if (!result.ok) throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) return resolve;
        return result.json();
      }).then(data => resolve(data)).catch(error => handleError(error, reject));
    });
  });
}

function get(fetcher, url, options) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'GET', url, options);
  });
}
function post(fetcher, url, body, options) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'POST', url, options, body);
  });
}
function put(fetcher, url, body, options) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'PUT', url, options, body);
  });
}
function remove(fetcher, url, body, options) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'DELETE', url, options, body);
  });
}

/***/ }),

/***/ 8327:
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/helpers.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "expiresAt": () => (/* binding */ expiresAt),
/* harmony export */   "getItemAsync": () => (/* binding */ getItemAsync),
/* harmony export */   "getItemSynchronously": () => (/* binding */ getItemSynchronously),
/* harmony export */   "getParameterByName": () => (/* binding */ getParameterByName),
/* harmony export */   "isBrowser": () => (/* binding */ isBrowser),
/* harmony export */   "removeItemAsync": () => (/* binding */ removeItemAsync),
/* harmony export */   "resolveFetch": () => (/* binding */ resolveFetch),
/* harmony export */   "setItemAsync": () => (/* binding */ setItemAsync),
/* harmony export */   "uuid": () => (/* binding */ uuid)
/* harmony export */ });
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1000);
  return timeNow + expiresIn;
}
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
const isBrowser = () => typeof window !== 'undefined';
function getParameterByName(name, url) {
  var _a;

  if (!url) url = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) || ''; // eslint-disable-next-line no-useless-escape

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const resolveFetch = customFetch => {
  let _fetch;

  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => __awaiter(void 0, void 0, void 0, function* () {
      return yield (yield __webpack_require__.e(/*! import() */ "node_modules_cross-fetch_dist_browser-ponyfill_js").then(__webpack_require__.t.bind(__webpack_require__, /*! cross-fetch */ 9119, 23))).fetch(...args);
    });
  } else {
    _fetch = fetch;
  }

  return (...args) => _fetch(...args);
}; // LocalStorage helpers

const setItemAsync = (storage, key, data) => __awaiter(void 0, void 0, void 0, function* () {
  isBrowser() && (yield storage === null || storage === void 0 ? void 0 : storage.setItem(key, JSON.stringify(data)));
});
const getItemAsync = (storage, key) => __awaiter(void 0, void 0, void 0, function* () {
  const value = isBrowser() && (yield storage === null || storage === void 0 ? void 0 : storage.getItem(key));
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
});
const getItemSynchronously = (storage, key) => {
  const value = isBrowser() && (storage === null || storage === void 0 ? void 0 : storage.getItem(key));

  if (!value || typeof value !== 'string') {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
};
const removeItemAsync = (storage, key) => __awaiter(void 0, void 0, void 0, function* () {
  isBrowser() && (yield storage === null || storage === void 0 ? void 0 : storage.removeItem(key));
});

/***/ }),

/***/ 9401:
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/polyfills.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "polyfillGlobalThis": () => (/* binding */ polyfillGlobalThis)
/* harmony export */ });
/**
 * https://mathiasbynens.be/notes/globalthis
 */
function polyfillGlobalThis() {
  if (typeof globalThis === 'object') return;

  try {
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this;
      },
      configurable: true
    }); // @ts-expect-error 'Allow access to magic'

    __magic__.globalThis = __magic__; // @ts-expect-error 'Allow access to magic'

    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== 'undefined') {
      // @ts-expect-error 'Allow access to globals'
      self.globalThis = self;
    }
  }
}

/***/ }),

/***/ 7670:
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/types.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ 2027:
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/gotrue-js/dist/module/lib/version.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
// generated by genversion
const version = '1.22.19';

/***/ }),

/***/ 1279:
/*!****************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostgrestClient)
/* harmony export */ });
/* harmony import */ var _lib_PostgrestQueryBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/PostgrestQueryBuilder */ 879);
/* harmony import */ var _lib_PostgrestRpcBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/PostgrestRpcBuilder */ 518);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/constants */ 1468);



class PostgrestClient {
  /**
   * Creates a PostgREST client.
   *
   * @param url  URL of the PostgREST endpoint.
   * @param headers  Custom headers.
   * @param schema  Postgres schema to switch to.
   */
  constructor(url, {
    headers = {},
    schema,
    fetch,
    throwOnError
  } = {}) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, _lib_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_HEADERS), headers);
    this.schema = schema;
    this.fetch = fetch;
    this.shouldThrowOnError = throwOnError;
  }
  /**
   * Authenticates the request with JWT.
   *
   * @param token  The JWT token to use.
   */


  auth(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }
  /**
   * Perform a table operation.
   *
   * @param table  The table name to operate on.
   */


  from(table) {
    const url = `${this.url}/${table}`;
    return new _lib_PostgrestQueryBuilder__WEBPACK_IMPORTED_MODULE_0__["default"](url, {
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      shouldThrowOnError: this.shouldThrowOnError
    });
  }
  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param params  The parameters to pass to the function call.
   * @param head  When set to true, no data will be returned.
   * @param count  Count algorithm to use to count rows in a table.
   */


  rpc(fn, params, {
    head = false,
    count = null
  } = {}) {
    const url = `${this.url}/rpc/${fn}`;
    return new _lib_PostgrestRpcBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](url, {
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      shouldThrowOnError: this.shouldThrowOnError
    }).rpc(params, {
      head,
      count
    });
  }

}

/***/ }),

/***/ 7436:
/*!******************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PostgrestBuilder": () => (/* reexport safe */ _lib_types__WEBPACK_IMPORTED_MODULE_3__.PostgrestBuilder),
/* harmony export */   "PostgrestClient": () => (/* reexport safe */ _PostgrestClient__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "PostgrestFilterBuilder": () => (/* reexport safe */ _lib_PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "PostgrestQueryBuilder": () => (/* reexport safe */ _lib_PostgrestQueryBuilder__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _PostgrestClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PostgrestClient */ 1279);
/* harmony import */ var _lib_PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/PostgrestFilterBuilder */ 7106);
/* harmony import */ var _lib_PostgrestQueryBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/PostgrestQueryBuilder */ 879);
/* harmony import */ var _lib_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/types */ 7502);






/***/ }),

/***/ 7106:
/*!***************************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestFilterBuilder.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostgrestFilterBuilder)
/* harmony export */ });
/* harmony import */ var _PostgrestTransformBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PostgrestTransformBuilder */ 8366);

class PostgrestFilterBuilder extends _PostgrestTransformBuilder__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    /** @deprecated Use `contains()` instead. */

    this.cs = this.contains;
    /** @deprecated Use `containedBy()` instead. */

    this.cd = this.containedBy;
    /** @deprecated Use `rangeLt()` instead. */

    this.sl = this.rangeLt;
    /** @deprecated Use `rangeGt()` instead. */

    this.sr = this.rangeGt;
    /** @deprecated Use `rangeGte()` instead. */

    this.nxl = this.rangeGte;
    /** @deprecated Use `rangeLte()` instead. */

    this.nxr = this.rangeLte;
    /** @deprecated Use `rangeAdjacent()` instead. */

    this.adj = this.rangeAdjacent;
    /** @deprecated Use `overlaps()` instead. */

    this.ov = this.overlaps;
  }
  /**
   * Finds all rows which doesn't satisfy the filter.
   *
   * @param column  The column to filter on.
   * @param operator  The operator to filter with.
   * @param value  The value to filter with.
   */


  not(column, operator, value) {
    this.url.searchParams.append(`${column}`, `not.${operator}.${value}`);
    return this;
  }
  /**
   * Finds all rows satisfying at least one of the filters.
   *
   * @param filters  The filters to use, separated by commas.
   * @param foreignTable  The foreign table to use (if `column` is a foreign column).
   */


  or(filters, {
    foreignTable
  } = {}) {
    const key = typeof foreignTable === 'undefined' ? 'or' : `${foreignTable}.or`;
    this.url.searchParams.append(key, `(${filters})`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` exactly matches the
   * specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  eq(column, value) {
    this.url.searchParams.append(`${column}`, `eq.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` doesn't match the
   * specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  neq(column, value) {
    this.url.searchParams.append(`${column}`, `neq.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` is greater than the
   * specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  gt(column, value) {
    this.url.searchParams.append(`${column}`, `gt.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` is greater than or
   * equal to the specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  gte(column, value) {
    this.url.searchParams.append(`${column}`, `gte.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` is less than the
   * specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  lt(column, value) {
    this.url.searchParams.append(`${column}`, `lt.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` is less than or equal
   * to the specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  lte(column, value) {
    this.url.searchParams.append(`${column}`, `lte.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value in the stated `column` matches the supplied
   * `pattern` (case sensitive).
   *
   * @param column  The column to filter on.
   * @param pattern  The pattern to filter with.
   */


  like(column, pattern) {
    this.url.searchParams.append(`${column}`, `like.${pattern}`);
    return this;
  }
  /**
   * Finds all rows whose value in the stated `column` matches the supplied
   * `pattern` (case insensitive).
   *
   * @param column  The column to filter on.
   * @param pattern  The pattern to filter with.
   */


  ilike(column, pattern) {
    this.url.searchParams.append(`${column}`, `ilike.${pattern}`);
    return this;
  }
  /**
   * A check for exact equality (null, true, false), finds all rows whose
   * value on the stated `column` exactly match the specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  is(column, value) {
    this.url.searchParams.append(`${column}`, `is.${value}`);
    return this;
  }
  /**
   * Finds all rows whose value on the stated `column` is found on the
   * specified `values`.
   *
   * @param column  The column to filter on.
   * @param values  The values to filter with.
   */


  in(column, values) {
    const cleanedValues = values.map(s => {
      // handle postgrest reserved characters
      // https://postgrest.org/en/v7.0.0/api.html#reserved-characters
      if (typeof s === 'string' && new RegExp('[,()]').test(s)) return `"${s}"`;else return `${s}`;
    }).join(',');
    this.url.searchParams.append(`${column}`, `in.(${cleanedValues})`);
    return this;
  }
  /**
   * Finds all rows whose json, array, or range value on the stated `column`
   * contains the values specified in `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  contains(column, value) {
    if (typeof value === 'string') {
      // range types can be inclusive '[', ']' or exclusive '(', ')' so just
      // keep it simple and accept a string
      this.url.searchParams.append(`${column}`, `cs.${value}`);
    } else if (Array.isArray(value)) {
      // array
      this.url.searchParams.append(`${column}`, `cs.{${value.join(',')}}`);
    } else {
      // json
      this.url.searchParams.append(`${column}`, `cs.${JSON.stringify(value)}`);
    }

    return this;
  }
  /**
   * Finds all rows whose json, array, or range value on the stated `column` is
   * contained by the specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  containedBy(column, value) {
    if (typeof value === 'string') {
      // range
      this.url.searchParams.append(`${column}`, `cd.${value}`);
    } else if (Array.isArray(value)) {
      // array
      this.url.searchParams.append(`${column}`, `cd.{${value.join(',')}}`);
    } else {
      // json
      this.url.searchParams.append(`${column}`, `cd.${JSON.stringify(value)}`);
    }

    return this;
  }
  /**
   * Finds all rows whose range value on the stated `column` is strictly to the
   * left of the specified `range`.
   *
   * @param column  The column to filter on.
   * @param range  The range to filter with.
   */


  rangeLt(column, range) {
    this.url.searchParams.append(`${column}`, `sl.${range}`);
    return this;
  }
  /**
   * Finds all rows whose range value on the stated `column` is strictly to
   * the right of the specified `range`.
   *
   * @param column  The column to filter on.
   * @param range  The range to filter with.
   */


  rangeGt(column, range) {
    this.url.searchParams.append(`${column}`, `sr.${range}`);
    return this;
  }
  /**
   * Finds all rows whose range value on the stated `column` does not extend
   * to the left of the specified `range`.
   *
   * @param column  The column to filter on.
   * @param range  The range to filter with.
   */


  rangeGte(column, range) {
    this.url.searchParams.append(`${column}`, `nxl.${range}`);
    return this;
  }
  /**
   * Finds all rows whose range value on the stated `column` does not extend
   * to the right of the specified `range`.
   *
   * @param column  The column to filter on.
   * @param range  The range to filter with.
   */


  rangeLte(column, range) {
    this.url.searchParams.append(`${column}`, `nxr.${range}`);
    return this;
  }
  /**
   * Finds all rows whose range value on the stated `column` is adjacent to
   * the specified `range`.
   *
   * @param column  The column to filter on.
   * @param range  The range to filter with.
   */


  rangeAdjacent(column, range) {
    this.url.searchParams.append(`${column}`, `adj.${range}`);
    return this;
  }
  /**
   * Finds all rows whose array or range value on the stated `column` overlaps
   * (has a value in common) with the specified `value`.
   *
   * @param column  The column to filter on.
   * @param value  The value to filter with.
   */


  overlaps(column, value) {
    if (typeof value === 'string') {
      // range
      this.url.searchParams.append(`${column}`, `ov.${value}`);
    } else {
      // array
      this.url.searchParams.append(`${column}`, `ov.{${value.join(',')}}`);
    }

    return this;
  }
  /**
   * Finds all rows whose text or tsvector value on the stated `column` matches
   * the tsquery in `query`.
   *
   * @param column  The column to filter on.
   * @param query  The Postgres tsquery string to filter with.
   * @param config  The text search configuration to use.
   * @param type  The type of tsquery conversion to use on `query`.
   */


  textSearch(column, query, {
    config,
    type = null
  } = {}) {
    let typePart = '';

    if (type === 'plain') {
      typePart = 'pl';
    } else if (type === 'phrase') {
      typePart = 'ph';
    } else if (type === 'websearch') {
      typePart = 'w';
    }

    const configPart = config === undefined ? '' : `(${config})`;
    this.url.searchParams.append(`${column}`, `${typePart}fts${configPart}.${query}`);
    return this;
  }
  /**
   * Finds all rows whose tsvector value on the stated `column` matches
   * to_tsquery(`query`).
   *
   * @param column  The column to filter on.
   * @param query  The Postgres tsquery string to filter with.
   * @param config  The text search configuration to use.
   *
   * @deprecated Use `textSearch()` instead.
   */


  fts(column, query, {
    config
  } = {}) {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`;
    this.url.searchParams.append(`${column}`, `fts${configPart}.${query}`);
    return this;
  }
  /**
   * Finds all rows whose tsvector value on the stated `column` matches
   * plainto_tsquery(`query`).
   *
   * @param column  The column to filter on.
   * @param query  The Postgres tsquery string to filter with.
   * @param config  The text search configuration to use.
   *
   * @deprecated Use `textSearch()` with `type: 'plain'` instead.
   */


  plfts(column, query, {
    config
  } = {}) {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`;
    this.url.searchParams.append(`${column}`, `plfts${configPart}.${query}`);
    return this;
  }
  /**
   * Finds all rows whose tsvector value on the stated `column` matches
   * phraseto_tsquery(`query`).
   *
   * @param column  The column to filter on.
   * @param query  The Postgres tsquery string to filter with.
   * @param config  The text search configuration to use.
   *
   * @deprecated Use `textSearch()` with `type: 'phrase'` instead.
   */


  phfts(column, query, {
    config
  } = {}) {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`;
    this.url.searchParams.append(`${column}`, `phfts${configPart}.${query}`);
    return this;
  }
  /**
   * Finds all rows whose tsvector value on the stated `column` matches
   * websearch_to_tsquery(`query`).
   *
   * @param column  The column to filter on.
   * @param query  The Postgres tsquery string to filter with.
   * @param config  The text search configuration to use.
   *
   * @deprecated Use `textSearch()` with `type: 'websearch'` instead.
   */


  wfts(column, query, {
    config
  } = {}) {
    const configPart = typeof config === 'undefined' ? '' : `(${config})`;
    this.url.searchParams.append(`${column}`, `wfts${configPart}.${query}`);
    return this;
  }
  /**
   * Finds all rows whose `column` satisfies the filter.
   *
   * @param column  The column to filter on.
   * @param operator  The operator to filter with.
   * @param value  The value to filter with.
   */


  filter(column, operator, value) {
    this.url.searchParams.append(`${column}`, `${operator}.${value}`);
    return this;
  }
  /**
   * Finds all rows whose columns match the specified `query` object.
   *
   * @param query  The object to filter with, with column names as keys mapped
   *               to their filter values.
   */


  match(query) {
    Object.keys(query).forEach(key => {
      this.url.searchParams.append(`${key}`, `eq.${query[key]}`);
    });
    return this;
  }

}

/***/ }),

/***/ 879:
/*!**************************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestQueryBuilder.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostgrestQueryBuilder)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ 7502);
/* harmony import */ var _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PostgrestFilterBuilder */ 7106);


class PostgrestQueryBuilder extends _types__WEBPACK_IMPORTED_MODULE_0__.PostgrestBuilder {
  constructor(url, {
    headers = {},
    schema,
    fetch,
    shouldThrowOnError
  } = {}) {
    super({
      fetch,
      shouldThrowOnError
    });
    this.url = new URL(url);
    this.headers = Object.assign({}, headers);
    this.schema = schema;
  }
  /**
   * Performs vertical filtering with SELECT.
   *
   * @param columns  The columns to retrieve, separated by commas.
   * @param head  When set to true, select will void data.
   * @param count  Count algorithm to use to count rows in a table.
   */


  select(columns = '*', {
    head = false,
    count = null
  } = {}) {
    this.method = 'GET'; // Remove whitespaces except when quoted

    let quoted = false;
    const cleanedColumns = columns.split('').map(c => {
      if (/\s/.test(c) && !quoted) {
        return '';
      }

      if (c === '"') {
        quoted = !quoted;
      }

      return c;
    }).join('');
    this.url.searchParams.set('select', cleanedColumns);

    if (count) {
      this.headers['Prefer'] = `count=${count}`;
    }

    if (head) {
      this.method = 'HEAD';
    }

    return new _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this);
  }

  insert(values, {
    upsert = false,
    onConflict,
    returning = 'representation',
    count = null
  } = {}) {
    this.method = 'POST';
    const prefersHeaders = [`return=${returning}`];
    if (upsert) prefersHeaders.push('resolution=merge-duplicates');
    if (upsert && onConflict !== undefined) this.url.searchParams.set('on_conflict', onConflict);
    this.body = values;

    if (count) {
      prefersHeaders.push(`count=${count}`);
    }

    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer']);
    }

    this.headers['Prefer'] = prefersHeaders.join(',');

    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);

      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map(column => `"${column}"`);
        this.url.searchParams.set('columns', uniqueColumns.join(','));
      }
    }

    return new _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this);
  }
  /**
   * Performs an UPSERT into the table.
   *
   * @param values  The values to insert.
   * @param onConflict  By specifying the `on_conflict` query parameter, you can make UPSERT work on a column(s) that has a UNIQUE constraint.
   * @param returning  By default the new record is returned. Set this to 'minimal' if you don't need this value.
   * @param count  Count algorithm to use to count rows in a table.
   * @param ignoreDuplicates  Specifies if duplicate rows should be ignored and not inserted.
   */


  upsert(values, {
    onConflict,
    returning = 'representation',
    count = null,
    ignoreDuplicates = false
  } = {}) {
    this.method = 'POST';
    const prefersHeaders = [`resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`, `return=${returning}`];
    if (onConflict !== undefined) this.url.searchParams.set('on_conflict', onConflict);
    this.body = values;

    if (count) {
      prefersHeaders.push(`count=${count}`);
    }

    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer']);
    }

    this.headers['Prefer'] = prefersHeaders.join(',');
    return new _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this);
  }
  /**
   * Performs an UPDATE on the table.
   *
   * @param values  The values to update.
   * @param returning  By default the updated record is returned. Set this to 'minimal' if you don't need this value.
   * @param count  Count algorithm to use to count rows in a table.
   */


  update(values, {
    returning = 'representation',
    count = null
  } = {}) {
    this.method = 'PATCH';
    const prefersHeaders = [`return=${returning}`];
    this.body = values;

    if (count) {
      prefersHeaders.push(`count=${count}`);
    }

    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer']);
    }

    this.headers['Prefer'] = prefersHeaders.join(',');
    return new _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this);
  }
  /**
   * Performs a DELETE on the table.
   *
   * @param returning  If `true`, return the deleted row(s) in the response.
   * @param count  Count algorithm to use to count rows in a table.
   */


  delete({
    returning = 'representation',
    count = null
  } = {}) {
    this.method = 'DELETE';
    const prefersHeaders = [`return=${returning}`];

    if (count) {
      prefersHeaders.push(`count=${count}`);
    }

    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer']);
    }

    this.headers['Prefer'] = prefersHeaders.join(',');
    return new _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this);
  }

}

/***/ }),

/***/ 518:
/*!************************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestRpcBuilder.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostgrestRpcBuilder)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ 7502);
/* harmony import */ var _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PostgrestFilterBuilder */ 7106);


class PostgrestRpcBuilder extends _types__WEBPACK_IMPORTED_MODULE_0__.PostgrestBuilder {
  constructor(url, {
    headers = {},
    schema,
    fetch,
    shouldThrowOnError
  } = {}) {
    super({
      fetch,
      shouldThrowOnError
    });
    this.url = new URL(url);
    this.headers = Object.assign({}, headers);
    this.schema = schema;
  }
  /**
   * Perform a function call.
   */


  rpc(params, {
    head = false,
    count = null
  } = {}) {
    if (head) {
      this.method = 'HEAD';

      if (params) {
        Object.entries(params).forEach(([name, value]) => {
          this.url.searchParams.append(name, value);
        });
      }
    } else {
      this.method = 'POST';
      this.body = params;
    }

    if (count) {
      if (this.headers['Prefer'] !== undefined) this.headers['Prefer'] += `,count=${count}`;else this.headers['Prefer'] = `count=${count}`;
    }

    return new _PostgrestFilterBuilder__WEBPACK_IMPORTED_MODULE_1__["default"](this);
  }

}

/***/ }),

/***/ 8366:
/*!******************************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestTransformBuilder.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostgrestTransformBuilder)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ 7502);

/**
 * Post-filters (transforms)
 */

class PostgrestTransformBuilder extends _types__WEBPACK_IMPORTED_MODULE_0__.PostgrestBuilder {
  /**
   * Performs vertical filtering with SELECT.
   *
   * @param columns  The columns to retrieve, separated by commas.
   */
  select(columns = '*') {
    // Remove whitespaces except when quoted
    let quoted = false;
    const cleanedColumns = columns.split('').map(c => {
      if (/\s/.test(c) && !quoted) {
        return '';
      }

      if (c === '"') {
        quoted = !quoted;
      }

      return c;
    }).join('');
    this.url.searchParams.set('select', cleanedColumns);
    return this;
  }
  /**
   * Orders the result with the specified `column`.
   *
   * @param column  The column to order on.
   * @param ascending  If `true`, the result will be in ascending order.
   * @param nullsFirst  If `true`, `null`s appear first.
   * @param foreignTable  The foreign table to use (if `column` is a foreign column).
   */


  order(column, {
    ascending = true,
    nullsFirst = false,
    foreignTable
  } = {}) {
    const key = typeof foreignTable === 'undefined' ? 'order' : `${foreignTable}.order`;
    const existingOrder = this.url.searchParams.get(key);
    this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}.${nullsFirst ? 'nullsfirst' : 'nullslast'}`);
    return this;
  }
  /**
   * Limits the result with the specified `count`.
   *
   * @param count  The maximum no. of rows to limit to.
   * @param foreignTable  The foreign table to use (for foreign columns).
   */


  limit(count, {
    foreignTable
  } = {}) {
    const key = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
    this.url.searchParams.set(key, `${count}`);
    return this;
  }
  /**
   * Limits the result to rows within the specified range, inclusive.
   *
   * @param from  The starting index from which to limit the result, inclusive.
   * @param to  The last index to which to limit the result, inclusive.
   * @param foreignTable  The foreign table to use (for foreign columns).
   */


  range(from, to, {
    foreignTable
  } = {}) {
    const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `${foreignTable}.offset`;
    const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
    this.url.searchParams.set(keyOffset, `${from}`); // Range is inclusive, so add 1

    this.url.searchParams.set(keyLimit, `${to - from + 1}`);
    return this;
  }
  /**
   * Sets the AbortSignal for the fetch request.
   */


  abortSignal(signal) {
    this.signal = signal;
    return this;
  }
  /**
   * Retrieves only one row from the result. Result must be one row (e.g. using
   * `limit`), otherwise this will result in an error.
   */


  single() {
    this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    return this;
  }
  /**
   * Retrieves at most one row from the result. Result must be at most one row
   * (e.g. using `eq` on a UNIQUE column), otherwise this will result in an
   * error.
   */


  maybeSingle() {
    this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    this.allowEmpty = true;
    return this;
  }
  /**
   * Set the response type to CSV.
   */


  csv() {
    this.headers['Accept'] = 'text/csv';
    return this;
  }

}

/***/ }),

/***/ 1468:
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/constants.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_HEADERS": () => (/* binding */ DEFAULT_HEADERS)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ 7114);

const DEFAULT_HEADERS = {
  'X-Client-Info': `postgrest-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}`
};

/***/ }),

/***/ 7502:
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/types.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PostgrestBuilder": () => (/* binding */ PostgrestBuilder)
/* harmony export */ });
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

class PostgrestBuilder {
  constructor(builder) {
    Object.assign(this, builder);

    let _fetch;

    if (builder.fetch) {
      _fetch = builder.fetch;
    } else if (typeof fetch === 'undefined') {
      _fetch = (...args) => __awaiter(this, void 0, void 0, function* () {
        return yield (yield __webpack_require__.e(/*! import() */ "node_modules_cross-fetch_dist_browser-ponyfill_js").then(__webpack_require__.t.bind(__webpack_require__, /*! cross-fetch */ 9119, 23))).fetch(...args);
      });
    } else {
      _fetch = fetch;
    }

    this.fetch = (...args) => _fetch(...args);

    this.shouldThrowOnError = builder.shouldThrowOnError || false;
    this.allowEmpty = builder.allowEmpty || false;
  }
  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */


  throwOnError(throwOnError) {
    if (throwOnError === null || throwOnError === undefined) {
      throwOnError = true;
    }

    this.shouldThrowOnError = throwOnError;
    return this;
  }

  then(onfulfilled, onrejected) {
    // https://postgrest.org/en/stable/api.html#switching-schemas
    if (typeof this.schema === 'undefined') {// skip
    } else if (['GET', 'HEAD'].includes(this.method)) {
      this.headers['Accept-Profile'] = this.schema;
    } else {
      this.headers['Content-Profile'] = this.schema;
    }

    if (this.method !== 'GET' && this.method !== 'HEAD') {
      this.headers['Content-Type'] = 'application/json';
    }

    let res = this.fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal
    }).then(res => __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d;

      let error = null;
      let data = null;
      let count = null;
      let status = res.status;
      let statusText = res.statusText;

      if (res.ok) {
        const isReturnMinimal = (_a = this.headers['Prefer']) === null || _a === void 0 ? void 0 : _a.split(',').includes('return=minimal');

        if (this.method !== 'HEAD' && !isReturnMinimal) {
          const text = yield res.text();

          if (!text) {// discard `text`
          } else if (this.headers['Accept'] === 'text/csv') {
            data = text;
          } else {
            data = JSON.parse(text);
          }
        }

        const countHeader = (_b = this.headers['Prefer']) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
        const contentRange = (_c = res.headers.get('content-range')) === null || _c === void 0 ? void 0 : _c.split('/');

        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1]);
        }
      } else {
        const body = yield res.text();

        try {
          error = JSON.parse(body);
        } catch (_e) {
          error = {
            message: body
          };
        }

        if (error && this.allowEmpty && ((_d = error === null || error === void 0 ? void 0 : error.details) === null || _d === void 0 ? void 0 : _d.includes('Results contain 0 rows'))) {
          error = null;
          status = 200;
          statusText = 'OK';
        }

        if (error && this.shouldThrowOnError) {
          throw error;
        }
      }

      const postgrestResponse = {
        error,
        data,
        count,
        status,
        statusText,
        body: data
      };
      return postgrestResponse;
    }));

    if (!this.shouldThrowOnError) {
      res = res.catch(fetchError => ({
        error: {
          message: `FetchError: ${fetchError.message}`,
          details: '',
          hint: '',
          code: fetchError.code || ''
        },
        data: null,
        body: null,
        count: null,
        status: 400,
        statusText: 'Bad Request'
      }));
    }

    return res.then(onfulfilled, onrejected);
  }

}

/***/ }),

/***/ 7114:
/*!************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/module/lib/version.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
// generated by genversion
const version = '0.37.4';

/***/ }),

/***/ 1895:
/*!***************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RealtimeChannel)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/constants */ 1019);
/* harmony import */ var _lib_push__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/push */ 9707);
/* harmony import */ var _lib_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/timer */ 3085);
/* harmony import */ var _RealtimePresence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RealtimePresence */ 3083);




class RealtimeChannel {
  constructor(topic, params = {}, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = [];
    this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.timeout = this.socket.timeout;
    this.joinPush = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new _lib_timer__WEBPACK_IMPORTED_MODULE_2__["default"](() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive('ok', () => {
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach(pushEvent => pushEvent.send());
      this.pushBuffer = [];
    });
    this.onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
      this.socket.remove(this);
    });
    this.onError(reason => {
      if (this.isLeaving() || this.isClosed()) {
        return;
      }

      this.socket.log('channel', `error ${this.topic}`, reason);
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive('timeout', () => {
      if (!this.isJoining()) {
        return;
      }

      this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
    this.presence = new _RealtimePresence__WEBPACK_IMPORTED_MODULE_3__["default"](this);
  }

  list() {
    return this.presence.list();
  }

  rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();

    if (this.socket.isConnected()) {
      this.rejoin();
    }
  }

  subscribe(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
    } else {
      const configs = this.bindings.reduce((acc, binding) => {
        const {
          type
        } = binding;

        if (!['phx_close', 'phx_error', 'phx_reply', 'presence_diff', 'presence_state'].includes(type)) {
          acc[type] = binding;
        }

        return acc;
      }, {});

      if (Object.keys(configs).length) {
        this.updateJoinPayload({
          configs
        });
      }

      this.joinedOnce = true;
      this.rejoin(timeout);
      return this.joinPush;
    }
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   */


  onClose(callback) {
    this.on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.close, {}, callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   */


  onError(callback) {
    this.on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.error, {}, reason => callback(reason));
  }

  on(type, filter, callback) {
    this.bindings.push({
      type,
      filter: filter !== null && filter !== void 0 ? filter : {},
      callback: callback !== null && callback !== void 0 ? callback : () => {}
    });
  }

  off(type, filter) {
    this.bindings = this.bindings.filter(bind => {
      return !(bind.type === type && RealtimeChannel.isEqual(bind.filter, filter));
    });
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   */


  canPush() {
    return this.socket.isConnected() && this.isJoined();
  }

  push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }

    let pushEvent = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, event, payload, timeout);

    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }

    return pushEvent;
  }

  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */


  unsubscribe(timeout = this.timeout) {
    this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.leaving;

    const onClose = () => {
      this.socket.log('channel', `leave ${this.topic}`);
      this.trigger(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.close, 'leave', this.joinRef());
    }; // Destroy joinPush to avoid connection timeouts during unscription phase


    this.joinPush.destroy();
    const leavePush = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.leave, {}, timeout);
    leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
    leavePush.send();

    if (!this.canPush()) {
      leavePush.trigger('ok', {});
    }

    return leavePush;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   */


  onMessage(event, payload, ref) {
    return payload;
  }

  isMember(topic) {
    return this.topic === topic;
  }

  joinRef() {
    return this.joinPush.ref;
  }

  rejoin(timeout = this.timeout) {
    if (this.isLeaving()) {
      return;
    }

    this.socket.leaveOpenTopic(this.topic);
    this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }

  trigger(type, payload, ref) {
    const {
      close,
      error,
      leave,
      join
    } = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS;
    const events = [close, error, leave, join];

    if (ref && events.indexOf(type) >= 0 && ref !== this.joinRef()) {
      return;
    }

    const handledPayload = this.onMessage(type, payload, ref);

    if (payload && !handledPayload) {
      throw 'channel onMessage callbacks must return the payload, modified or unmodified';
    }

    this.bindings.filter(bind => {
      var _a, _b;

      return (bind === null || bind === void 0 ? void 0 : bind.type) === type && (((_a = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _a === void 0 ? void 0 : _a.event) === '*' || ((_b = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _b === void 0 ? void 0 : _b.event) === (payload === null || payload === void 0 ? void 0 : payload.event));
    }).map(bind => bind.callback(handledPayload, ref));
  }

  send(payload) {
    const push = this.push(payload.type, payload);
    return new Promise((resolve, reject) => {
      push.receive('ok', () => resolve('ok'));
      push.receive('timeout', () => reject('timeout'));
    });
  }

  replyEventName(ref) {
    return `chan_reply_${ref}`;
  }

  isClosed() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
  }

  isErrored() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
  }

  isJoined() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joined;
  }

  isJoining() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joining;
  }

  isLeaving() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.leaving;
  }

  static isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }

    for (const k in obj1) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }

    return true;
  }

}

/***/ }),

/***/ 5973:
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RealtimeClient)
/* harmony export */ });
/* harmony import */ var websocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! websocket */ 2576);
/* harmony import */ var websocket__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(websocket__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/constants */ 1019);
/* harmony import */ var _lib_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/timer */ 3085);
/* harmony import */ var _lib_serializer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/serializer */ 409);
/* harmony import */ var _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RealtimeSubscription */ 4652);
/* harmony import */ var _RealtimeChannel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./RealtimeChannel */ 1895);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};








const noop = () => {};

class RealtimeClient {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket.
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers The optional headers to pass when connecting.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.longpollerTimeout The maximum timeout of a long poll AJAX request. Defaults to 20s (double the server long poll timer).
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   */
  constructor(endPoint, options) {
    this.accessToken = null;
    this.channels = [];
    this.endPoint = '';
    this.headers = _lib_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_HEADERS;
    this.params = {};
    this.timeout = _lib_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_TIMEOUT;
    this.transport = websocket__WEBPACK_IMPORTED_MODULE_0__.w3cwebsocket;
    this.heartbeatIntervalMs = 30000;
    this.longpollerTimeout = 20000;
    this.heartbeatTimer = undefined;
    this.pendingHeartbeatRef = null;
    this.ref = 0;
    this.logger = noop;
    this.conn = null;
    this.sendBuffer = [];
    this.serializer = new _lib_serializer__WEBPACK_IMPORTED_MODULE_3__["default"]();
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    this.endPoint = `${endPoint}/${_lib_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSPORTS.websocket}`;
    if (options === null || options === void 0 ? void 0 : options.params) this.params = options.params;
    if (options === null || options === void 0 ? void 0 : options.headers) this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
    if (options === null || options === void 0 ? void 0 : options.timeout) this.timeout = options.timeout;
    if (options === null || options === void 0 ? void 0 : options.logger) this.logger = options.logger;
    if (options === null || options === void 0 ? void 0 : options.transport) this.transport = options.transport;
    if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) this.heartbeatIntervalMs = options.heartbeatIntervalMs;
    if (options === null || options === void 0 ? void 0 : options.longpollerTimeout) this.longpollerTimeout = options.longpollerTimeout;
    this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs : tries => {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode : (payload, callback) => {
      return callback(JSON.stringify(payload));
    };
    this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer);
    this.reconnectTimer = new _lib_timer__WEBPACK_IMPORTED_MODULE_2__["default"](() => __awaiter(this, void 0, void 0, function* () {
      yield this.disconnect();
      this.connect();
    }), this.reconnectAfterMs);
  }
  /**
   * Connects the socket, unless already connected.
   */


  connect() {
    if (this.conn) {
      return;
    }

    this.conn = new this.transport(this.endPointURL(), [], null, this.headers);

    if (this.conn) {
      // this.conn.timeout = this.longpollerTimeout // TYPE ERROR
      this.conn.binaryType = 'arraybuffer';

      this.conn.onopen = () => this._onConnOpen();

      this.conn.onerror = error => this._onConnError(error);

      this.conn.onmessage = event => this.onConnMessage(event);

      this.conn.onclose = event => this._onConnClose(event);
    }
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */


  disconnect(code, reason) {
    return new Promise((resolve, _reject) => {
      try {
        if (this.conn) {
          this.conn.onclose = function () {}; // noop


          if (code) {
            this.conn.close(code, reason || '');
          } else {
            this.conn.close();
          }

          this.conn = null; // remove open handles

          this.heartbeatTimer && clearInterval(this.heartbeatTimer);
          this.reconnectTimer.reset();
        }

        resolve({
          error: null,
          data: true
        });
      } catch (error) {
        resolve({
          error: error,
          data: false
        });
      }
    });
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overriden.
   */


  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  /**
   * Registers a callback for connection state change event.
   *
   * @param callback A function to be called when the event occurs.
   *
   * @example
   *    socket.onOpen(() => console.log("Socket opened."))
   */


  onOpen(callback) {
    this.stateChangeCallbacks.open.push(callback);
  }
  /**
   * Registers a callback for connection state change events.
   *
   * @param callback A function to be called when the event occurs.
   *
   * @example
   *    socket.onOpen(() => console.log("Socket closed."))
   */


  onClose(callback) {
    this.stateChangeCallbacks.close.push(callback);
  }
  /**
   * Registers a callback for connection state change events.
   *
   * @param callback A function to be called when the event occurs.
   *
   * @example
   *    socket.onOpen((error) => console.log("An error occurred"))
   */


  onError(callback) {
    this.stateChangeCallbacks.error.push(callback);
  }
  /**
   * Calls a function any time a message is received.
   *
   * @param callback A function to be called when the event occurs.
   *
   * @example
   *    socket.onMessage((message) => console.log(message))
   */


  onMessage(callback) {
    this.stateChangeCallbacks.message.push(callback);
  }
  /**
   * Returns the current state of the socket.
   */


  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case _lib_constants__WEBPACK_IMPORTED_MODULE_1__.SOCKET_STATES.connecting:
        return _lib_constants__WEBPACK_IMPORTED_MODULE_1__.CONNECTION_STATE.Connecting;

      case _lib_constants__WEBPACK_IMPORTED_MODULE_1__.SOCKET_STATES.open:
        return _lib_constants__WEBPACK_IMPORTED_MODULE_1__.CONNECTION_STATE.Open;

      case _lib_constants__WEBPACK_IMPORTED_MODULE_1__.SOCKET_STATES.closing:
        return _lib_constants__WEBPACK_IMPORTED_MODULE_1__.CONNECTION_STATE.Closing;

      default:
        return _lib_constants__WEBPACK_IMPORTED_MODULE_1__.CONNECTION_STATE.Closed;
    }
  }
  /**
   * Retuns `true` is the connection is open.
   */


  isConnected() {
    return this.connectionState() === _lib_constants__WEBPACK_IMPORTED_MODULE_1__.CONNECTION_STATE.Open;
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   */


  remove(channel) {
    this.channels = this.channels.filter(c => c.joinRef() !== channel.joinRef());
  }

  channel(topic, chanParams = {}) {
    var _a;

    const {
      selfBroadcast
    } = chanParams,
          params = __rest(chanParams, ["selfBroadcast"]);

    if (selfBroadcast) {
      params.self_broadcast = selfBroadcast;
    }

    const chan = ((_a = this.params) === null || _a === void 0 ? void 0 : _a.vsndate) ? new _RealtimeChannel__WEBPACK_IMPORTED_MODULE_5__["default"](topic, params, this) : new _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_4__["default"](topic, params, this);

    if (chan instanceof _RealtimeChannel__WEBPACK_IMPORTED_MODULE_5__["default"]) {
      chan.presence.onJoin((key, currentPresences, newPresences) => {
        chan.trigger('presence', {
          event: 'JOIN',
          key,
          currentPresences,
          newPresences
        });
      });
      chan.presence.onLeave((key, currentPresences, leftPresences) => {
        chan.trigger('presence', {
          event: 'LEAVE',
          key,
          currentPresences,
          leftPresences
        });
      });
      chan.presence.onSync(() => {
        chan.trigger('presence', {
          event: 'SYNC'
        });
      });
    }

    this.channels.push(chan);
    return chan;
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */


  push(data) {
    const {
      topic,
      event,
      payload,
      ref
    } = data;

    let callback = () => {
      this.encode(data, result => {
        var _a;

        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
      });
    };

    this.log('push', `${topic} ${event} (${ref})`, payload);

    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }

  onConnMessage(rawMessage) {
    this.decode(rawMessage.data, msg => {
      let {
        topic,
        event,
        payload,
        ref
      } = msg;

      if (ref && ref === this.pendingHeartbeatRef || event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
        this.pendingHeartbeatRef = null;
      }

      this.log('receive', `${payload.status || ''} ${topic} ${event} ${ref && '(' + ref + ')' || ''}`, payload);
      this.channels.filter(channel => channel.isMember(topic)).forEach(channel => channel.trigger(event, payload, ref));
      this.stateChangeCallbacks.message.forEach(callback => callback(msg));
    });
  }
  /**
   * Returns the URL of the websocket.
   */


  endPointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, {
      vsn: _lib_constants__WEBPACK_IMPORTED_MODULE_1__.VSN
    }));
  }
  /**
   * Return the next message ref, accounting for overflows
   */


  makeRef() {
    let newRef = this.ref + 1;

    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }

    return this.ref.toString();
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * @param token A JWT string.
   */


  setAuth(token) {
    this.accessToken = token;
    this.channels.forEach(channel => {
      token && channel.updateJoinPayload({
        user_token: token
      });

      if (channel.joinedOnce && channel.isJoined()) {
        channel.push(_lib_constants__WEBPACK_IMPORTED_MODULE_1__.CHANNEL_EVENTS.access_token, {
          access_token: token
        });
      }
    });
  }
  /**
   * Unsubscribe from channels with the specified topic.
   */


  leaveOpenTopic(topic) {
    let dupChannel = this.channels.find(c => c.topic === topic && (c.isJoined() || c.isJoining()));

    if (dupChannel) {
      this.log('transport', `leaving duplicate topic "${topic}"`);
      dupChannel.unsubscribe();
    }
  }

  _onConnOpen() {
    this.log('transport', `connected to ${this.endPointURL()}`);

    this._flushSendBuffer();

    this.reconnectTimer.reset();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
    this.stateChangeCallbacks.open.forEach(callback => callback());
  }

  _onConnClose(event) {
    this.log('transport', 'close', event);

    this._triggerChanError();

    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnectTimer.scheduleTimeout();
    this.stateChangeCallbacks.close.forEach(callback => callback(event));
  }

  _onConnError(error) {
    this.log('transport', error.message);

    this._triggerChanError();

    this.stateChangeCallbacks.error.forEach(callback => callback(error));
  }

  _triggerChanError() {
    this.channels.forEach(channel => channel.trigger(_lib_constants__WEBPACK_IMPORTED_MODULE_1__.CHANNEL_EVENTS.error));
  }

  _appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }

    const prefix = url.match(/\?/) ? '&' : '?';
    const query = new URLSearchParams(params);
    return `${url}${prefix}${query}`;
  }

  _flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach(callback => callback());
      this.sendBuffer = [];
    }
  }

  _sendHeartbeat() {
    var _a;

    if (!this.isConnected()) {
      return;
    }

    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(_lib_constants__WEBPACK_IMPORTED_MODULE_1__.WS_CLOSE_NORMAL, 'hearbeat timeout');
      return;
    }

    this.pendingHeartbeatRef = this.makeRef();
    this.push({
      topic: 'phoenix',
      event: 'heartbeat',
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.setAuth(this.accessToken);
  }

}

/***/ }),

/***/ 3083:
/*!****************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RealtimePresence)
/* harmony export */ });
/*
  This file draws heavily from https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/assets/js/phoenix/presence.js
  License: https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/LICENSE.md
*/
class RealtimePresence {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeSubscription
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.state = {};
    this.pendingDiffs = [];
    this.joinRef = null;
    this.caller = {
      onJoin: () => {},
      onLeave: () => {},
      onSync: () => {}
    };
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: 'presence_state',
      diff: 'presence_diff'
    };
    this.channel.on(events.state, {}, newState => {
      const {
        onJoin,
        onLeave,
        onSync
      } = this.caller;
      this.joinRef = this.channel.joinRef();
      this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach(diff => {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel.on(events.diff, {}, diff => {
      const {
        onJoin,
        onLeave,
        onSync
      } = this.caller;

      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   */


  static syncState(currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState);
    const transformedState = this.transformState(newState);
    const joins = {};
    const leaves = {};
    this.map(state, (key, presences) => {
      if (!transformedState[key]) {
        leaves[key] = presences;
      }
    });
    this.map(transformedState, (key, newPresences) => {
      const currentPresences = state[key];

      if (currentPresences) {
        const newPresenceIds = newPresences.map(m => m.presence_id);
        const curPresenceIds = currentPresences.map(m => m.presence_id);
        const joinedPresences = newPresences.filter(m => curPresenceIds.indexOf(m.presence_id) < 0);
        const leftPresences = currentPresences.filter(m => newPresenceIds.indexOf(m.presence_id) < 0);

        if (joinedPresences.length > 0) {
          joins[key] = joinedPresences;
        }

        if (leftPresences.length > 0) {
          leaves[key] = leftPresences;
        }
      } else {
        joins[key] = newPresences;
      }
    });
    return this.syncDiff(state, {
      joins,
      leaves
    }, onJoin, onLeave);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   */


  static syncDiff(state, diff, onJoin, onLeave) {
    const {
      joins,
      leaves
    } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    };

    if (!onJoin) {
      onJoin = () => {};
    }

    if (!onLeave) {
      onLeave = () => {};
    }

    this.map(joins, (key, newPresences) => {
      const currentPresences = state[key];
      state[key] = this.cloneDeep(newPresences);

      if (currentPresences) {
        const joinedPresenceIds = state[key].map(m => m.presence_id);
        const curPresences = currentPresences.filter(m => joinedPresenceIds.indexOf(m.presence_id) < 0);
        state[key].unshift(...curPresences);
      }

      onJoin(key, currentPresences, newPresences);
    });
    this.map(leaves, (key, leftPresences) => {
      let currentPresences = state[key];
      if (!currentPresences) return;
      const presenceIdsToRemove = leftPresences.map(m => m.presence_id);
      currentPresences = currentPresences.filter(m => presenceIdsToRemove.indexOf(m.presence_id) < 0);
      state[key] = currentPresences;
      onLeave(key, currentPresences, leftPresences);
      if (currentPresences.length === 0) delete state[key];
    });
    return state;
  }
  /**
   * Returns the array of presences, with selected metadata.
   */


  static list(presences, chooser) {
    if (!chooser) {
      chooser = (_key, pres) => pres;
    }

    return this.map(presences, (key, presences) => chooser(key, presences));
  }

  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map(key => func(key, obj[key]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_id'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_id: '2', user_id: 1 },
   *    { presence_id: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   */


  static transformState(state) {
    state = this.cloneDeep(state);
    return Object.getOwnPropertyNames(state).reduce((newState, key) => {
      const presences = state[key];

      if ('metas' in presences) {
        newState[key] = presences.metas.map(presence => {
          presence['presence_id'] = presence['phx_ref'];
          delete presence['phx_ref'];
          delete presence['phx_ref_prev'];
          return presence;
        });
      } else {
        newState[key] = presences;
      }

      return newState;
    }, {});
  }

  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  onJoin(callback) {
    this.caller.onJoin = callback;
  }

  onLeave(callback) {
    this.caller.onLeave = callback;
  }

  onSync(callback) {
    this.caller.onSync = callback;
  }

  list(by) {
    return RealtimePresence.list(this.state, by);
  }

  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel.joinRef();
  }

}

/***/ }),

/***/ 4652:
/*!********************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimeSubscription.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RealtimeSubscription)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/constants */ 1019);
/* harmony import */ var _lib_push__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/push */ 9707);
/* harmony import */ var _lib_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/timer */ 3085);



class RealtimeSubscription {
  constructor(topic, params = {}, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = [];
    this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.timeout = this.socket.timeout;
    this.joinPush = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new _lib_timer__WEBPACK_IMPORTED_MODULE_2__["default"](() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive('ok', () => {
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach(pushEvent => pushEvent.send());
      this.pushBuffer = [];
    });
    this.onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
      this.socket.remove(this);
    });
    this.onError(reason => {
      if (this.isLeaving() || this.isClosed()) {
        return;
      }

      this.socket.log('channel', `error ${this.topic}`, reason);
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive('timeout', () => {
      if (!this.isJoining()) {
        return;
      }

      this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
  }

  rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();

    if (this.socket.isConnected()) {
      this.rejoin();
    }
  }

  subscribe(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
    } else {
      this.joinedOnce = true;
      this.rejoin(timeout);
      return this.joinPush;
    }
  }

  onClose(callback) {
    this.on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.close, callback);
  }

  onError(callback) {
    this.on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.error, reason => callback(reason));
  }

  on(event, callback) {
    this.bindings.push({
      event,
      callback
    });
  }

  off(event) {
    this.bindings = this.bindings.filter(bind => bind.event !== event);
  }

  canPush() {
    return this.socket.isConnected() && this.isJoined();
  }

  push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }

    let pushEvent = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, event, payload, timeout);

    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }

    return pushEvent;
  }

  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */


  unsubscribe(timeout = this.timeout) {
    this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.leaving;

    let onClose = () => {
      this.socket.log('channel', `leave ${this.topic}`);
      this.trigger(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.close, 'leave', this.joinRef());
    }; // Destroy joinPush to avoid connection timeouts during unscription phase


    this.joinPush.destroy();
    let leavePush = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.leave, {}, timeout);
    leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
    leavePush.send();

    if (!this.canPush()) {
      leavePush.trigger('ok', {});
    }

    return leavePush;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   */


  onMessage(event, payload, ref) {
    return payload;
  }

  isMember(topic) {
    return this.topic === topic;
  }

  joinRef() {
    return this.joinPush.ref;
  }

  rejoin(timeout = this.timeout) {
    if (this.isLeaving()) {
      return;
    }

    this.socket.leaveOpenTopic(this.topic);
    this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }

  trigger(event, payload, ref) {
    let {
      close,
      error,
      leave,
      join
    } = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS;
    let events = [close, error, leave, join];

    if (ref && events.indexOf(event) >= 0 && ref !== this.joinRef()) {
      return;
    }

    let handledPayload = this.onMessage(event, payload, ref);

    if (payload && !handledPayload) {
      throw 'channel onMessage callbacks must return the payload, modified or unmodified';
    }

    this.bindings.filter(bind => {
      // Bind all events if the user specifies a wildcard.
      if (bind.event === '*') {
        return event === (payload === null || payload === void 0 ? void 0 : payload.type);
      } else {
        return bind.event === event;
      }
    }).map(bind => bind.callback(handledPayload, ref));
  }

  replyEventName(ref) {
    return `chan_reply_${ref}`;
  }

  isClosed() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
  }

  isErrored() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
  }

  isJoined() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joined;
  }

  isJoining() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joining;
  }

  isLeaving() {
    return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.leaving;
  }

}

/***/ }),

/***/ 3264:
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RealtimeChannel": () => (/* reexport safe */ _RealtimeChannel__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "RealtimeClient": () => (/* reexport safe */ _RealtimeClient__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "RealtimePresence": () => (/* reexport safe */ _RealtimePresence__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "RealtimeSubscription": () => (/* reexport safe */ _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "Transformers": () => (/* reexport module object */ _lib_transformers__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _lib_transformers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/transformers */ 2381);
/* harmony import */ var _RealtimeClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RealtimeClient */ 5973);
/* harmony import */ var _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RealtimeSubscription */ 4652);
/* harmony import */ var _RealtimeChannel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RealtimeChannel */ 1895);
/* harmony import */ var _RealtimePresence__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RealtimePresence */ 3083);







/***/ }),

/***/ 1019:
/*!*************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/constants.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHANNEL_EVENTS": () => (/* binding */ CHANNEL_EVENTS),
/* harmony export */   "CHANNEL_STATES": () => (/* binding */ CHANNEL_STATES),
/* harmony export */   "CONNECTION_STATE": () => (/* binding */ CONNECTION_STATE),
/* harmony export */   "DEFAULT_HEADERS": () => (/* binding */ DEFAULT_HEADERS),
/* harmony export */   "DEFAULT_TIMEOUT": () => (/* binding */ DEFAULT_TIMEOUT),
/* harmony export */   "SOCKET_STATES": () => (/* binding */ SOCKET_STATES),
/* harmony export */   "TRANSPORTS": () => (/* binding */ TRANSPORTS),
/* harmony export */   "VSN": () => (/* binding */ VSN),
/* harmony export */   "WS_CLOSE_NORMAL": () => (/* binding */ WS_CLOSE_NORMAL)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ 769);

const DEFAULT_HEADERS = {
  'X-Client-Info': `realtime-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}`
};
const VSN = '1.0.0';
const DEFAULT_TIMEOUT = 10000;
const WS_CLOSE_NORMAL = 1000;
var SOCKET_STATES;

(function (SOCKET_STATES) {
  SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
  SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
  SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
  SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));

var CHANNEL_STATES;

(function (CHANNEL_STATES) {
  CHANNEL_STATES["closed"] = "closed";
  CHANNEL_STATES["errored"] = "errored";
  CHANNEL_STATES["joined"] = "joined";
  CHANNEL_STATES["joining"] = "joining";
  CHANNEL_STATES["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));

var CHANNEL_EVENTS;

(function (CHANNEL_EVENTS) {
  CHANNEL_EVENTS["close"] = "phx_close";
  CHANNEL_EVENTS["error"] = "phx_error";
  CHANNEL_EVENTS["join"] = "phx_join";
  CHANNEL_EVENTS["reply"] = "phx_reply";
  CHANNEL_EVENTS["leave"] = "phx_leave";
  CHANNEL_EVENTS["access_token"] = "access_token";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));

var TRANSPORTS;

(function (TRANSPORTS) {
  TRANSPORTS["websocket"] = "websocket";
})(TRANSPORTS || (TRANSPORTS = {}));

var CONNECTION_STATE;

(function (CONNECTION_STATE) {
  CONNECTION_STATE["Connecting"] = "connecting";
  CONNECTION_STATE["Open"] = "open";
  CONNECTION_STATE["Closing"] = "closing";
  CONNECTION_STATE["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));

/***/ }),

/***/ 9707:
/*!********************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/push.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Push)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/constants */ 1019);
/* harmony import */ var _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../RealtimeSubscription */ 4652);


class Push {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(channel, event, payload = {}, timeout = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_TIMEOUT) {
    this.channel = channel;
    this.event = event;
    this.payload = payload;
    this.timeout = timeout;
    this.sent = false;
    this.timeoutTimer = undefined;
    this.ref = '';
    this.receivedResp = null;
    this.recHooks = [];
    this.refEvent = null;
  }

  resend(timeout) {
    this.timeout = timeout;

    this._cancelRefEvent();

    this.ref = '';
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }

  send() {
    if (this._hasReceived('timeout')) {
      return;
    }

    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref
    });
  }

  updatePayload(payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload);
  }

  receive(status, callback) {
    var _a;

    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
    }

    this.recHooks.push({
      status,
      callback
    });
    return this;
  }

  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }

    this.ref = this.channel.socket.makeRef();
    this.refEvent = this.channel.replyEventName(this.ref);

    const callback = payload => {
      this._cancelRefEvent();

      this._cancelTimeout();

      this.receivedResp = payload;

      this._matchReceive(payload);
    };

    if (this.channel instanceof _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.channel.on(this.refEvent, callback);
    } else {
      this.channel.on(this.refEvent, {}, callback);
    }

    this.timeoutTimer = setTimeout(() => {
      this.trigger('timeout', {});
    }, this.timeout);
  }

  trigger(status, response) {
    if (this.refEvent) this.channel.trigger(this.refEvent, {
      status,
      response
    });
  }

  destroy() {
    this._cancelRefEvent();

    this._cancelTimeout();
  }

  _cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }

    if (this.channel instanceof _RealtimeSubscription__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.channel.off(this.refEvent);
    } else {
      this.channel.off(this.refEvent, {});
    }
  }

  _cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = undefined;
  }

  _matchReceive({
    status,
    response
  }) {
    this.recHooks.filter(h => h.status === status).forEach(h => h.callback(response));
  }

  _hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }

}

/***/ }),

/***/ 409:
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/serializer.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Serializer)
/* harmony export */ });
// This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
// License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
class Serializer {
  constructor() {
    this.HEADER_LENGTH = 1;
  }

  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload));
    }

    if (typeof rawPayload === 'string') {
      return callback(JSON.parse(rawPayload));
    }

    return callback({});
  }

  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    return this._decodeBroadcast(buffer, view, decoder);
  }

  _decodeBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
    return {
      ref: null,
      topic: topic,
      event: event,
      payload: data
    };
  }

}

/***/ }),

/***/ 3085:
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/timer.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
/**
 * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
 *
 * @example
 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *      return [1000, 5000, 10000][tries - 1] || 10000
 *    })
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 *    reconnectTimer.scheduleTimeout() // fires after 5000
 *    reconnectTimer.reset()
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 */
class Timer {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = undefined;
    this.tries = 0;
    this.callback = callback;
    this.timerCalc = timerCalc;
  }

  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  } // Cancels any previous scheduleTimeout and schedules callback


  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }

}

/***/ }),

/***/ 2381:
/*!****************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/transformers.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PostgresTypes": () => (/* binding */ PostgresTypes),
/* harmony export */   "convertCell": () => (/* binding */ convertCell),
/* harmony export */   "convertChangeData": () => (/* binding */ convertChangeData),
/* harmony export */   "convertColumn": () => (/* binding */ convertColumn),
/* harmony export */   "toArray": () => (/* binding */ toArray),
/* harmony export */   "toBoolean": () => (/* binding */ toBoolean),
/* harmony export */   "toJson": () => (/* binding */ toJson),
/* harmony export */   "toNumber": () => (/* binding */ toNumber),
/* harmony export */   "toTimestampString": () => (/* binding */ toTimestampString)
/* harmony export */ });
/**
 * Helpers to convert the change Payload into native JS types.
 */
// Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
// 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
var PostgresTypes;

(function (PostgresTypes) {
  PostgresTypes["abstime"] = "abstime";
  PostgresTypes["bool"] = "bool";
  PostgresTypes["date"] = "date";
  PostgresTypes["daterange"] = "daterange";
  PostgresTypes["float4"] = "float4";
  PostgresTypes["float8"] = "float8";
  PostgresTypes["int2"] = "int2";
  PostgresTypes["int4"] = "int4";
  PostgresTypes["int4range"] = "int4range";
  PostgresTypes["int8"] = "int8";
  PostgresTypes["int8range"] = "int8range";
  PostgresTypes["json"] = "json";
  PostgresTypes["jsonb"] = "jsonb";
  PostgresTypes["money"] = "money";
  PostgresTypes["numeric"] = "numeric";
  PostgresTypes["oid"] = "oid";
  PostgresTypes["reltime"] = "reltime";
  PostgresTypes["text"] = "text";
  PostgresTypes["time"] = "time";
  PostgresTypes["timestamp"] = "timestamp";
  PostgresTypes["timestamptz"] = "timestamptz";
  PostgresTypes["timetz"] = "timetz";
  PostgresTypes["tsrange"] = "tsrange";
  PostgresTypes["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
/**
 * Takes an array of columns and an object of string values then converts each string value
 * to its mapped type.
 *
 * @param {{name: String, type: String}[]} columns
 * @param {Object} record
 * @param {Object} options The map of various options that can be applied to the mapper
 * @param {Array} options.skipTypes The array of types that should not be converted
 *
 * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
 * //=>{ first_name: 'Paul', age: 33 }
 */


const convertChangeData = (columns, record, options = {}) => {
  var _a;

  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
/**
 * Converts the value of an individual column.
 *
 * @param {String} columnName The column that you want to convert
 * @param {{name: String, type: String}[]} columns All of the columns
 * @param {Object} record The map of string values
 * @param {Array} skipTypes An array of types that should not be converted
 * @return {object} Useless information
 *
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
 * //=> 33
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
 * //=> "33"
 */

const convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find(x => x.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];

  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }

  return noop(value);
};
/**
 * If the value of the cell is `null`, returns null.
 * Otherwise converts the string value to the correct type.
 * @param {String} type A postgres column type
 * @param {String} stringValue The cell value
 *
 * @example convertCell('bool', 't')
 * //=> true
 * @example convertCell('int8', '10')
 * //=> 10
 * @example convertCell('_int4', '{1,2,3,4}')
 * //=> [1,2,3,4]
 */

const convertCell = (type, value) => {
  // if data type is an array
  if (type.charAt(0) === '_') {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  } // If not null, convert to correct type.


  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);

    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);

    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);

    case PostgresTypes.timestamp:
      return toTimestampString(value);
    // Format to be consistent with PostgREST

    case PostgresTypes.abstime: // To allow users to cast it based on Timezone

    case PostgresTypes.date: // To allow users to cast it based on Timezone

    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime: // To allow users to cast it based on Timezone

    case PostgresTypes.text:
    case PostgresTypes.time: // To allow users to cast it based on Timezone

    case PostgresTypes.timestamptz: // To allow users to cast it based on Timezone

    case PostgresTypes.timetz: // To allow users to cast it based on Timezone

    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop(value);

    default:
      // Return the value for remaining types
      return noop(value);
  }
};

const noop = value => {
  return value;
};

const toBoolean = value => {
  switch (value) {
    case 't':
      return true;

    case 'f':
      return false;

    default:
      return value;
  }
};
const toNumber = value => {
  if (typeof value === 'string') {
    const parsedValue = parseFloat(value);

    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }

  return value;
};
const toJson = value => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      return value;
    }
  }

  return value;
};
/**
 * Converts a Postgres Array into a native JS array
 *
 * @example toArray('{}', 'int4')
 * //=> []
 * @example toArray('{"[2021-01-01,2021-12-31)","(2021-01-01,2021-12-32]"}', 'daterange')
 * //=> ['[2021-01-01,2021-12-31)', '(2021-01-01,2021-12-32]']
 * @example toArray([1,2,3,4], 'int4')
 * //=> [1,2,3,4]
 */

const toArray = (value, type) => {
  if (typeof value !== 'string') {
    return value;
  }

  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0]; // Confirm value is a Postgres array by checking curly brackets

  if (openBrace === '{' && closeBrace === '}') {
    let arr;
    const valTrim = value.slice(1, lastIdx); // TODO: find a better solution to separate Postgres array data

    try {
      arr = JSON.parse('[' + valTrim + ']');
    } catch (_) {
      // WARNING: splitting on comma does not cover all edge cases
      arr = valTrim ? valTrim.split(',') : [];
    }

    return arr.map(val => convertCell(type, val));
  }

  return value;
};
/**
 * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
 * See https://github.com/supabase/supabase/issues/18
 *
 * @example toTimestampString('2019-09-10 00:00:00')
 * //=> '2019-09-10T00:00:00'
 */

const toTimestampString = value => {
  if (typeof value === 'string') {
    return value.replace(' ', 'T');
  }

  return value;
};

/***/ }),

/***/ 769:
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/version.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
const version = '1.7.2';

/***/ }),

/***/ 3011:
/*!************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/StorageClient.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageClient": () => (/* binding */ StorageClient)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib */ 2076);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib */ 81);

class StorageClient extends _lib__WEBPACK_IMPORTED_MODULE_0__.StorageBucketApi {
  constructor(url, headers = {}, fetch) {
    super(url, headers, fetch);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */


  from(id) {
    return new _lib__WEBPACK_IMPORTED_MODULE_1__.StorageFileApi(this.url, this.headers, id, this.fetch);
  }

}

/***/ }),

/***/ 2076:
/*!*******************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/StorageBucketApi.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageBucketApi": () => (/* binding */ StorageBucketApi)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ 4516);
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch */ 3879);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ 6612);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};




class StorageBucketApi {
  constructor(url, headers = {}, fetch) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, _constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HEADERS), headers);
    this.fetch = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.resolveFetch)(fetch);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */


  listBuckets() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.get)(this.fetch, `${this.url}/bucket`, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */


  getBucket(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.get)(this.fetch, `${this.url}/bucket/${id}`, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @returns newly created bucket id
   */


  createBucket(id, options = {
    public: false
  }) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/bucket`, {
          id,
          name: id,
          public: options.public
        }, {
          headers: this.headers
        });
        return {
          data: data.name,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Updates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   */


  updateBucket(id, options) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.put)(this.fetch, `${this.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */


  emptyBucket(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/bucket/${id}/empty`, {}, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */


  deleteBucket(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_2__.remove)(this.fetch, `${this.url}/bucket/${id}`, {}, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }

}

/***/ }),

/***/ 81:
/*!*****************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/StorageFileApi.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageFileApi": () => (/* binding */ StorageFileApi)
/* harmony export */ });
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fetch */ 3879);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ 6612);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};



const DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: 'name',
    order: 'asc'
  }
};
const DEFAULT_FILE_OPTIONS = {
  cacheControl: '3600',
  contentType: 'text/plain;charset=UTF-8',
  upsert: false
};
class StorageFileApi {
  constructor(url, headers = {}, bucketId, fetch) {
    this.url = url;
    this.headers = headers;
    this.bucketId = bucketId;
    this.fetch = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.resolveFetch)(fetch);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   * @param fileOptions HTTP headers.
   * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
   * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
   * `upsert`: boolean, whether to perform an upsert.
   */


  uploadOrUpdate(method, path, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let body;
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), method === 'POST' && {
          'x-upsert': String(options.upsert)
        });

        if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
          body = new FormData();
          body.append('cacheControl', options.cacheControl);
          body.append('', fileBody);
        } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
          body = fileBody;
          body.append('cacheControl', options.cacheControl);
        } else {
          body = fileBody;
          headers['cache-control'] = `max-age=${options.cacheControl}`;
          headers['content-type'] = options.contentType;
        }

        const cleanPath = this._removeEmptyFolders(path);

        const _path = this._getFinalPath(cleanPath);

        const res = yield this.fetch(`${this.url}/object/${_path}`, {
          method,
          body: body,
          headers
        });

        if (res.ok) {
          // const data = await res.json()
          // temporary fix till backend is updated to the latest storage-api version
          return {
            data: {
              Key: _path
            },
            error: null
          };
        } else {
          const error = yield res.json();
          return {
            data: null,
            error
          };
        }
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   * @param fileOptions HTTP headers.
   * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
   * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
   * `upsert`: boolean, whether to perform an upsert.
   */


  upload(path, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   * @param fileOptions HTTP headers.
   * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
   * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
   * `upsert`: boolean, whether to perform an upsert.
   */


  update(path, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
    });
  }
  /**
   * Moves an existing file.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   */


  move(fromPath, toPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.post)(this.fetch, `${this.url}/object/move`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Copies an existing file.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   */


  copy(fromPath, toPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.post)(this.fetch, `${this.url}/object/copy`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Create signed URL to download file without requiring permissions. This URL can be valid for a set number of seconds.
   *
   * @param path The file path to be downloaded, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   */


  createSignedUrl(path, expiresIn) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const _path = this._getFinalPath(path);

        let data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.post)(this.fetch, `${this.url}/object/sign/${_path}`, {
          expiresIn
        }, {
          headers: this.headers
        });
        const signedURL = `${this.url}${data.signedURL}`;
        data = {
          signedURL
        };
        return {
          data,
          error: null,
          signedURL
        };
      } catch (error) {
        return {
          data: null,
          error,
          signedURL: null
        };
      }
    });
  }
  /**
   * Create signed URLs to download files without requiring permissions. These URLs can be valid for a set number of seconds.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   */


  createSignedUrls(paths, expiresIn) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.post)(this.fetch, `${this.url}/object/sign/${this.bucketId}`, {
          expiresIn,
          paths
        }, {
          headers: this.headers
        });
        return {
          data: data.map(datum => Object.assign(Object.assign({}, datum), {
            signedURL: datum.signedURL ? `${this.url}${datum.signedURL}` : null
          })),
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Downloads a file.
   *
   * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
   */


  download(path) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const _path = this._getFinalPath(path);

        const res = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.get)(this.fetch, `${this.url}/object/${_path}`, {
          headers: this.headers,
          noResolveJson: true
        });
        const data = yield res.blob();
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Retrieve URLs for assets in public buckets
   *
   * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
   */


  getPublicUrl(path) {
    try {
      const _path = this._getFinalPath(path);

      const publicURL = `${this.url}/object/public/${_path}`;
      const data = {
        publicURL
      };
      return {
        data,
        error: null,
        publicURL
      };
    } catch (error) {
      return {
        data: null,
        error,
        publicURL: null
      };
    }
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to be deleted, including the path and file name. For example [`folder/image.png`].
   */


  remove(paths) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.remove)(this.fetch, `${this.url}/object/${this.bucketId}`, {
          prefixes: paths
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(id: string): Promise<{ data: Metadata | null; error: Error | null }> {
  //   try {
  //     const data = await get(`${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     return { data: null, error }
  //   }
  // }

  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<{ data: Metadata | null; error: Error | null }> {
  //   try {
  //     const data = await post(`${this.url}/metadata/${id}`, { ...meta }, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     return { data: null, error }
  //   }
  // }

  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   * @param options Search options, including `limit`, `offset`, and `sortBy`.
   * @param parameters Fetch parameters, currently only supports `signal`, which is an AbortController's signal
   */


  list(path, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), {
          prefix: path || ''
        });
        const data = yield (0,_fetch__WEBPACK_IMPORTED_MODULE_1__.post)(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, {
          headers: this.headers
        }, parameters);
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }

  _getFinalPath(path) {
    return `${this.bucketId}/${path}`;
  }

  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
  }

}

/***/ }),

/***/ 4516:
/*!************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/constants.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_HEADERS": () => (/* binding */ DEFAULT_HEADERS)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ 7157);

const DEFAULT_HEADERS = {
  'X-Client-Info': `storage-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}`
};

/***/ }),

/***/ 3879:
/*!********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/fetch.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "post": () => (/* binding */ post),
/* harmony export */   "put": () => (/* binding */ put),
/* harmony export */   "remove": () => (/* binding */ remove)
/* harmony export */ });
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const _getErrorMessage = err => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);

const handleError = (error, reject) => {
  if (typeof error.json !== 'function') {
    return reject(error);
  }

  error.json().then(err => {
    return reject({
      message: _getErrorMessage(err),
      status: (error === null || error === void 0 ? void 0 : error.status) || 500
    });
  });
};

const _getRequestParams = (method, options, parameters, body) => {
  const params = {
    method,
    headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
  };

  if (method === 'GET') {
    return params;
  }

  params.headers = Object.assign({
    'Content-Type': 'application/json'
  }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};

function _handleRequest(fetcher, method, url, options, parameters, body) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then(result => {
        if (!result.ok) throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) return resolve(result);
        return result.json();
      }).then(data => resolve(data)).catch(error => handleError(error, reject));
    });
  });
}

function get(fetcher, url, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'GET', url, options, parameters);
  });
}
function post(fetcher, url, body, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'POST', url, options, parameters, body);
  });
}
function put(fetcher, url, body, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
  });
}
function remove(fetcher, url, body, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
  });
}

/***/ }),

/***/ 6612:
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/helpers.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resolveFetch": () => (/* binding */ resolveFetch)
/* harmony export */ });
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const resolveFetch = customFetch => {
  let _fetch;

  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => __awaiter(void 0, void 0, void 0, function* () {
      return yield (yield __webpack_require__.e(/*! import() */ "node_modules_cross-fetch_dist_browser-ponyfill_js").then(__webpack_require__.t.bind(__webpack_require__, /*! cross-fetch */ 9119, 23))).fetch(...args);
    });
  } else {
    _fetch = fetch;
  }

  return (...args) => _fetch(...args);
};

/***/ }),

/***/ 7157:
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/version.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
// generated by genversion
const version = '0.0.0';

/***/ }),

/***/ 6674:
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SupabaseClient)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/constants */ 7162);
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/helpers */ 8421);
/* harmony import */ var _lib_SupabaseAuthClient__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/SupabaseAuthClient */ 9085);
/* harmony import */ var _lib_SupabaseQueryBuilder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/SupabaseQueryBuilder */ 5653);
/* harmony import */ var _supabase_storage_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @supabase/storage-js */ 3011);
/* harmony import */ var _supabase_functions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @supabase/functions-js */ 3444);
/* harmony import */ var _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/postgrest-js */ 7436);
/* harmony import */ var _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/realtime-js */ 3264);
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};









const DEFAULT_OPTIONS = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  multiTab: true,
  headers: _lib_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_HEADERS
};
/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */

class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.headers Any additional headers to send with each network request.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.multiTab Set to "false" if you want to disable multi-tab/window events.
   * @param options.fetch A custom fetch implementation.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl) throw new Error('supabaseUrl is required.');
    if (!supabaseKey) throw new Error('supabaseKey is required.');

    const _supabaseUrl = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.stripTrailingSlash)(supabaseUrl);

    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.restUrl = `${_supabaseUrl}/rest/v1`;
    this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace('http', 'ws');
    this.authUrl = `${_supabaseUrl}/auth/v1`;
    this.storageUrl = `${_supabaseUrl}/storage/v1`;

    const isPlatform = _supabaseUrl.match(/(supabase\.co)|(supabase\.in)/);

    if (isPlatform) {
      const urlParts = _supabaseUrl.split('.');

      this.functionsUrl = `${urlParts[0]}.functions.${urlParts[1]}.${urlParts[2]}`;
    } else {
      this.functionsUrl = `${_supabaseUrl}/functions/v1`;
    }

    this.schema = settings.schema;
    this.multiTab = settings.multiTab;
    this.fetch = settings.fetch;
    this.headers = Object.assign(Object.assign({}, _lib_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_HEADERS), options === null || options === void 0 ? void 0 : options.headers);
    this.shouldThrowOnError = settings.shouldThrowOnError || false;
    this.auth = this._initSupabaseAuthClient(settings);
    this.realtime = this._initRealtimeClient(Object.assign({
      headers: this.headers
    }, settings.realtime));

    this._listenForAuthEvents();

    this._listenForMultiTabEvents(); // In the future we might allow the user to pass in a logger to receive these events.
    // this.realtime.onOpen(() => console.log('OPEN'))
    // this.realtime.onClose(() => console.log('CLOSED'))
    // this.realtime.onError((e: Error) => console.log('Socket error', e))

  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */


  get functions() {
    return new _supabase_functions_js__WEBPACK_IMPORTED_MODULE_4__.FunctionsClient(this.functionsUrl, {
      headers: this._getAuthHeaders(),
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */


  get storage() {
    return new _supabase_storage_js__WEBPACK_IMPORTED_MODULE_5__.StorageClient(this.storageUrl, this._getAuthHeaders(), this.fetch);
  }
  /**
   * Perform a table operation.
   *
   * @param table The table name to operate on.
   */


  from(table) {
    const url = `${this.restUrl}/${table}`;
    return new _lib_SupabaseQueryBuilder__WEBPACK_IMPORTED_MODULE_6__.SupabaseQueryBuilder(url, {
      headers: this._getAuthHeaders(),
      schema: this.schema,
      realtime: this.realtime,
      table,
      fetch: this.fetch,
      shouldThrowOnError: this.shouldThrowOnError
    });
  }
  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param params  The parameters to pass to the function call.
   * @param head   When set to true, no data will be returned.
   * @param count  Count algorithm to use to count rows in a table.
   *
   */


  rpc(fn, params, {
    head = false,
    count = null
  } = {}) {
    const rest = this._initPostgRESTClient();

    return rest.rpc(fn, params, {
      head,
      count
    });
  }
  /**
   * Creates a channel with Broadcast and Presence.
   * Activated when vsndate query param is present in the WebSocket URL.
   */


  channel(name, opts) {
    var _a, _b;

    const userToken = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;

    if (!this.realtime.isConnected()) {
      this.realtime.connect();
    }

    return this.realtime.channel(name, Object.assign(Object.assign({}, opts), {
      user_token: userToken
    }));
  }
  /**
   * Closes and removes all subscriptions and returns a list of removed
   * subscriptions and their errors.
   */


  removeAllSubscriptions() {
    return __awaiter(this, void 0, void 0, function* () {
      const allSubs = this.getSubscriptions().slice();
      const allSubPromises = allSubs.map(sub => this.removeSubscription(sub));
      const allRemovedSubs = yield Promise.all(allSubPromises);
      return allRemovedSubs.map(({
        error
      }, i) => {
        return {
          data: {
            subscription: allSubs[i]
          },
          error
        };
      });
    });
  }
  /**
   * Closes and removes a channel and returns the number of open channels.
   *
   * @param channel The channel you want to close and remove.
   */


  removeChannel(channel) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        error
      } = yield this._closeSubscription(channel);
      const allChans = this.getSubscriptions();
      const openChanCount = allChans.filter(chan => chan.isJoined()).length;
      if (allChans.length === 0) yield this.realtime.disconnect();
      return {
        data: {
          openChannels: openChanCount
        },
        error
      };
    });
  }
  /**
   * Closes and removes a subscription and returns the number of open subscriptions.
   *
   * @param subscription The subscription you want to close and remove.
   */


  removeSubscription(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        error
      } = yield this._closeSubscription(subscription);
      const allSubs = this.getSubscriptions();
      const openSubCount = allSubs.filter(chan => chan.isJoined()).length;
      if (allSubs.length === 0) yield this.realtime.disconnect();
      return {
        data: {
          openSubscriptions: openSubCount
        },
        error
      };
    });
  }

  _closeSubscription(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
      let error = null;

      if (!subscription.isClosed()) {
        const {
          error: unsubError
        } = yield this._unsubscribeSubscription(subscription);
        error = unsubError;
      }

      this.realtime.remove(subscription);
      return {
        error
      };
    });
  }

  _unsubscribeSubscription(subscription) {
    return new Promise(resolve => {
      subscription.unsubscribe().receive('ok', () => resolve({
        error: null
      })).receive('error', error => resolve({
        error
      })).receive('timeout', () => resolve({
        error: new Error('timed out')
      }));
    });
  }
  /**
   * Returns an array of all your subscriptions.
   */


  getSubscriptions() {
    return this.realtime.channels;
  }

  _initSupabaseAuthClient({
    autoRefreshToken,
    persistSession,
    detectSessionInUrl,
    localStorage,
    headers,
    fetch,
    cookieOptions,
    multiTab
  }) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new _lib_SupabaseAuthClient__WEBPACK_IMPORTED_MODULE_7__.SupabaseAuthClient({
      url: this.authUrl,
      headers: Object.assign(Object.assign({}, headers), authHeaders),
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      localStorage,
      fetch,
      cookieOptions,
      multiTab
    });
  }

  _initRealtimeClient(options) {
    return new _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), {
      params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), {
        apikey: this.supabaseKey
      })
    }));
  }

  _initPostgRESTClient() {
    return new _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_0__.PostgrestClient(this.restUrl, {
      headers: this._getAuthHeaders(),
      schema: this.schema,
      fetch: this.fetch,
      throwOnError: this.shouldThrowOnError
    });
  }

  _getAuthHeaders() {
    var _a, _b;

    const headers = Object.assign({}, this.headers);
    const authBearer = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
    headers['apikey'] = this.supabaseKey;
    headers['Authorization'] = headers['Authorization'] || `Bearer ${authBearer}`;
    return headers;
  }

  _listenForMultiTabEvents() {
    if (!this.multiTab || !(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_3__.isBrowser)() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      return null;
    }

    try {
      return window === null || window === void 0 ? void 0 : window.addEventListener('storage', e => {
        var _a, _b, _c;

        if (e.key === _lib_constants__WEBPACK_IMPORTED_MODULE_2__.STORAGE_KEY) {
          const newSession = JSON.parse(String(e.newValue));
          const accessToken = (_b = (_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : undefined;
          const previousAccessToken = (_c = this.auth.session()) === null || _c === void 0 ? void 0 : _c.access_token;

          if (!accessToken) {
            this._handleTokenChanged('SIGNED_OUT', accessToken, 'STORAGE');
          } else if (!previousAccessToken && accessToken) {
            this._handleTokenChanged('SIGNED_IN', accessToken, 'STORAGE');
          } else if (previousAccessToken !== accessToken) {
            this._handleTokenChanged('TOKEN_REFRESHED', accessToken, 'STORAGE');
          }
        }
      });
    } catch (error) {
      console.error('_listenForMultiTabEvents', error);
      return null;
    }
  }

  _listenForAuthEvents() {
    let {
      data
    } = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, session === null || session === void 0 ? void 0 : session.access_token, 'CLIENT');
    });
    return data;
  }

  _handleTokenChanged(event, token, source) {
    if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') && this.changedAccessToken !== token) {
      // Token has changed
      this.realtime.setAuth(token); // Ideally we should call this.auth.recoverSession() - need to make public
      // to trigger a "SIGNED_IN" event on this client.

      if (source == 'STORAGE') this.auth.setAuth(token);
      this.changedAccessToken = token;
    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      // Token is removed
      this.realtime.setAuth(this.supabaseKey);
      if (source == 'STORAGE') this.auth.signOut();
    }
  }

}

/***/ }),

/***/ 5683:
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GoTrueApi": () => (/* reexport safe */ _supabase_gotrue_js__WEBPACK_IMPORTED_MODULE_0__.GoTrueApi),
/* harmony export */   "GoTrueClient": () => (/* reexport safe */ _supabase_gotrue_js__WEBPACK_IMPORTED_MODULE_0__.GoTrueClient),
/* harmony export */   "RealtimeChannel": () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.RealtimeChannel),
/* harmony export */   "RealtimeClient": () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.RealtimeClient),
/* harmony export */   "RealtimePresence": () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.RealtimePresence),
/* harmony export */   "RealtimeSubscription": () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.RealtimeSubscription),
/* harmony export */   "SupabaseClient": () => (/* reexport safe */ _SupabaseClient__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "Transformers": () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.Transformers),
/* harmony export */   "createClient": () => (/* binding */ createClient)
/* harmony export */ });
/* harmony import */ var _SupabaseClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SupabaseClient */ 6674);
/* harmony import */ var _supabase_gotrue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/gotrue-js */ 2675);
/* harmony import */ var _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/realtime-js */ 3264);



/**
 * Creates a new Supabase Client.
 */

const createClient = (supabaseUrl, supabaseKey, options) => {
  return new _SupabaseClient__WEBPACK_IMPORTED_MODULE_2__["default"](supabaseUrl, supabaseKey, options);
};



/***/ }),

/***/ 9085:
/*!**********************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SupabaseAuthClient": () => (/* binding */ SupabaseAuthClient)
/* harmony export */ });
/* harmony import */ var _supabase_gotrue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/gotrue-js */ 2675);

class SupabaseAuthClient extends _supabase_gotrue_js__WEBPACK_IMPORTED_MODULE_0__.GoTrueClient {
  constructor(options) {
    super(options);
  }

}

/***/ }),

/***/ 5653:
/*!************************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SupabaseQueryBuilder": () => (/* binding */ SupabaseQueryBuilder)
/* harmony export */ });
/* harmony import */ var _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/postgrest-js */ 7436);
/* harmony import */ var _SupabaseRealtimeClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SupabaseRealtimeClient */ 6835);


class SupabaseQueryBuilder extends _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_0__.PostgrestQueryBuilder {
  constructor(url, {
    headers = {},
    schema,
    realtime,
    table,
    fetch,
    shouldThrowOnError
  }) {
    super(url, {
      headers,
      schema,
      fetch,
      shouldThrowOnError
    });
    this._subscription = null;
    this._realtime = realtime;
    this._headers = headers;
    this._schema = schema;
    this._table = table;
  }
  /**
   * Subscribe to realtime changes in your database.
   * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
   * @param callback A callback that will handle the payload that is sent whenever your database changes.
   */


  on(event, callback) {
    if (!this._realtime.isConnected()) {
      this._realtime.connect();
    }

    if (!this._subscription) {
      this._subscription = new _SupabaseRealtimeClient__WEBPACK_IMPORTED_MODULE_1__.SupabaseRealtimeClient(this._realtime, this._headers, this._schema, this._table);
    }

    return this._subscription.on(event, callback);
  }

}

/***/ }),

/***/ 6835:
/*!**************************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/SupabaseRealtimeClient.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SupabaseRealtimeClient": () => (/* binding */ SupabaseRealtimeClient)
/* harmony export */ });
/* harmony import */ var _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/realtime-js */ 3264);

class SupabaseRealtimeClient {
  constructor(socket, headers, schema, tableName) {
    const chanParams = {};
    const topic = tableName === '*' ? `realtime:${schema}` : `realtime:${schema}:${tableName}`;
    const userToken = headers['Authorization'].split(' ')[1];

    if (userToken) {
      chanParams['user_token'] = userToken;
    }

    this.subscription = socket.channel(topic, chanParams);
  }

  getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };

    if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
      records.new = _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_0__.Transformers.convertChangeData(payload.columns, payload.record);
    }

    if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
      records.old = _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_0__.Transformers.convertChangeData(payload.columns, payload.old_record);
    }

    return records;
  }
  /**
   * The event you want to listen to.
   *
   * @param event The event
   * @param callback A callback function that is called whenever the event occurs.
   */


  on(event, callback) {
    this.subscription.on(event, payload => {
      let enrichedPayload = {
        schema: payload.schema,
        table: payload.table,
        commit_timestamp: payload.commit_timestamp,
        eventType: payload.type,
        new: {},
        old: {},
        errors: payload.errors
      };
      enrichedPayload = Object.assign(Object.assign({}, enrichedPayload), this.getPayloadRecords(payload));
      callback(enrichedPayload);
    });
    return this;
  }
  /**
   * Enables the subscription.
   */


  subscribe(callback = () => {}) {
    this.subscription.onError(e => callback('SUBSCRIPTION_ERROR', e));
    this.subscription.onClose(() => callback('CLOSED'));
    this.subscription.subscribe().receive('ok', () => callback('SUBSCRIBED')).receive('error', e => callback('SUBSCRIPTION_ERROR', e)).receive('timeout', () => callback('RETRYING_AFTER_TIMEOUT'));
    return this.subscription;
  }

}

/***/ }),

/***/ 7162:
/*!*************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/constants.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_HEADERS": () => (/* binding */ DEFAULT_HEADERS),
/* harmony export */   "STORAGE_KEY": () => (/* binding */ STORAGE_KEY)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ 4288);
// constants.ts

const DEFAULT_HEADERS = {
  'X-Client-Info': `supabase-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}`
};
const STORAGE_KEY = 'supabase.auth.token';

/***/ }),

/***/ 8421:
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/helpers.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBrowser": () => (/* binding */ isBrowser),
/* harmony export */   "stripTrailingSlash": () => (/* binding */ stripTrailingSlash),
/* harmony export */   "uuid": () => (/* binding */ uuid)
/* harmony export */ });
// helpers.ts
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function stripTrailingSlash(url) {
  return url.replace(/\/$/, '');
}
const isBrowser = () => typeof window !== 'undefined';

/***/ }),

/***/ 4288:
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/version.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
const version = '1.35.4';

/***/ }),

/***/ 9584:
/*!****************************************!*\
  !*** ./node_modules/es5-ext/global.js ***!
  \****************************************/
/***/ ((module) => {

var naiveFallback = function () {
  if (typeof self === "object" && self) return self;
  if (typeof window === "object" && window) return window;
  throw new Error("Unable to resolve global `this`");
};

module.exports = function () {
  if (this) return this; // Unexpected strict mode (may happen if e.g. bundled into ESM module)
  // Fallback to standard globalThis if available

  if (typeof globalThis === "object" && globalThis) return globalThis; // Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
  // In all ES5+ engines global object inherits from Object.prototype
  // (if you approached one that doesn't please report)

  try {
    Object.defineProperty(Object.prototype, "__global__", {
      get: function () {
        return this;
      },
      configurable: true
    });
  } catch (error) {
    // Unfortunate case of updates to Object.prototype being restricted
    // via preventExtensions, seal or freeze
    return naiveFallback();
  }

  try {
    // Safari case (window.__global__ works, but __global__ does not)
    if (!__global__) return naiveFallback();
    return __global__;
  } finally {
    delete Object.prototype.__global__;
  }
}();

/***/ }),

/***/ 2428:
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/_esm2015/internal/operators/pluck.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pluck": () => (/* binding */ pluck)
/* harmony export */ });
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ 6942);

function pluck(...properties) {
  const length = properties.length;

  if (length === 0) {
    throw new Error('list of properties cannot be empty.');
  }

  return source => (0,_map__WEBPACK_IMPORTED_MODULE_0__.map)(plucker(properties, length))(source);
}

function plucker(props, length) {
  const mapper = x => {
    let currentProp = x;

    for (let i = 0; i < length; i++) {
      const p = currentProp != null ? currentProp[props[i]] : undefined;

      if (p !== void 0) {
        currentProp = p;
      } else {
        return undefined;
      }
    }

    return currentProp;
  };

  return mapper;
}

/***/ }),

/***/ 2576:
/*!***********************************************!*\
  !*** ./node_modules/websocket/lib/browser.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _globalThis;

if (typeof globalThis === 'object') {
  _globalThis = globalThis;
} else {
  try {
    _globalThis = __webpack_require__(/*! es5-ext/global */ 9584);
  } catch (error) {} finally {
    if (!_globalThis && typeof window !== 'undefined') {
      _globalThis = window;
    }

    if (!_globalThis) {
      throw new Error('Could not determine global this');
    }
  }
}

var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;

var websocket_version = __webpack_require__(/*! ./version */ 4393);
/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */


function W3CWebSocket(uri, protocols) {
  var native_instance;

  if (protocols) {
    native_instance = new NativeWebSocket(uri, protocols);
  } else {
    native_instance = new NativeWebSocket(uri);
  }
  /**
   * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
   * class). Since it is an Object it will be returned as it is when creating an
   * instance of W3CWebSocket via 'new W3CWebSocket()'.
   *
   * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
   */


  return native_instance;
}

if (NativeWebSocket) {
  ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (prop) {
    Object.defineProperty(W3CWebSocket, prop, {
      get: function () {
        return NativeWebSocket[prop];
      }
    });
  });
}
/**
 * Module exports.
 */


module.exports = {
  'w3cwebsocket': NativeWebSocket ? W3CWebSocket : null,
  'version': websocket_version
};

/***/ }),

/***/ 4393:
/*!***********************************************!*\
  !*** ./node_modules/websocket/lib/version.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ../package.json */ 9794).version;

/***/ }),

/***/ 9794:
/*!*********************************************!*\
  !*** ./node_modules/websocket/package.json ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"websocket","description":"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.","keywords":["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],"author":"Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)","contributors":["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],"version":"1.0.34","repository":{"type":"git","url":"https://github.com/theturtle32/WebSocket-Node.git"},"homepage":"https://github.com/theturtle32/WebSocket-Node","engines":{"node":">=4.0.0"},"dependencies":{"bufferutil":"^4.0.1","debug":"^2.2.0","es5-ext":"^0.10.50","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2","yaeti":"^0.0.6"},"devDependencies":{"buffer-equal":"^1.0.0","gulp":"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1","jshint":"^2.0.0","tape":"^4.9.1"},"config":{"verbose":false},"scripts":{"test":"tape test/unit/*.js","gulp":"gulp"},"main":"index","directories":{"lib":"./lib"},"browser":"lib/browser.js","license":"Apache-2.0"}');

/***/ })

}]);
//# sourceMappingURL=default-src_app_services_supabase_service_ts.js.map