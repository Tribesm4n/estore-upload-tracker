// ==UserScript==
// @name         Upload Logger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Logs uploaded file names to Google Sheets via Apps Script Web App
// @match        https://www.etsy.com/*
// @match        https://www.canva.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const WEB_APP_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

    // ---------------------------------------------------------
    //  GLOBAL UPLOAD LOGGER
    // ---------------------------------------------------------
    window.logUpload = function (filenames) {
        const payload = {
            timestamp: new Date().toISOString(),
            pageUrl: location.href,
            pageTitle: document.title,
            filenames: filenames,
            notes: ""
        };

        console.log("%c[UploadLogger] Payload:", "color: #4CAF50", payload);

        fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(r => r.text())
            .then(t => console.log("%c[UploadLogger] Response:", "color: #2196F3", t))
            .catch(err => console.error("[UploadLogger] ERROR:", err));
    };

    // ---------------------------------------------------------
    //  ATTACH LISTENERS TO FILE INPUTS
    // ---------------------------------------------------------
    function attachListeners() {
        const inputs = document.querySelectorAll('input[type="file"]');

        inputs.forEach(input => {
            if (input.dataset.loggerAttached === "true") return;

            input.dataset.loggerAttached = "true";

            input.addEventListener("change", () => {
                const files = [...input.files].map(f => f.name);
                if (files.length) {
                    console.log("%c[UploadLogger] Detected upload:", "color: orange", files);
                    window.logUpload(files);
                }
            });

            console.log("%c[UploadLogger] Listener attached:", "color: #9C27B0", input);
        });
    }

    // ---------------------------------------------------------
    //  HANDLE SHADOW DOM (Etsy uses this)
    // ---------------------------------------------------------
    function scanShadowRoots(node) {
        if (!node) return;

        if (node.shadowRoot) {
            const shadowInputs = node.shadowRoot.querySelectorAll('input[type="file"]');
            shadowInputs.forEach(input => {
                if (!input.dataset.loggerAttached) {
                    input.dataset.loggerAttached = "true";
                    input.addEventListener("change", () => {
                        const files = [...input.files].map(f => f.name);
                        if (files.length) window.logUpload(files);
                    });
                    console.log("%c[UploadLogger] Shadow listener attached", "color: #FF9800", input);
                }
            });
        }

        node.childNodes?.forEach(scanShadowRoots);
    }

    // ---------------------------------------------------------
    //  MUTATION OBSERVER (Dynamic Etsy/Canva UIs)
    // ---------------------------------------------------------
    const observer = new MutationObserver(mutations => {
        attachListeners();
        mutations.forEach(m => m.addedNodes?.forEach(scanShadowRoots));
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ---------------------------------------------------------
    //  INITIAL SCAN + RETRY (for slow-loading widgets)
    // ---------------------------------------------------------
    attachListeners();
    scanShadowRoots(document.body);

    setTimeout(attachListeners, 1500);
    setTimeout(attachListeners, 4000);
})();