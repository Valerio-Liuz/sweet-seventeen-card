let sections = document.querySelectorAll('.main')
sections.forEach(el => {
    el.classList.add('none')
});
function guest() {
    const params = new URLSearchParams(window.location.search)
    let name_container = document.getElementById('guest-name')
    if (!params.has('to')) {
        name_container.innerText = 'guest'
    }
    else {
        let name = params.get('to')
        name_container.innerText = name
    }
}
function tes() {
    let card = document.getElementById('dear-card')
    let sections = document.querySelectorAll('.main')
    sections.forEach(el => {
        el.classList.remove('none')
    });
    setTimeout(() => {
        card.classList.remove('dear-center')
        card.parentElement.classList.remove('d-flex')
        card.parentElement.classList.add('none')
    }, 1000);

}
let countDownDate = new Date("Feb 15, 2025 16:00:00").getTime();

let x = setInterval(function () {

    let now = new Date().getTime();

    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById('day').innerHTML = days + ' d'
    document.getElementById('hour').innerHTML = hours + ' h'
    document.getElementById('minute').innerHTML = minutes + ' m'
    document.getElementById('second').innerHTML = seconds + ' s'

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
    }
}, 1000);

$(document).ready(function () {
    const $contentDiv = $("#msg-list");
    const $pagination = $(".pagination");
    const $prevPageLink = $("#prev-page");
    const $nextPageLink = $("#next-page");

    const itemsPerPage = 10;
    let currentPage = 1;
    let allItems = [];
    function getComment() {
        axios.get('/api/comments').then(result => {
            allItems = sortTimestamps(result.data.user)
            displayItems(currentPage, allItems);
            updatePagination(currentPage);
        })
    }

    function sortTimestamps(timestamps) {
        return timestamps.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
        });
    }

    function displayItems(page) {
        $contentDiv.empty();
        if (allItems.length === 0) {
            $contentDiv.html("<p class='text-center'>No wishes yet.</p>");
            return;
        }
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, allItems.length);
        const itemsToDisplay = allItems.slice(startIndex, endIndex);


        itemsToDisplay.forEach(el => {
            let created = new Date(el.createdAt).getTime();
            let now = new Date().getTime();
            let time = 0
            let distance = now - created;
            const seconds = Math.floor(distance / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const years = Math.floor(days / 365);
            const months = Math.floor((days % 365) / 30);
            if (years > 0) {
                time = years + " y"
            } else if (months > 0) {
                time = months + " mo"
            } else if (days > 0) {
                time = days + " d"
            } else if (hours > 0) {
                time = hours + " h"
            } else if (minutes > 0) {
                time = minutes + " min"
            } else {
                time = seconds + " sec"
            }

            const html = `
           <div class="border border-2 border-dark px-3 mb-2">
            <div class="d-flex flex-row">
              <p class="fs-5 my-auto fw-bold">${el.name}</p>
              <p class="my-auto mx-4 color-light" id="time">${time} ago</p>
            </div>
            <p class="msg">${el.comment}</p>
          </div>
          `;
            $contentDiv.append(html);
        });
    }

    function updatePagination(page) {
        $prevPageLink.toggleClass('disabled', page === 1);
        $nextPageLink.toggleClass('disabled', page * itemsPerPage >= allItems.length);
    }

    $pagination.on('click','.page-link', function (event) {
        event.preventDefault();
        const $clickedLink = $(this);
        
        let newPage = parseInt($clickedLink.text());
        if ($clickedLink.parent().attr('id') === 'prev-page') {newPage = currentPage - 1};
        if ($clickedLink.parent().attr('id') === 'next-page') {newPage = currentPage + 1};

        if (newPage >= 1 && newPage * itemsPerPage <= allItems.length + itemsPerPage) {
            currentPage = newPage;
            $("#page-number").text(currentPage);
            displayItems(currentPage);
            updatePagination(currentPage);
        }
    });

    $("#submit-msg").submit(function (event) {
        event.preventDefault();
        let name = $("#name").val();
        let comment = $("#msg").val();
        axios.post("/api/comments", {
            name: name,
            comment: comment
        })
            .then(result => {
                if (result.status == 200) {
                    $("#name").val("");
                    $("#msg").val("");
                    getComment()
                    let timerInterval;
                    Swal.fire({
                        title: "Wish sent!",
                        showClass: {
                            popup: `
                              animate__animated
                              animate__fadeInUp
                              animate__faster
                            `
                        },
                        hideClass: {
                            popup: `
                              animate__animated
                              animate__fadeOutDown
                              animate__faster
                            `
                        },
                        timer: 2000,
                        icon:"success",
                        timerProgressBar: true,
                        color:"black",
                        didOpen: () => {
                            Swal.showLoading();
                            const timer = Swal.getPopup().querySelector("b");
                            timerInterval = setInterval(() => {
                                timer.textContent = `${Swal.getTimerLeft()}`;
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    })
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Data not valid..."
                      });
                    name.val('')
                    comment.val('')
                }
            })
    });

    guest()
    getComment()
});
