var Feedback = {
    // Run will initialize all of these functions and event handlers
    // And they have the settings variable we passed in to work with
    run: function (settings) {
        // Click action for 
        $(document).on('click', '#showFeedbackForm', function () {
            getOptions().then(function (ajaxRes) {
                // Once options are loaded, build the select list
                // Using fake data here, 'options' would normally be from ajaxRes
                var options = [
                    { text: 'This is helpful', id: 3 },
                    { text: 'The weather is wrong', id: 4 },
                    { text: 'The location is wrong', id: 6 },
                    { text: 'This is not useful', id: 7 },
                    { text: 'Something else', id: 9 },
                ];

                buildRadioGroup(options);

                $('#feedbackModalTitle').html(settings.title);
                $('#feedbackModal').modal('show');
            });
        });

        // Clear the modal when it closes
        $('#feedbackModal').on('hidden.bs.modal', function () {
            clearModal();
        });

        // On keydown when the textarea is focused, expand +1 row, up to 8 rows total if 'Enter' button pressed
        $(document).on('keydown', '#feedbackModalComment', function (event) {
            if (event.keyCode === 13) {
                var totalRows = $(this).prop('rows');
                if (totalRows < 8) {
                    $(this).prop('rows', totalRows + 1);
                }
            }
        });

        // On click of save, validate then save
        $(document).on('click', '#feedbackModalSend', function () {
            if ($('input[name="rad1"]:checked').val() > 0) {
                saveFeedback( getFeedback($('input[name="rad1"]:checked').val()) ).then(function () {
                    notify(true, "Thanks for the feedback!");
                });
            } else {
                notify(false, "Please make sure you select a reason.");
            }
        });

        // Get options from the server
        getOptions = function () {
            // AJAX call to get the options
            // Just going to a random API
            // This is where we would use settings.getOptionsUrl
            // url: settings.getOptionsUrl + '?userId=' + settings.userId + '&optionsId=' + settings.optionsId
            return $.ajax({
                url: 'https://randomuser.me/api/'
            });
        };

        // Build select list from options passed in
        buildRadioGroup = function (optionsArr) {
            optionsArr.forEach( function (option) {
                $('#feedbackModalLisWrapper').append(buildRadioButton(option));
            });
        };
        
        // Builds a single radio button
        buildRadioButton = function (option) {
            return '\
            <div class="form-check"> \
            <label class="form-check-label"> \
                <input class="form-check-input" type="radio" name="rad1" value="' + option.id + '"> \
                ' + option.text + ' \
            </label> \
            </div>';
        }

        // Save feedback form, gets the data, then sends it
        saveFeedback = function (data) {
            console.log(data);
            // Again,not actually saving anything, just hitting a random API for the AJAX call
            // This is where our settings.sendFeedbackUrl would live
            return $.ajax({
                url: 'https://randomuser.me/api/'
            });
        }

        // Make a feedback object to give to the server
        getFeedback = function (selectedOptionVal) {
            return {
                userId: settings.userId,
                optionsId: settings.optionsId,
                selectedOption: selectedOptionVal,
                comments: $('#feedbackModalComment').val()
            };
        },

        // Clear the modal, need to remove options and reset textarea
        clearModal = function () {
            $('#feedbackModalLisWrapper').html('');
            $('#feedbackModalComment').val('');
        }

        // Show notification, CSS class based on if success or not
        notify = function (success, msg) {
            $('#notificationArea').html(
                $('<div />', {
                    class: 'alert alert-' + (success ? 'success' : 'danger'),
                    text: msg
                })
            );
            $('#notificationArea').fadeIn();
            setTimeout(function () {
                clearNotifications();
            }, 2000)
        }

        // Clear notifications
        clearNotifications = function () {
            $('#notificationArea').fadeOut(function () {
                $(this).html('');
            })
        }
    }
}