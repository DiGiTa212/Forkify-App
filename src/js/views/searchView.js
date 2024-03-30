class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlersSearch(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }

  addClickHandler() {
    this._parentElement.querySelector('.search__field').addEventListener('click', () => {
      this._clearInput();
    })
  }
}

export default new SearchView();