import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { asyncComponent } from "./components/AsyncComponent";
import { createBrowserHistory } from "history";
const AsyncHome = asyncComponent(import("./page/Home"));
const AsyncFaq = asyncComponent(import("./page/Faq"));
const AsyncNotFound = asyncComponent(import("./page/NotFound"));
const AsyncBrand = asyncComponent(import("./page/Brand"));
const AsyncAmbassador = asyncComponent(import("./page/Ambassador"));
const AsyncCommunity = asyncComponent(import("./page/Community"));
const AsyncBlog = asyncComponent(import("./page/Blog"));
const AsyncBlogTutorials = asyncComponent(import("./page/Blog/TutorialsPage"));
const AsyncBlogNewsletters = asyncComponent(import("./page/Blog/NewslettersPage"));
// const AsyncMedia = asyncComponent(import("./page/Media"));
const AsyncNews = asyncComponent(import("./page/News"));
const AsyncEvents = asyncComponent(import("./page/Events"));
const AsyncReports = asyncComponent(import("./page/Reports"));
const AsyncVideos = asyncComponent(import("./page/Videos"));
const AsyncTech = asyncComponent(import("./page/Tech"));
const AsyncModel = asyncComponent(import("./page/EcoModel"));
const AsyncPlo = asyncComponent(import("./page/Plo"));
const AsyncPloContrbite = asyncComponent(import("./page/PloContribute"));
const history = createBrowserHistory();

const prefix = "/legacy-home";

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact component={AsyncHome} path={`${prefix}/`} />
      <Route exact component={AsyncFaq} path={`${prefix}/faq`} />

      <Route exact component={AsyncBrand} path={`${prefix}/brand`} />

      <Route exact component={AsyncAmbassador} path={`${prefix}/ambassador`} />

      <Route exact component={AsyncCommunity} path={`${prefix}/community`} />

      <Route exact component={AsyncBlog} path={`${prefix}/blog`} />
      <Route exact component={AsyncBlogTutorials} path={`${prefix}/blog/tutorials`} />
      <Route exact component={AsyncBlogNewsletters} path={`${prefix}/blog/newsletters`} />

      {/* <Route exact component={AsyncMedia} path="/media" /> */}

      <Route exact component={AsyncReports} path={`${prefix}/reports`} />

      <Route exact component={AsyncEvents} path={`${prefix}/events`} />

      <Route exact component={AsyncVideos} path={`${prefix}/videos`} />

      <Route exact component={AsyncNews} path={`${prefix}/news`} />

      <Route exact component={AsyncTech} path={`${prefix}/tech`} />

      <Route exact component={AsyncModel} path={`${prefix}/economic_model`} />

      <Route exact component={AsyncPlo} path={`${prefix}/plo`} />

      <Route exact component={AsyncPloContrbite} path={`${prefix}/plo_contribute`} />

      <Route component={AsyncNotFound} />
    </Switch>
  </Router>
);

export default Routes;
