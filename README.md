# circlecrm-auth

Circle CRM Core Library

## Usage

### Css

Importare core.css in src/style.scss:

```css
@import "~@circlecrm/circlecrm-auth/resources/css/core.css";
```

### Modernizr

* Abilitare il modernizr:

```json
{
  ...,
  "apps":[{
    ...,
    "scripts": [
      ...,
      "../node_modules/@circlecrm/circlecrm-auth/resources/js/modernizr.js"
    ],
    ...
  }],
  ...
}
```

### Preloader

Per utilizzare il preloader, seguire i seguenti passi:

* Includere preloader.js in .angular-cli:

```json
{
  ...,
  "apps":[{
    ...,
    "scripts": [
      ...,
      "../node_modules/@circlecrm/circlecrm-auth/resources/js/preloader.js"
    ],
    ...
  }],
  ...
}
```

* inserire il codice html in src/index.html:

```html
<html>
    ...
<body>
  <app-...></app-...>
  <!-- start preloader -->
  <div class="preloader">
    <div class="preloader-progress">
      <div class="preloader-progress-bar"></div>
    </div>
  </div>
  <!-- end preloader -->
</body>
</html>
```

* modificare src/main.ts per chiudere il preloader una volta che l'applicazione ha completato il boot:

```javascript
...

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => { (<any>window).appBootstrap && (<any>window).appBootstrap(); })
  .catch(err => console.log(err));
```

appBoostrap è la funzione iniettata dal preloader da richiamare per indicare al preloader che l'applicazione è 
avviata e può disattivarsi

## Layout

Il tema è pensato per il seguente layout:

```html
<div class="wrapper">

      <!-- top navbar-->
      <div class="topnavbar-wrapper">
        <nav class="navbar topnavbar" role="navigation">
          <div class="navbar-header">
            <a class="navbar-brand" href="https://webapp.circlecrm.it">
              <div class="brand-logo">
                <img class="img-responsive" src="assets/img/logo.png" alt="App Logo"/>
              </div>
              <div class="brand-logo-collapsed">
                <img class="img-responsive" src="assets/img/logo-single.png" alt="App Logo"/>
              </div>
            </a>
          </div>
          <div class="nav-wrapper">
            <ul class="nav navbar-nav">
              <li><a dirCircleCRMToggleSidebar></a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li class="visible-lg"><a dirCircleCRMToggleFullscreen></a></li>
              <li><a dirCircleCRMToggleOffsidebar></a></li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- sidebar -->
      <div class="aside">
        <div class="aside-inner">
          <nav class="sidebar">
            <ul class="nav">
              <!-- application menu -->
              <cmp-circlecrm-menu [menuItems]="menuItems"></cmp-circlecrm-menu>
            </ul>
          </nav>
        </div>
      </div>

      <!-- offsidebar-->
      <div class="offsidebar">
        <cmp-circlecrm-settings></cmp-circlecrm-settings>
      </div>

      <!-- form panel -->
      <cmp-circlecrm-form-panel></cmp-circlecrm-form-panel>

      <!-- Main section-->
      <section id="main-section">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </section>

      <!-- Page footer-->
      <footer><span>&copy; 2017 - Circle</span></footer>

    </div>
    <cmp-circlecrm-cssloader></cmp-circlecrm-cssloader>
```

## using menu

Definire un array di IMenuItem, ad esempio:

```typescript

const heading: IMenuItem = {
      text: 'Main Navigation',
      heading: true
    } as IMenuItem;

    const welcome: IMenuItem = {
      text: 'Welcome',
      link: ['/demo'],
      icon: 'icon-speedometer'
    } as IMenuItem;

    const fakeA: IMenuItem = {
      text: 'Fake 1',
      link: ['/demo/fake1'],
      icon: 'icon-phone',
      submenu: [
        {
          text: 'Fake 2',
          link: ['/demo/fake2'],
          icon: 'icon-directions'
        },
        {
          text: 'Fake 3',
          link: ['/demo/fake3'],
          icon: 'icon-printer'
        }
      ]
    } as IMenuItem;

    const fakeB: IMenuItem = {
      text: 'Fake 4',
      link: ['/demo/fake4'],
      icon: 'icon-layers'
    } as IMenuItem;

    menuItems: IMenuItem[] = [
      heading,
      welcome,
      fakeA,
      fakeB
    ];
```

ed usarlo nel componente:

```html
<cmp-circlecrm-menu [menuItems]="menuItems"></cmp-circlecrm-menu>
```

## Usare i temi

in .angular-cli, aggiungere agli assets:

```json
{
  "glob": "**/*",
  "input": "../node_modules/@circlecrm/circlecrm-auth/resources/css/themes/",
  "output": "./assets/css/themes/",
  "allowOutsideOutDir": false
}
```

## Base starter

Creare un nuovo progetto angular con angular-cli (impostare la versione 4.4.6). Un esempio di dependencies finale:

```json
...
"dependencies": {
    "@angular/animations": "4.4.6",
    "@angular/common": "4.4.6",
    "@angular/compiler": "4.4.6",
    "@angular/core": "4.4.6",
    "@angular/forms": "4.4.6",
    "@angular/http": "4.4.6",
    "@angular/platform-browser": "4.4.6",
    "@angular/platform-browser-dynamic": "4.4.6",
    "@angular/router": "4.4.6",
    "@circlecrm/circlecrm-auth": "1.0.0-beta.1",
    "core-js": "^2.4.1",
    "rxjs": "^5.5.6",
    "zone.js": "^0.8.19"
  }
...
```

## Libraries

* bootstrap 3.3.7
* loaders.css@0.1.2
* spinkit@1.2.5
* angular2-toaster@4.0.2
* font-awesome@4.7.0
* simple-line-icons@2.4.1
* primeng@4.3.0

## License
MIT
