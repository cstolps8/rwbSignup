$(function fbResult() {
    console.log("Calling results javascript")
    //update the dom

    function updateResults(data) {
        const render = [];
        // Reset all status messages

        // All went well
        if (!data.errors && data.feedback) {
            // The input was valid - reset the form
            $('.feedback-form').trigger('reset');

            $.each(data.feedback, function createHtml(key, item) {
                render.push(
                    `
                  <tr class="feedback-table-row" id=${item.entry}>
                    <td class="feedback-name">${item.name}</td>
                    <td class="feedback-email">${item.email}</td>
                    <td class="feedback-phoneNumber">${item.phoneNumber}</td>
                    <td class="feedback-dateOfParty">${item.dateOfParty}</td>
                    <td class="feedback-receivePromos">${item.receivePromos}</td>
                    <td class="feedback-receiveTexts">${item.receiveTexts}</td>
                    <td><button type="button" class="btn btn-danger feedback-delete" id="btn"> Delete static</button></td>
                  </tr>
                `
                );
            });


            // Update feedback-table with what the REST API returned
            $('.feedback-table-body').html(function () {
                console.log("updating table")
                return render.join('\n')
            });
            // Output the success message
            $('.feedback-status').html(`<div class="alert alert-success">${data.successMessage}</div>`);
        } else {
            // There was an error
            // Create a list of errors
            $.each(data.errors, function createHtml(key, error) {
                render.push(`
              <li>${error.msg}</li>
            `);
            });
            // Set the status message
            $('.feedback-status').html(
                `<div class="alert alert-danger"><ul>${render.join('\n')}</ul></div>`
            );
        }
    }


    $('.feedback').on('click', '#exportToExcel', function (e) {
        console.log("hellp")
    })

    $('.feedback-table-body').on('click', '.feedback-delete', function (e) {
        console.log("button clicked")
        var id = $(this).parent().parent().prop("id")//.closest('tr').find('#feedback-table-row')//.id;

        console.log("clicked button with id " + id)
        $.ajax({
            type: 'DELETE',
            url: '/fbResult/api/delete/'+id,
            success: function(){
                $("#" + id).remove()
            },
        });
        console.log(id);
    });



    function cb(random = false) {
        console.log("callback")
        const sec = Date.now() * 1000 + Math.random() * 1000;
        const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
        return `${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
    };

    // update entry

    // delete entry



    // export data


});