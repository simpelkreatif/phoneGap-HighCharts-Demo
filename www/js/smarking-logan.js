var myApp = new Framework7({
    modalTitle: 'Logan Admin Portal',
    animateNavBackIcon: true
});

// Expose Internal DOM library
var $$ = Framework7.$;

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
// Add another view, which is in right panel
var rightView = myApp.addView('.view-right', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function() {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function() {
    myApp.hideIndicator();
});
//document.location = 'http://google.com';
// Events for specific pages when it initialized
$$(document).on('pageInit', function(e) {
    var page = e.detail.page;
    // Handle Modals Page event when it is init
    remoteURL = '';
    type = 'occupancy';
    isPrediction = 0;
    fromdate = '2014-04-13';
    todate = '2014-05-13';

    if (page.name === 'centralWest') {
        remoteURL = 'http://smarking.net:8080/garage?garage=centralWest&';
    } else if (page.name === 'terminalB') {
        remoteURL = 'http://smarking.net:8080/garage?garage=terminalB&';
    } else if (page.name === 'terminalE') {
        remoteURL = 'http://smarking.net:8080/garage?garage=terminalE&';
    } else if (page.name === 'economyLot') {
        remoteURL = 'http://smarking.net:8080/garage?garage=economyLot&';
    }
    $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
        genChartByHighCharts(data, 'chart-content', type, type);
    });

    if (page.name === 'centralWest' || page.name === 'terminalB' || page.name === 'terminalE' || page.name === 'economyLot') {

        $$('.action-period').on('click', function() {
            var buttons = [{
                fromdate: true
            }, {
                todate: true
            }, {
                text: 'Get Chart',
                onClick: function() {
                    fromdate = $('.from-date').val();
                    todate = $('.to-date').val();
                    myApp.updateChart();
                }
            }, ];
            myApp.myactions(buttons);
        });

        $$('.action-type').on('click', function() {
            var buttons = [{
                text: 'Occupancy',
                onClick: function() {
                    type = 'occupancy';
                    myApp.updateChart();
                }
            }, {
                text: 'Entry',
                onClick: function() {
                    type = 'entry';
                    myApp.updateChart();
                }
            }, {
                text: 'Exits',
                onClick: function() {
                    type = 'exits';
                    myApp.updateChart();
                }
            }, {
                text: 'Duration',
                onClick: function() {
                    type = 'duration';
                    myApp.updateChart();
                }
            }, ];
            myApp.myactions(buttons);
        });

        $$('.history-selected').on('click', function() {
            isPrediction = 0;
            myApp.updateChart();
            myApp.closePanel();
        });

        $$('.predicton-selected').on('click', function() {
            isPrediction = 1;
            myApp.updateChart();
            myApp.closePanel();
        });
    }
});

$$('.pre-loader').on('click', function() {
    myApp.showPreloader();
})
// Required for demo popover
$$('.popover a').on('click', function() {
    myApp.closeModal('.popover');
});

// Change statusbar bg when panel opened/closed
$$('.panel-left').on('open', function() {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function() {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function() {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});

// Generate Content Dynamically
var dynamicPageIndex = 0;

function createContentPage() {
    mainView.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '	<div class="left"><a href="#" class="back link">Back</a></div>' +
        '	<div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-content" class="page">' +
        '	<!-- Scrollable page content-->' +
        '	<div class="page-content">' +
        '	  <div class="content-block">' +
        '		<div class="content-block-inner">' +
        '		  <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '		  <p>Go <a href="#" class="back">back</a> or generate <a href="#" class="ks-generate-page">one more page</a>.</p>' +
        '		</div>' +
        '	  </div>' +
        '	</div>' +
        '  </div>' +
        '</div>'
    );
    return;
}

function genChartByHighCharts(_chartData, _elementId, _title, _label_title, _valueSuffix) {
    myApp.hidePreloader();
    $('#' + _elementId).empty();
    Highcharts.setOptions({
        global: {
            timezoneOffset: 4 * 60
        }
    });
    $('#' + _elementId).highcharts('StockChart', {

        rangeSelector: {
            selected: 5,
            inputEnabled: false, //$('#' + _elementId).width() > 480,
            buttons: [{
                type: 'day',
                count: 1,
                text: '1d'
            }, {
                type: 'week',
                count: 1,
                text: '1w'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }],
        },

        title: {
            text: _title
        },

        series: [{
            name: _label_title,
            data: _chartData,
            tooltip: {
                valueDecimals: 2,
                valueSuffix: _valueSuffix
            }
        }],

        exporting: {
            enabled: false
        }

    });
}

$$(document).on('click', '.ks-generate-page', createContentPage);

myApp.updateChart = function() {
    if (isPrediction) {
        $.getJSON(remoteURL + 'type=' + type + '&isPrediction=' + isPrediction).done(function(data) {
            genChartByHighCharts(data, 'chart-content', type, type, '');
        });
    } else if (type == 'duration') {
        $.getJSON(remoteURL + 'type=' + type + '&from=' + fromdate + '&to=' + todate).done(function(data) {
            genChartByHighCharts(data, 'chart-content', type, type, 'min');
        });
    } else {
        $.getJSON(remoteURL + 'type=' + type + '&from=' + fromdate + '&to=' + todate).done(function(data) {
            genChartByHighCharts(data, 'chart-content', type, type, '');
        });
    }
};

myApp.myactions = function(params) {
    _modalTemplateTempDiv = document.createElement('div');

    params = params || [];
    if (params.length > 0 && !$.isArray(params[0])) {
        params = [params];
    }

    var actionsTemplate = myApp.params.modalActionsTemplate;
    var buttonsHTML = '';
    for (var i = 0; i < params.length; i++) {
        for (var j = 0; j < params[i].length; j++) {


            if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
            var button = params[i][j];
            var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
            if (button.bold) buttonClass += ' actions-modal-button-bold';
            if (button.red) buttonClass += ' actions-modal-button-red';
            if (button.fromdate) {
                buttonsHTML += '<span class="actions-modal-label"><input type="date" class="list-button item-link from-date" name="from-date" value="' + fromdate + '"></span>';
            } else if (button.todate) {
                buttonsHTML += '<span class="actions-modal-label"><input type="date" class="to-date" name="to-date" value="' + todate + '"></span>';
            } else if (button.text) {
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
            }
            if (j === params[i].length - 1) buttonsHTML += '</div>';
        }
    }

    var modalHTML = actionsTemplate.replace(/{{buttons}}/g, buttonsHTML);

    _modalTemplateTempDiv.innerHTML = modalHTML;
    var modal = $(_modalTemplateTempDiv).children();
    $('body').append(modal[0]);

    var groups = modal.find('.actions-modal-group');
    groups.each(function(index, el) {
        var groupIndex = index;
        $(el).children().each(function(index, el) {
            var buttonIndex = index;
            var buttonParams = params[groupIndex][buttonIndex];
            if ($(el).hasClass('actions-modal-button')) {
                $(el).on('click', function(e) {
                    if (buttonParams.close !== false) myApp.closeModal(modal);
                    if (buttonParams.onClick) buttonParams.onClick(modal, e);
                });
            }
        });
    });

    myApp.openModal(modal);
    return modal[0];
};