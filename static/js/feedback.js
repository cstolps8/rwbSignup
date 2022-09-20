$(function feedback() {
 console.log("Calling results javascript")

  /**
   * Updates the DOM
   * @param {*} data XHR result
   */
  function updateFeedback(data) {
    const render = [];
    console.log("updateFeedback is called")
    // Reset all status messages
    $('.feedback-status').empty();

    // All went well
    if (!data.errors && data.feedback) {
      console.log("there was no errors in data for updateFeedback")
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

  /**
   * Attaches to the form and sends the data to our REST endpoint
   */
  $('.feedback-form').submit(function submitFeedback(e) {
    // Prevent the default submit form event
    e.preventDefault();

    // XHR POST request
    $.post(
      '/fbResult/api',
      // Gather all data from the form and create a JSON object from it
      {
        entry: uniqid(),
        name: $('#feedback-form-name').val(),
        email: $('#feedback-form-email').val(),
        phoneNumber: $('#feedback-form-phoneNumber').val(),
        dateOfParty: $('#feedback-form-dateOfParty').val(),
        receivePromos: $('#feedback-form-receivePromos').prop("checked"),
        receiveTexts: $('#feedback-form-receiveTexts').prop("checked"),
      },
      // Callback to be called with the data
      updateFeedback
    );
  });

  $('#btn').click(function (e) {
    console.log("hellp")
  })

  $('.feedback-table-body').on('click', '#btn', function (e) {
    console.log("button clicked")
    var id = $(this).parent().parent().prop("id")//.closest('tr').find('#feedback-table-row')//.id;

    $("#" + id).remove()

    //xhr DELETE   
    // $.post(
    //   '/feedback/api',
    //   // Gather all data from the form and create a JSON object from it
    //   {
    //     entry: id,
    //     name: $('#feedback-form-name').val(),
    //     email: $('#feedback-form-email').val(),
    //     phoneNumber: $('#feedback-form-phoneNumber').val(),
    //     dateOfParty: $('#feedback-form-dateOfParty').val(),
    //     receivePromos: $('#feedback-form-receivePromos').prop("checked"),
    //     receiveTexts: $('#feedback-form-receiveTexts').prop("checked"),
    //   },
    // Callback to be called with the data
    // updateFeedback
    // );

    console.log(id);
  },
    //Callback to be called with the data
   // cb

  );

  function uniqid(random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
  };

  function cb(random = false) {
    console.log("callback")
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
  };

});
