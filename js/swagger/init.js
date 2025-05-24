window.onload = function () {
    // Build a system
    var url = window.location.search.match(/url=([^&]+)/);
    if (url && url.length > 1) {
        url = decodeURIComponent(url[1]);
    } else {
        url = window.location.origin;
    }
    var options = {
        "customOptions": {
            "urls": [
                {
                    "url": "https://api.efaz.dev/api/swagger",
                    "name": "Main API"
                },
                {
                    "url": "https://dashboard.efaz.dev/api/swagger",
                    "name": "Dashboard API"
                },
                {
                    "url": "https://railway.efaz.dev/api/swagger",
                    "name": "Railway API"
                }
            ],
            "default": "Main API",
            "validatorUrl": null,
            "enableCookies": true,
            "configUrl": "https://api.efaz.dev/api/swagger",
            "launchUrl": "https://api.efaz.dev/api/swagger"
        },
        "swaggerUrl": {}
    };
    if (window.location.href.includes("?urls.primaryName=Dashboard%20API")) {
        options["customOptions"]["default"] = "Dashboard API"
        options["customOptions"]["launchUrl"] = "https://dashboard.efaz.dev/api/swagger"
        options["customOptions"]["configUrl"] = "https://dashboard.efaz.dev/api/swagger"
        options["customOptions"]["urls"] = [
            {
                "url": "https://dashboard.efaz.dev/api/swagger",
                "name": "Dashboard API"
            },
            {
                "url": "https://api.efaz.dev/api/swagger",
                "name": "Main API"
            },
            {
                "url": "https://railway.efaz.dev/api/swagger",
                "name": "Railway API"
            }
        ]
    } else if (window.location.href.includes("?urls.primaryName=Railway%20API")) {
        options["customOptions"]["default"] = "Railway API"
        options["customOptions"]["launchUrl"] = "https://railway.efaz.dev/api/swagger"
        options["customOptions"]["configUrl"] = "https://railway.efaz.dev/api/swagger"
        options["customOptions"]["urls"] = [
            {
                "url": "https://railway.efaz.dev/api/swagger",
                "name": "Railway API"
            },
            {
                "url": "https://api.efaz.dev/api/swagger",
                "name": "Main API"
            },
            {
                "url": "https://dashboard.efaz.dev/api/swagger",
                "name": "Dashboard API"
            }
        ]
    }
    url = options.swaggerUrl || url
    var urls = options.swaggerUrls
    var customOptions = options.customOptions
    var spec1 = options.swaggerDoc
    var swaggerOptions = {
        spec: spec1,
        url: url,
        urls: urls,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        withCredentials: true,
        layout: "StandaloneLayout"
    }
    for (var attrname in customOptions) {
        swaggerOptions[attrname] = customOptions[attrname];
    }
    var ui = SwaggerUIBundle(swaggerOptions)

    if (customOptions.oauth) {
        ui.initOAuth(customOptions.oauth)
    }

    if (customOptions.preauthorizeApiKey) {
        const key = customOptions.preauthorizeApiKey.authDefinitionKey;
        const value = customOptions.preauthorizeApiKey.apiKeyValue;
        if (!!key && !!value) {
            const pid = setInterval(() => {
                const authorized = ui.preauthorizeApiKey(key, value);
                if (!!authorized) clearInterval(pid);
            }, 500)

        }
    }

    if (customOptions.authAction) {
        ui.authActions.authorize(customOptions.authAction)
    }

    window.ui = ui
}
