import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Raven.config('https://c2ea52e7d67d4787b4b55149bc32bf0d@sentry.io/704564')
     .addPlugin(RavenVue, Vue)
     .install();
