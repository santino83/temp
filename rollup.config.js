import resolve from 'rollup-plugin-node-resolve';

// Add here external dependencies that actually you use.
const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/add/operator/map': "Rx",
    'rxjs/BehaviorSubject': 'Rx'
};

export default {
    entry: './dist/modules/circlecrm-auth.es5.js',
    dest: './dist/bundles/circlecrm-auth.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'circlecrm.auth',
    plugins: [resolve()],
    external: [
        Object.keys(globals),
        'moment',
        '@angular/core',
        '@angular/common',
        '@angular/common/http',
        '@angular/forms',
        '@angular/router',
        '@circlecrm/circlecrm-core',
        'rxjs/Observable',
        'rxjs/operators',
        'rxjs/BehaviorSubject',
        'ngx-webstorage',
        'jwt-decode'
    ],
    globals: globals,
    onwarn: () => {return}
}
