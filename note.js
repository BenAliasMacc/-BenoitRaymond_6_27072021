const queryString_URL_ID = window.location.search;

    const searchParamsID = new URLSearchParams(queryString_URL_ID);
    const idPhotographe = searchParamsID.get("id");
    console.log(idPhotographe);