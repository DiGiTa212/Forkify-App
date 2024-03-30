import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';

const suspendAnimation = () => {
  let resizeTimer;
  window.addEventListener("resize", () => {
    document.body.classList.add("suspend-resize-animation");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("suspend-resize-animation");
    }, 400);
  });
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update Results View to Mark Selected Search Result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id)

    // Rendering Recipe
    recipeView.render(model.state.recipe);

    // Updating Bookmarks View
    bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // Load Search Results
    await model.loadSearchResults(query);

    // Render Results =
    resultsView.render(model.getSearchResultsPage());

    // Render Initial Pagination Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render New Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add / Remove Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update Recipe View
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlDeleteRecipe = () => {
  // 1) Delete Recipe
  model.deleteRecipe(model.state.recipe.id)

  // 2) Update Recipe View
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Loading Spinner
    addRecipeView.renderSpinner();

    // Upload the New Recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('Error', error);
    addRecipeView.renderError(error.message);
  }
};


bookmarksView.addHandlerRender(controlBookmarks);
recipeView.addHandlerRender(controlRecipes);
recipeView.addHandlerUpdateServings(controlServings);
recipeView.addHandlerAddBookmark(controlAddBookmark);
recipeView.addHandlerAddDelete(controlDeleteRecipe);
searchView.addHandlersSearch(controlSearchResults);
searchView.addClickHandler()
paginationView.addHandlerClick(controlPagination);
addRecipeView.addHandlerUpload(controlAddRecipe);

suspendAnimation()



