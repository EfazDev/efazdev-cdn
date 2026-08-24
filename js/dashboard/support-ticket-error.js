window.addEventListener("load", function () {
    const url_search_params = new URLSearchParams(window.location.search);
    const error = url_search_params.get('error');
    const err_mes_dom = document.getElementById("error_message");
    if (error) {
        err_mes_dom.innerHTML = atob(error);
    } else {
        err_mes_dom.innerHTML = "No error was given.";
    }
});