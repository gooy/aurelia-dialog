import 'prism/themes/prism-okaidia.css!';

export class App {

  configureRouter(config, router){

    config.title = 'Aurelia Dialog';
    config.map([
      { route: ['','home'],  moduleId: './home',      nav: true, title:'Home' },
      { route: 'demo',  moduleId: './demo',      nav: true, title:'Demo' },
      { route: 'effects',  moduleId: './effects',      nav: true, title:'Effects' }
    ]);

    this.router = router;
  }

}
