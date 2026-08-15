(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/auth/AuthForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$company$2d$registration$2f$RegistrationShowcase$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/company-registration/RegistrationShowcase.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function AuthForm({ mode }) {
    _s();
    const isRegister = mode === 'register';
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function submit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);
        const form = new FormData(event.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            const endpoint = isRegister ? ("TURBOPACK compile-time value", "/auth/register") || '/auth/register' : ("TURBOPACK compile-time value", "/auth/login") || '/auth/login';
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticate"])(endpoint, payload);
            // 1. Sauvegarde du token (supporte 'jobsinc_token' et 'token' pour compatibilité)
            if (result.token) {
                localStorage.setItem('jobsinc_token', result.token);
                localStorage.setItem('token', result.token);
            }
            // 2. Récupération du rôle renvoyé par l'API Express Backend
            const userRole = result.user?.role || result.role;
            // 3. Redirection conditionnelle selon le rôle
            if (userRole === 'ADMIN') {
                window.location.assign('/admin');
            } else {
                window.location.assign('/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "form-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$company$2d$registration$2f$RegistrationShowcase$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/auth/AuthForm.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "form-main",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "eyebrow",
                            children: "Espace entreprise"
                        }, void 0, false, {
                            fileName: "[project]/components/auth/AuthForm.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: isRegister ? 'Créer votre compte' : 'Se connecter'
                        }, void 0, false, {
                            fileName: "[project]/components/auth/AuthForm.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: isRegister ? 'Commencez à recruter avec plus de clarté.' : 'Retrouvez votre espace de recrutement.'
                        }, void 0, false, {
                            fileName: "[project]/components/auth/AuthForm.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: submit,
                            children: [
                                isRegister && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "companyName",
                                            children: "Nom de l’entreprise"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/AuthForm.tsx",
                                            lineNumber: 66,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "companyName",
                                            name: "companyName",
                                            required: true,
                                            placeholder: "Votre entreprise"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/AuthForm.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/auth/AuthForm.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            children: "Email professionnel"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/AuthForm.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "email",
                                            name: "email",
                                            type: "email",
                                            required: true,
                                            autoComplete: "email",
                                            placeholder: "vous@entreprise.com"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/AuthForm.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/auth/AuthForm.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            children: "Mot de passe"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/AuthForm.tsx",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "password",
                                            name: "password",
                                            type: "password",
                                            required: true,
                                            minLength: 6,
                                            autoComplete: isRegister ? 'new-password' : 'current-password',
                                            placeholder: "••••••••"
                                        }, void 0, false, {
                                            fileName: "[project]/components/auth/AuthForm.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/auth/AuthForm.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                isRegister && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/auth/AuthForm.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this),
                                            " J’accepte les conditions d’utilisation."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/auth/AuthForm.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/auth/AuthForm.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-error",
                                    role: "alert",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/components/auth/AuthForm.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "button button-primary",
                                    style: {
                                        width: '100%'
                                    },
                                    disabled: loading,
                                    children: loading ? 'Connexion en cours…' : isRegister ? 'Créer mon compte entreprise' : 'Se connecter'
                                }, void 0, false, {
                                    fileName: "[project]/components/auth/AuthForm.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/auth/AuthForm.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-foot",
                            children: isRegister ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "Vous avez déjà un compte ? ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/login",
                                        children: "Se connecter"
                                    }, void 0, false, {
                                        fileName: "[project]/components/auth/AuthForm.tsx",
                                        lineNumber: 131,
                                        columnNumber: 44
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/auth/AuthForm.tsx",
                                lineNumber: 130,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "Pas encore de compte ?",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/register",
                                        children: "Créer un compte entreprise"
                                    }, void 0, false, {
                                        fileName: "[project]/components/auth/AuthForm.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/auth/AuthForm.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/auth/AuthForm.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-foot",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                children: "Retour à l’accueil"
                            }, void 0, false, {
                                fileName: "[project]/components/auth/AuthForm.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/auth/AuthForm.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/auth/AuthForm.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/auth/AuthForm.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/auth/AuthForm.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(AuthForm, "VUCssnr9ReH2MpPRMzyiZhLM8PU=");
_c = AuthForm;
var _c;
__turbopack_context__.k.register(_c, "AuthForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/company-registration/RegistrationShowcase.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegistrationShowcase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$components$2f$layout$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/components/layout/logo.png.mjs { IMAGE => "[project]/components/layout/logo.png (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const benefits = [
    'Trouvez les meilleurs talents',
    'Publiez vos offres simplement',
    'Gérez vos candidatures',
    'Développez votre équipe'
];
function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((part)=>part[0]).join('').toUpperCase() || 'E';
}
function CompanyImage({ company }) {
    _s();
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const source = typeof company.logo === 'string' && company.logo.trim() ? company.logo : null;
    if (!source || failed) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "showcase-company-initials",
        "aria-label": `Initiales de ${company.name}`,
        children: initials(company.name)
    }, void 0, false, {
        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
        lineNumber: 23,
        columnNumber: 33
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: source,
        alt: `Présentation de ${company.name}`,
        onError: ()=>setFailed(true)
    }, void 0, false, {
        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_s(CompanyImage, "BFa/7w0IiJnSoWJxZHxuU4kOwF4=");
_c = CompanyImage;
function RegistrationShowcase() {
    _s1();
    const [companies, setCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('loading');
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegistrationShowcase.useEffect": ()=>{
            let cancelled = false;
            const timeout = window.setTimeout({
                "RegistrationShowcase.useEffect.timeout": ()=>{
                    if (!cancelled) setStatus('error');
                }
            }["RegistrationShowcase.useEffect.timeout"], 9000);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isApiConfigured"])()) {
                window.clearTimeout(timeout);
                setStatus('empty');
                return ({
                    "RegistrationShowcase.useEffect": ()=>{
                        cancelled = true;
                    }
                })["RegistrationShowcase.useEffect"];
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCompanies"])().then({
                "RegistrationShowcase.useEffect": (data)=>{
                    if (cancelled) return;
                    setCompanies(data);
                    setStatus(data.length ? 'ready' : 'empty');
                }
            }["RegistrationShowcase.useEffect"]).catch({
                "RegistrationShowcase.useEffect": ()=>{
                    if (!cancelled) setStatus('error');
                }
            }["RegistrationShowcase.useEffect"]).finally({
                "RegistrationShowcase.useEffect": ()=>window.clearTimeout(timeout)
            }["RegistrationShowcase.useEffect"]);
            return ({
                "RegistrationShowcase.useEffect": ()=>{
                    cancelled = true;
                    window.clearTimeout(timeout);
                }
            })["RegistrationShowcase.useEffect"];
        }
    }["RegistrationShowcase.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RegistrationShowcase.useEffect": ()=>{
            if (companies.length < 2 || status !== 'ready') return;
            const timer = window.setInterval({
                "RegistrationShowcase.useEffect.timer": ()=>setActiveIndex({
                        "RegistrationShowcase.useEffect.timer": (current)=>(current + 1) % companies.length
                    }["RegistrationShowcase.useEffect.timer"])
            }["RegistrationShowcase.useEffect.timer"], 6000);
            return ({
                "RegistrationShowcase.useEffect": ()=>window.clearInterval(timer)
            })["RegistrationShowcase.useEffect"];
        }
    }["RegistrationShowcase.useEffect"], [
        companies.length,
        status
    ]);
    const activeCompany = companies[activeIndex];
    const dots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RegistrationShowcase.useMemo[dots]": ()=>companies.slice(0, 6)
    }["RegistrationShowcase.useMemo[dots]"], [
        companies
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "form-aside registration-showcase",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                className: "logo-link",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$components$2f$layout$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                        alt: "JOBSINC",
                        width: 42,
                        height: 42,
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 54,
                        columnNumber: 42
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "JOBSINC"
                    }, void 0, false, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 54,
                        columnNumber: 108
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                lineNumber: 54,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "showcase-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "eyebrow",
                        children: "La nouvelle façon de recruter"
                    }, void 0, false, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 56,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: [
                            "Connecter les talents ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "&"
                            }, void 0, false, {
                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                lineNumber: 57,
                                columnNumber: 33
                            }, this),
                            " les opportunités"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 57,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "showcase-intro",
                        children: "Rejoignez JOBSINC et donnez à votre entreprise les outils nécessaires pour attirer, identifier et recruter les meilleurs talents."
                    }, void 0, false, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 58,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "showcase-benefits",
                        "aria-label": "Avantages de JOBSINC",
                        children: benefits.map((benefit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 59,
                                        columnNumber: 120
                                    }, this),
                                    benefit
                                ]
                            }, benefit, true, {
                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                lineNumber: 59,
                                columnNumber: 102
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 59,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `showcase-company showcase-company-${status}`,
                        "aria-live": "polite",
                        children: [
                            status === 'loading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "showcase-company-image showcase-skeleton"
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 61,
                                        columnNumber: 36
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "showcase-company-details",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "showcase-skeleton-line short"
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 61,
                                                columnNumber: 138
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "showcase-skeleton-line medium"
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 61,
                                                columnNumber: 187
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "showcase-skeleton-line long"
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 61,
                                                columnNumber: 237
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 61,
                                        columnNumber: 96
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                lineNumber: 61,
                                columnNumber: 34
                            }, this),
                            status === 'ready' && activeCompany && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "showcase-company-image",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompanyImage, {
                                            company: activeCompany
                                        }, void 0, false, {
                                            fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                            lineNumber: 62,
                                            columnNumber: 91
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 62,
                                        columnNumber: 51
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "showcase-company-details",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "showcase-kicker",
                                                children: "Entreprises présentes sur JOBSINC"
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 62,
                                                columnNumber: 179
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: activeCompany.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 62,
                                                columnNumber: 253
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: activeCompany.sector || 'Secteur non renseigné'
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 62,
                                                columnNumber: 290
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: activeCompany.location || 'Localisation non renseignée'
                                            }, void 0, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 62,
                                                columnNumber: 352
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 62,
                                        columnNumber: 137
                                    }, this),
                                    companies.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "showcase-dots",
                                        "aria-label": "Navigation des entreprises",
                                        children: dots.map((company, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: index === activeIndex ? 'active' : '',
                                                onClick: ()=>setActiveIndex(index),
                                                "aria-label": `Afficher ${company.name}`
                                            }, company.id, false, {
                                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                                lineNumber: 62,
                                                columnNumber: 556
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 62,
                                        columnNumber: 455
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                lineNumber: 62,
                                columnNumber: 49
                            }, this),
                            (status === 'empty' || status === 'error') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "showcase-empty",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "showcase-empty-mark",
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 63,
                                        columnNumber: 88
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: status === 'empty' ? 'Aucune entreprise inscrite pour le moment' : 'Données momentanément indisponibles'
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 63,
                                        columnNumber: 134
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: "Les entreprises présentes sur JOBSINC apparaîtront ici."
                                    }, void 0, false, {
                                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                        lineNumber: 63,
                                        columnNumber: 257
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                                lineNumber: 63,
                                columnNumber: 56
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 60,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "showcase-closing",
                        children: "Construisez aujourd’hui l’équipe qui fera grandir votre entreprise demain."
                    }, void 0, false, {
                        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                        lineNumber: 65,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
                lineNumber: 55,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/company-registration/RegistrationShowcase.tsx",
        lineNumber: 53,
        columnNumber: 10
    }, this);
}
_s1(RegistrationShowcase, "CKmtDw+OBzd7rlwK9ACyQhA54zQ=");
_c1 = RegistrationShowcase;
var _c, _c1;
__turbopack_context__.k.register(_c, "CompanyImage");
__turbopack_context__.k.register(_c1, "RegistrationShowcase");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/logo.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.q("/_next/static/media/logo.39sbr5vb8ppnm.png");}),
"[project]/components/layout/logo.png.mjs { IMAGE => \"[project]/components/layout/logo.png (static in ecmascript, tag client)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/components/layout/logo.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1254,
    height: 1254,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAtUlEQVR42kWOMQuCUBSF/Vv1e/oHDe0NjbW1NTZEQw0tYRAOgVkQokMFhmmGlZKp7/X0vfvoZZIX7nDv4TvnSLwYCjzC+YtgCuz3kcQCcNMnmpsqF8t8XuEvZBTGqteZGs35bGKbGaMVMZCP9Ua31moPDzsAKIUoTlf6qTda9JfK2nduOGEAEmOwtxxFM+SNvnXPqmvrd09U+BLonQURch6BF4Z+GIuztBIQInmCcIJxSggrMj5dcqz+7xUH2wAAAABJRU5ErkJggg=="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiRequest",
    ()=>apiRequest,
    "authenticate",
    ()=>authenticate,
    "authenticateWithFiles",
    ()=>authenticateWithFiles,
    "getCompanies",
    ()=>getCompanies,
    "getCompanyApplications",
    ()=>getCompanyApplications,
    "getCompanyJobs",
    ()=>getCompanyJobs,
    "getCompanyMessages",
    ()=>getCompanyMessages,
    "getDashboardData",
    ()=>getDashboardData,
    "getJobs",
    ()=>getJobs,
    "getMatching",
    ()=>getMatching,
    "getStats",
    ()=>getStats,
    "isApiConfigured",
    ()=>isApiConfigured
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api")?.replace(/\/$/, '') || 'http://localhost:5000/api';
function endpoint(path) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
async function apiRequest(path, options) {
    const url = endpoint(path);
    if (!url) throw new Error('API non configurée');
    // Récupération automatique du token dans localStorage (côté client)
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('jobsinc_token') || localStorage.getItem('token') : "TURBOPACK unreachable";
    // Construction des en-têtes HTTP
    const headers = {
        'Content-Type': 'application/json',
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {},
        ...options?.headers
    };
    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });
    if (!response.ok) {
        const body = await response.json().catch(()=>null);
        const error = new Error(body?.error || body?.message || `Erreur serveur (${response.status})`);
        error.status = response.status;
        throw error;
    }
    return response.json();
}
/**
 * Fonction pour envoyer des formulaires multipart/form-data (fichiers, images, etc.)
 */ async function apiRequestForm(path, body) {
    const url = endpoint(path);
    if (!url) throw new Error('API non configurée');
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('jobsinc_token') || localStorage.getItem('token') : "TURBOPACK unreachable";
    const headers = {
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {}
    };
    const response = await fetch(url, {
        method: 'POST',
        body,
        headers,
        credentials: 'include'
    });
    if (!response.ok) {
        const responseBody = await response.json().catch(()=>null);
        throw new Error(responseBody?.error || responseBody?.message || `Erreur serveur (${response.status})`);
    }
    return response.json();
}
async function authenticate(path, payload) {
    return apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
async function authenticateWithFiles(path, fields, files, fieldName = 'photos') {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value])=>formData.append(key, value));
    files.forEach((file)=>formData.append(fieldName, file, file.name));
    return apiRequestForm(path, formData);
}
function isApiConfigured() {
    return Boolean(API_URL);
}
async function getDashboardData() {
    const dashboardEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DASHBOARD_ENDPOINT || '/auth/me';
    return apiRequest(dashboardEndpoint);
}
async function getMatching() {
    const matchingEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MATCHING_ENDPOINT || '/matching';
    const response = await apiRequest(matchingEndpoint);
    if (Array.isArray(response)) return response;
    return response?.data || response?.results || [];
}
async function getCompanyJobs() {
    const jobsEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_COMPANY_JOBS_ENDPOINT || '/jobs';
    const response = await apiRequest(jobsEndpoint);
    return Array.isArray(response) ? response : response.data || response.results || [];
}
async function getCompanyApplications() {
    const applicationsEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_COMPANY_APPLICATIONS_ENDPOINT || '/applications';
    const response = await apiRequest(applicationsEndpoint);
    return Array.isArray(response) ? response : response?.data || response?.results || [];
}
async function getCompanyMessages() {
    const messagesEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_COMPANY_MESSAGES_ENDPOINT || '/messages';
    const response = await apiRequest(messagesEndpoint);
    return Array.isArray(response) ? response : response?.data || response?.results || [];
}
async function getCompanies() {
    const response = await apiRequest(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_COMPANIES_ENDPOINT || '/companies');
    return Array.isArray(response) ? response : response.data || response.results || [];
}
async function getJobs() {
    const response = await apiRequest(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_JOBS_ENDPOINT || '/jobs');
    return Array.isArray(response) ? response : response.data || response.results || [];
}
async function getStats() {
    const response = await apiRequest(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_STATS_ENDPOINT || '/stats');
    if (typeof response === 'object' && response !== null && 'data' in response && typeof response.data === 'object' && response.data !== null) {
        return response.data;
    }
    return response;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_205vp0a._.js.map