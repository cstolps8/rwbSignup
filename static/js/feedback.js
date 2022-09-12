/* eslint-disable no-undef */
/* eslint-disable prefer-arrow-callback */
// this file is run in the browser, hence static

$(function feedback() {
  /**
   * Updates the DOM
   * @param {*} data XHR result
   */
  function updateFeedback(data) {
    console.log("updating feedback")
    const render = [];
    // Reset all status messages
    $('.feedback-status').empty();

    // All went well
    if (!data.errors && data.feedback) {
      // The input was valid - reset the form
      $('.feedback-form').trigger('reset');

      // Data Picker Initialization
      // $('.form-dateOfParty').datepicker({
      //   inline: true
      // });

      $.each(data.feedback, function createHtml(key, item) {
        render.push(`
        <tr class="feedback-table-row" id=${item.entry}>
          <td class="feedback-name">${item.name}</td>
          <td class="feedback-email">${item.email}</td>
          <td class="feedback-phoneNumber">${item.phoneNumber}</td>
          <td class="feedback-dateOfParty">${item.dateOfParty}</td>
          <td class="feedback-receivePromos">${item.receivePromos}</td>
          <td class="feedback-receiveTexts">${item.receiveTexts}</td>
          <td><button type="button" class="btn btn-danger feedback-delete" > Delete static</button></td>

        </tr>
        `);
      });

      // $.each(data.feedback, function createHtml(key, item) {
      //   render.push(`
      //     <div class="feedback-item item-list media-list">
      //       <div class="feedback-item media">
      //         <div class="feedback-info media-body">
      //           <div class="feedback-head">
      //           </div>
                

      //           <div class="feedback-name">
      //             ${item.name}
      //           </div> 

      //           <div class="feedback-form-email">
      //             ${item.email}
      //           </div>

      //           <div class="feedback-form-phoneNumber">
      //             ${item.phoneNumber}
      //           </div>

      //             <div class="feedback-form-dateOfParty">
      //               ${item.dateOfParty}
      //             </div>

      //           <div class="feedback-form-receivePromos">
      //             ${item.receivePromos}
      //           </div>

      //           <div class="feedback-form-receiveTexts">
      //             ${item.receiveTexts}
      //           </div> 

      //         </div>
      //       </div>
      //     </div>
      //   `);
      // });
      // Update feedback-items with what the REST API returned
      $('.feedback-table-body').html(render.join('/n'));
      // Output the success message
      $('.feedback-status').html(`<div class="alert alert-success">${data.successMessage}</div>`);
    } else {
      // There was an error
      // Create a list of errors
      console.log("THere was errors in updatingFeedback")
      $.each(data.errors, function createHtml(key, error) {
        render.push(`
        <li>${error.msg}</li>
        `);
      });
      console.log(render)
      // Set the status message
      $('.feedback-status').html(

        `<div class="alert alert-danger"><ul>${render.join('\n')}</ul></div>`
      );
    }
  } // end of update feedback

  /**
   * Attaches to the form and sends the data to our REST endpoint
   */
  $('.feedback-form').submit(function submitFeedback(e) {

    if($('#feedback-form-receivePromos').prop("checked")){


    }

    // Prevent the default submit form event
    e.preventDefault();

    // XHR POST request
    $.post(
      '/feedback/api',
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

  $('.btn-danger').on('click', function(e) {
    console.log("button clicked")
    var id = $(this).parent().parent().prop("id")//.closest('tr').find('#feedback-table-row')//.id;

    //$("#"+id).remove()

    //xhr DELETE   
    $.post(
      '/feedback/api',
      // Gather all data from the form and create a JSON object from it
      {
        entry: id,
        name: $('#feedback-form-name').val(),
        email: $('#feedback-form-email').val(),
        phoneNumber: $('#feedback-form-phoneNumber').val(),
        dateOfParty: $('#feedback-form-dateOfParty').val(),
        receivePromos: $('#feedback-form-receivePromos').prop("checked"),
        receiveTexts: $('#feedback-form-receiveTexts').prop("checked"),
      },
      // Callback to be called with the data
      //updateFeedback
    );
    

    console.log(id);
  }
        // Callback to be called with the data
        //updateFeedback
  );

  function uniqid(random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
  };

});
