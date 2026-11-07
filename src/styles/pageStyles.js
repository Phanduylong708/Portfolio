// Stylesheet bundles per page type. Order matters: later sheets override earlier ones.
import inner from "./pages/inner.css?inline";
import cv from "./pages/cv.css?inline";
import notFound from "./pages/not-found.css?inline";
import portfolio from "./pages/portfolio.css?inline";
import portfolioCv from "./pages/portfolio-cv.css?inline";
import portfolioDisciplines from "./pages/portfolio-disciplines.css?inline";
import chrome from "./pages/chrome.css?inline";

export const innerStyles = [inner, cv, chrome];
export const notFoundStyles = [notFound, chrome];
export const portfolioStyles = [portfolio, chrome, portfolioDisciplines, portfolioCv];
