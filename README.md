## WifiLookup 1.0.0-alpha

> Desktop application built with ElectronJS and Angular 5 to lookups and registre devices in a LAN Network. It use Nmap to perform a DHCP server per scope based detection, that scan all getway range and return all host connected in the LAN.

![Wifi Lookup](/src/assets/icon/icons8-wi-fi-64.png)

Currently runs with:

- Angular v5.2.5
- Angular-CLI v1.7.1
- Electron v1.8.2
- Electron Builder v20.0.5
- Nmap v7.60


## Getting Started

It use [Nmap](https://nmap.org/) to perform network scanning, so you need have it installed in your computer.

Clone this repository locally:

``` bash
git clone https://github.com/pheliperocha/wifilookup
```

Go into the repository

``` bash
cd wifilookup
```

Install dependencies with npm:

``` bash
npm install
```

## To build for development

- **in a terminal window** -> `npm start`

## Manage your environment variables

Use .env to manage your environment variables

- Using local variables:  `ENV=local`
- Using development variables :  `ENV=dev`
- Using production variables  :  `ENV=prod`

- You can also use `DEBUG=true` to open developer tools on windows show event.

## Included Commands

|Command|Description|
|--|--|
|`npm start`| Build the app, executing the app in the browser and start electron for develop |
|`npm run ng:serve`| Execute the app in the browser |
|`npm run electron:serve`| Execute the app in electron (Must have browser server runnning) |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron |
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |
|`npm run test`|  Run karma for unit test |
|`npm run e2e`|  Run end-to-end test |

**Your application is optimised. Only /dist folder and node dependencies are included in the executable.**

## Browser mode

Maybe you want to execute the application in the browser (WITHOUT HOT RELOAD ACTUALLY...) ? You can do it with `npm run ng:serve`.  
Note that you can't use Electron or NodeJS native libraries in this case. Please check `providers/electron.service.ts` to watch how conditional import of electron/Native libraries is done.

## Thanks ![](/src/assets/icon/icons8-like-32.png)

* [Maxime GRIS](https://github.com/maximegris) for ultra-fast bootstrapping with Angular 5 and Electron;

* ![Icons8](/src/assets/icon/icons8-icons8-16.png) [Icons8](https://icons8.com/) for amazing Nolan style icon pack.
