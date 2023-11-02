$(document).ready(function () {

    let totalPages;
    let currentPage = 1;

    function makeApiRequest(page) {

        const searchQuery = $("#searchQueryInput").val();
        const apiUrl = `https://api.searchspring.net/api/search/search.json?siteId=scmq7n&q=${searchQuery}&resultsFormat=native&page=${page}`;
        const settings = {
            async: false,
            crossDomain: true,
            url: apiUrl,
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        };

        $.ajax(settings).done(function (response) {
            totalPages = response.pagination.totalPages;
            $('.page-number span').text('/' + totalPages);
            const productContainer = $("#product__grid .grid-inner");
            response.results.forEach(function (product) {
                const productCard = $("<div>").addClass("product-card");
                const productImg = $("<img>").addClass("product-img").attr("src", product.thumbnailImageUrl);
                const productBrand = $("<h3>").text(product.brand)
                const productName = $("<p>").text(product.name);
                const productPrice = $("<p>").text(product.price).addClass('eff-price');

                if (product.msrp && product.msrp > product.price) {
                    const crossedOutPrice = $("<span>").addClass("crossed-out").text(product.msrp);
                    productPrice.append(crossedOutPrice);
                }

                productCard.append(productImg, productBrand, productName, productPrice);
                productContainer.append(productCard);
            });
        });
        currentPage = page;
    }

    function handlePaginationInitial() {
        if (totalPages === 1 || totalPages < 1) {
            $('.pagination-cont').addClass('d-none');
        } else {
            $('.pagination-cont').removeClass('d-none');
        }
        $('.pagination-cont .previous-page').addClass('d-none');
    }

    function updateProductTiles() {
        $('.product-card').remove();
        makeApiRequest(currentPage);
        if (currentPage === 1) {
            $('.pagination-cont .previous-page').addClass('d-none');
        } else {
            $('.pagination-cont .previous-page').removeClass('d-none');
        }
        if (currentPage === totalPages) {
            $('.pagination-cont .next-page').addClass('d-none');
        } else {
            if (totalPages === 0) {
                $('.pagination-cont').addClass('d-none');
            }
            $('.pagination-cont .next-page').removeClass('d-none');
        }
        if (totalPages === 1){
            $('.pagination-cont').addClass('d-none');
        } 
        else{
            $('.pagination-cont').removeClass('d-none');
        }
        $('.page-number').html(`Page ${currentPage}/${totalPages}`);
    }


    $("#searchQuerySubmit").on("click", function () {
        $('.product-card').remove();
        handlePaginationInitial();
        currentPage = 1;
        updateProductTiles();
    });

    $("#searchQueryInput").on("keypress", function (event) {
        if (event.keyCode === 13) {
            $('.product-card').remove();
            handlePaginationInitial();
            currentPage = 1;
            updateProductTiles();
        }
    })

    $('.pagination-cont .next-page').on('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            updateProductTiles();
        }
    });

    $('.pagination-cont .previous-page').on('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updateProductTiles();
        }
    });


    $('.suggestions-box').on('click', function () {
        const innerText = $(this).text().trim();
        $('#searchQueryInput').val(innerText);
        $("#searchQuerySubmit").click();
    });
});
